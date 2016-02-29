# kakle

> If Commit Then That

When working on big or small teams, there comes a time when one of your team members adds a frontend dependency, adds code that requires database migration, or just adds a patch that simply requires you to run a command. `kakle` does exactly this. If some file is changed, run a command. If a commit message contains a tag, run a command. If you don't want to automatically run commands, you can just get a reminder that you should do it your self. `kakle` can be summarized as `If Commit, Then That`.

See more documentation in the [docs](./docs)

## Example Usage

`kakle` uses a local config file (`.kaklerc`) in your repo which you can use to add hooks for commits. Or you can use the CLI to add interactively:

```shell
⇝ kakle add
? type (tag, regex or glob) tag
? tag run
? command curl http://localhost:3000
? should run automatically Yes

{
  "tag": "run",
  "command": "curl http://localhost:3000",
  "autorun": true
}

? Does this look good? Yes
√ Added new hook
```

This adds a `tag hook` to your git messages, and when you merge in or rebase in a new commit with the text `[run]` in the message, the command `curl http://localhost:3000` will automatically run – given that you have activated the kakle hooks. You can check this by doing:

```shell
⇝ kakle hooks status
Hooks not yet activated.
Run `kakle hooks activate` to activate hooks.
```

and activate it by doing:

```
⇝ kakle hooks activate
Activated hooks
```

See other commands by doing `kakle help` or help on a specific topic by doing `kakle help <topic>` (e.g. `kakle help hooks`).

## Install private version:

```shell
npm i https://dl.dropboxusercontent.com/u/2361994/npm/kakle-1.0.2.tgz
```

# Usage

```
⇝ kakle -h

  Usage: kakle [options] [command]


  Commands:

    hooks <command>  manage git hooks
    exec <manifest>  execute kakle on manifestfile
    add [type]       Add tags, regexes and/or globs
    remove [type]    Add tags, regexes and/or globs
    list [type]      List different hooks
    help [cmd]       display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

# Examples

## Adding

```shell
kakle add tag
> tag: <>
> command: <>
> autorun: true|false
```

```shell
kakle add regex
> regex: <>
> command: <>
> autorun: true|false
```

```shell
kakle add glob
> glob: <>
> command: <>
> autorun: true|false
```

## Hooks

```shell
kakle hooks activate
```

```shell
kakle hooks deactivate
```

```shell
kakle hooks status
```

## List

```shell
kakle list
# List all tags/regex/globs
```


## Executing

```shell
kakle exec ./path/to/.kaklerc
```
