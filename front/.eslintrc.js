module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ["plugin:vue/essential", "@vue/standard"],
	parserOptions: {
		parser: "babel-eslint"
	},
	rules: {
		"no-console":
			process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger":
			process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-tabs": ["error", { allowIndentationTabs: true }],
		indent: ["error", "tab"],
		"space-before-function-paren": ["error", "never"],
		quotes: ["error", "double"],
		semi: ["error", "always"]
	}
};
