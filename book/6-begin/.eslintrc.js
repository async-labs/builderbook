module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['react', 'jsx-a11y', 'import', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
        printWidth: 100,
        semi: true
      },
    ],
    'camelcase': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-mixed-operators': 'off',
    'prefer-arrow-callback': 'error',
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-danger': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx'],
      },
    ],
    'no-console': 'off',
  },
};
