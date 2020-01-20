# User Guide
## Requirements
This whole application is written in javascript so [NodeJs](https://nodejs.org/download/) v8.0 is the minimal required installation.
## How To Use
First of all clone the repository [here](https://github.com/sfeir-open-source/talk-control/).

Then install the dependencies.
```sh
cd talk-control
npm i
```

Next you have to build the app.
```sh
npm run build
```
*You will be asked to give the full path to your presentation's entry point (index.html).*

Then run the commands below and start your presentation.
```sh
node dist/server/index.js
npx serve dist/client/master
```

Finally open your browser on [localhost:5000](http://localhost:5000).