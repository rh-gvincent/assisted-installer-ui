# webpack-no-fully-specified-esm

## Why do we need this?
Webpack requires all ECMAScript Modules to be fully specified when importing.  
The settings in this package turn off this requirement for all the packages imported from the @openshift-assisted organization scope.  
This shim is necessary until we migrate our codebase to be fully compliant with ESM.  

## Installation
`yarn add -D @openshift-assisted/webpack-no-fully-specified-esm`

## Usage
```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: /node_modules\/@openshift-assisted\//,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
};

// or just do...
const noFullySpecifiedEsmShim = require('@openshift-assisted/webpack-no-fully-specified-esm');

module.exports = {
  // ...
  module: {
    rules: [
      // some rules...
      noFullySpecifiedEsmShim,
      // other rules
    ],
  },
};
```

