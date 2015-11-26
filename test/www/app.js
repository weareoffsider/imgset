(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*

IDEA:
- [ ] data-srcset-options for optional params
- [ ] e.g., { lazy: 500 } attempts to load images when near 500px of bottom of screen
      Probably best to do this via load: false and have a single scroll tracker
      request srcset images to load on demand.
- [ ] Might be nice if imgset retuned a promise when images were loaded. This way your could use it to priority load assets as little more efficiently. 
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var _libDebounceJs = require('./lib/debounce.js');

var _libDebounceJs2 = _interopRequireDefault(_libDebounceJs);

var _libImageLoadedJs = require('./lib/imageLoaded.js');

var _libImageLoadedJs2 = _interopRequireDefault(_libImageLoadedJs);

exports['default'] = Imgset;

// Finds the closest matched (but not lower) object key and returns the mathcing value
// Assumes object keys and target are ints
var closestKey = function closestKey(obj, target) {
  var closest = 0;
  Object.keys(obj).forEach(function (key) {
    if (key <= target) {
      closest = Math.max(closest, key);
    }
  });
  return obj[closest];
};

// let createChildEls = (el) => {
// 
// }

function Imgset(selector) {
  selector = selector || '.Imgset';

  var els = Array.prototype.slice.call(document.querySelectorAll(selector));
  // ^ Convert node list to array for iteration

  // Setup
  els.forEach(function (el) {
    // TODO: Skip if already applied
    // What's a nice way of doing this?
    if (el.wknds_imgset) return;
    el.wknds_imgset;

    // Get the set of images from the <noscript> child node's data attribute
    var data = JSON.parse(el.children[0].dataset.json);
    // data.set, data.alt, data.focus

    // Create dom elements for background, and img
    var background_el = document.createElement('span');
    background_el.className = 'Imgset__background';

    var img_el = document.createElement('img');
    img_el.className = 'Imgset__img';
    img_el.alt = data.alt || '';

    el.appendChild(background_el);
    el.appendChild(img_el);

    var updateImageSrcForElWidth = function updateImageSrcForElWidth() {
      // Don't request image if element has 0 width
      if (el.offsetWidth === 0) return;

      // Select the most appropriate image to load from the list
      var uri = closestKey(data.set, el.offsetWidth);

      // When image loaded...
      (0, _libImageLoadedJs2['default'])(uri, function () {
        if (el.className.indexOf('is-loaded') === -1) {
          el.className = el.className + ' is-loaded';
        }
        // Only write to DOM if src to change
        if (img_el.src !== uri) {
          background_el.style.backgroundImage = 'url(' + uri + ')';
          img_el.src = uri;
        }
      });
    };

    updateImageSrcForElWidth();

    window.addEventListener('resize', (0, _libDebounceJs2['default'])(updateImageSrcForElWidth, 100));
  }); // forEach
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
module.exports = exports['default'];

},{"./lib/debounce.js":2,"./lib/imageLoaded.js":3}],2:[function(require,module,exports){
"use strict";

var debounce = function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};

module.exports = debounce;

},{}],3:[function(require,module,exports){
// Image loaded event hander

'use strict';

module.exports = function (src, callback) {
  var image = new Image();

  image.onload = function () {
    callback(src);
    // @TODO destoy image perhaps? Any perf benefit?
  };

  image.onerror = function () {
    var msg = 'Could not load image src ' + src;
    callback(new Error(msg));
  };

  image.src = src;
};

},{}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var _imgsetJs = require('../../imgset.js');

var _imgsetJs2 = _interopRequireDefault(_imgsetJs);

console.log('test');

(0, _imgsetJs2['default'])();

},{"../../imgset.js":1}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvRG9taW5pYy9Qcm9qZWN0cy82LiBQZXJzb25hbC9pbWdzZXQvaW1nc2V0LmpzIiwiL1VzZXJzL0RvbWluaWMvUHJvamVjdHMvNi4gUGVyc29uYWwvaW1nc2V0L2xpYi9kZWJvdW5jZS5qcyIsIi9Vc2Vycy9Eb21pbmljL1Byb2plY3RzLzYuIFBlcnNvbmFsL2ltZ3NldC9saWIvaW1hZ2VMb2FkZWQuanMiLCIvVXNlcnMvRG9taW5pYy9Qcm9qZWN0cy82LiBQZXJzb25hbC9pbWdzZXQvdGVzdC9zcmMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ1VBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUU7QUFDM0MsT0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDLENBQUM7O0FBRUgsU0FBUyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUU7QUFBRSxTQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQztDQUFFOztBQUVqRyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBUFAsbUJBQW1CLENBQUEsQ0FBQTs7QUFTeEMsSUFBSSxlQUFlLEdBQUcsc0JBQXNCLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRTdELElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQVZQLHNCQUFzQixDQUFBLENBQUE7O0FBWTlDLElBQUksa0JBQWtCLEdBQUcsc0JBQXNCLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFbkUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQVhILE1BQU0sQ0FBQTs7OztBQUtyQixJQUFJLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxHQUFHLEVBQUUsTUFBTSxFQUFLO0FBQ2hDLE1BQUksT0FBTyxHQUFHLENBQUMsQ0FBQTtBQUNmLFFB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RSxDQUFDO0NBQUU7O0FBRWpHLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FKSixpQkFBaUIsQ0FBQSxDQUFBOztBQU1wQyxJQUFJLFVBQVUsR0FBRyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFKbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFbkIsQ0FBQSxDQUFBLEVBQUEsVUFBQSxDQUFBLFNBQUEsQ0FBQSxDQUFBLEVBQVEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuXG5JREVBOlxuLSBbIF0gZGF0YS1zcmNzZXQtb3B0aW9ucyBmb3Igb3B0aW9uYWwgcGFyYW1zXG4tIFsgXSBlLmcuLCB7IGxhenk6IDUwMCB9IGF0dGVtcHRzIHRvIGxvYWQgaW1hZ2VzIHdoZW4gbmVhciA1MDBweCBvZiBib3R0b20gb2Ygc2NyZWVuXG4gICAgICBQcm9iYWJseSBiZXN0IHRvIGRvIHRoaXMgdmlhIGxvYWQ6IGZhbHNlIGFuZCBoYXZlIGEgc2luZ2xlIHNjcm9sbCB0cmFja2VyXG4gICAgICByZXF1ZXN0IHNyY3NldCBpbWFnZXMgdG8gbG9hZCBvbiBkZW1hbmQuXG4tIFsgXSBNaWdodCBiZSBuaWNlIGlmIGltZ3NldCByZXR1bmVkIGEgcHJvbWlzZSB3aGVuIGltYWdlcyB3ZXJlIGxvYWRlZC4gVGhpcyB3YXkgeW91ciBjb3VsZCB1c2UgaXQgdG8gcHJpb3JpdHkgbG9hZCBhc3NldHMgYXMgbGl0dGxlIG1vcmUgZWZmaWNpZW50bHkuIFxuKi9cblxuXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnLi9saWIvZGVib3VuY2UuanMnXG5pbXBvcnQgaW1hZ2VMb2FkZWQgZnJvbSAnLi9saWIvaW1hZ2VMb2FkZWQuanMnXG5cblxuZXhwb3J0IGRlZmF1bHQgSW1nc2V0XG5cblxuLy8gRmluZHMgdGhlIGNsb3Nlc3QgbWF0Y2hlZCAoYnV0IG5vdCBsb3dlcikgb2JqZWN0IGtleSBhbmQgcmV0dXJucyB0aGUgbWF0aGNpbmcgdmFsdWVcbi8vIEFzc3VtZXMgb2JqZWN0IGtleXMgYW5kIHRhcmdldCBhcmUgaW50c1xubGV0IGNsb3Nlc3RLZXkgPSAob2JqLCB0YXJnZXQpID0+IHtcbiAgbGV0IGNsb3Nlc3QgPSAwXG4gIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChrZXkgPD0gdGFyZ2V0KSB7XG4gICAgICBjbG9zZXN0ID0gTWF0aC5tYXgoY2xvc2VzdCwga2V5KVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIG9ialtjbG9zZXN0XVxufVxuXG5cbi8vIGxldCBjcmVhdGVDaGlsZEVscyA9IChlbCkgPT4ge1xuLy8gICBcbi8vIH1cblxuXG5mdW5jdGlvbiBJbWdzZXQoc2VsZWN0b3IpIHtcbiAgc2VsZWN0b3IgPSBzZWxlY3RvciB8fCAnLkltZ3NldCdcbiAgXG4gIGxldCBlbHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcbiAgLy8gXiBDb252ZXJ0IG5vZGUgbGlzdCB0byBhcnJheSBmb3IgaXRlcmF0aW9uXG4gIFxuICAvLyBTZXR1cFxuICBlbHMuZm9yRWFjaCggZWwgPT4ge1xuICAgIC8vIFRPRE86IFNraXAgaWYgYWxyZWFkeSBhcHBsaWVkXG4gICAgLy8gV2hhdCdzIGEgbmljZSB3YXkgb2YgZG9pbmcgdGhpcz8gXG4gICAgaWYgKCBlbC53a25kc19pbWdzZXQgKSByZXR1cm5cbiAgICBlbC53a25kc19pbWdzZXRcbiAgICBcblxuICAgIC8vIEdldCB0aGUgc2V0IG9mIGltYWdlcyBmcm9tIHRoZSA8bm9zY3JpcHQ+IGNoaWxkIG5vZGUncyBkYXRhIGF0dHJpYnV0ZVxuICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShlbC5jaGlsZHJlblswXS5kYXRhc2V0Lmpzb24pXG4gICAgLy8gZGF0YS5zZXQsIGRhdGEuYWx0LCBkYXRhLmZvY3VzXG4gICAgXG4gICAgXG4gICAgLy8gQ3JlYXRlIGRvbSBlbGVtZW50cyBmb3IgYmFja2dyb3VuZCwgYW5kIGltZ1xuICAgIGxldCBiYWNrZ3JvdW5kX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgYmFja2dyb3VuZF9lbC5jbGFzc05hbWUgPSAnSW1nc2V0X19iYWNrZ3JvdW5kJ1xuICAgIFxuICAgIGxldCBpbWdfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuICAgIGltZ19lbC5jbGFzc05hbWUgPSAnSW1nc2V0X19pbWcnXG4gICAgaW1nX2VsLmFsdCA9IGRhdGEuYWx0IHx8ICcnXG4gICAgXG4gICAgZWwuYXBwZW5kQ2hpbGQoYmFja2dyb3VuZF9lbClcbiAgICBlbC5hcHBlbmRDaGlsZChpbWdfZWwpXG4gICAgXG4gICAgXG4gICAgbGV0IHVwZGF0ZUltYWdlU3JjRm9yRWxXaWR0aCA9ICgpID0+IHsgICAgICBcbiAgICAgIC8vIERvbid0IHJlcXVlc3QgaW1hZ2UgaWYgZWxlbWVudCBoYXMgMCB3aWR0aFxuICAgICAgaWYgKCBlbC5vZmZzZXRXaWR0aCA9PT0gMCApXG4gICAgICAgIHJldHVyblxuICAgICAgXG4gICAgICAvLyBTZWxlY3QgdGhlIG1vc3QgYXBwcm9wcmlhdGUgaW1hZ2UgdG8gbG9hZCBmcm9tIHRoZSBsaXN0XG4gICAgICBsZXQgdXJpID0gY2xvc2VzdEtleShkYXRhLnNldCwgZWwub2Zmc2V0V2lkdGgpXG4gICAgICBcbiAgICAgIC8vIFdoZW4gaW1hZ2UgbG9hZGVkLi4uXG4gICAgICBpbWFnZUxvYWRlZCh1cmksICgpID0+IHtcbiAgICAgICAgaWYgKGVsLmNsYXNzTmFtZS5pbmRleE9mKCdpcy1sb2FkZWQnKSA9PT0gLTEpIHtcbiAgICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUgKyAnIGlzLWxvYWRlZCdcbiAgICAgICAgfVxuICAgICAgICAvLyBPbmx5IHdyaXRlIHRvIERPTSBpZiBzcmMgdG8gY2hhbmdlXG4gICAgICAgIGlmIChpbWdfZWwuc3JjICE9PSB1cmkpIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kX2VsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoJyArIHVyaSArICcpJztcbiAgICAgICAgICBpbWdfZWwuc3JjID0gdXJpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIFxuXG4gICAgdXBkYXRlSW1hZ2VTcmNGb3JFbFdpZHRoKClcbiAgICBcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZGVib3VuY2UodXBkYXRlSW1hZ2VTcmNGb3JFbFdpZHRoLCAxMDApKVxuICAgIFxuICB9KSAvLyBmb3JFYWNoXG59XG5cblxuXG4vKlxuLy8gT2xkIG1ldGhvZCBmb3IgcGFyc2luZyBzdHJpbmcuXG4vLyBXZSBub3cgdXNlIGpzb24gaW4gYSBkYXRhIGF0dHJpYnV0ZSBpbnN0ZWFkXG5cbmxldCBwYXJzZVVyaVN0cmluZyA9IHVyaV9zdHJpbmcgPT4ge1xuICAvLyBlLmcuLCBwaWMuanBnLCBwaWMyLmpwZyA0ODAsIHBpYzMuanBnIDcyMFxuICBcbiAgaWYgKCAhIHVyaV9zdHJpbmcgKVxuICAgIGNvbnNvbGUubG9nKCdObyB1cmkgc3RyaW5nIGZvciBTcmNzZXQgZWxlbWVudCcpXG5cbiAgbGV0IHNldHMgPSB7fVxuICB1cmlfc3RyaW5nLnNwbGl0KCcsICcpLmZvckVhY2goc2V0ID0+IHtcbiAgICAvLyBlLmcuLCBwaWMuanBnIDMyMFxuICAgIGxldCBhcnIgPSBzZXQuc3BsaXQoJyAnKVxuICAgIGlmIChhcnIubGVuZ3RoID09PSAxKVxuICAgICAgLy8gaWYgbm8gd2lkdGggc3BlY2NlZCwgYXNzdW1lIHdlIGhhdmUgYW4gaW1nIHVyaSBhbmQgbm8gd2lkdGhcbiAgICAgIHNldHNbMF0gPSBhcnJbMF1cbiAgICBlbHNlXG4gICAgICBzZXRzW2FyclsxXSAqIDFdID0gYXJyWzBdXG4gIH0pXG4gIFxuICByZXR1cm4gc2V0c1xufVxuKi9cbiIsInZhciBkZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICB2YXIgdGltZW91dFxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbFxuICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncylcbiAgICB9LCB3YWl0KVxuICAgIGlmIChpbW1lZGlhdGUgJiYgIXRpbWVvdXQpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncylcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlXG4iLCIvLyBJbWFnZSBsb2FkZWQgZXZlbnQgaGFuZGVyXG5cbm1vZHVsZS5leHBvcnRzID0gKHNyYywgY2FsbGJhY2spID0+IHtcbiAgbGV0IGltYWdlID0gbmV3IEltYWdlKClcbiAgXG4gIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcbiAgICBjYWxsYmFjayhzcmMpXG4gICAgLy8gQFRPRE8gZGVzdG95IGltYWdlIHBlcmhhcHM/IEFueSBwZXJmIGJlbmVmaXQ/XG4gIH1cbiAgXG4gIGltYWdlLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgbGV0IG1zZyA9ICdDb3VsZCBub3QgbG9hZCBpbWFnZSBzcmMgJyArIHNyY1xuICAgIGNhbGxiYWNrKG5ldyBFcnJvcihtc2cpKVxuICB9XG4gIFxuICBpbWFnZS5zcmMgPSBzcmNcbn1cbiIsImltcG9ydCBJbWdzZXQgZnJvbSAnLi4vLi4vaW1nc2V0LmpzJ1xuXG5jb25zb2xlLmxvZygndGVzdCcpXG5cbkltZ3NldCgpXG4iXX0=
