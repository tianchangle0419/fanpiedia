import { Link, useParams } from 'react-router'
import { EpNo, MovieLink, SectionHead } from '@/components/bits'
import { getDirector, getDirectorEpisodes, getDirectorMovies, movieStats } from '@/data/archive'

export default function DirectorDetail() {
  const { id } = useParams()
  const director = id ? getDirector(decodeURIComponent(id)) : undefined

  if (!director) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-2xl">没有找到这位导演</p>
        <Link to="/directors" className="mt-4 inline-flex h-11 items-center px-2 text-signal underline underline-offset-4">
          返回导演索引
        </Link>
      </div>
    )
  }

  const films = getDirectorMovies(director.id)
  const epHits = getDirectorEpisodes(director.id)

  return (
    <div className="pb-4 pt-10 md:pt-16">
      <nav aria-label="面包屑" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-60">
        <Link to="/directors" className="nav-link hover:text-signal">导演索引</Link>
        <span aria-hidden> / </span>
        <span>{director.zh}</span>
      </nav>

      <h1 className="mt-5 font-display text-4xl leading-tight md:text-6xl">{director.zh}</h1>
      {director.en && <p className="mt-3 text-base text-ink-60 md:text-lg">{director.en}</p>}

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-y border-ink-15 py-4 text-sm">
        <div className="flex gap-2">
          <dt className="text-ink-60">在库作品</dt>
          <dd className="font-mono tabular-nums">{films.length} 部</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-ink-60">作品被提及</dt>
          <dd className="font-mono tabular-nums text-signal">{epHits.length} 期</dd>
        </div>
      </dl>

      {/* 作品列表 */}
      <section className="pt-12">
        <SectionHead en="Filmography" zh={`${director.zh} 的作品`} count={films.length} />
        {films.length === 0 ? (
          <p className="py-4 text-sm text-ink-60">暂无在库作品。</p>
        ) : (
          <ul className="grid gap-x-8 md:grid-cols-2">
            {films.map((m) => {
              const st = movieStats(m.id)
              return (
                <li
                  key={m.id}
                  className="flex items-baseline justify-between gap-4 border-b border-ink-15 py-3"
                >
                  <span className="min-w-0">
                    <MovieLink id={m.id} title={m.title} className="text-lg" />
                    {m.originalTitle && (
                      <span className="ml-2 text-xs text-ink-60">{m.originalTitle}</span>
                    )}
                  </span>
                  <span className="shrink-0 text-right font-mono text-xs tabular-nums text-ink-40">
                    {m.year}
                    {st.total > 0 && (
                      <span className="ml-2 text-ink-60">
                        <span className="text-signal">{st.total}</span> 期
                      </span>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* 提及这些作品的节目 */}
      {epHits.length > 0 && (
        <section className="pt-12">
          <SectionHead en="Mentioned in" zh="提及这些作品的节目" count={epHits.length} />
          <ul>
            {epHits.map(({ episode: e, films: fs }) => (
              <li key={e.id}>
                <Link
                  to={`/episodes/${e.id}`}
                  className="hl-parent group grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 border-b border-ink-15 py-4 md:grid-cols-[5.5rem_1fr_auto] md:gap-x-5"
                >
                  <EpNo episode={e} className="text-sm" />
                  <span className="min-w-0">
                    <span className="hl font-display text-lg leading-snug">{e.title}</span>
                    <span className="mt-1 block truncate text-xs text-ink-60 md:text-sm">
                      涉及：{fs.map((f) => f.title).join(' / ')}
                    </span>
                  </span>
                  <span className="col-start-2 font-mono text-xs tabular-nums text-ink-40 md:col-start-auto">
                    {e.date}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
