import globals from "globals";
import pluginJs from "@eslint/js";

export default [
	// { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } }, // for node [other just delete]
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	{
		rules: {
			"no-unused-vars": "warn",
			"arrow-body-style": ["error", "always"],
		},
	},
];
