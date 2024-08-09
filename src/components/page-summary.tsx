import React from 'react';

export default function PageSummary({ content }: { content: string }) {
  return <p className="mb-12 leading-7">{content}</p>;
}
