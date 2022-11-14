module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'plugin:react/recommended',
		'standard-with-typescript',
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended"
	],
	overrides: [
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json'], // Specify it only for TypeScript files

	},
	plugins: [
		'react'
	],
	rules: {
		"react/react-in-jsx-scope": "off",
		"camelcase": "error",
		"spaced-comment": "error",
		"quotes": ["error", "single"],
		"no-duplicate-imports": "error",
		"no-tabs": 0
	},
	"settings": {
		"react": {
			"version": "detect"
		}
	}
}
