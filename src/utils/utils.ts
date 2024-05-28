function isNull<T>(element: unknown): asserts element is NonNullable<T> {
  if (element === null) {
    throw new Error(`${element} is null`);
  }
}

export { isNull };

export const countriesList: Record<string, string> = {
  BY: 'Belarus',
  BG: 'Bulgaria',
  CA: 'Canada',
  CN: 'China',
  CZ: 'Czechia',
  FR: 'France',
  DE: 'Germany',
  IT: 'Italy',
  KZ: 'Kazakhstan',
  PL: 'Poland',
  RU: 'Russia',
  ES: 'Spain',
  SE: 'Sweden',
  UA: 'Ukraine',
  US: 'United States',
};
