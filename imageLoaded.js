// Image loaded event hander

module.exports = (src, callback) => {
  let image = new Image()
  
  image.onload = () => {
    callback(src)
    // @TODO destoy image perhaps? Any perf benefit?
  }
  
  image.onerror = () => {
    let msg = 'Could not load image src ' + src
    callback(new Error(msg))
  }
  
  image.src = src
}
