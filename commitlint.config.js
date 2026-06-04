export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'chore', 'test', 'refactor', 'style', 'ci']],
    'subject-max-length': [2, 'always', 50],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [0],
  },
};
