# TalkControl

This project aims to make speakers' life easier by supplying an app to remotely control their slideshow.

The documentation of this project can be generated with the following commands :

```bash
npm i # install dependencies
npm run jsdoc:build # build code documentation with JSDoc
npm run docs:dev # build global documentation with vuepress

# Then open a browser and go to url: http://localhost:8080/
```

## Getting help

Feel free to add any issue that you might find useful to improve the project and even propose pull request to help us :).
You can go check our [issues page](https://github.com/sfeir-open-source/talk-control/issues)

## Getting involved

General instructions on _how_ can be found in the [CONTRIBUTING](CONTRIBUTING.md) file.

## Troubleshoot

In case of `Error: listen EADDRINUSE :::3000`, execute:

```bash
lsof -i :3000
kill -9 <PID>
```
