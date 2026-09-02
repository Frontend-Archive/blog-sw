import type { CardVariant } from '../types';
import { IndexedCard, StandardCard } from './base-cards';
import { CircleCard, ColorBarCard, FilmStripCard, QuoteCard } from './dense-cards';
import { BrowserFrameCard, DuotoneCard, PageCurlCard, ZigzagCard } from './media-cards';

const GRID_3 = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3';
const GRID_4 = 'grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
const STACK = 'flex flex-col';

export const CARD_VARIANTS: CardVariant[] = [
  {
    id: 'standard',
    name: '01 · 기본형',
    note: '지금 홈에서 쓰는 형태. 대표 태그를 썸네일 위에 얹고 아래는 세 줄로 정리했다.',
    layout: GRID_3,
    Component: StandardCard,
  },
  {
    id: 'indexed',
    name: '02 · 인덱스',
    note: '번호를 세워 순서를 강조한다. 최신순 목록이라는 성격이 드러난다.',
    layout: STACK,
    Component: IndexedCard,
  },
  {
    id: 'browser-frame',
    name: '03 · 브라우저 창',
    note: '썸네일을 브라우저 목업 안에 넣고 주소창에 출처를 띄운다. 외부 링크임이 분명해진다.',
    layout: GRID_3,
    Component: BrowserFrameCard,
  },
  {
    id: 'zigzag',
    name: '04 · 지그재그',
    note: '홀·짝이 썸네일 좌우를 번갈아 차지한다. 스크롤에 리듬이 생긴다.',
    layout: STACK,
    Component: ZigzagCard,
  },
  {
    id: 'page-curl',
    name: '05 · 접힌 모서리',
    note: '오른쪽 아래가 종이처럼 말려 있고 그 자리에 회차 번호가 들어간다.',
    layout: GRID_3,
    Component: PageCurlCard,
  },
  {
    id: 'duotone',
    name: '06 · 듀오톤',
    note: '평소엔 색을 덮어 통일하고 호버하면 원래 색이 드러난다. 썸네일 색이 제각각인 문제를 덮는다.',
    layout: GRID_3,
    Component: DuotoneCard,
  },
  {
    id: 'film-strip',
    name: '07 · 필름',
    note: '위아래 퍼포레이션으로 필름 한 컷처럼. 기록물이라는 인상이 강하다.',
    layout: GRID_3,
    Component: FilmStripCard,
  },
  {
    id: 'circle',
    name: '08 · 원형',
    note: '원형 썸네일에 가운데 정렬. 사람이 쓴 글이라는 인상이 강해진다.',
    layout: GRID_4,
    Component: CircleCard,
  },
  {
    id: 'color-bar',
    name: '09 · 컬러 바',
    note: '회차마다 다른 색 띠를 위에 얹는다. 목록에서 회차가 색으로 구분된다.',
    layout: GRID_3,
    Component: ColorBarCard,
  },
  {
    id: 'quote',
    name: '10 · 인용문',
    note: '요약을 인용문처럼 앞세우고 썸네일은 배경으로 흐리게 깐다. 글맛이 먼저 온다.',
    layout: GRID_3,
    Component: QuoteCard,
  },
];
