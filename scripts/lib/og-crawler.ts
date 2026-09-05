/**
 * 아티클 링크의 OG 메타를 긁어와 이미지를 로컬로 내려받는다.
 *
 * 티스토리·노션의 og:image 는 서명과 만료 시각이 붙은 URL 이라 핫링크하면
 * 몇 주 뒤 깨진다. 그래서 바이트를 받아 public/og 아래에 보존한다.
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as cheerio from 'cheerio';
import { imageSize } from 'image-size';
import type { OgEntry, OgImage } from '@/lib/archive/og-schema';

const USER_AGENT =
  'Mozilla/5.0 (compatible; FrontendArchiveBot/1.0; +https://github.com/Frontend-Archive)';
const FETCH_TIMEOUT_MS = 20_000;
const MAX_IMAGE_BYTES = 3_000_000;
/** 한국어 기준 분당 읽기 속도(글자) */
const CHARS_PER_MINUTE = 500;
/** 노션처럼 클라이언트 렌더라 본문이 안 담기는 페이지의 껍데기 텍스트를 걸러내는 하한 */
const MIN_CHARS_FOR_READING_TIME = 1200;

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
};

async function fetchWithTimeout(url: string, accept: string): Promise<Response> {
  return fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: accept },
    redirect: 'follow',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

function hashUrl(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 16);
}

/** og:image 값이 실제 URL 인지 확인한다. 일부 사이트는 "[object Object]" 를 내보낸다. */
function toAbsoluteUrl(value: string | undefined, base: string): string | null {
  if (!value || value.includes('[object')) return null;
  try {
    const resolved = new URL(value, base);
    return resolved.protocol === 'http:' || resolved.protocol === 'https:' ? resolved.href : null;
  } catch {
    return null;
  }
}

async function downloadImage(
  imageUrl: string,
  publicDir: string,
  prefix: string,
): Promise<OgImage | null> {
  const response = await fetchWithTimeout(imageUrl, 'image/*');
  if (!response.ok) return null;

  const mime = (response.headers.get('content-type') ?? '').split(';')[0]?.trim() ?? '';
  const extension = EXTENSION_BY_MIME[mime];
  if (!extension) return null;

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES) return null;

  let width: number | undefined;
  let height: number | undefined;
  try {
    const size = imageSize(bytes);
    width = size.width;
    height = size.height;
  } catch {
    return null;
  }
  if (!width || !height) return null;

  const fileName = `${prefix}.${extension}`;
  await mkdir(publicDir, { recursive: true });
  await writeFile(join(publicDir, fileName), bytes);

  return { src: `/og/${fileName}`, width, height };
}

async function downloadFavicon(
  $: cheerio.CheerioAPI,
  pageUrl: string,
  publicDir: string,
  prefix: string,
): Promise<string | null> {
  const declared = $('link[rel~="icon"]').attr('href');
  const candidates = [
    toAbsoluteUrl(declared, pageUrl),
    toAbsoluteUrl('/favicon.ico', pageUrl),
  ].filter((value): value is string => value !== null);

  for (const candidate of candidates) {
    try {
      const image = await downloadImage(candidate, join(publicDir, 'favicons'), prefix);
      if (image) return `/og/favicons/${image.src.split('/').pop()}`;
    } catch {
      // 파비콘은 없어도 되므로 조용히 넘어간다.
    }
  }
  return null;
}

/** 발췌로 쓸 문단 수와 한 문단의 상한. 원문을 대체할 만큼 길게 가져가지 않는다. */
const EXCERPT_PARAGRAPHS = 3;
const MAX_PARAGRAPH_LENGTH = 400;

/** 본문 컨테이너를 고른다. 티스토리는 전용 클래스가 따로 있다. */
function findBody($: cheerio.CheerioAPI) {
  const candidates = ['.entry-content', '.tt_article_useless_p_margin', 'article', 'main'];
  for (const selector of candidates) {
    const found = $(selector).first();
    if (found.length && found.text().trim().length > 500) return found;
  }
  return $('body');
}

/** 본문 앞 문단 몇 개. 목차나 캡션 같은 짧은 조각은 건너뛴다. */
function extractExcerpt($: cheerio.CheerioAPI): string[] | undefined {
  const container = findBody($);
  container.find('script, style, noscript, nav, header, footer, aside, figure').remove();

  const paragraphs = container
    .find('p')
    .toArray()
    .map((element) => $(element).text().replace(/\s+/g, ' ').trim())
    .filter((text) => text.length > 40)
    .slice(0, EXCERPT_PARAGRAPHS)
    .map((text) =>
      text.length > MAX_PARAGRAPH_LENGTH ? `${text.slice(0, MAX_PARAGRAPH_LENGTH)}…` : text,
    );

  return paragraphs.length > 0 ? paragraphs : undefined;
}

function estimateReadingMinutes($: cheerio.CheerioAPI): number | undefined {
  const container = $('article').first().length
    ? $('article').first()
    : $('main').first().length
      ? $('main').first()
      : $('body');

  container.find('script, style, noscript, nav, header, footer, aside').remove();
  const text = container.text().replace(/\s+/g, ' ').trim();
  if (text.length < MIN_CHARS_FOR_READING_TIME) return undefined;

  return Math.max(1, Math.round(text.length / CHARS_PER_MINUTE));
}

function meta($: cheerio.CheerioAPI, ...names: string[]): string | undefined {
  for (const name of names) {
    const value =
      $(`meta[property="${name}"]`).attr('content') ?? $(`meta[name="${name}"]`).attr('content');
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

export async function crawlOg(url: string, publicOgDir: string): Promise<OgEntry> {
  const fetchedAt = new Date().toISOString();
  const prefix = hashUrl(url);

  try {
    const response = await fetchWithTimeout(url, 'text/html,application/xhtml+xml');
    if (!response.ok) {
      return { url, ok: false, status: response.status, error: response.statusText, fetchedAt };
    }

    const $ = cheerio.load(await response.text());

    const imageUrl = toAbsoluteUrl(meta($, 'og:image', 'twitter:image'), url);
    const image = imageUrl ? await downloadImage(imageUrl, publicOgDir, prefix) : null;
    const favicon = await downloadFavicon($, url, publicOgDir, prefix);

    return {
      url,
      ok: true,
      status: response.status,
      title:
        meta($, 'og:title', 'twitter:title') ?? ($('title').first().text().trim() || undefined),
      description: meta($, 'og:description', 'twitter:description', 'description'),
      siteName: meta($, 'og:site_name') ?? new URL(url).hostname.replace(/^www\./, ''),
      image: image ?? undefined,
      favicon: favicon ?? undefined,
      readingMinutes: estimateReadingMinutes($),
      excerpt: extractExcerpt($),
      fetchedAt,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: null,
      error: error instanceof Error ? error.message : String(error),
      fetchedAt,
    };
  }
}
