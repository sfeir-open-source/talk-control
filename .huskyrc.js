module.exports = {
    hooks: {
        'pre-commit': 'eslint .',
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
        'pre-push': 'npm test',
    }
};
