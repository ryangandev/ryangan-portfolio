import React from 'react';

export default function PageSummary({ content }: { content: string }) {
  return <p className="mb-8 leading-7 sm:mb-12">{content}</p>;
}
