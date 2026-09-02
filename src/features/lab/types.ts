import type { ArticleCardData } from '@/lib/archive/view';

export interface CardVariantProps {
  article: ArticleCardData;
  index: number;
}

export interface CardVariant {
  id: string;
  name: string;
  note: string;
  /** 시안을 감싸는 컨테이너 클래스. 그리드/리스트 등 배치가 시안마다 다르다. */
  layout: string;
  Component: (props: CardVariantProps) => React.ReactNode;
}
