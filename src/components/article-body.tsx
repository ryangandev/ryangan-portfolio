import React from 'react';

/**
 * The rendered MDX of a post or project, in the site's prose style.
 * `prose-neutral` keeps it on the same pure grey scale as the rest of the
 * site; the plugin's default, `gray`, is tinted blue.
 */
const ArticleBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="prose max-w-[644px] prose-neutral dark:prose-invert">
      {children}
    </section>
  );
};

export default ArticleBody;
