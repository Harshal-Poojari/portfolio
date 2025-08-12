// src/sanity/env.ts
export const apiVersion = '2024-01-01'

// Use environment variables with fallback to production values
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zcpo32br'

// Utility function for required environment variables
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMessage)
    }
    console.warn(errorMessage)
    return '' as T
  }
  return v
}

// export const projectId = assertValue(
//   process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
// )
