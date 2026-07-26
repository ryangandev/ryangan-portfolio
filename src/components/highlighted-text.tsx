import React from 'react';

type HighlightedTextProps = {
  text: string;
  highlightedString: string;
};

/**
 * `highlightedString` comes straight from a search input, so it has to be
 * escaped before it can be interpolated into a pattern. Unescaped, a lone `(`
 * threw `SyntaxError: Invalid regular expression: /((/gi: Unterminated group`
 * during render and blanked the portfolio page; `[`, `*`, `+`, `?` and a
 * trailing backslash did the same. The metacharacters that happened not to
 * throw were still wrong — typing `.` highlighted every character.
 */
const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  highlightedString,
}) => {
  if (!highlightedString.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(
    new RegExp(`(${escapeRegExp(highlightedString)})`, 'gi'),
  );

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === highlightedString.toLowerCase() ? (
          <span key={index} className="text-orange-600 dark:text-orange-400">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
};

export default HighlightedText;
