import type { CardVariant } from '../types';
import { IndexedCard, StandardCard } from './base-cards';
import { MattedCard, PeekCard, SidebarCard, StripCard } from './dense-cards';
import { BannerCard, NumberOverlayCard, RevealCard, StampCard } from './media-cards';

const GRID_3 = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3';
const GRID_2 = 'grid gap-6 sm:grid-cols-2';
const STACK = 'flex flex-col gap-4';
const STACK_TIGHT = 'flex flex-col';

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
    layout: STACK_TIGHT,
    Component: IndexedCard,
  },
  {
    id: 'stamp',
    name: '03 · 스탬프',
    note: '썸네일을 원형으로 도려내 카드 위에 겹친다. 프로필 카드 같은 인상.',
    layout: GRID_3,
    Component: StampCard,
  },
  {
    id: 'banner',
    name: '04 · 배너',
    note: '썸네일이 왼쪽 전체를 차지하는 와이드형. 태그를 포인트 색으로 앞세운다.',
    layout: STACK,
    Component: BannerCard,
  },
  {
    id: 'reveal',
    name: '05 · 리빌',
    note: '3:4 세로 카드. 평소엔 제목만 보이고 호버하면 요약이 떠오른다.',
    layout: GRID_3,
    Component: RevealCard,
  },
  {
    id: 'number-overlay',
    name: '06 · 넘버 오버레이',
    note: '회차 번호를 썸네일 아래쪽에 크게 걸쳐 놓는다.',
    layout: GRID_3,
    Component: NumberOverlayCard,
  },
  {
    id: 'matted',
    name: '07 · 액자',
    note: '썸네일과 본문을 각각 흰 판 위에 올리고 회색 매트로 감싼다.',
    layout: GRID_3,
    Component: MattedCard,
  },
  {
    id: 'sidebar',
    name: '08 · 사이드바',
    note: '왼쪽 굵은 색 막대로 목록의 리듬을 만든다. 썸네일은 오른쪽 작은 정사각.',
    layout: STACK,
    Component: SidebarCard,
  },
  {
    id: 'strip',
    name: '09 · 스트립',
    note: '썸네일을 5:1 로 얇게 잘라 띠처럼. 이미지 비중을 최소로 줄인다.',
    layout: GRID_3,
    Component: StripCard,
  },
  {
    id: 'peek',
    name: '10 · 픽',
    note: '썸네일이 카드 밖으로 살짝 빠져나온다. 목록에 입체감이 생긴다.',
    layout: GRID_2,
    Component: PeekCard,
  },
];
