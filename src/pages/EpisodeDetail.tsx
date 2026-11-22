import { Link, useParams } from 'react-router'
import { GuestLink, MovieLink, RoleBadge, SectionHead } from '@/components/bits'
import { byDateDesc, epLabel, episodes, getEpisode, getGuest, getMovie, seriesGroup, seriesLabel } from '@/data/archive'

export default function EpisodeDetail() {
  const { id } = useParams()
  const ep = id ? getEpisode(id) : undefined

  if (!ep) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-2xl">没有找到这期节目</p>
        <Link to="/episodes" className="mt-4 inline-flex h-11 items-center px-2 text-signal underline underline-offset-4">
          返回节目目录
        </Link>
      </div>
    )
  }

  const mains = ep.movies.filter((m) => m.role === 'main')
  const mentioned = ep.movies
    .filter((m) => m.role === 'mentioned')
    .sort((a, b) => (getMovie(a.movieId)?.year ?? 9999) - (getMovie(b.movieId)?.year ?? 9999))

  const hostEntry = ep.guests.find((g) => g.guestId === '波米')
  const otherGuests = ep.guests.filter((g) => g.guestId !== '波米')
  const isMa = seriesGroup(ep.series) === 'ma'
  const isEr = seriesGroup(ep.series) === 'er'

  return (
    <div className="pb-4 pt-10 md:pt-16">
      <nav aria-label="面包屑" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-60">
        <Link to="/episodes" className="nav-link hover:text-signal">节目目录</Link>
        <span aria-hidden> / </span>
        <span>{seriesLabel(ep.series)}</span>
        <span aria-hidden> / </span>
        <span>{epLabel(ep)}</span>
      </nav>

      <h1 className="mt-5 max-w-3xl font-display text-3xl leading-snug md:text-5xl md:leading-[1.2]">
        {ep.title}
      </h1>

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-ink-15 py-4 text-sm">
        <div className="flex gap-2">
          <dt className="text-ink-60">上线</dt>
          <dd className="font-mono tabular-nums">{ep.date}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-ink-60">主播</dt>
          <dd className="flex flex-wrap gap-x-4 gap-y-1">
            {hostEntry && <GuestLink id="波米" name="波米" />}
            {(isMa || isEr) &&
              otherGuests.map((g) => {
                const guest = getGuest(g.guestId)
                return guest ? (
                  <GuestLink key={g.guestId} id={guest.id} name={guest.name} />
                ) : null
              })}
          </dd>
        </div>
        {!isMa && !isEr && otherGuests.length > 0 && (
          <div className="flex gap-2">
            <dt className="text-ink-60">嘉宾</dt>
            <dd className="flex flex-wrap gap-x-4 gap-y-1">
              {otherGuests.map((g) => {
                const guest = getGuest(g.guestId)
                return guest ? (
                  <GuestLink key={g.guestId} id={guest.id} name={guest.name} />
                ) : null
              })}
            </dd>
          </div>
        )}
      </dl>

      {/* 专题主聊 */}
      {mains.length > 0 && (
        <section className="pt-12">
          <SectionHead en="Feature" zh="专题主聊" count={mains.length} />
          <ul>
            {mains.map((em) => {
              const m = getMovie(em.movieId)
              if (!m) return null
              return (
                <li
                  key={em.movieId}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-ink-15 py-4"
                >
                  <RoleBadge role="main" />
                  <MovieLink id={m.id} title={m.title} className="text-xl md:text-2xl" />
                  <span className="text-sm text-ink-60">
                    {m.originalTitle && <span>{m.originalTitle}</span>}
                    {m.originalTitle && m.year && <span aria-hidden> · </span>}
                    {m.year && <span className="font-mono tabular-nums">{m.year}</span>}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {mentioned.length > 0 && (
        <section className="pt-12">
          <SectionHead
            en="In this episode"
            zh={seriesGroup(ep.series) === 'main' ? '本期片目提及' : '本期谈到的电影'}
            count={mentioned.length}
          />
          <ul className="grid gap-x-8 md:grid-cols-2">
            {mentioned.map((em) => {
              const m = getMovie(em.movieId)
              if (!m) return null
              return (
                <li
                  key={em.movieId}
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
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* 上一期 / 下一期（同系列内导航） */}
      <SeriesNav ep={ep} />
    </div>
  )
}

function SeriesNav({ ep }: { ep: NonNullable<ReturnType<typeof getEpisode>> }) {
  const sameSeries = episodes.filter((e) => seriesGroup(e.series) === seriesGroup(ep.series)).sort(byDateDesc)
  const idx = sameSeries.findIndex((e) => e.id === ep.id)
  const prev = sameSeries[idx + 1] // 更旧
  const next = sameSeries[idx - 1] // 更新
  return (
    <nav aria-label="相邻节目" className="mt-14 grid gap-px border border-ink-15 bg-ink-15 md:grid-cols-2">
      {prev ? (
        <Link to={`/episodes/${prev.id}`} className="hl-parent group bg-paper p-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-60">← 上一期</span>
          <span className="mt-2 block">
            <span className="hl font-display text-lg">{epLabel(prev)} {prev.title}</span>
          </span>
        </Link>
      ) : (
        <div className="bg-paper p-5 text-sm text-ink-40">已是最早一期</div>
      )}
      {next ? (
        <Link to={`/episodes/${next.id}`} className="hl-parent group bg-paper p-5 md:text-right">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-60">下一期 →</span>
          <span className="mt-2 block">
            <span className="hl font-display text-lg">{epLabel(next)} {next.title}</span>
          </span>
        </Link>
      ) : (
        <div className="bg-paper p-5 text-sm text-ink-40 md:text-right">已是最新一期</div>
      )}
    </nav>
  )
}
