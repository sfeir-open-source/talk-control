module.exports = {
    hooks: {
        "pre-commit": "npm run lint && git add .",
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
};
