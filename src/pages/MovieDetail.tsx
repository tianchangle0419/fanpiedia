import { Link, useParams } from 'react-router'
import { DirectorLink, EpNo, RoleBadge, SectionHead } from '@/components/bits'
import { getMovie, getMovieAppearances } from '@/data/archive'

export default function MovieDetail() {
  const { id } = useParams()
  const movie = id ? getMovie(id) : undefined

  if (!movie) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-2xl">没有找到这部电影</p>
        <Link to="/movies" className="mt-4 inline-flex h-11 items-center px-2 text-signal underline underline-offset-4">
          返回电影索引
        </Link>
      </div>
    )
  }

  const apps = getMovieAppearances(movie.id)
  const mains = apps.filter((a) => a.role === 'main')
  const mentions = apps.filter((a) => a.role === 'mentioned')

  return (
    <div className="pb-4 pt-10 md:pt-16">
      <nav aria-label="面包屑" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-60">
        <Link to="/movies" className="nav-link hover:text-signal">电影索引</Link>
        <span aria-hidden> / </span>
        <span>{movie.letter}</span>
      </nav>

      <h1 className="mt-5 font-display text-4xl leading-tight md:text-6xl">{movie.title}</h1>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {movie.originalTitle && (
          <p className="text-base text-ink-60 md:text-lg">{movie.originalTitle}</p>
        )}
        {movie.year && (
          <p className="font-mono text-base tabular-nums text-ink-60 md:text-lg">{movie.year}</p>
        )}
        {movie.directors && movie.directors.length > 0 && (
          <p className="text-base md:text-lg">
            {movie.directors.map((d, i) => (
              <span key={d.zh}>
                {i > 0 && <span className="text-ink-40"> / </span>}
                <DirectorLink id={d.zh} zh={d.zh} en={d.en} />
              </span>
            ))}
          </p>
        )}
        {movie.doubanId && (
          <a
            href={`https://movie.douban.com/subject/${movie.doubanId}/`}
            target="_blank"
            rel="noreferrer"
            className="nav-link font-mono text-sm tabular-nums text-ink-60 hover:text-signal"
          >
            豆瓣条目 ↗
          </a>
        )}
      </div>

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-y border-ink-15 py-4 text-sm">
        <div className="flex gap-2">
          <dt className="text-ink-60">专题主聊</dt>
          <dd className="font-mono tabular-nums">{mains.length} 期</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-ink-60">片目提及</dt>
          <dd className="font-mono tabular-nums">{mentions.length} 期</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-ink-60">合计出现</dt>
          <dd className="font-mono tabular-nums text-signal">{apps.length} 期</dd>
        </div>
      </dl>

      {apps.length === 0 ? (
        <p className="mt-10 border border-dashed border-ink-15 px-4 py-12 text-center text-sm text-ink-60">
          这部电影已收录进索引，但当前节目数据中还没有聊到它。
        </p>
      ) : (
        <>
          {mains.length > 0 && (
            <section className="pt-12">
              <SectionHead en="Featured in" zh="专题主聊它的节目" count={mains.length} />
              <AppearanceList items={mains} />
            </section>
          )}
          {mentions.length > 0 && (
            <section className="pt-12">
              <SectionHead en="Mentioned in" zh="片目提到它的节目" count={mentions.length} />
              <AppearanceList items={mentions} />
            </section>
          )}
        </>
      )}
    </div>
  )
}

function AppearanceList({ items }: { items: ReturnType<typeof getMovieAppearances> }) {
  return (
    <ul>
      {items.map((a) => (
        <li key={a.episode.id}>
          <Link
            to={`/episodes/${a.episode.id}`}
            className="hl-parent group grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 border-b border-ink-15 py-4 md:grid-cols-[3rem_5.5rem_1fr_auto] md:gap-x-5"
          >
            <RoleBadge role={a.role} />
            <EpNo episode={a.episode} className="text-sm" />
            <span className="col-span-2 min-w-0 md:col-span-1">
              <span className="hl font-display text-lg leading-snug">{a.episode.title}</span>
            </span>
            <span className="col-start-2 font-mono text-xs tabular-nums text-ink-40 md:col-start-auto">
              {a.episode.date}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
