import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { SectionHead } from '@/components/bits'
import { movies, movieStats } from '@/data/archive'

export default function Movies() {
  const [q, setQ] = useState('')

  const groups = useMemo(() => {
    const kw = q.trim().toLowerCase()
    const filtered = kw
      ? movies.filter((m) => m.title.toLowerCase().includes(kw) || m.py.includes(kw))
      : movies
    const map = new Map<string, typeof filtered>()
    for (const m of filtered) {
      const arr = map.get(m.letter) ?? []
      arr.push(m)
      map.set(m.letter, arr)
    }
    return [...map.entries()].sort((a, b) => {
      if (a[0] === '#') return 1
      if (b[0] === '#') return -1
      return a[0].localeCompare(b[0])
    })
  }, [q])

  const letters = groups.map(([l]) => l)

  return (
    <div className="pb-4 pt-10 md:pt-16">
      <SectionHead en="Movies A–Z" zh="电影索引" count={movies.length} />

      <div className="flex flex-wrap items-center gap-3 py-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="筛片名或拼音…"
          aria-label="筛选电影"
          className="h-11 w-full border border-ink-15 bg-transparent px-3 text-base outline-none transition-colors placeholder:text-ink-40 focus:border-signal focus-visible:outline-none md:w-72"
        />
      </div>

      {/* 字母导航 */}
      <nav aria-label="字母索引" className="sticky top-14 z-20 -mx-4 flex flex-wrap gap-x-1 border-y border-ink-15 bg-paper/95 px-4 backdrop-blur-sm md:top-16 md:-mx-8 md:px-8">
        {letters.map((l) => (
          <a
            key={l}
            href={`#letter-${l === '#' ? 'num' : l}`}
            className="flex h-11 min-w-11 items-center justify-center font-mono text-sm text-ink-60 transition-colors hover:text-signal"
          >
            {l}
          </a>
        ))}
      </nav>

      {groups.length === 0 && (
        <p className="mt-6 border border-dashed border-ink-15 px-4 py-12 text-center text-sm text-ink-60">
          没有匹配「{q}」的电影。
        </p>
      )}

      {groups.map(([letter, list]) => (
        <section key={letter} id={`letter-${letter === '#' ? 'num' : letter}`} className="scroll-mt-32 pt-8">
          <h2 className="flex items-baseline gap-3">
            <span className="font-mono text-2xl text-signal">{letter}</span>
            <span className="font-mono text-[11px] tabular-nums text-ink-40">{list.length} 部</span>
          </h2>
          <ul className="mt-2">
            {list.map((m) => {
              const st = movieStats(m.id)
              return (
                <li key={m.id}>
                  <Link
                    to={`/movies/${m.id}`}
                    className="hl-parent group grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-ink-15 py-3.5"
                  >
                    <span className="min-w-0">
                      <span className="hl font-display text-lg md:text-xl">{m.title}</span>
                      <span className="ml-3 text-xs text-ink-60 md:text-sm">
                        {m.originalTitle && <span>{m.originalTitle}</span>}
                        {m.originalTitle && m.year && <span aria-hidden> · </span>}
                        {m.year && <span className="font-mono tabular-nums">{m.year}</span>}
                        {(m.originalTitle || m.year) && m.directors && m.directors.length > 0 && (
                          <span aria-hidden> · </span>
                        )}
                        {m.directors && m.directors.length > 0 && (
                          <span>{m.directors.map((d) => d.zh).join(' / ')}</span>
                        )}
                      </span>
                    </span>
                    <span className="shrink-0 text-right font-mono text-xs tabular-nums text-ink-60">
                      <span className="text-signal">{st.total}</span> 期
                      <span className="ml-2 hidden text-ink-40 sm:inline">
                        主聊 {st.main} · 提及 {st.mentioned}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
