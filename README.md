# TalkControl

![master](https://github.com/sfeir-open-source/talk-control/workflows/master/badge.svg?branch=master)
![v0.3](https://github.com/sfeir-open-source/talk-control/workflows/v0.3/badge.svg?branch=v0.3)

This project aims to make speakers' life easier by supplying an app to remotely control their slideshow.

## Getting started

```bash
npm i
npm start

# Then open a browser and go to url: http://localhost:1234/
```

## Documentation

The documentation of this project can be generated with the following commands :

```bash
npm i # if not already done previously
npm run jsdoc:build # build code documentation with JSDoc
npm run docs:dev # build global documentation with vuepress

# Then open a browser and go to url: http://localhost:8080/
```

## Help us

Feel free to add any issue that you might find useful to improve the project and even submit pull requests to help us :).

You can go check our [issues page](https://github.com/sfeir-open-source/talk-control/issues)

General instructions on _how to contribute_ can be found in the [CONTRIBUTING](CONTRIBUTING.md) file.

## Troubleshoot

In case of `Error: listen EADDRINUSE :::3000`, execute:

```bash
lsof -i :3000
kill -9 <PID>
```
