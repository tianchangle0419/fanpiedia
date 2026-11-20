import { Link, useParams } from 'react-router'
import { EpNo, SectionHead } from '@/components/bits'
import { getGuest, getGuestEpisodes, getMovie } from '@/data/archive'

export default function GuestDetail() {
  const { id } = useParams()
  const guest = id ? getGuest(id) : undefined

  if (!guest) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-2xl">没有找到这位嘉宾</p>
        <Link to="/guests" className="mt-4 inline-flex h-11 items-center px-2 text-signal underline underline-offset-4">
          返回嘉宾索引
        </Link>
      </div>
    )
  }

  const eps = getGuestEpisodes(guest.id)

  return (
    <div className="pb-4 pt-10 md:pt-16">
      <nav aria-label="面包屑" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-60">
        <Link to="/guests" className="nav-link hover:text-signal">嘉宾索引</Link>
        <span aria-hidden> / </span>
        <span>{guest.name}</span>
      </nav>

      <h1 className="mt-5 font-display text-4xl leading-tight md:text-6xl">
        {guest.name}
        {guest.isHost && (
          <span className="ml-3 align-middle font-mono text-sm text-signal">主播</span>
        )}
      </h1>

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-y border-ink-15 py-4 text-sm">
        <div className="flex gap-2">
          <dt className="text-ink-60">出场</dt>
          <dd className="font-mono tabular-nums text-signal">{eps.length} 期</dd>
        </div>
      </dl>

      <section className="pt-12">
        <SectionHead en="Appeared in" zh={`${guest.name} 出现的节目`} count={eps.length} />
        <ul>
          {eps.map((e) => {
            const mainTitles = e.movies
              .filter((m) => m.role === 'main')
              .map((m) => getMovie(m.movieId)?.title)
              .filter(Boolean)
              .join(' / ')
            return (
              <li key={e.id}>
                <Link
                  to={`/episodes/${e.id}`}
                  className="hl-parent group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 border-b border-ink-15 py-4 md:grid-cols-[5.5rem_1fr_auto_auto] md:gap-x-6"
                >
                  <EpNo episode={e} className="text-sm" />
                  <span className="min-w-0">
                    <span className="hl font-display text-lg leading-snug">{e.title}</span>
                    {mainTitles && (
                      <span className="mt-1 block truncate text-xs text-ink-60 md:text-sm">
                        主聊：{mainTitles}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-ink-40">{e.date}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
