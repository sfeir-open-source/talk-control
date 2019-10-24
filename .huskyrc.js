module.exports = {
    hooks: {
        'pre-commit': 'eslint --ext .js,.ts .',
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
        'pre-push': 'npm test',
    }
};
