export const isEnglishOnly = (text) => {
  const regex = /^[\p{Emoji}\p{L}\p{N}\p{P}\p{Zs}\r\n]+$/u;
  const englishOnly = /^[\p{Emoji}A-Za-z0-9 .,!?'"()\-\n\r]+$/u;
  return regex.test(text.trim()) && englishOnly.test(text.trim());
};
