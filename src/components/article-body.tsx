import React from 'react';

/** The rendered MDX of a post or project, in the site's prose style */
const ArticleBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="prose max-w-[644px] dark:prose-invert">
      {children}
    </section>
  );
};

export default ArticleBody;
