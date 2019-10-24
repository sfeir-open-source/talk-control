const task = arr => arr.join(' && ');

module.exports = {
    hooks: {
        'pre-commit': task(['eslint .', 'pretty-quick --staged']),
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
        'pre-push': 'npm test'
    }
};
