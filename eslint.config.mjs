import js from "@eslint/js";
import css from "@eslint/css";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/", "node_modules/"]
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: globals.browser
    },
    plugins: { js },
    rules: {
      "no-unused-vars": "error"
    },
    extends: ["js/recommended"]
  },
  {
    files: ["**/*.css"],
    language: "css/css",
    plugins: { css },
    extends: ["css/recommended"],
    rules: {
      "css/use-baseline": "off"
    }
  }
]);
