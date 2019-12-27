# TalkControl

You can find all the documentation about this project [here](http://m.quickmeme.com/img/74/74b9f223ba4275108406508561b12d3b708110d5d0cd92b8bc05cf575fc944e8.jpg).

## Getting help

Feel free to add any issue that you might find useful to improve the project and even propose pull request to help us :).
You can go check our [issues page]('https://github.com/sfeir-open-source/talk-control/issues')

## Getting involved

General instructions on _how_ can be found in the [CONTRIBUTING](CONTRIBUTING.md) file.

## Troubleshoot

In case of `Error: listen EADDRINUSE :::3000`, execute:

```bash
lsof -i :3000
kill -9 <PID>
```
