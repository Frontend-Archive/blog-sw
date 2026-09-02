import type { CardVariant } from '../types';
import { IndexedCard, StandardCard } from './base-cards';
import { GlassCard, MiniRowCard, SplitCard, StackCard } from './dense-cards';
import { OverlapCard, PolaroidCard, TicketCard, VerticalThumbCard } from './media-cards';

const GRID_3 = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3';
const GRID_2 = 'grid gap-4 sm:grid-cols-2';
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
    id: 'overlap',
    name: '02 · 오버랩',
    note: '텍스트 블록이 썸네일 위로 겹쳐 올라온다. 이미지와 글이 한 덩어리로 읽힌다.',
    layout: GRID_3,
    Component: OverlapCard,
  },
  {
    id: 'vertical-thumb',
    name: '03 · 세로 썸네일',
    note: '3:4 썸네일을 왼쪽에 세운다. 테두리 없이 목록 밀도를 높인다.',
    layout: GRID_2,
    Component: VerticalThumbCard,
  },
  {
    id: 'polaroid',
    name: '04 · 폴라로이드',
    note: '정사각 썸네일에 여백 프레임을 둘렀다. 호버 시 살짝 기운다.',
    layout: GRID_3,
    Component: PolaroidCard,
  },
  {
    id: 'ticket',
    name: '05 · 티켓',
    note: '절취선과 노치로 티켓처럼. 회차 번호를 발권 번호처럼 쓴다.',
    layout: GRID_2,
    Component: TicketCard,
  },
  {
    id: 'glass',
    name: '06 · 글래스',
    note: '썸네일을 꽉 채우고 하단에 반투명 바를 얹는다. 이미지가 주인공이 된다.',
    layout: GRID_3,
    Component: GlassCard,
  },
  {
    id: 'mini-row',
    name: '07 · 미니 행',
    note: '가장 촘촘하되 44px 썸네일로 시각 단서를 남긴다.',
    layout: STACK,
    Component: MiniRowCard,
  },
  {
    id: 'indexed',
    name: '08 · 인덱스',
    note: '번호를 세워 순서를 강조한다. 최신순 목록이라는 성격이 드러난다.',
    layout: STACK,
    Component: IndexedCard,
  },
  {
    id: 'stack',
    name: '09 · 스택',
    note: '뒤에 카드가 겹쳐 쌓인 듯 보인다. 아카이브가 쌓인다는 은유.',
    layout: GRID_3,
    Component: StackCard,
  },
  {
    id: 'split',
    name: '10 · 분할',
    note: '카드 안을 좌우로 나눈다. 세로 길이가 일정해 그리드가 가지런하다.',
    layout: GRID_2,
    Component: SplitCard,
  },
];
