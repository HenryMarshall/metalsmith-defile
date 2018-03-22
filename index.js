const purify = fn => {
  if (typeof fn !== "function" || typeof fn() !== "function") {
    throw new TypeError("Purify takes a metalsmith function")
  }

  return fn
}


module.exports = purify
