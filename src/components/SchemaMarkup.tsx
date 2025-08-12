import Script from 'next/script';

interface SchemaMarkupProps {
  schema: Record<string, any>;
}

export const SchemaMarkup = ({ schema }: SchemaMarkupProps) => {
  return (
    <Script
      id="schema-markup"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  );
};
