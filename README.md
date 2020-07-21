# TalkControl

![version](https://img.shields.io/github/package-json/v/sfeir-open-source/talk-control?color=blue)
![license](https://img.shields.io/github/license/sfeir-open-source/talk-control)
![maintained](https://img.shields.io/maintenance/yes/2020)
![open issues](https://img.shields.io/github/issues-raw/sfeir-open-source/talk-control)

![master](https://github.com/sfeir-open-source/talk-control/workflows/master/badge.svg?branch=master)
![develop](https://github.com/sfeir-open-source/talk-control/workflows/develop/badge.svg?branch=develop)

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

In case of `Error: listen EADDRINUSE :::3001`, execute:

```bash
lsof -i :3001
kill -9 <PID>
```
