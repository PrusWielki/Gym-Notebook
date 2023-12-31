/* eslint-disable @typescript-eslint/no-var-requires */
const postcssPresetEnv = require('postcss-preset-env');
const csso = require('postcss-csso');
const postcssGlobalData = require('@csstools/postcss-global-data');
const path = require('path');
const postcssJitProps = require('postcss-jit-props');
const config = {
	plugins: [
		postcssJitProps({
			files: [path.resolve(__dirname, 'node_modules/open-props/open-props.min.css')]
		}),
		postcssGlobalData({
			files: [path.resolve(__dirname, 'node_modules/open-props/media.min.css')]
		}),
		postcssPresetEnv(),
		csso()
	]
};

module.exports = config;
