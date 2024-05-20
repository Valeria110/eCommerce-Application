export const ALL_NUMBERS = /\d/;
export const ALL_SPECIAL_CHARACTERS = /[!@#$%^&*()_+\-=[\]{};':"`\\|,.<>~/?]/;
export const ALL_UPPERCASE_LETTERS = /[A-Z]/;
export const ALL_LOWERCASE_LETTERS = /[a-z]/;

export const ALL_CONTRIES: Record<string, RegExp> = {
  'Germany (DE)': /^\d{5}$/,
  'United States (US)': /^\d{5}(-\d{4})?$/,
  'Russia (RU)': /^\d{6}$/,
  'Ukraine (UA)': /^\d{5}$/,
  'Italy (IT)': /^\d{5}$/,
  'Belarus (BY)': /^\d{6}$/,
  'Kazakhstan (KZ)': /^\d{6}$/,
  'France (FR)': /^\d{5}$/,
  'Poland (PL)': /^\d{2}-\d{3}$/,
  'Bulgaria (BG)': /^\d{4}$/,
  'China (CN)': /^\d{6}$/,
  'Czechia (CZ)': /^\d{3} \d{2}$/,
  'Spain (ES)': /^\d{5}$/,
  'Sweden (SE)': /^\d{3} \d{2}$/,
  'Canada (CA)': /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
};
