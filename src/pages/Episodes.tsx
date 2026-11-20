import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { EpNo, SectionHead } from '@/components/bits'
import { byDateDesc, epLabel, episodes, getGuest, getMovie, seriesGroup, seriesLabel } from '@/data/archive'

type SortKey = 'desc' | 'asc'
type SeriesFilter = 'all' | 'main' | 'ma' | 'er'

export default function Episodes() {
  const [sort, setSort] = useState<SortKey>('desc')
  const [q, setQ] = useState('')
  const [series, setSeries] = useState<SeriesFilter>('all')

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase().replace(/[.\s]/g, '')
    const filtered = episodes.filter((e) => {
      if (series !== 'all' && seriesGroup(e.series) !== series) return false
      if (!kw) return true
      if (
        e.title.toLowerCase().includes(kw) ||
        epLabel(e).toLowerCase().replace(/[.\s·]/g, '').includes(kw)
      )
        return true
      return e.movies.some((em) => {
        const m = getMovie(em.movieId)
        return m && m.title.toLowerCase().includes(kw)
      })
    })
    return filtered.sort((a, b) => (sort === 'desc' ? byDateDesc(a, b) : byDateDesc(b, a)))
  }, [sort, q, series])

  return (
    <div className="pb-4 pt-10 md:pt-16">
      <SectionHead en="Episodes" zh="节目目录" count={list.length} />

      <div className="flex flex-wrap items-center gap-3 py-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="筛期号、标题或片名…"
          aria-label="筛选节目"
          className="h-11 w-full border border-ink-15 bg-transparent px-3 text-base outline-none transition-colors placeholder:text-ink-40 focus:border-signal focus-visible:outline-none"
        />
        <div className="flex items-center gap-2 font-mono text-xs" role="group" aria-label="系列筛选">
          {(
            [
              ['all', '全部'],
              ['main', '长节目'],
              ['ma', '马后炮'],
              ['er', '耳旁风'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setSeries(k)}
              aria-pressed={series === k}
              className={`h-11 border px-3 transition-colors ${
                series === k
                  ? 'border-ink bg-ink text-paper'
                  : 'border-ink-15 text-ink-60 hover:border-ink hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 font-mono text-xs" role="group" aria-label="排序">
          <span className="text-ink-60">日期</span>
          {(['desc', 'asc'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setSort(k)}
              aria-pressed={sort === k}
              className={`h-11 border px-3 transition-colors ${
                sort === k
                  ? 'border-ink bg-ink text-paper'
                  : 'border-ink-15 text-ink-60 hover:border-ink hover:text-ink'
              }`}
            >
              {k === 'desc' ? '新 → 旧' : '旧 → 新'}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="border border-dashed border-ink-15 px-4 py-12 text-center text-sm text-ink-60">
          没有匹配「{q}」的节目。
        </p>
      ) : (
        <ul>
          {list.map((e) => {
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
                    <span className="hl font-display text-lg leading-snug md:text-xl">{e.title}</span>
                    {mainTitles && (
                      <span className="mt-1 block truncate text-xs text-ink-60 md:text-sm">
                        主聊：{mainTitles}
                      </span>
                    )}
                    {seriesGroup(e.series) !== 'main' && (
                      <span className="mt-1 block truncate font-mono text-[11px] uppercase tracking-[0.15em] text-ink-40">
                        {seriesLabel(e.series)}
                      </span>
                    )}
                  </span>
                  <span className="hidden max-w-[10rem] truncate text-xs text-ink-60 lg:block">
                    {e.guests
                      .filter((g) => g.guestId !== '波米')
                      .map((g) => getGuest(g.guestId)?.name)
                      .filter(Boolean)
                      .join('、')}
                  </span>
                  <span className="text-right font-mono text-xs tabular-nums text-ink-60">
                    {e.date}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
