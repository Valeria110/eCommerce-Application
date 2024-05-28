function isNull<T>(element: unknown): asserts element is NonNullable<T> {
  if (element === null) {
    throw new Error(`${element} is null`);
  }
}

export { isNull };

export const countriesList: Record<string, string> = {
  BY: 'Belarus (BY)',
  BG: 'Bulgaria (BG)',
  CA: 'Canada (CA)',
  CN: 'China (CN)',
  CZ: 'Czechia (CZ)',
  FR: 'France (FR)',
  DE: 'Germany (DE)',
  IT: 'Italy (IT)',
  KZ: 'Kazakhstan (KZ)',
  PL: 'Poland (PL)',
  RU: 'Russia (RU)',
  ES: 'Spain (ES)',
  SE: 'Sweden (SE)',
  UA: 'Ukraine (UA)',
  US: 'United States (US)',
};
