import { lowerCase } from 'lodash';

const getRegexPattern = (target: string): RegExp => {
  const magicSeparator = '[\\W_]*';
  const magicMatchString = target
    .replace(/\W/g, '')
    .split('')
    .join(magicSeparator);
  const groupRegexString =
    target.length === 1
      ? `^(${magicMatchString})[\\W_]+|[\\W_]+(${magicMatchString})[\\W_]+|[\\W_]+(${magicMatchString})$|^(${magicMatchString})$`
      : `(${magicMatchString})`;
  return new RegExp(groupRegexString, 'gi');
};

export const getMatchedWordsInString = (
  stringToMatch: string,
  wordsToMatch: string[]
): string[] => {
  const matchedTaboos: string[] = [];
  for (const matcher of wordsToMatch) {
    if (!matcher) continue;
    const regex = getRegexPattern(lowerCase(matcher));
    let result;
    while ((result = regex.exec(stringToMatch)) !== null) {
      if (!matchedTaboos.includes(matcher)) {
        matchedTaboos.push(matcher);
      }
      // This is necessary to avoid infinite loops with zero-width matches
      if (result.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }
  }
  return matchedTaboos;
};
