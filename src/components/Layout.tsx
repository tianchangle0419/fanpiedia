import { Link, NavLink, Outlet } from 'react-router'
import SearchBox from '@/components/SearchBox'

const NAV = [
  { to: '/episodes', zh: '节目', en: 'EPISODES' },
  { to: '/movies', zh: '电影', en: 'MOVIES' },
  { to: '/directors', zh: '导演', en: 'DIRECTORS' },
  { to: '/guests', zh: '嘉宾', en: 'GUESTS' },
]

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-ink-15 bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 md:h-16 md:px-8">
          <Link to="/" className="group flex shrink-0 items-baseline gap-2" aria-label="返回首页">
            <span className="hl font-display text-lg font-bold md:text-xl">反派影评</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-60">
              档案索引
            </span>
          </Link>
          <nav aria-label="主导航" className="flex items-center gap-4 md:gap-8">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `nav-link flex h-11 items-center text-[15px] transition-colors hover:text-signal md:h-16 ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                {n.zh}
              </NavLink>
            ))}
          </nav>
          <div className="hidden w-80 shrink-0 lg:block">
            <SearchBox placeholder="搜电影 / 导演 / 嘉宾 / 期数…" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 md:px-8">
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-ink-15">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
          <p className="font-display text-2xl md:text-3xl">
            反派影评<span className="text-signal">·</span>档案索引
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-60">
            <Link to="/episodes" className="nav-link h-11 inline-flex items-center hover:text-signal">节目目录</Link>
            <Link to="/movies" className="nav-link h-11 inline-flex items-center hover:text-signal">电影索引</Link>
            <Link to="/directors" className="nav-link h-11 inline-flex items-center hover:text-signal">导演索引</Link>
            <Link to="/guests" className="nav-link h-11 inline-flex items-center hover:text-signal">嘉宾索引</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
