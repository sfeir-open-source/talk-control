# Talk Control

## Description

This project aims to make speakers' life easier by supplying an app to remotely control their slideshow.
It is composed by three main parts:

-   **Server** : As its name say, it's the backend part of the app. Its job is to work as the **single source sf truth** of the app.
-   **Master** : The master is the "view" that is displayed to the user. It's purpose is to be the "bridge" between the server and its slave(s). There is possibly multiple masters with each a different purpose. For exemple the presenter master, it will display the presentation in an iframe (this is the slave) and listen to any key pressed by the speaker to send them to the server. It will then forward the server response to its slave so that it can update the slideshow accordingly.
-   **Slave** : The slave is the part that interract directly with the slideshow. It will update the view with the events received from its master. There could be multiple slides assossiated with one master. For exemple, in a presenter view where you have the presenter notes and a preview of the next slide. Both these part would be different slaves.

### Technology stack

This app is written in plain javascript, tested with mocha and chai and bundled with parcelJs.

### Status

This app is currently still in initial developpement phase.

## Dependencies

For this to work you need to have nodeJS installed on your computer.

## Usage

Firstly install the dependencies

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

## Getting help

Feel free to add any issue that you might find useful to improve the project and even propose pull request to help us :).
You can go check our [issues page]('https://github.com/sfeir-open-source/talk-control/issues')

## Getting involved

General instructions on _how_ can be found in the [CONTRIBUTING](CONTRIBUTING.md) file.
