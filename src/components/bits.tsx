import { Link } from 'react-router'
import type { Episode, MentionRole } from '@/types'
import { epLabel } from '@/data/archive'

/** 期数标签（等宽字体），自动处理正期/特别期 */
export function EpNo({ episode, className = '' }: { episode: Episode; className?: string }) {
  return (
    <span className={`font-mono text-ink-60 tabular-nums ${className}`}>{epLabel(episode)}</span>
  )
}

/** 角色徽标：专题主聊 / 提及 */
export function RoleBadge({ role }: { role: MentionRole }) {
  if (role === 'main') {
    return (
      <span className="inline-flex shrink-0 items-center bg-signal px-1.5 py-0.5 font-mono text-[11px] leading-none text-paper">
        主聊
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center border border-ink-15 px-1.5 py-0.5 font-mono text-[11px] leading-none text-ink-60">
      提及
    </span>
  )
}

/** 电影名链接：衬线 + 红色高亮悬停 */
export function MovieLink({
  id,
  title,
  className = '',
}: {
  id: string
  title: string
  className?: string
}) {
  return (
    <Link to={`/movies/${id}`} className={`inline-block ${className}`}>
      <span className="hl font-display">{title}</span>
    </Link>
  )
}

/** 嘉宾名链接 */
export function GuestLink({
  id,
  name,
  isHost = false,
  className = '',
}: {
  id: string
  name: string
  isHost?: boolean
  className?: string
}) {
  return (
    <Link to={`/guests/${id}`} className={`group inline-flex items-baseline gap-1 ${className}`}>
      <span className="hl">{name}</span>
      {isHost && <span className="font-mono text-[11px] text-signal">主播</span>}
    </Link>
  )
}

/** 导演名链接：中文名 + 可选外文名 */
export function DirectorLink({
  id,
  zh,
  en,
  className = '',
}: {
  id: string
  zh: string
  en?: string | null
  className?: string
}) {
  return (
    <Link
      to={`/directors/${encodeURIComponent(id)}`}
      className={`group inline-flex items-baseline gap-1.5 ${className}`}
    >
      <span className="hl">{zh}</span>
      {en && <span className="text-[0.85em] text-ink-40">{en}</span>}
    </Link>
  )
}

/** 区块标题 */
export function SectionHead({
  en,
  zh,
  count,
  className = '',
}: {
  en: string
  zh: string
  count?: number
  className?: string
}) {
  return (
    <div className={`flex items-baseline justify-between gap-4 border-b border-ink-15 pb-3 ${className}`}>
      <h2 className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">{en}</span>
        <span className="font-display text-xl md:text-2xl">{zh}</span>
      </h2>
      {count !== undefined && (
        <span className="font-mono text-xs tabular-nums text-ink-60">{count} 条</span>
      )}
    </div>
  )
}
