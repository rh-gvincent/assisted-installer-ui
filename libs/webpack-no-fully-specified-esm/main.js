/**
 * Webpack requires all ECMAScript Modules to be fully specified
 * when importing.
 * This setting is necessary until we migrate our codebase to be
 * fully compliant with ESM.
 * 
 * @see https://webpack.js.org/configuration/module/#resolvefullyspecified
 * @type {import('webpack').RuleSetRule}
 */
module.exports = {
  test: /\.m?js$/,
  include: /node_modules\/@openshift-assisted\//,
  resolve: {
    fullySpecified: false,
  },
};
