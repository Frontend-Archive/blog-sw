import type { ArticleCardData } from '@/lib/archive/view';
import type { CardVariant } from './types';

interface LabSectionProps {
  variant: CardVariant;
  articles: ArticleCardData[];
}

export function LabSection({ variant, articles }: LabSectionProps) {
  const { name, note, layout, Component } = variant;

  return (
    <section id={variant.id} className="scroll-mt-20">
      <header className="mb-5 flex flex-col gap-1 border-b border-border/60 pb-4">
        <h2 className="font-semibold tracking-tight">{name}</h2>
        <p className="text-14 text-muted-foreground">{note}</p>
      </header>
      <div className={layout}>
        {articles.map((article, index) => (
          <Component key={article.key} article={article} index={index} />
        ))}
      </div>
    </section>
  );
}
