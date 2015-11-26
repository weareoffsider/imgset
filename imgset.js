/*

IDEA:
- [ ] data-srcset-options for optional params
- [ ] e.g., { lazy: 500 } attempts to load images when near 500px of bottom of screen
      Probably best to do this via load: false and have a single scroll tracker
      request srcset images to load on demand.
- [ ] Might be nice if imgset retuned a promise when images were loaded. This way your could use it to priority load assets as little more efficiently. 
*/


import debounce from './lib/debounce.js'
import imageLoaded from './lib/imageLoaded.js'


export default Imgset


// Finds the closest matched (but not lower) object key and returns the mathcing value
// Assumes object keys and target are ints
let closestKey = (obj, target) => {
  let closest = 0
  Object.keys(obj).forEach(key => {
    if (key <= target) {
      closest = Math.max(closest, key)
    }
  })
  return obj[closest]
}


// let createChildEls = (el) => {
//   
// }


function Imgset(selector) {
  selector = selector || '.Imgset'
  
  let els = Array.prototype.slice.call(document.querySelectorAll(selector))
  // ^ Convert node list to array for iteration
  
  // Setup
  els.forEach( el => {
    // TODO: Skip if already applied
    // What's a nice way of doing this? 
    if ( el.wknds_imgset ) return
    el.wknds_imgset
    

    // Get the set of images from the <noscript> child node's data attribute
    let data = JSON.parse(el.children[0].dataset.json)
    // data.set, data.alt, data.focus
    
    
    // Create dom elements for background, and img
    let background_el = document.createElement('span')
    background_el.className = 'Imgset__background'
    
    let img_el = document.createElement('img')
    img_el.className = 'Imgset__img'
    img_el.alt = data.alt || ''
    
    el.appendChild(background_el)
    el.appendChild(img_el)
    
    
    let updateImageSrcForElWidth = () => {      
      // Don't request image if element has 0 width
      if ( el.offsetWidth === 0 )
        return
      
      // Select the most appropriate image to load from the list
      let uri = closestKey(data.set, el.offsetWidth)
      
      // When image loaded...
      imageLoaded(uri, () => {
        if (el.className.indexOf('is-loaded') === -1) {
          el.className = el.className + ' is-loaded'
        }
        // Only write to DOM if src to change
        if (img_el.src !== uri) {
          background_el.style.backgroundImage = 'url(' + uri + ')';
          img_el.src = uri
        }
      })
    }
    

    updateImageSrcForElWidth()
    
    window.addEventListener('resize', debounce(updateImageSrcForElWidth, 100))
    
  }) // forEach
}



/*
// Old method for parsing string.
// We now use json in a data attribute instead

let parseUriString = uri_string => {
  // e.g., pic.jpg, pic2.jpg 480, pic3.jpg 720
  
  if ( ! uri_string )
    console.log('No uri string for Srcset element')

  let sets = {}
  uri_string.split(', ').forEach(set => {
    // e.g., pic.jpg 320
    let arr = set.split(' ')
    if (arr.length === 1)
      // if no width specced, assume we have an img uri and no width
      sets[0] = arr[0]
    else
      sets[arr[1] * 1] = arr[0]
  })
  
  return sets
}
*/
