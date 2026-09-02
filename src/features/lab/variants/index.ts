import type { CardVariant } from '../types';
import { IndexedCard, StandardCard } from './base-cards';
import { BookCoverCard, FolderCard, OffsetCard, WatermarkCard } from './dense-cards';
import { CutCornerCard, NaturalRatioCard, StoryCard, ThumbRightCard } from './media-cards';

const GRID_3 = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3';
const GRID_4 = 'grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
const MASONRY = 'columns-1 gap-5 sm:columns-2 lg:columns-3';
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
    id: 'natural-ratio',
    name: '02 · 비율 유지',
    note: '썸네일을 자르지 않고 원본 비율 그대로 쌓는다. 이미지 정보가 손실되지 않는다.',
    layout: MASONRY,
    Component: NaturalRatioCard,
  },
  {
    id: 'thumb-right',
    name: '03 · 우측 썸네일',
    note: '제목이 먼저 읽히고 썸네일은 보조로 물러난다. 글 중심 목록에 맞는다.',
    layout: STACK,
    Component: ThumbRightCard,
  },
  {
    id: 'cut-corner',
    name: '04 · 컷 코너',
    note: '오른쪽 위 모서리를 잘라내고 그 자리에 회차 번호를 놓는다.',
    layout: GRID_3,
    Component: CutCornerCard,
  },
  {
    id: 'story',
    name: '05 · 스토리',
    note: '9:14 세로 카드. 상단 세그먼트가 몇 번째 글인지 보여준다.',
    layout: GRID_4,
    Component: StoryCard,
  },
  {
    id: 'offset',
    name: '06 · 오프셋',
    note: '썸네일과 텍스트 블록을 어긋나게 겹친다. 정렬을 일부러 깨서 리듬을 만든다.',
    layout: GRID_3,
    Component: OffsetCard,
  },
  {
    id: 'folder',
    name: '07 · 폴더',
    note: '상단 탭에 대표 태그를 올린다. 주제별로 분류된 인상을 준다.',
    layout: GRID_3,
    Component: FolderCard,
  },
  {
    id: 'indexed',
    name: '08 · 인덱스',
    note: '번호를 세워 순서를 강조한다. 최신순 목록이라는 성격이 드러난다.',
    layout: STACK,
    Component: IndexedCard,
  },
  {
    id: 'watermark',
    name: '09 · 워터마크',
    note: '회차 번호를 배경에 크게 깔고 썸네일은 원형으로 작게. 텍스트가 주인공이다.',
    layout: GRID_3,
    Component: WatermarkCard,
  },
  {
    id: 'book-cover',
    name: '10 · 책 표지',
    note: '2:3 세로 표지에 책등 그림자. 서가에 꽂힌 것처럼 보인다.',
    layout: GRID_4,
    Component: BookCoverCard,
  },
];
