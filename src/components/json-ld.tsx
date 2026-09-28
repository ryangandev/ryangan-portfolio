type JsonLdProps = {
  /** A schema.org object, including its `@context` and `@type` */
  data: Record<string, unknown>;
};

/**
 * Structured data for search engines, as a `<script type="application/ld+json">`.
 *
 * `<` is escaped because the JSON is inlined into HTML: a string containing
 * `</script>` would otherwise close the tag early. None of today's values do,
 * but titles and summaries come from content files.
 */
const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
};

export default JsonLd;
