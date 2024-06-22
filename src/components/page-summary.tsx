import React from 'react';

export default function PageSummary({
  content,
}: {
  content: string | string[];
}) {
  if (typeof content === 'string') {
    return <p className="mb-16 leading-7">{content}</p>;
  }

  return (
    <ul className="mb-16">
      {content.map((item, index) => (
        <li key={index}>
          <p className="leading-7">{item}</p>
        </li>
      ))}
    </ul>
  );
}
