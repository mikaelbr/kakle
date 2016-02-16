# kakle

> If Commit Then That

Config file to hook up commands reacting to commits.

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
