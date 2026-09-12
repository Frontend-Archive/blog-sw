import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_URL } from '@/lib/site';

/**
 * 링크를 공유했을 때 뜨는 사이트 기본 이미지.
 *
 * 파일 규칙(opengraph-image.tsx)을 쓰지 않는 이유는, 그쪽이 하위 페이지의
 * 메타데이터보다 우선해서 아티클마다 붙인 원문 썸네일을 덮을 수 있기 때문이다.
 * 여기서 만들고 썸네일이 없는 페이지에만 기본값으로 건다.
 *
 * 기본 글꼴에 한글이 없어 글자는 영문만 쓴다.
 */
export const dynamic = 'force-static';

const SIZE = { width: 1200, height: 630 };

export async function GET() {
  const icon = await readFile(join(process.cwd(), 'src/app/icon.svg'));
  const iconSrc = `data:image/svg+xml;base64,${icon.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '0 96px',
        background: 'radial-gradient(circle at 20% 30%, #1f2a55 0%, #05070b 60%)',
        color: '#f5f7ff',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse 는 img 만 받는다 */}
      <img src={iconSrc} width={112} height={112} alt="" />
      <div style={{ marginTop: 48, fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>
        {SITE_NAME}
      </div>
      <div style={{ marginTop: 20, fontSize: 32, color: '#8f9bbf' }}>{new URL(SITE_URL).host}</div>
    </div>,
    SIZE,
  );
}
