/**
 * A schema.org graph. The data is static and author-controlled; `<` is escaped
 * anyway, so no string in content/ can ever close the script element.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
