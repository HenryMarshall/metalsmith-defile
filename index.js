const cloneDeep = require("lodash.clonedeep")
const deepFreeze = require("deep-freeze")

const defile = (fn, defileConfig = {}) => {
  if (typeof fn !== "function" || typeof fn() !== "function") {
    throw new TypeError("Defile takes a metalsmith function")
  }

  return config => (files, metalsmith, done) => {
    fn(config)(
      defileConfig.throwOnMutation ? immutableCopy(files) : files,
      defileConfig.throwOnMutation ? immutableCopy(metalsmith) : metalsmith,
      immutableDone(files, metalsmith, done))
  }
}

const immutableCopy = obj => deepFreeze(cloneDeep(obj))

const immutableDone = (files, metalsmith, done) => (updated = {}) => {
  update(files, updated.files)
  update(metalsmith, updated.metalsmith)

  done()
}

// If updated is `undefined` we assume it was not passed to the `done` function
// and you instead want to keep the old value. Many plugins touch only files or
// metalsmith, but not both making this a reasonable default. Pass `{}` as
// `updated` to clear all keys.
const update = (old, updated) => {
  if (updated) {
    deleteMissingKeys(old, updated)
    Object.assign(old, updated)
  }
}

const deleteMissingKeys = (old, updated) => {
  Object.keys(old).forEach(key => {
    if (!updated.hasOwnProperty(key)) {
      delete old[key]
    }
  })
}

module.exports = defile
