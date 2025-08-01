// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schema} from './src/sanity/schemaTypes'
import {codeInput} from '@sanity/code-input'

export default defineConfig({
  name: 'default',
  title: 'Portfolio Blog',
  projectId: 'zcpo32br',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool(), codeInput()],
  schema,
})
