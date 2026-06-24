# TalkControl
Welcome on TalkControl documentation.

You can find a technical documentation [here](https://github.com/sfeir-open-source/talk-control/tree/master/docs-sources/developers), instructions on how to use it [here](https://github.com/sfeir-open-source/talk-control/tree/master/docs-sources/users) and a JsDoc [here](https://github.com/sfeir-open-source/talk-control/tree/master/docs-sources/developers/code).

## Description

This project aims to make speakers' life easier by supplying an app to remotely control their slideshow.

It is composed by three main parts:

-   **Server** : it's the backend part of the app.

    It has 2 purposes :

    -   It receives and send events to master(s)
    -   It stores the state of the app : slide number, etc...

    Its job is to work as the **single source of truth** for the app.

-   **Master** : the master is a set of views for the speaker.

    To control the talk, the master is the bridge between the slave(s) and the server.
    It displays the slave(s) and listens for speaker events (key pressed, etc...), and send them to the server.
    There are multiple master views, like :

    -   The stage view : it displays the talk in an iframe in fullscreen
    -   The presenter view : it displays the current slide, the next one, the timer and the notes

-   **Slave** : the slave is a technical component added to a view (for example : the slideshow, the timer, etc...) to update it from events sent by the server or the master.

### Technology stack

This app is written in plain javascript, uses web components, is tested with mocha and chai and bundled with parcelJs.

### Status

Currently, this app is still in initial developpement phase.

## Dependencies

For this to work you need to have Node.js v8 or more installed on your computer.

## Usage

First, install the dependencies

```sh
npm i
```

Then run the project

```sh
npm start
```

Now you just need to open your browser on localhost:1234.

## How to test the software

Run tests

```sh
npm test
```
