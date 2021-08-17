# Watch path and execute command

## Why?

This shouldn't be a hard problem, yet there are no good solutions I was able to find.

## Other Solutions I tried and didn't like
- [npm-watch](https://github.com/M-Zuber/npm-watch)
- [fswatch](https://github.com/emcrisostomo/fswatch) 
- [watchman](https://github.com/facebook/watchman)

## Problems with solutions I tried
They leave weird running background processes when the main terminal quits

-- OR --

They have no ability to watch multiple directories and do multiple different things

-- OR --

They are insanely complex for what should be a simple tool

## So I made my own using Node.js and [chokidar](https://github.com/paulmillr/chokidar)

This is _simlar_ to npm-watch but has none of the 'nodemon' (leave processes running all over the place) madness, and has IMHO a more user-friendly command-line interface.

Usage:

```console
$ watch ./dir cmd1 ./dir2 'cmd2 arg1 arg2' {etc...}
```

Simple pairs of strings, first is the path to watch for changes, 2nd is the command to run (be sure to quote command and args)

- The child (later) commands _wait_ on previous (parent) commands to finish.
- Commands _ignore_ repeated changes on its watch-path, if the command is currently busy running the command.
- If the previous command fails the child commands will not run until the 'parent' runs successfully.

Build: 
```console
$ git clone https://github.com/matthewjosephtaylor/mjtdev-watch .
$ npm run build
```

Install:
```console
# Copy to somewhere in your path
$ cp ./bin/watch ~/scripts
# Or you can install it as a 'npm global binary' after cloning/building it
$ npm install -g .
# Or install it as a dependency
$ npm install github.com/matthewjosephtaylor/mjtdev-watch
```
## Blame

Matt Taylor https://mjt.dev

## License

MIT

## Changelog

| Date                | Change                                                                        |
| ------------------- | ----------------------------------------------------------------------------- |
| 2021-08-17 16:08:00 | Initial Commit                                                                |
| 2021-08-17 16:51:03 | Bump version, fix bug in 'doAfter' that made parent always call child command |



