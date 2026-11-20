import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { SectionHead } from '@/components/bits'
import { directorMentionCount, directors, getDirectorMovies } from '@/data/archive'

export default function Directors() {
  const [q, setQ] = useState('')

  const sorted = useMemo(() => {
    const kw = q.trim().toLowerCase()
    const filtered = kw
      ? directors.filter(
          (d) => d.zh.toLowerCase().includes(kw) || (d.en && d.en.toLowerCase().includes(kw)),
        )
      : directors
    return [...filtered].sort((a, b) => directorMentionCount(b.id) - directorMentionCount(a.id))
  }, [q])

  return (
    <div className="pb-4 pt-10 md:pt-16">
      <SectionHead en="Directors" zh="导演索引" count={directors.length} />
      <p className="py-4 text-sm text-ink-60">
        按作品被节目提及的期数排序。点名字查看 ta 的全部作品，以及提到这些作品的节目。
      </p>

      <div className="flex flex-wrap items-center gap-3 pb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="筛导演中文或外文名…"
          aria-label="筛选导演"
          className="h-11 w-full border border-ink-15 bg-transparent px-3 text-base outline-none transition-colors placeholder:text-ink-40 focus:border-signal focus-visible:outline-none md:w-72"
        />
      </div>

      {sorted.length === 0 ? (
        <p className="border border-dashed border-ink-15 px-4 py-12 text-center text-sm text-ink-60">
          没有匹配「{q}」的导演。
        </p>
      ) : (
        <ul>
          {sorted.map((d, i) => {
            const mentions = directorMentionCount(d.id)
            const works = getDirectorMovies(d.id).length
            return (
              <li key={d.id}>
                <Link
                  to={`/directors/${encodeURIComponent(d.id)}`}
                  className="hl-parent group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 border-b border-ink-15 py-4 md:gap-x-6"
                >
                  <span className="w-8 font-mono text-sm tabular-nums text-ink-40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="hl font-display text-lg md:text-xl">{d.zh}</span>
                    {d.en && (
                      <span className="ml-3 text-xs text-ink-60 md:text-sm">{d.en}</span>
                    )}
                  </span>
                  <span className="shrink-0 text-right font-mono text-xs tabular-nums text-ink-60">
                    {works} 部作品
                    <span className="mx-1.5 text-ink-40" aria-hidden>·</span>
                    提及 <span className="text-signal">{mentions}</span> 期
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
