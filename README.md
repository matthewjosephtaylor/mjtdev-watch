# Watch path and execute command

This isn't a hard problem yet all solutions from npm-watch, to fswatch to watchman are awful.

They leave weird running background processes when the main terminal quits

-- OR --

They have no ability to watch multiple directories and do multiple different things

-- OR --

They are insanely complex for what should be a simple tool

Usage:

```console
$ ./bin/watch ./dir, cmd1, ./dir2, 'cmd2 arg1 arg2', {etc...}
```

Simple pairs of strings, first is the dir to watch for changes, 2nd is the command to run (be sure to quote command and args)

- The child (later) commands _wait_ on previous (parent) commands to finish.
- The command _ignores_ repeated changes on its watch-path if it is currently busy running the command

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
## Blame Matt Taylor https://mjt.dev

