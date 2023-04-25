const { blue, green, red, yellow } = require('chalk')

module.exports = {
  info: (msg) => {
    console.log(blue(msg))
  },
  success: (msg) => {
    console.log(green(msg))
  },
  warn: (msg) => {
    console.log(yellow(msg))
  },
  error: (msg) => {
    console.log(red(msg))
  }
}
