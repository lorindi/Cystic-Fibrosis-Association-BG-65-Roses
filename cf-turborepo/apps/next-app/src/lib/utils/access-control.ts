import { UserGroup } from '@/graphql/generated/graphql';

// Изброим всички секции в админ панела, които имат специфични права за достъп
export enum AdminSection {
  CAMPAIGNS = 'Campaigns',
  INITIATIVES = 'Initiatives',
  CONFERENCES = 'Conferences',
  EVENTS = 'Events',
  NEWS = 'News',
  BLOG = 'Blog',
  RECIPES = 'Recipes',
  USERS = 'User Management',
  SETTINGS = 'Settings',
}

// Мапинг на секции към необходими групи за достъп
export const SECTION_TO_GROUPS_MAP: Record<AdminSection, UserGroup[]> = {
  [AdminSection.CAMPAIGNS]: ['campaigns'],
  [AdminSection.INITIATIVES]: ['initiatives'],
  [AdminSection.CONFERENCES]: ['conferences'],
  [AdminSection.EVENTS]: ['events'],
  [AdminSection.NEWS]: ['news'],
  [AdminSection.BLOG]: ['blog'],
  [AdminSection.RECIPES]: ['recipes'],
  [AdminSection.USERS]: [], // Само за админи
  [AdminSection.SETTINGS]: [], // Само за админи
};

// Мапинг на URL пътища към секции в админ панела
export const PATH_TO_SECTION_MAP: Record<string, AdminSection> = {
  '/admin/campaigns': AdminSection.CAMPAIGNS,
  '/admin/initiatives': AdminSection.INITIATIVES,
  '/admin/conferences': AdminSection.CONFERENCES,
  '/admin/events': AdminSection.EVENTS,
  '/admin/news': AdminSection.NEWS,
  '/admin/blog': AdminSection.BLOG,
  '/admin/recipes': AdminSection.RECIPES,
  '/admin/users': AdminSection.USERS,
  '/admin/settings': AdminSection.SETTINGS,
};

// Помощна функция за получаване на групи, необходими за достъп до определен път
export function getRequiredGroupsForPath(path: string): UserGroup[] {
  const section = PATH_TO_SECTION_MAP[path];
  if (!section) return [];
  return SECTION_TO_GROUPS_MAP[section];
}

// Помощна функция за получаване на името на секцията за определен път
export function getSectionNameForPath(path: string): string {
  const section = PATH_TO_SECTION_MAP[path];
  if (!section) return 'Admin Section';
  return section;
} 