(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
/*

IDEA:
- [ ] data-srcset-options for optional params
- [ ] e.g., { lazy: 500 } attempts to load images when near 500px of bottom of screen
      Probably best to do this via load: false and have a single scroll tracker
      request srcset images to load on demand.
*/

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debounceJs = require('./debounce.js');

var _debounceJs2 = _interopRequireDefault(_debounceJs);

var _imageLoadedJs = require('./imageLoaded.js');

var _imageLoadedJs2 = _interopRequireDefault(_imageLoadedJs);

module.exports = Srcset;

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

function Srcset(selector) {
  selector = selector || '.Srcset';

  var els = Array.prototype.slice.call(document.querySelectorAll(selector));
  // ^ Convert node list to array for iteration

  console.log(els);

  // Setup
  els.forEach(function (el) {
    // TODO: Skip if already applied
    // What's a nice way of doing this?
    if (el.wknds_srcset) return;
    el.wknds_srcset;

    // Get the set of images from the <noscript> child node's data attribute
    var data = JSON.parse(el.children[0].dataset.json);
    // data.set, data.alt, data.focus

    // Create dom elements for background, and img
    var background_el = document.createElement('span');
    background_el.className = 'Srcset__background';

    var img_el = document.createElement('img');
    img_el.className = 'Srcset__img';
    img_el.alt = data.alt || '';

    el.appendChild(background_el);
    el.appendChild(img_el);

    var updateImageSrcForElWidth = function updateImageSrcForElWidth() {
      console.log(el);

      // Don't request image if element has 0 width
      if (el.offsetWidth === 0) return;

      // Select the most appropriate image to load from the list
      var uri = closestKey(data.set, el.offsetWidth);

      // When image loaded...
      (0, _imageLoadedJs2['default'])(uri, function () {
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
    window.onresize = (0, _debounceJs2['default'])(updateImageSrcForElWidth, 100);
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

},{"./debounce.js":1,"./imageLoaded.js":2}],4:[function(require,module,exports){
'use strict';

var srcset = require('../srcset.js');

srcset();

},{"../srcset.js":3}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9Eb21pbmljL1Byb2plY3RzLzYuIFBlcnNvbmFsL3NyY3NldC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvRG9taW5pYy9Qcm9qZWN0cy82LiBQZXJzb25hbC9zcmNzZXQvZGVib3VuY2UuanMiLCIvVXNlcnMvRG9taW5pYy9Qcm9qZWN0cy82LiBQZXJzb25hbC9zcmNzZXQvaW1hZ2VMb2FkZWQuanMiLCIvVXNlcnMvRG9taW5pYy9Qcm9qZWN0cy82LiBQZXJzb25hbC9zcmNzZXQvc3Jjc2V0LmpzIiwiL1VzZXJzL0RvbWluaWMvUHJvamVjdHMvNi4gUGVyc29uYWwvc3Jjc2V0L3Rlc3QvZmFrZV83ODk5YmZkYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQVksSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7QUFDN0MsTUFBSSxPQUFPLENBQUE7QUFDWCxTQUFPLFlBQVc7QUFDaEIsUUFBSSxPQUFPLEdBQUcsSUFBSTtRQUFFLElBQUksR0FBRyxTQUFTLENBQUE7QUFDcEMsZ0JBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNyQixXQUFPLEdBQUcsVUFBVSxDQUFDLFlBQVc7QUFDOUIsYUFBTyxHQUFHLElBQUksQ0FBQTtBQUNkLFVBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDMUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNSLFFBQUksU0FBUyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO0dBQ3JELENBQUE7Q0FDRixDQUFBOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxD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LENBQUMsQ0FBQyxFQUFFO0FBQzVDLFlBQUUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUE7U0FDM0M7O0FBRUQsWUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRTtBQUN0Qix1QkFBYSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDekQsZ0JBQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO1NBQ2pCO09BQ0YsQ0FBQyxDQUFBO0tBQ0gsQ0FBQTs7QUFHRCw0QkFBd0IsRUFBRSxDQUFBO0FBQzFCLFVBQU0sQ0FBQyxRQUFRLEdBQUcsNkJBQVMsd0JBQXdCLEVBQUUsR0FBRyxDQUFDLENBQUE7R0FDMUQsQ0FBQyxDQUFBO0NBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNGRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7O0FBRXBDLE1BQU0sRUFBRSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBkZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICB2YXIgdGltZW91dFxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbFxuICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncylcbiAgICB9LCB3YWl0KVxuICAgIGlmIChpbW1lZGlhdGUgJiYgIXRpbWVvdXQpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncylcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlXG4iLCIvLyBJbWFnZSBsb2FkZWQgZXZlbnQgaGFuZGVyXG5cbm1vZHVsZS5leHBvcnRzID0gKHNyYywgY2FsbGJhY2spID0+IHtcbiAgbGV0IGltYWdlID0gbmV3IEltYWdlKClcbiAgXG4gIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcbiAgICBjYWxsYmFjayhzcmMpXG4gICAgLy8gQFRPRE8gZGVzdG95IGltYWdlIHBlcmhhcHM/IEFueSBwZXJmIGJlbmVmaXQ/XG4gIH1cbiAgXG4gIGltYWdlLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgbGV0IG1zZyA9ICdDb3VsZCBub3QgbG9hZCBpbWFnZSBzcmMgJyArIHNyY1xuICAgIGNhbGxiYWNrKG5ldyBFcnJvcihtc2cpKVxuICB9XG4gIFxuICBpbWFnZS5zcmMgPSBzcmNcbn1cbiIsIi8qXG5cbklERUE6XG4tIFsgXSBkYXRhLXNyY3NldC1vcHRpb25zIGZvciBvcHRpb25hbCBwYXJhbXNcbi0gWyBdIGUuZy4sIHsgbGF6eTogNTAwIH0gYXR0ZW1wdHMgdG8gbG9hZCBpbWFnZXMgd2hlbiBuZWFyIDUwMHB4IG9mIGJvdHRvbSBvZiBzY3JlZW5cbiAgICAgIFByb2JhYmx5IGJlc3QgdG8gZG8gdGhpcyB2aWEgbG9hZDogZmFsc2UgYW5kIGhhdmUgYSBzaW5nbGUgc2Nyb2xsIHRyYWNrZXJcbiAgICAgIHJlcXVlc3Qgc3Jjc2V0IGltYWdlcyB0byBsb2FkIG9uIGRlbWFuZC5cbiovXG5cblxuaW1wb3J0IGRlYm91bmNlIGZyb20gJy4vZGVib3VuY2UuanMnXG5pbXBvcnQgaW1hZ2VMb2FkZWQgZnJvbSAnLi9pbWFnZUxvYWRlZC5qcydcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNyY3NldFxuXG5cbi8vIEZpbmRzIHRoZSBjbG9zZXN0IG1hdGNoZWQgKGJ1dCBub3QgbG93ZXIpIG9iamVjdCBrZXkgYW5kIHJldHVybnMgdGhlIG1hdGhjaW5nIHZhbHVlXG4vLyBBc3N1bWVzIG9iamVjdCBrZXlzIGFuZCB0YXJnZXQgYXJlIGludHNcbmxldCBjbG9zZXN0S2V5ID0gKG9iaiwgdGFyZ2V0KSA9PiB7XG4gIGxldCBjbG9zZXN0ID0gMFxuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5IDw9IHRhcmdldCkge1xuICAgICAgY2xvc2VzdCA9IE1hdGgubWF4KGNsb3Nlc3QsIGtleSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiBvYmpbY2xvc2VzdF1cbn1cblxuXG5cbmZ1bmN0aW9uIFNyY3NldChzZWxlY3Rvcikge1xuICBzZWxlY3RvciA9IHNlbGVjdG9yIHx8ICcuU3Jjc2V0J1xuICBcbiAgbGV0IGVscyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKVxuICAvLyBeIENvbnZlcnQgbm9kZSBsaXN0IHRvIGFycmF5IGZvciBpdGVyYXRpb25cbiAgXG4gIGNvbnNvbGUubG9nKGVscylcbiAgXG4gIC8vIFNldHVwXG4gIGVscy5mb3JFYWNoKCBlbCA9PiB7XG4gICAgLy8gVE9ETzogU2tpcCBpZiBhbHJlYWR5IGFwcGxpZWRcbiAgICAvLyBXaGF0J3MgYSBuaWNlIHdheSBvZiBkb2luZyB0aGlzPyBcbiAgICBpZiAoIGVsLndrbmRzX3NyY3NldCApIHJldHVyblxuICAgIGVsLndrbmRzX3NyY3NldFxuICAgIFxuXG4gICAgLy8gR2V0IHRoZSBzZXQgb2YgaW1hZ2VzIGZyb20gdGhlIDxub3NjcmlwdD4gY2hpbGQgbm9kZSdzIGRhdGEgYXR0cmlidXRlXG4gICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGVsLmNoaWxkcmVuWzBdLmRhdGFzZXQuanNvbilcbiAgICAvLyBkYXRhLnNldCwgZGF0YS5hbHQsIGRhdGEuZm9jdXNcbiAgICBcbiAgICBcbiAgICAvLyBDcmVhdGUgZG9tIGVsZW1lbnRzIGZvciBiYWNrZ3JvdW5kLCBhbmQgaW1nXG4gICAgbGV0IGJhY2tncm91bmRfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBiYWNrZ3JvdW5kX2VsLmNsYXNzTmFtZSA9ICdTcmNzZXRfX2JhY2tncm91bmQnXG4gICAgXG4gICAgbGV0IGltZ19lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpICAgIFxuICAgIGltZ19lbC5jbGFzc05hbWUgPSAnU3Jjc2V0X19pbWcnXG4gICAgaW1nX2VsLmFsdCA9IGRhdGEuYWx0IHx8ICcnXG4gICAgXG4gICAgZWwuYXBwZW5kQ2hpbGQoYmFja2dyb3VuZF9lbClcbiAgICBlbC5hcHBlbmRDaGlsZChpbWdfZWwpXG4gICAgXG4gICAgXG4gICAgbGV0IHVwZGF0ZUltYWdlU3JjRm9yRWxXaWR0aCA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVsKVxuICAgICAgXG4gICAgICAvLyBEb24ndCByZXF1ZXN0IGltYWdlIGlmIGVsZW1lbnQgaGFzIDAgd2lkdGhcbiAgICAgIGlmICggZWwub2Zmc2V0V2lkdGggPT09IDAgKVxuICAgICAgICByZXR1cm5cbiAgICAgIFxuICAgICAgLy8gU2VsZWN0IHRoZSBtb3N0IGFwcHJvcHJpYXRlIGltYWdlIHRvIGxvYWQgZnJvbSB0aGUgbGlzdFxuICAgICAgbGV0IHVyaSA9IGNsb3Nlc3RLZXkoZGF0YS5zZXQsIGVsLm9mZnNldFdpZHRoKVxuICAgICAgXG4gICAgICAvLyBXaGVuIGltYWdlIGxvYWRlZC4uLlxuICAgICAgaW1hZ2VMb2FkZWQodXJpLCAoKSA9PiB7XG4gICAgICAgIGlmIChlbC5jbGFzc05hbWUuaW5kZXhPZignaXMtbG9hZGVkJykgPT09IC0xKSB7XG4gICAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lICsgJyBpcy1sb2FkZWQnXG4gICAgICAgIH1cbiAgICAgICAgLy8gT25seSB3cml0ZSB0byBET00gaWYgc3JjIHRvIGNoYW5nZVxuICAgICAgICBpZiAoaW1nX2VsLnNyYyAhPT0gdXJpKSB7XG4gICAgICAgICAgYmFja2dyb3VuZF9lbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcgKyB1cmkgKyAnKSc7XG4gICAgICAgICAgaW1nX2VsLnNyYyA9IHVyaVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBcblxuICAgIHVwZGF0ZUltYWdlU3JjRm9yRWxXaWR0aCgpXG4gICAgd2luZG93Lm9ucmVzaXplID0gZGVib3VuY2UodXBkYXRlSW1hZ2VTcmNGb3JFbFdpZHRoLCAxMDApICAgIFxuICB9KSAvLyBmb3JFYWNoXG59XG5cblxuXG4vKlxuLy8gT2xkIG1ldGhvZCBmb3IgcGFyc2luZyBzdHJpbmcuXG4vLyBXZSBub3cgdXNlIGpzb24gaW4gYSBkYXRhIGF0dHJpYnV0ZSBpbnN0ZWFkXG5cbmxldCBwYXJzZVVyaVN0cmluZyA9IHVyaV9zdHJpbmcgPT4ge1xuICAvLyBlLmcuLCBwaWMuanBnLCBwaWMyLmpwZyA0ODAsIHBpYzMuanBnIDcyMFxuICBcbiAgaWYgKCAhIHVyaV9zdHJpbmcgKVxuICAgIGNvbnNvbGUubG9nKCdObyB1cmkgc3RyaW5nIGZvciBTcmNzZXQgZWxlbWVudCcpXG5cbiAgbGV0IHNldHMgPSB7fVxuICB1cmlfc3RyaW5nLnNwbGl0KCcsICcpLmZvckVhY2goc2V0ID0+IHtcbiAgICAvLyBlLmcuLCBwaWMuanBnIDMyMFxuICAgIGxldCBhcnIgPSBzZXQuc3BsaXQoJyAnKVxuICAgIGlmIChhcnIubGVuZ3RoID09PSAxKVxuICAgICAgLy8gaWYgbm8gd2lkdGggc3BlY2NlZCwgYXNzdW1lIHdlIGhhdmUgYW4gaW1nIHVyaSBhbmQgbm8gd2lkdGhcbiAgICAgIHNldHNbMF0gPSBhcnJbMF1cbiAgICBlbHNlXG4gICAgICBzZXRzW2FyclsxXSAqIDFdID0gYXJyWzBdXG4gIH0pXG4gIFxuICByZXR1cm4gc2V0c1xufVxuKi9cbiIsInZhciBzcmNzZXQgPSByZXF1aXJlKCcuLi9zcmNzZXQuanMnKVxuXG5zcmNzZXQoKVxuIl19
