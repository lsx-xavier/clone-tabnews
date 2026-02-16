
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.extends("eslint:recommended"),
  ...compat.extends("plugin:jest/recommended"),
  ...nextCoreWebVitals,
  ...compat.extends("prettier"),
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**"],
  },
];
