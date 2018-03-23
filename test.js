import test from "ava"
import purify from "./index"

test("throws when passed non-functions", t => {
  const error = t.throws(() => {
    purify("not a function")
  }, TypeError)

  t.is(error.message, "Purify takes a metalsmith function")
})

test("throws when passed non metalsmith (curried) functions", t => {
  const fn = () => "I'm a function"
  t.throws(() => {
    purify(fn)
  }, TypeError, "Purify takes a metalsmith function")
})


test("returns a metalsmith function", t => {
  const testPlugin = config => (files, metalsmith, done) => done()
  const purified = purify(testPlugin)
  t.plan(3)

  t.is(typeof purified, "function")
  t.is(typeof purified(), "function")

  purified()({}, {}, () => {
    t.pass("done was called")
  })
})

test("update by passing results to done", t => {
  const files = { foo: "foo" }
  const testPlugin = obj => (files, metalsmith, done) => {
    done({ files: { foo: "bar" } })
  }
  purify(testPlugin)()(files, {}, () => {})

  t.is(files.foo, "bar")
})


// #throwOnMutation
test("throws if files are directly mutated", t => {
  const testPlugin = obj => (files, metalsmith, done) => {
    files.foo = "bar"
  }
  const purified = purify(testPlugin, { throwOnMutation: true })

  t.throws(() => {
    purified()({}, {}, () => {})
  }, TypeError)
})

