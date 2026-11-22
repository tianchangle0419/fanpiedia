// 数据层：加载解析好的真实数据并建立倒排索引
// 数据源：听友维护的反派影评 RSS（长节目 + 马后炮 + 耳旁风）+ 豆瓣 credits 导演信息
import raw from '@/data/generated/archive.json'
import type { Director, Episode, Guest, Movie, MovieAppearance } from '@/types'

export const episodes = raw.episodes as Episode[]
export const movies = raw.movies as Movie[]
export const guests = raw.guests as Guest[]
export const directors = raw.directors as Director[]

const movieMap = new Map(movies.map((m) => [m.id, m]))
const guestMap = new Map(guests.map((g) => [g.id, g]))
const episodeMap = new Map(episodes.map((e) => [e.id, e]))
const directorMap = new Map(directors.map((d) => [d.id, d]))

export const getMovie = (id: string) => movieMap.get(id)
export const getGuest = (id: string) => guestMap.get(id)
export const getEpisode = (id: string) => episodeMap.get(id)
export const getDirector = (id: string) => directorMap.get(id)

/** 期号展示标签：No.239 / SP.009 / MA.146 / ER.100 */
export function epLabel(e: Episode): string {
  if (e.series === 'ma') return `MA.${String(e.no ?? 0).padStart(3, '0')}`
  if (e.series === 'ma-sp') return `MA·SP.${String(e.sp ?? 0).padStart(2, '0')}`
  if (e.series === 'ma-x') return 'MA·番外'
  if (e.series === 'er') return `ER.${String(e.no ?? 0).padStart(3, '0')}`
  if (e.series === 'er-sp') return `ER·SP.${String(e.sp ?? 0).padStart(2, '0')}`
  if (e.series === 'er-zt') return `杂谈.${String(e.no ?? 0).padStart(2, '0')}`
  if (e.series === 'er-x') return 'ER·番外'
  if (e.no != null) return `No.${e.no}`
  if (e.sp != null) return `SP.${String(e.sp).padStart(3, '0')}`
  return '特别期'
}

/** 系列中文名 */
export function seriesLabel(s: Episode['series']): string {
  switch (s) {
    case 'ma':
      return '马后炮'
    case 'er':
      return '耳旁风'
    case 'ma-sp':
    case 'ma-x':
    case 'er-sp':
    case 'er-zt':
    case 'er-x':
    case 'sp':
      return '其他内容'
    default:
      return '长节目'
  }
}

/** 系列分组（筛选器用）：main / ma / er / other */
export function seriesGroup(s: Episode['series']): 'main' | 'ma' | 'er' | 'other' {
  if (s === 'main') return 'main'
  if (s === 'er') return 'er'
  if (s === 'ma') return 'ma'
  return 'other'
}

/** 按上线日期排序（新→旧） */
export function byDateDesc(a: Episode, b: Episode): number {
  return b.date.localeCompare(a.date)
}

/** 一部电影的全部出现记录（新→旧） */
export function getMovieAppearances(movieId: string): MovieAppearance[] {
  const out: MovieAppearance[] = []
  for (const ep of episodes) {
    for (const em of ep.movies) {
      if (em.movieId === movieId) out.push({ episode: ep, role: em.role })
    }
  }
  return out.sort((a, b) => byDateDesc(a.episode, b.episode))
}

/** 一位嘉宾出场的全部期数（新→旧） */
export function getGuestEpisodes(guestId: string): Episode[] {
  const out: Episode[] = []
  for (const ep of episodes) {
    if (ep.guests.some((g) => g.guestId === guestId)) out.push(ep)
  }
  return out.sort(byDateDesc)
}

/** 一位导演的全部在库作品（按年份新→旧，无年份排后） */
export function getDirectorMovies(directorId: string): Movie[] {
  const out = movies.filter((m) => m.directors?.some((d) => d.zh === directorId))
  return out.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
}

/** 一位导演的作品被提及的全部节目（新→旧，含每期涉及的作品） */
export function getDirectorEpisodes(directorId: string): { episode: Episode; films: Movie[] }[] {
  const filmIds = new Set(getDirectorMovies(directorId).map((m) => m.id))
  const out: { episode: Episode; films: Movie[] }[] = []
  for (const ep of episodes) {
    const hits = ep.movies.filter((em) => filmIds.has(em.movieId))
    if (hits.length > 0) {
      out.push({
        episode: ep,
        films: hits.map((h) => movieMap.get(h.movieId)!).filter(Boolean),
      })
    }
  }
  return out.sort((a, b) => byDateDesc(a.episode, b.episode))
}

/** 导演热度：其作品被提及的总期数 */
export function directorMentionCount(directorId: string): number {
  return getDirectorEpisodes(directorId).length
}

/** 电影出现统计 */
export function movieStats(movieId: string) {
  const apps = getMovieAppearances(movieId)
  return {
    main: apps.filter((a) => a.role === 'main').length,
    mentioned: apps.filter((a) => a.role === 'mentioned').length,
    total: apps.length,
  }
}

/** 嘉宾出场数 */
export function guestCount(guestId: string): number {
  let n = 0
  for (const ep of episodes) if (ep.guests.some((g) => g.guestId === guestId)) n++
  return n
}

/** 全站统计 */
export function siteStats() {
  const mentionCount = episodes.reduce((n, e) => n + e.movies.length, 0)
  return {
    episodes: episodes.length,
    movies: movies.length,
    guests: guests.length,
    mentions: mentionCount,
    directors: directors.length,
    main: episodes.filter((e) => seriesGroup(e.series) === 'main').length,
    ma: episodes.filter((e) => seriesGroup(e.series) === 'ma').length,
    er: episodes.filter((e) => seriesGroup(e.series) === 'er').length,
    other: episodes.filter((e) => seriesGroup(e.series) === 'other').length,
  }
}

// ============================================================
// 全局搜索：电影（片名/拼音）、嘉宾、节目（标题/期号）
// ============================================================

export interface SearchResults {
  movies: Movie[]
  guests: Guest[]
  directors: Director[]
  episodes: Episode[]
}

export function searchAll(query: string): SearchResults {
  const q = query.trim().toLowerCase()
  if (!q) return { movies: [], guests: [], directors: [], episodes: [] }
  const hit = (s: string) => s.toLowerCase().includes(q)
  return {
    movies: movies.filter(
      (m) => hit(m.title) || hit(m.py) || (m.originalTitle && hit(m.originalTitle)),
    ),
    guests: guests.filter((g) => hit(g.name)),
    directors: directors.filter((d) => hit(d.zh) || (d.en && hit(d.en))),
    episodes: episodes.filter((e) => {
      if (hit(e.title)) return true
      const q2 = q.replace(/[.\s]/g, '')
      const label = epLabel(e).toLowerCase().replace(/[.\s·]/g, '')
      if (label === q2) return true
      // 支持 "ma146"、"no239"、"239" 直接命中
      if (/^(ma|no|sp)?\d{1,3}$/.test(q2)) {
        const num = parseInt(q2.replace(/^(ma|no|sp)/, ''), 10)
        return e.no === num || e.sp === num
      }
      return false
    }),
  }
}
