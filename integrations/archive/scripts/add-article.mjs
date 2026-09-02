/**
 * 블로그에서 보낸 repository_dispatch 페이로드를 받아 archives/*.md 를 고친다.
 *
 * 의존성을 추가하지 않기 위해 Node 내장 모듈만 쓴다. frontmatter 형식이 고정되어 있어
 * 줄 단위 편집으로 충분하고, 최종 정규화는 이 레포의 prettier 가 맡는다.
 *
 * 사용: PAYLOAD='<json>' node scripts/add-article.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ARCHIVES_DIR = 'archives';
const ARCHIVE_FILE = /^\d{6}\.md$/;
const MEETING_TYPES = ['on-line', 'off-line'];

function die(message) {
  console.error(`[add-article] ${message}`);
  process.exit(1);
}

/**
 * YAML 문자열 리터럴.
 *
 * 이 레포 규칙은 작은따옴표지만, 값 안에 작은따옴표가 있으면 prettier 가
 * 이스케이프를 피해 큰따옴표로 바꿔버린다. 그 형태로 미리 내보내 재포맷을 없앤다.
 */
function yamlQuote(value) {
  const text = String(value);
  if (!text.includes("'")) return `'${text}'`;
  return `"${text.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
}

function parsePayload() {
  const raw = process.env.PAYLOAD;
  if (!raw) die('PAYLOAD 환경변수가 없습니다.');

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    die('PAYLOAD 를 JSON 으로 읽지 못했습니다.');
  }

  if (payload.mode === 'fill-slot') {
    const { author, archiveId, title, url, tags } = payload;
    if (typeof author !== 'string' || !author) die('author 가 없습니다.');
    if (!Number.isInteger(archiveId) || archiveId <= 0) die('archiveId 가 올바르지 않습니다.');
    if (typeof title !== 'string' || !title.trim()) die('title 이 비었습니다.');
    if (typeof url !== 'string' || !/^https?:\/\//.test(url)) die('url 이 올바르지 않습니다.');
    if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== 'string')) {
      die('tags 는 문자열 배열이어야 합니다.');
    }
    return payload;
  }

  if (payload.mode === 'new-archive') {
    const { date, type } = payload;
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) die('date 형식이 다릅니다.');
    if (!MEETING_TYPES.includes(type)) die('type 이 올바르지 않습니다.');
    return payload;
  }

  return die(`알 수 없는 mode: ${payload.mode}`);
}

async function readArchives() {
  const names = (await readdir(ARCHIVES_DIR)).filter((name) => ARCHIVE_FILE.test(name)).sort();
  return Promise.all(
    names.map(async (fileName) => ({
      fileName,
      path: join(ARCHIVES_DIR, fileName),
      lines: (await readFile(join(ARCHIVES_DIR, fileName), 'utf8')).split('\n'),
    })),
  );
}

function readId(lines) {
  const match = lines.find((line) => /^id:\s*\d+/.test(line));
  return match ? Number(match.replace(/^id:\s*/, '')) : null;
}

/** frontmatter 안에서 해당 author 항목이 차지하는 줄 범위 [시작, 끝) */
function findAuthorBlock(lines, author) {
  const start = lines.findIndex((line) =>
    new RegExp(`^\\s*-\\s*author:\\s*'${author.replaceAll("'", "''")}'\\s*$`).test(line),
  );
  if (start === -1) return null;

  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end];
    if (/^\s*-\s*author:/.test(line) || line.trim() === '---') break;
    end += 1;
  }
  return { start, end };
}

function fillSlot(archives, payload) {
  const target = archives.find((archive) => readId(archive.lines) === payload.archiveId);
  if (!target) die(`${payload.archiveId}회차 파일을 찾지 못했습니다.`);

  const block = findAuthorBlock(target.lines, payload.author);
  if (!block) die(`${target.fileName} 에서 ${payload.author} 항목을 찾지 못했습니다.`);

  const slice = target.lines.slice(block.start, block.end);
  const currentUrl = slice.find((line) => /^\s*url:/.test(line)) ?? '';
  if (!/url:\s*''\s*$/.test(currentUrl)) {
    die(`${payload.author} 님의 ${payload.archiveId}회차 자리는 이미 채워져 있습니다.`);
  }

  const tags = payload.tags.map(yamlQuote).join(', ');
  const replaced = slice.map((line) => {
    if (/^\s*title:/.test(line)) return `    title: ${yamlQuote(payload.title)}`;
    if (/^\s*url:/.test(line)) return `    url: ${yamlQuote(payload.url)}`;
    if (/^\s*tags:/.test(line)) return `    tags: [${tags}]`;
    return line;
  });

  target.lines.splice(block.start, block.end - block.start, ...replaced);
  return {
    path: target.path,
    lines: target.lines,
    summary: `${payload.archiveId}회차 ${payload.author}`,
  };
}

/** 가장 최근 회차에서 멤버 이름과 순서를 그대로 가져온다. */
function readAuthors(lines) {
  return lines
    .filter((line) => /^\s*-\s*author:/.test(line))
    .map((line) => line.replace(/^\s*-\s*author:\s*'?/, '').replace(/'?\s*$/, ''));
}

function newArchive(archives, payload) {
  const yearMonth = payload.date.slice(0, 7).replace('-', '');
  const fileName = `${yearMonth}.md`;
  if (archives.some((archive) => archive.fileName === fileName)) {
    die(`${fileName} 이 이미 있습니다.`);
  }

  const latest = archives.at(-1);
  if (!latest) die('기준으로 삼을 기존 회차가 없습니다.');

  const id = Math.max(...archives.map((archive) => readId(archive.lines) ?? 0)) + 1;
  const authors = readAuthors(latest.lines);
  if (authors.length === 0) die('기존 회차에서 멤버 목록을 읽지 못했습니다.');

  const slots = authors
    .map((author) =>
      [`  - author: ${yamlQuote(author)}`, "    title: ''", "    url: ''", '    tags: []'].join(
        '\n',
      ),
    )
    .join('\n\n');

  const body = [
    '---',
    `id: ${id}`,
    `date: ${yamlQuote(payload.date)}`,
    `title: ${yamlQuote(`스터디 ${id}회차`)}`,
    `type: ${yamlQuote(payload.type)}`,
    'articles:',
    slots,
    '---',
    '',
    `스터디 ${id}회차 (${payload.date.replaceAll('-', '.')})`,
    '',
  ].join('\n');

  return { path: join(ARCHIVES_DIR, fileName), lines: body.split('\n'), summary: `${id}회차 생성` };
}

const payload = parsePayload();
const archives = await readArchives();
const result =
  payload.mode === 'fill-slot' ? fillSlot(archives, payload) : newArchive(archives, payload);

await writeFile(result.path, result.lines.join('\n'), 'utf8');
console.log(`[add-article] ${result.path} — ${result.summary}`);

if (process.env.GITHUB_OUTPUT) {
  const { appendFileSync } = await import('node:fs');
  appendFileSync(process.env.GITHUB_OUTPUT, `summary=${result.summary}\n`);
}
