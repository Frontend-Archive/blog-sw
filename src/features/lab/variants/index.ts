import type { CardVariant } from '../types';
import { BadgedCard, HorizontalCard, MagazineCard, OverlayCard, StandardCard } from './media-cards';
import { IndexedCard, MinimalCard, MonoCard, RowCard, StickerCard } from './text-cards';

const GRID_3 = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3';
const GRID_2 = 'grid gap-5 sm:grid-cols-2';
const STACK = 'flex flex-col';

export const CARD_VARIANTS: CardVariant[] = [
  {
    id: 'standard',
    name: '01 · 기본형',
    note: '지금 홈에서 쓰는 형태. 썸네일·요약·태그·출처를 모두 담는다.',
    layout: GRID_3,
    Component: StandardCard,
  },
  {
    id: 'overlay',
    name: '02 · 오버레이',
    note: '썸네일 위에 텍스트를 얹는다. 이미지가 좋은 글은 강해지지만 없으면 빈약해진다.',
    layout: GRID_3,
    Component: OverlayCard,
  },
  {
    id: 'horizontal',
    name: '03 · 가로형',
    note: '한 화면에 더 많이 들어간다. 목록 밀도와 썸네일을 둘 다 챙기는 절충안.',
    layout: GRID_2,
    Component: HorizontalCard,
  },
  {
    id: 'magazine',
    name: '04 · 매거진',
    note: '테두리를 없애고 제목을 키웠다. 글 수가 적을 때 여백이 자연스럽다.',
    layout: GRID_2,
    Component: MagazineCard,
  },
  {
    id: 'badged',
    name: '05 · 뱃지형',
    note: '회차와 읽는 시간을 썸네일 위로 올려 텍스트 영역을 비웠다.',
    layout: GRID_3,
    Component: BadgedCard,
  },
  {
    id: 'minimal',
    name: '06 · 미니멀',
    note: '썸네일 없이 글만. 노션처럼 썸네일이 부실한 링크가 섞여도 균일해 보인다.',
    layout: STACK,
    Component: MinimalCard,
  },
  {
    id: 'row',
    name: '07 · 표 행',
    note: '가장 촘촘하다. 19개를 한 화면에 다 넣을 수 있지만 탐색보다 열람에 가깝다.',
    layout: STACK,
    Component: RowCard,
  },
  {
    id: 'indexed',
    name: '08 · 인덱스',
    note: '번호를 세워 순서를 강조한다. 최신순 목록이라는 성격이 드러난다.',
    layout: STACK,
    Component: IndexedCard,
  },
  {
    id: 'mono',
    name: '09 · 모노',
    note: '메타를 고정폭으로. 개발자 대상이라는 톤이 분명해진다.',
    layout: GRID_3,
    Component: MonoCard,
  },
  {
    id: 'sticker',
    name: '10 · 스티커',
    note: '태그를 맨 위로 올려 주제부터 읽히게 했다. 썸네일 의존이 없다.',
    layout: GRID_3,
    Component: StickerCard,
  },
];
