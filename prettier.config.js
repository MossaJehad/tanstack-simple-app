/** @type {import('prettier').Config} */
const config = {
	tabWidth: 4,
	semi: true,
	singleQuote: true,
	printWidth: 80,
	useTabs: true,
	overrides: [
		{
			files: ['*.yml', '*.yaml'],
			options: {
				tabWidth: 4,
				useTabs: true,
			},
		},
	],
};

export default config;
