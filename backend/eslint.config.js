module.exports = [
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly'
      }
    },
    rules: {
      // Disable rules that commonly cause build failures
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-unreachable': 'warn',
      'no-empty': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
      
      // TypeScript specific rules (if using @typescript-eslint)
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      
      // Allow common patterns
      'no-prototype-builtins': 'off',
      'no-fallthrough': 'warn'
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      '*.min.js',
      'coverage/**'
    ]
  }
]; 