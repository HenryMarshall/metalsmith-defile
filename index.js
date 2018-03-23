const R = require("ramda")
const cloneDeep = require("lodash.clonedeep")
const deepFreeze = require("deep-freeze")

const purify = (fn, purifyConfig = {}) => {
  if (typeof fn !== "function" || typeof fn() !== "function") {
    throw new TypeError("Purify takes a metalsmith function")
  }

  return config => (files, metalsmith, done) => {
    fn(config)(
      purifyConfig.throwOnMutation ? immutableCopy(files) : files,
      purifyConfig.throwOnMutation ? immutableCopy(metalsmith) : metalsmith,
      immutableDone(files, metalsmith, done))
  }
}

const immutableCopy = R.pipe(cloneDeep, deepFreeze)

const immutableDone = (files, metalsmith, done) => (updated = {}) => {
  Object.assign(files, updated.files)
  Object.assign(metalsmith, updated.metalsmith)
  done()
}

module.exports = purify
