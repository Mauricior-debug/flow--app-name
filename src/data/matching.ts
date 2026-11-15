import type { HomeFilters, Scholarship, User } from './types';
import { SCHOLARSHIPS } from './scholarships';

function hasMasters(user: User) {
  const text = user.academics.map((item) => item.degree).join(' ').toLowerCase();
  return /master|msc|m\.sc|meng|mph|mba/.test(text);
}

export function qualifies(user: User, scholarship: Scholarship) {
  const doctoralOnly = scholarship.degreeLevels.length === 1 && scholarship.degreeLevels[0] === 'PhD';
  if (doctoralOnly && !hasMasters(user)) return false;
  return true;
}

export function matchedScholarships(user: User, filters: HomeFilters) {
  const countries = new Set(user.countryCodes);
  const saved = new Set(user.savedIds);
  const list = SCHOLARSHIPS.filter((scholarship) => {
    if (countries.size > 0 && !countries.has(scholarship.country)) return false;
    if (!qualifies(user, scholarship)) return false;
    if (filters.degree !== 'All' && !scholarship.degreeLevels.includes(filters.degree)) return false;
    if (filters.funding !== 'All' && scholarship.funding !== filters.funding) return false;
    if (filters.savedOnly && !saved.has(scholarship.id)) return false;
    return true;
  });
  const fundingRank = (value: Scholarship['funding']) => (value === 'Fully Funded' ? 0 : 1);
  return list.sort((a, b) => {
    if (filters.sort === 'name') return a.name.localeCompare(b.name);
    if (filters.sort === 'deadline') return a.deadlineISO.localeCompare(b.deadlineISO);
    if (filters.sort === 'funding') return fundingRank(a.funding) - fundingRank(b.funding) || b.fit - a.fit;
    return b.fit - a.fit;
  });
}

export function searchScholarships(query: string) {
  const needle = query.trim().toLowerCase();
  const list = SCHOLARSHIPS.filter((scholarship) => {
    if (!needle) return true;
    return [scholarship.name, scholarship.institution, scholarship.country, scholarship.requirement]
      .join(' ')
      .toLowerCase()
      .includes(needle);
  });
  return list.sort((a, b) => a.name.localeCompare(b.name));
}
