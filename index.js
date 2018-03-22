const deepFreeze = require("deep-freeze")

const purify = fn => {
  if (typeof fn !== "function" || typeof fn() !== "function") {
    throw new TypeError("Purify takes a metalsmith function")
  }

  return config => (files, metalsmith, done) => {
    deepFreeze(files)
    deepFreeze(metalsmith)

    fn(config)(files, metalsmith, done)
  }
}


module.exports = purify
