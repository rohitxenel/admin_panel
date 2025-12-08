// eslint.config.mjs
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// Use Next.js’ core-web-vitals config (JS + JSX)
const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
]

export default eslintConfig

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals"),
//   {
//     rules: {
//       // Disable the quote escaping error globally
//       "react/no-unescaped-entities": "off",
//       // (Optional) if you also want to silence hook dependency warnings:
//       // "react-hooks/exhaustive-deps": "off",
//     },
//   },
// ];

// export default eslintConfig;
