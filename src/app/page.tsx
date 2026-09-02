import { archives, articles } from '@/lib/archive/source';

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Frontend Archive</h1>
      <p className="mt-3 text-muted-foreground">
        스터디 {archives.length}회차 · 아티클 {articles.length}개
      </p>
      <ul className="mt-10 space-y-4">
        {articles.map((article) => (
          <li key={article.key}>
            <a href={article.url} target="_blank" rel="noreferrer" className="hover:underline">
              {article.title}
            </a>
            <p className="mt-1 text-sm text-muted-foreground">
              {article.author} · {article.archiveId}회차 · {article.tags.join(', ')}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
