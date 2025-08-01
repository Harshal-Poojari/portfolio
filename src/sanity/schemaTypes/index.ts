// src/sanity/schemaTypes/index.ts
import {defineType, defineField} from 'sanity'

const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'A short summary of the blog post (1-2 sentences)',
      rows: 3,
      validation: (Rule) => Rule.max(200)
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Web Development', value: 'web-dev'},
          {title: 'Game Development', value: 'game-dev'},
          {title: 'Technology', value: 'tech'},
          {title: 'Tutorials', value: 'tutorial'},
        ],
        layout: 'dropdown'
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for screen readers'
        }
      ]
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required()
    }),
    // ✅ ENHANCED: Content field with proper code block support
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'}, // Inline code
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (Rule) => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean'
                  }
                ],
              },
            ],
          },
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
        },
        // ✅ ADD: Enhanced code block with @sanity/code-input
        {
          type: 'code',
          name: 'codeBlock',
          title: 'Code Block',
          options: {
            language: 'javascript', // Default language
            languageAlternatives: [
              {title: 'JavaScript', value: 'javascript'},
              {title: 'TypeScript', value: 'typescript'},
              {title: 'React JSX', value: 'jsx'},
              {title: 'React TSX', value: 'tsx'},
              {title: 'HTML', value: 'html'},
              {title: 'CSS', value: 'css'},
              {title: 'SCSS/Sass', value: 'scss'},
              {title: 'Python', value: 'python'},
              {title: 'Java', value: 'java'},
              {title: 'C++', value: 'cpp'},
              {title: 'C#', value: 'csharp'},
              {title: 'PHP', value: 'php'},
              {title: 'Ruby', value: 'ruby'},
              {title: 'Go', value: 'go'},
              {title: 'Rust', value: 'rust'},
              {title: 'Swift', value: 'swift'},
              {title: 'Kotlin', value: 'kotlin'},
              {title: 'JSON', value: 'json'},
              {title: 'XML', value: 'xml'},
              {title: 'YAML', value: 'yaml'},
              {title: 'Markdown', value: 'markdown'},
              {title: 'Bash/Shell', value: 'bash'},
              {title: 'PowerShell', value: 'powershell'},
              {title: 'SQL', value: 'sql'},
              {title: 'GraphQL', value: 'graphql'},
              {title: 'Dockerfile', value: 'dockerfile'},
              {title: 'Plain Text', value: 'text'},
            ],
            withFilename: true, // Allow filename for code blocks
          },
        },
        // ✅ ADD: Enhanced image support
        {
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for screen readers',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for the image'
            }
          ],
        },
      ],
      validation: (Rule) => Rule.required()
    }),
  ],
  // ✅ ADD: Preview configuration for better content management
  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'coverImage',
      category: 'category'
    },
    prepare(selection) {
      const {title, subtitle, media, category} = selection
      return {
        title,
        subtitle: subtitle || 'No excerpt provided',
        media,
        description: category ? `Category: ${category}` : 'No category assigned'
      }
    }
  }
})

export const schema = {
  types: [blogPost],
}
