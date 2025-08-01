// src/sanity/env.ts - TEMPORARY WORKING VERSION
export const apiVersion = '2024-01-01'

// ✅ HARDCODE YOUR ACTUAL VALUES HERE (temporarily)
export const dataset = 'production'  // Your dataset name
export const projectId = 'zcpo32br'  // Replace with your actual Sanity Project ID

// Temporarily disable the assertValue function
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }
  return v
}

// You can add these back later once env vars work
// export const dataset = assertValue(
//   process.env.NEXT_PUBLIC_SANITY_DATASET,
//   'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
// )

// export const projectId = assertValue(
//   process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
// )
