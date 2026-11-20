// 数据模型 —— 真实数据由 scripts 解析 RSS 生成，见 src/data/generated/archive.json

export type MentionRole = 'main' | 'mentioned'
/** 节目系列：main=长节目 / sp=长节目特别期 / ma*=马后炮 / er*=耳旁风（er 正期 / er-sp / er-zt 新片杂谈 / er-x） */
export type Series = 'main' | 'sp' | 'ma' | 'ma-sp' | 'ma-x' | 'er' | 'er-sp' | 'er-zt' | 'er-x'

export interface Episode {
  id: string
  series: Series
  no: number | null    // 正期期号（长节目 No.xxx / 马后炮 MAxxx）
  sp: number | null    // 特别期编号（SP001 等）
  title: string
  date: string         // YYYY-MM-DD
  duration: string     // HH:MM:SS
  movies: EpisodeMovie[]
  guests: EpisodeGuest[]
}

export interface EpisodeMovie {
  movieId: string
  role: MentionRole    // main=专题主聊 / mentioned=本期片目提及
}

export interface EpisodeGuest {
  guestId: string
}

export interface DirectorRef {
  zh: string           // 中文名
  en: string | null    // 外文名（豆瓣 credits latin_name，可能缺失）
}

export interface Movie {
  id: string
  title: string
  year: number | null
  py: string           // 全拼（搜索用）
  letter: string       // 拼音首字母（数字开头为 #）
  // 豆瓣匹配字段（可能缺失）
  doubanId?: string
  originalTitle?: string | null
  directors?: DirectorRef[]
}

export interface Guest {
  id: string
  name: string
  isHost?: boolean
}

/** 导演实体：以中文名归并，作品跨系列聚合 */
export interface Director {
  id: string           // 归一化 id（中文名）
  zh: string
  en: string | null
}

export interface MovieAppearance {
  episode: Episode
  role: MentionRole
}
