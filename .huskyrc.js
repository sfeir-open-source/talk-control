module.exports = {
    'hooks': {
        'pre-commit': 'eslint --ext .js,.ts',
        'pre-push': 'npm test'
    }
}