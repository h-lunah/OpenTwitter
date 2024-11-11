import DOMPurify from 'dompurify';

const purifyConfig = {
	ALLOWED_TAGS: ['img', 'a'],
	ALLOWED_ATTR: ['src'],
    FORBID_TAGS: ['*'],
    SANITIZE_DOM: true,
    FORBID_CONTENTS: [],
    KEEP_CONTENT: true,
    IN_PLACE: false,
    WHOLE_DOCUMENT: false,
    ADD_TAGS: [],
    ADD_ATTR: [],
    ADD_URI_SAFE_ATTR: [],
    FORBID_ATTR: [],
    USE_PROFILES: { svg: true, html: true },
    ALLOW_UNKNOWN_PROTOCOLS: false
};

export function twemojiParse(input: string): string {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  let result = '';

  Array.from(input ?? '').forEach((char) => {
    if (emojiRegex.test(char)) {
      const codePoints = Array.from(char)
        .map((c) => c.codePointAt(0)?.toString(16))
        .filter(Boolean)
        .join('-');

      const imgUrl = `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/${codePoints}.png`;

      result += `<img style="height: 1em; width: 1em; margin: 0 .05em 0 .1em; vertical-align: -.1em; display: inline-block;" src="${imgUrl}" alt="${char}" />`;
    } else result += char;
  });

  return DOMPurify.sanitize(result, purifyConfig);
}

export function twemojiParseWithLinks(
  input: string,
  elementClass?: string
): string {
  const urlRegex =
    /http(s)?:\/\/([a-z0-9.-]+){1,3}(:[0-9]+)?(\/[\w?%.\-_@&.=/]*)?/gm; // Updated to allow for proper URL parsing
  const handleRegex = /@([\w]+)/g; // Regex to match @handles
  const hashtagRegex = /#([\w]+)/g; // Regex to match #hashtags

  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  const processedText = input
    .replace(urlRegex, (url) => {
      return `<a href="${url}" class="${
        elementClass ?? 'text-main-accent'
      }">${url}</a>`;
    })
    .replace(handleRegex, (handle) => {
      const username = handle.slice(1); // Remove '@' for the link
      return `<a href="/${username}" class="${
        elementClass ?? 'text-main-accent'
      }">${handle}</a>`;
    }) // Link structure for handles
    .replace(hashtagRegex, (hashtag) => {
      return `<a href="/trends" class="${
        elementClass ?? 'text-main-accent'
      }">${hashtag}</a>`;
    });

  let result = '';
  Array.from(processedText ?? '').forEach((char) => {
    if (emojiRegex.test(char)) {
      const codePoints = Array.from(char)
        .map((c) => c.codePointAt(0)?.toString(16))
        .filter(Boolean)
        .join('-');

      const imgUrl = `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${codePoints}.svg`;

      result += `<img style="height: 1em; width: 1em; margin: 0 .05em 0 .1em; vertical-align: -.1em; display: inline-block;" alt="${char}" src="${imgUrl}"/>`;
    } else result += char;
  });

  return DOMPurify.sanitize(result, purifyConfig);
}
