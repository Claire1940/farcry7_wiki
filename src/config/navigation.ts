import type { LucideIcon } from 'lucide-react'
import {
	CalendarClock,
	Newspaper,
	Film,
	Map,
	BookOpen,
	Cpu,
	MonitorSmartphone,
	Compass,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'release' -> t('nav.release')
	path: string // URL 路径，如 '/release'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：依据 Far Cry 7 内容规划，8 个内容分类
// 排序遵循发布优先级：Release → News → Media → Platforms → Setting → Story → Features → Guide
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'release', path: '/release', icon: CalendarClock, isContentType: true },
	{ key: 'news', path: '/news', icon: Newspaper, isContentType: true },
	{ key: 'media', path: '/media', icon: Film, isContentType: true },
	{ key: 'platforms', path: '/platforms', icon: MonitorSmartphone, isContentType: true },
	{ key: 'setting', path: '/setting', icon: Map, isContentType: true },
	{ key: 'story', path: '/story', icon: BookOpen, isContentType: true },
	{ key: 'features', path: '/features', icon: Cpu, isContentType: true },
	{ key: 'guide', path: '/guide', icon: Compass, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
)

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
