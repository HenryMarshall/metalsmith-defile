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
