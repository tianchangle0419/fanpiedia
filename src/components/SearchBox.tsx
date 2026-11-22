import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { directorMentionCount, epLabel, guestCount, searchAll } from '@/data/archive'

interface FlatItem {
  key: string
  to: string
  group: '电影' | '导演' | '嘉宾' | '节目'
  label: string
  meta: string
}

/** 全局搜索框：输入即搜，下拉分组结果，支持键盘上下选择 */
export default function SearchBox({
  autoFocus = false,
  placeholder = '搜电影 / 导演 / 嘉宾 / 期数，支持拼音…',
}: {
  autoFocus?: boolean
  placeholder?: string
}) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const r = searchAll(q)
  const items: FlatItem[] = [
    ...r.movies.slice(0, 5).map((m) => ({
      key: `m-${m.id}`,
      to: `/movies/${m.id}`,
      group: '电影' as const,
      label: m.title,
      meta: m.year ? String(m.year) : '年份不详',
    })),
    ...r.directors.slice(0, 3).map((d) => ({
      key: `d-${d.id}`,
      to: `/directors/${encodeURIComponent(d.id)}`,
      group: '导演' as const,
      label: d.zh,
      meta: d.en ?? `提及 ${directorMentionCount(d.id)} 期`,
    })),
    ...r.guests.slice(0, 3).map((g) => ({
      key: `g-${g.id}`,
      to: `/guests/${encodeURIComponent(g.id)}`,
      group: '嘉宾' as const,
      label: g.name,
      meta: g.isHost ? '主播' : `出场 ${guestCount(g.id)} 期`,
    })),
    ...r.episodes.slice(0, 4).map((e) => ({
      key: `e-${e.id}`,
      to: `/episodes/${e.id}`,
      group: '节目' as const,
      label: `${epLabel(e)} ${e.title}`,
      meta: e.date,
    })),
  ]

  useEffect(() => {
    setActive(0)
  }, [q])

  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(ev.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const go = (to: string) => {
    setOpen(false)
    setQ('')
    navigate(to)
  }

  const onKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault()
      setActive((a) => Math.min(a + 1, items.length - 1))
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (ev.key === 'Enter' && items[active]) {
      ev.preventDefault()
      go(items[active].to)
    } else if (ev.key === 'Escape') {
      setOpen(false)
    }
  }

  let lastGroup = ''

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="flex items-center gap-2 border border-ink-15 bg-paper px-3 transition-colors focus-within:border-signal">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0 text-ink-60">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="全局搜索"
          className="h-11 w-full bg-transparent text-base outline-none placeholder:text-ink-40 focus-visible:outline-none"
        />
        {q && (
          <button
            type="button"
            aria-label="清空搜索"
            onClick={() => setQ('')}
            className="flex h-11 shrink-0 items-center px-1 font-mono text-xs text-ink-60 transition-colors hover:text-signal"
          >
            ✕
          </button>
        )}
      </div>

      {open && q.trim() && (
        <div
          role="listbox"
          aria-label="搜索结果"
          className="absolute right-0 top-full z-40 mt-1 max-h-[60vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto border border-ink-15 bg-paper shadow-[0_8px_24px_rgba(34,34,34,0.12)]"
        >
          {items.length === 0 ? (
            <p className="px-4 py-6 text-sm text-ink-60">
              没有命中「{q}」。试试原名、拼音，或导演名字。
            </p>
          ) : (
            items.map((it, i) => {
              const head =
                it.group !== lastGroup ? (
                  <div
                    key={`h-${it.group}`}
                    className="border-t border-ink-15 px-4 pb-1 pt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-60 first:border-t-0 first:pt-2"
                  >
                    {it.group}
                  </div>
                ) : null
              lastGroup = it.group
              return (
                <div key={it.key}>
                  {head}
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(it.to)}
                    className={`flex w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left transition-colors ${
                      i === active ? 'bg-signal text-paper' : ''
                    }`}
                  >
                    <span className="min-w-0 truncate text-[15px]">{it.label}</span>
                    <span
                      className={`shrink-0 font-mono text-[11px] ${i === active ? 'text-paper/80' : 'text-ink-40'}`}
                    >
                      {it.meta}
                    </span>
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
