import { defineDocumentType, makeSource } from 'contentlayer2/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    slug: {
      type: 'string',
      description: 'The slug of the post',
      required: true,
    },
    excerpt: {
      type: 'string',
      description: 'The excerpt of the post',
      required: true,
    },
    coverImage: {
      type: 'string',
      description: 'Cover image path',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Tags for the post',
      required: false,
    },
    featured: {
      type: 'boolean',
      description: 'Is the post featured?',
      default: false,
    },
    published: {
      type: 'boolean',
      description: 'Is the post published?',
      default: true,
    },
    author: {
      type: 'string',
      description: 'Author of the post',
      default: 'Harshal Poojari',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post.slug}`,
    },
    readingTime: {
      type: 'number',
      resolve: (post) => {
        const wordsPerMinute = 200;
        const noOfWords = post.body.raw.split(/\s/g).length;
        return Math.ceil(noOfWords / wordsPerMinute);
      },
    },
  },
}))

export default makeSource({
  contentDirPath: './posts', // ← Fixed: Points to your actual posts folder
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})
