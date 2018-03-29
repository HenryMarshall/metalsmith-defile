# metalsmith-defile

**This plugin is for metalsmith plugin developer *not* users of metalsmith (though
you may be both).**

Metalsmith-Defile (henceforth defile) is middleware that let's you write your
plugin as a pure function rather than by mutating files and metalsmith in place.
You can then call `defile` on your pure function to make it compatible with the
Metalsmith API. This is primarily useful if you are writing in a functional
style using something like [ramda.js](http://ramdajs.com/).

This is best shown by example. You would write:

```js
const defile = require("metalsmith-defile")

const myPlugin = options => (files, metalsmith, done) => {
  done({ files: "bar", metalsmith })
}

module.exports = defile(myPlugin)
```

instead of:

```js
const myPlugin = options => (files, metalsmith, done) => {
  files.foo = "bar"
  done()
}

module.exports = myPlugin
```

## Details

If you don't pass `files` and/or `metalsmith`, the original object is passed
through. This object *may* have been mutated by the plugin. This means that
defiling an existing (impure) plugin should have no effect at all.

```js
// These are equivalent
options => (files, metalsmith, done) => {
  done({ files: "bar", metalsmith })
}

options => (files, metalsmith, done) => {
  done({ files: "bar" })
}
```

To delete a key/value pair on an object, omit it from the object you return. To
remove all files, you would pass `{ files: {} }`.


## Testing

By default defile does *not* throw if you mutate in place. Because this throwing
may be desirable in the development process, you can enable it by passing `{
throwOnMutation: true }` to `defile` as a second argument. Enabling this
behavior isn't free however, so I discourage you from shipping your plugin with
it on.

```js
// myPlugin.js
const myPlugin = options => (files, metalsmith, done) => { done() }

module.exports = defile(myPlugin)
module.exports.pure = myPlugin


// myPlugin.test.js
test("throws if files are directly mutated", t => {
  const defiled = defile(myPlugin.pure, { throwOnMutation: true })

  t.throws(() => {
    defiled()({}, {}, () => {})
  }, TypeError)
})
```

