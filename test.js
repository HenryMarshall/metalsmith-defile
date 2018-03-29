import test from "ava"
import defile from "./index"

test("throws when passed non-functions", t => {
  const error = t.throws(() => {
    defile("not a function")
  }, TypeError)

  t.is(error.message, "defile takes a metalsmith function")
})

test("throws when passed non metalsmith (curried) functions", t => {
  const fn = () => "I'm a function"
  t.throws(() => {
    defile(fn)
  }, TypeError, "defile takes a metalsmith function")
})


test("returns a metalsmith function", t => {
  const testPlugin = config => (files, metalsmith, done) => done()
  const defiled = defile(testPlugin)
  t.plan(3)

  t.is(typeof defiled, "function")
  t.is(typeof defiled(), "function")

  defiled()({}, {}, () => {
    t.pass("done was called")
  })
})

test("update by passing results to done", t => {
  const files = { foo: "foo" }
  const testPlugin = obj => (files, metalsmith, done) => {
    done({ files: { foo: "bar" } })
  }
  defile(testPlugin)()(files, {}, () => {})

  t.is(files.foo, "bar")
})

test("delete values by passing results to done", t => {
  const files = { foo: "foo", bar: "bar" }
  const expectedFiles = { foo: "foo" }

  const fn = () => {}
  const metalsmith = { baz: "baz", bav: true, bax: [1, 2, 3], fn }
  const expectedMetalsmith = { baz: "baz", bax: [1, 2, 3], fn }

  const testPlugin = obj => (files, metalsmith, done) => {
    done({ files: expectedFiles, metalsmith: expectedMetalsmith })
  }

  const defiled = defile(testPlugin, { throwOnMutation: true })
  defiled()(files, metalsmith, () => {})

  t.deepEqual(files, expectedFiles)
  t.deepEqual(metalsmith, expectedMetalsmith)
})

test("throws if files are directly mutated", t => {
  const testPlugin = obj => (files, metalsmith, done) => {
    files.foo = "bar"
    done()
  }
  const defiled = defile(testPlugin, { throwOnMutation: true })

  t.throws(() => {
    defiled()({}, {}, () => {})
  }, TypeError)
})

test("does not throw on mutation without flag", t => {
  const testPlugin = obj => (files, metalsmith, done) => {
    files.foo = "bar"
    done()
  }
  const defiled = defile(testPlugin)
  const files = { foo: "foo" }
  defiled()(files, {}, () => {})

  t.deepEqual(files, { foo: "bar" })
})
