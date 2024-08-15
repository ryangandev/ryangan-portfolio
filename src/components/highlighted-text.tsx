import React from 'react';

type HighlightedTextProps = {
  text: string;
  highlightedString: string;
};

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  highlightedString,
}) => {
  if (!highlightedString.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${highlightedString})`, 'gi'));

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
