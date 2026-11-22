import { Link } from 'react-router'
import SearchBox from '@/components/SearchBox'
import { EpNo, SectionHead } from '@/components/bits'
import { byDateDesc, episodes, getMovie, movies, movieStats, siteStats } from '@/data/archive'

export default function Home() {
  const s = siteStats()
  const latest = [...episodes].sort(byDateDesc).slice(0, 5)
  // 被提及次数最多的电影
  const hottest = [...movies]
    .map((m) => ({ m, st: movieStats(m.id) }))
    .sort((a, b) => b.st.total - a.st.total)
    .slice(0, 8)

  return (
    <div>
      {/* Hero */}
      <section className="pb-10 pt-14 md:pb-16 md:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal">
          A listener-built index
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl md:leading-[1.15]">
          每部电影，
          <br />
          都能找回聊到它的<span className="text-signal">那期节目</span>。
        </h1>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-ink-60 md:text-lg">
          「反派影评」听友自建的索引：从一部电影、一位嘉宾、一位导演出发，
          立刻定位它出现在哪几期节目。
        </p>
        <div className="mt-8 max-w-xl">
          <SearchBox />
        </div>
      </section>

      {/* 统计条 */}
      <section aria-label="收录统计" className="grid grid-cols-2 border-y border-ink-15 md:grid-cols-4">
        {[
          { n: s.episodes, zh: '期节目', en: 'EPISODES', to: '/episodes' },
          { n: s.movies, zh: '部电影', en: 'MOVIES', to: '/movies' },
          { n: s.guests, zh: '位嘉宾', en: 'GUESTS', to: '/guests' },
          { n: s.mentions, zh: '条提及', en: 'MENTIONS', to: '/movies' },
        ].map((it, i) => (
          <Link
            key={it.en}
            to={it.to}
            className={`hl-parent group flex flex-col gap-1 px-4 py-5 transition-colors md:px-6 md:py-6 ${
              i > 0 ? 'border-l border-ink-15' : ''
            } ${i >= 2 ? 'max-md:border-t max-md:border-ink-15' : ''} ${i === 2 ? 'max-md:border-l-0' : ''}`}
          >
            <span className="font-mono text-2xl tabular-nums md:text-3xl">
              <span className="hl">{it.n}</span>
            </span>
            <span className="text-sm text-ink-60">
              {it.zh}
              <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-40">
                {it.en}
              </span>
            </span>
          </Link>
        ))}
      </section>

      {/* 最新节目 */}
      <section className="pt-14 md:pt-20">
        <SectionHead en="Latest" zh="最新节目" count={episodes.length} />
        <ul>
          {latest.map((e) => {
            const mainTitles = e.movies
              .filter((m) => m.role === 'main')
              .map((m) => getMovie(m.movieId)?.title)
              .filter(Boolean)
              .join(' / ')
            return (
              <li key={e.id}>
                <Link
                  to={`/episodes/${e.id}`}
                  className="hl-parent group grid grid-cols-[auto_1fr] items-baseline gap-x-4 border-b border-ink-15 py-4 md:grid-cols-[5.5rem_1fr_auto] md:gap-x-6"
                >
                  <EpNo episode={e} className="text-sm" />
                  <span className="min-w-0">
                    <span className="hl font-display text-lg md:text-xl">{e.title}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-60">
                      <span className="font-mono tabular-nums">{e.date}</span>
                      {mainTitles && (
                        <>
                          <span aria-hidden>·</span>
                          <span className="text-ink-60">主聊 {mainTitles}</span>
                        </>
                      )}
                    </span>
                  </span>
                  <span className="hidden font-mono text-xs text-ink-40 transition-colors group-hover:text-signal md:block">
                    →
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <Link
          to="/episodes"
          className="mt-6 inline-flex h-11 items-center border border-ink px-6 font-mono text-xs uppercase tracking-[0.15em] transition-colors hover:bg-ink hover:text-paper"
        >
          全部节目 →
        </Link>
      </section>

      {/* 高频提及 */}
      <section className="pt-14 md:pt-20">
        <SectionHead en="Most mentioned" zh="高频提及电影" />
        <ul className="grid gap-x-8 md:grid-cols-2">
          {hottest.map(({ m, st }) => (
            <li key={m.id}>
              <Link
                to={`/movies/${m.id}`}
                className="hl-parent group flex items-baseline justify-between gap-4 border-b border-ink-15 py-3.5"
              >
                <span className="min-w-0">
                  <span className="hl font-display text-lg">{m.title}</span>
                  <span className="ml-3 text-xs text-ink-60">
                    {m.originalTitle && <span>{m.originalTitle}</span>}
                    {m.originalTitle && m.year && <span aria-hidden> · </span>}
                    {m.year && <span className="font-mono tabular-nums">{m.year}</span>}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-ink-60">
                  <span className="text-signal">{st.total}</span> 期
                  <span className="ml-2 hidden text-ink-40 sm:inline">
                    主聊 {st.main} · 提及 {st.mentioned}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/movies"
          className="mt-6 inline-flex h-11 items-center border border-ink px-6 font-mono text-xs uppercase tracking-[0.15em] transition-colors hover:bg-ink hover:text-paper"
        >
          电影索引 A–Z →
        </Link>
      </section>


    </div>
  )
}
