import { Link } from 'react-router'
import { SectionHead } from '@/components/bits'
import { guestCount, guests } from '@/data/archive'

export default function Guests() {
  const sorted = [...guests].sort((a, b) => guestCount(b.id) - guestCount(a.id))

  return (
    <div className="pb-4 pt-10 md:pt-16">
      <SectionHead en="Guests" zh="嘉宾索引" count={guests.length} />
      <p className="py-4 text-sm text-ink-60">
        按出场次数排序，名单自动解析自各期 shownotes 的主播与嘉宾署名。点名字查看 ta 出现的全部期数。
      </p>

      <ul>
        {sorted.map((g, i) => {
          const count = guestCount(g.id)
          return (
            <li key={g.id}>
              <Link
                to={`/guests/${g.id}`}
                className="hl-parent group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 border-b border-ink-15 py-4 md:gap-x-6"
              >
                <span className="w-8 font-mono text-sm tabular-nums text-ink-40">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="hl font-display text-lg md:text-xl">
                    {g.name}
                    {g.isHost && (
                      <span className="ml-2 align-middle font-mono text-[11px] text-signal">主播</span>
                    )}
                  </span>
                </span>
                <span className="shrink-0 text-right font-mono text-xs tabular-nums text-ink-60">
                  <span className="text-signal">{count}</span> 期
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
