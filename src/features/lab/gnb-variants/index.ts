import type { GnbVariant } from './shared';
import {
  CenterWordmarkGnb,
  DrawerGnb,
  LeftClusterGnb,
  RightClusterGnb,
  SearchLedGnb,
  ShrinkOnScrollGnb,
  ThirdsGnb,
  TwoRowGnb,
} from './bars';
import { BottomBarGnb, SideRailGnb } from './screens';

export const GNB_VARIANTS: GnbVariant[] = [
  {
    id: 'left-cluster',
    name: '01 · 좌측 집약',
    note: '로고와 내비를 왼쪽에 붙이고 액션만 오른쪽. 지금 쓰는 배치다.',
    frame: 'bar',
    Component: LeftClusterGnb,
  },
  {
    id: 'thirds',
    name: '02 · 3분할',
    note: '로고·내비·액션이 각각 3분의 1을 차지한다. 내비가 화면 정중앙에 온다.',
    frame: 'bar',
    Component: ThirdsGnb,
  },
  {
    id: 'right-cluster',
    name: '03 · 우측 집약',
    note: '로고만 왼쪽에 두고 내비와 액션을 모두 오른쪽으로 모은다. 가운데가 비어 여유롭다.',
    frame: 'bar',
    Component: RightClusterGnb,
  },
  {
    id: 'two-row',
    name: '04 · 2단',
    note: '위는 브랜드와 액션, 아래는 내비가 폭을 다 쓴다. 항목이 늘어도 눌리지 않는다.',
    frame: 'bar',
    Component: TwoRowGnb,
  },
  {
    id: 'center-wordmark',
    name: '05 · 로고 중앙',
    note: '내비 왼쪽, 로고 가운데, 액션 오른쪽. 좌우가 대칭이라 정적인 인상.',
    frame: 'bar',
    Component: CenterWordmarkGnb,
  },
  {
    id: 'search-led',
    name: '06 · 검색 확장',
    note: '검색이 헤더 가운데를 통째로 차지하고 내비는 메뉴로 접힌다. 찾기가 주 행동일 때.',
    frame: 'bar',
    Component: SearchLedGnb,
  },
  {
    id: 'shrink-on-scroll',
    name: '07 · 스크롤 축소',
    note: '처음엔 크게 펼쳐지고 스크롤하면 한 줄로 줄어든다. 두 상태를 나란히 놓았다.',
    frame: 'bar',
    Component: ShrinkOnScrollGnb,
  },
  {
    id: 'drawer',
    name: '08 · 드로어',
    note: '헤더에는 로고와 메뉴만, 내비는 옆에서 밀려 나온다. 헤더가 가장 조용하다.',
    frame: 'screen',
    Component: DrawerGnb,
  },
  {
    id: 'side-rail',
    name: '09 · 사이드 레일',
    note: '상단 바를 없애고 내비를 왼쪽 세로줄로 세운다. 항목이 늘어날수록 유리하다.',
    frame: 'screen',
    Component: SideRailGnb,
  },
  {
    id: 'bottom-bar',
    name: '10 · 하단 바',
    note: '상단에는 브랜드만 두고 이동은 화면 아래에서. 모바일에서 엄지가 닿는 자리다.',
    frame: 'screen',
    Component: BottomBarGnb,
  },
];
