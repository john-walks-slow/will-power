module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  globals: {
    PIXI: false,
    dragonBones: false,
    particlesJS: false
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [
      2,
      {
        'x-invalid-end-tag': false,
        'invalid-first-character-of-tag-name': false
      }
    ],
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'none', ignoreRestSiblings: false }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
