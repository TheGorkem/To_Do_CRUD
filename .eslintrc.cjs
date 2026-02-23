module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-refresh"],
  settings: {
    react: { version: "detect" },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
  ignorePatterns: ["dist", "node_modules", "coverage"],
};
