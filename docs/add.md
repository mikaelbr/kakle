# Add new hook

Add a new kakle hook to run when you do a git merge or rebase. Can be of three different types:

* `tag`: Match a tag in git commit messages. In the format as `[tag-name]`. E.g. if tag is `install` it will trigger command if `[install]` is found in a commit message.
* `regex`: A regular expression checked against both git message and file tree. Command executed if regex matches any of those inputs.
* `glob`: An unix glob to match the in git diff tree. E.g. `package.json` or `./**/packages.config`.

## Example

```
kakle add
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
