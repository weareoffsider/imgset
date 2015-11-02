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

},{"./debounce.js":1,"./imageLoaded.js":3}],3:[function(require,module,exports){
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9Eb21pbmljL1Byb2plY3RzLzYuIFBlcnNvbmFsL3NyY3NldC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvRG9taW5pYy9Qcm9qZWN0cy82LiBQZXJzb25hbC9zcmNzZXQvZGVib3VuY2UuanMiLCIvVXNlcnMvRG9taW5pYy9Qcm9qZWN0cy82LiBQZXJzb25hbC9zcmNzZXQvZmFrZV8xMjFmYzZkOS5qcyIsIi9Vc2Vycy9Eb21pbmljL1Byb2plY3RzLzYuIFBlcnNvbmFsL3NyY3NldC9pbWFnZUxvYWRlZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQVksSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7QUFDN0MsTUFBSSxPQUFPLENBQUE7QUFDWCxTQUFPLFlBQVc7QUFDaEIsUUFBSSxPQUFPLEdBQUcsSUFBSTtRQUFFLElBQUksR0FBRyxTQUFTLENBQUE7QUFDcEMsZ0JBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNyQixXQUFPLEdBQUcsVUFBVSxDQUFDLFlBQVc7QUFDOUIsYUFBTyxHQUFHLElBQUksQ0FBQTtBQUNkLFVBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDMUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNSLFFBQUksU0FBUyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO0dBQ3JELENBQUE7Q0FDRixDQUFBOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7OzBCQ0hKLGVBQWU7Ozs7NkJBQ1osa0JBQWtCOzs7O0FBRzFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBOzs7O0FBS3ZCLElBQUksVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUs7QUFDaEMsTUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0FBQ2YsUUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDOUIsUUFBSSxHQUFHLElBQUksTUFBTSxFQUFFO0FBQ2pCLGFBQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQTtLQUNqQztHQUNGLENBQUMsQ0FBQTtBQUNGLFNBQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0NBQ3BCLENBQUE7O0FBSUQsU0FBUyxNQUFNLENBQUMsUUFBUSxFQUFFO0FBQ3hCLFVBQVEsR0FBRyxRQUFRLElBQUksU0FBUyxDQUFBOztBQUVoQyxNQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7OztBQUd6RSxTQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBOzs7QUFHaEIsS0FBRyxDQUFDLE9BQU8sQ0FBRSxVQUFBLEVBQUUsRUFBSTs7O0FBR2pCLFFBQUssRUFBRSxDQUFDLFlBQVksRUFBRyxPQUFNO0FBQzdCLE1BQUUsQ0FBQyxZQUFZLENBQUE7OztBQUlmLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7Ozs7QUFLbEQsUUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNsRCxpQkFBYSxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQTs7QUFFOUMsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMxQyxVQUFNLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQTtBQUNoQyxVQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFBOztBQUUzQixNQUFFLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQzdCLE1BQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBR3RCLFFBQUksd0JBQXdCLEdBQUcsU0FBM0Isd0JBQXdCLEdBQVM7QUFDbkMsYUFBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTs7O0FBR2YsVUFBSyxFQUFFLENBQUMsV0FBVyxLQUFLLENBQUMsRUFDdkIsT0FBTTs7O0FBR1IsVUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFBOzs7QUFHOUMsc0NBQVksR0FBRyxFQUFFLFlBQU07QUFDckIsWUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUM1QyxZQUFFLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFBO1NBQzNDOztBQUVELFlBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxHQUFHLEVBQUU7QUFDdEIsdUJBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3pELGdCQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtTQUNqQjtPQUNGLENBQUMsQ0FBQTtLQUNILENBQUE7O0FBR0QsNEJBQXdCLEVBQUUsQ0FBQTtBQUMxQixVQUFNLENBQUMsUUFBUSxHQUFHLDZCQUFTLHdCQUF3QixFQUFFLEdBQUcsQ0FBQyxDQUFBO0dBQzFELENBQUMsQ0FBQTtDQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pGRCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQUMsR0FBRyxFQUFFLFFBQVEsRUFBSztBQUNsQyxNQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFBOztBQUV2QixPQUFLLENBQUMsTUFBTSxHQUFHLFlBQU07QUFDbkIsWUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBOztHQUVkLENBQUE7O0FBRUQsT0FBSyxDQUFDLE9BQU8sR0FBRyxZQUFNO0FBQ3BCLFFBQUksR0FBRyxHQUFHLDJCQUEyQixHQUFHLEdBQUcsQ0FBQTtBQUMzQyxZQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtHQUN6QixDQUFBOztBQUVELE9BQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO0NBQ2hCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gIHZhciB0aW1lb3V0XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHNcbiAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsXG4gICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxuICAgIH0sIHdhaXQpXG4gICAgaWYgKGltbWVkaWF0ZSAmJiAhdGltZW91dCkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2VcbiIsIi8qXG5cbklERUE6XG4tIFsgXSBkYXRhLXNyY3NldC1vcHRpb25zIGZvciBvcHRpb25hbCBwYXJhbXNcbi0gWyBdIGUuZy4sIHsgbGF6eTogNTAwIH0gYXR0ZW1wdHMgdG8gbG9hZCBpbWFnZXMgd2hlbiBuZWFyIDUwMHB4IG9mIGJvdHRvbSBvZiBzY3JlZW5cbiAgICAgIFByb2JhYmx5IGJlc3QgdG8gZG8gdGhpcyB2aWEgbG9hZDogZmFsc2UgYW5kIGhhdmUgYSBzaW5nbGUgc2Nyb2xsIHRyYWNrZXJcbiAgICAgIHJlcXVlc3Qgc3Jjc2V0IGltYWdlcyB0byBsb2FkIG9uIGRlbWFuZC5cbiovXG5cblxuaW1wb3J0IGRlYm91bmNlIGZyb20gJy4vZGVib3VuY2UuanMnXG5pbXBvcnQgaW1hZ2VMb2FkZWQgZnJvbSAnLi9pbWFnZUxvYWRlZC5qcydcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNyY3NldFxuXG5cbi8vIEZpbmRzIHRoZSBjbG9zZXN0IG1hdGNoZWQgKGJ1dCBub3QgbG93ZXIpIG9iamVjdCBrZXkgYW5kIHJldHVybnMgdGhlIG1hdGhjaW5nIHZhbHVlXG4vLyBBc3N1bWVzIG9iamVjdCBrZXlzIGFuZCB0YXJnZXQgYXJlIGludHNcbmxldCBjbG9zZXN0S2V5ID0gKG9iaiwgdGFyZ2V0KSA9PiB7XG4gIGxldCBjbG9zZXN0ID0gMFxuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5IDw9IHRhcmdldCkge1xuICAgICAgY2xvc2VzdCA9IE1hdGgubWF4KGNsb3Nlc3QsIGtleSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiBvYmpbY2xvc2VzdF1cbn1cblxuXG5cbmZ1bmN0aW9uIFNyY3NldChzZWxlY3Rvcikge1xuICBzZWxlY3RvciA9IHNlbGVjdG9yIHx8ICcuU3Jjc2V0J1xuICBcbiAgbGV0IGVscyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKVxuICAvLyBeIENvbnZlcnQgbm9kZSBsaXN0IHRvIGFycmF5IGZvciBpdGVyYXRpb25cbiAgXG4gIGNvbnNvbGUubG9nKGVscylcbiAgXG4gIC8vIFNldHVwXG4gIGVscy5mb3JFYWNoKCBlbCA9PiB7XG4gICAgLy8gVE9ETzogU2tpcCBpZiBhbHJlYWR5IGFwcGxpZWRcbiAgICAvLyBXaGF0J3MgYSBuaWNlIHdheSBvZiBkb2luZyB0aGlzPyBcbiAgICBpZiAoIGVsLndrbmRzX3NyY3NldCApIHJldHVyblxuICAgIGVsLndrbmRzX3NyY3NldFxuICAgIFxuXG4gICAgLy8gR2V0IHRoZSBzZXQgb2YgaW1hZ2VzIGZyb20gdGhlIDxub3NjcmlwdD4gY2hpbGQgbm9kZSdzIGRhdGEgYXR0cmlidXRlXG4gICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGVsLmNoaWxkcmVuWzBdLmRhdGFzZXQuanNvbilcbiAgICAvLyBkYXRhLnNldCwgZGF0YS5hbHQsIGRhdGEuZm9jdXNcbiAgICBcbiAgICBcbiAgICAvLyBDcmVhdGUgZG9tIGVsZW1lbnRzIGZvciBiYWNrZ3JvdW5kLCBhbmQgaW1nXG4gICAgbGV0IGJhY2tncm91bmRfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBiYWNrZ3JvdW5kX2VsLmNsYXNzTmFtZSA9ICdTcmNzZXRfX2JhY2tncm91bmQnXG4gICAgXG4gICAgbGV0IGltZ19lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpICAgIFxuICAgIGltZ19lbC5jbGFzc05hbWUgPSAnU3Jjc2V0X19pbWcnXG4gICAgaW1nX2VsLmFsdCA9IGRhdGEuYWx0IHx8ICcnXG4gICAgXG4gICAgZWwuYXBwZW5kQ2hpbGQoYmFja2dyb3VuZF9lbClcbiAgICBlbC5hcHBlbmRDaGlsZChpbWdfZWwpXG4gICAgXG4gICAgXG4gICAgbGV0IHVwZGF0ZUltYWdlU3JjRm9yRWxXaWR0aCA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVsKVxuICAgICAgXG4gICAgICAvLyBEb24ndCByZXF1ZXN0IGltYWdlIGlmIGVsZW1lbnQgaGFzIDAgd2lkdGhcbiAgICAgIGlmICggZWwub2Zmc2V0V2lkdGggPT09IDAgKVxuICAgICAgICByZXR1cm5cbiAgICAgIFxuICAgICAgLy8gU2VsZWN0IHRoZSBtb3N0IGFwcHJvcHJpYXRlIGltYWdlIHRvIGxvYWQgZnJvbSB0aGUgbGlzdFxuICAgICAgbGV0IHVyaSA9IGNsb3Nlc3RLZXkoZGF0YS5zZXQsIGVsLm9mZnNldFdpZHRoKVxuICAgICAgXG4gICAgICAvLyBXaGVuIGltYWdlIGxvYWRlZC4uLlxuICAgICAgaW1hZ2VMb2FkZWQodXJpLCAoKSA9PiB7XG4gICAgICAgIGlmIChlbC5jbGFzc05hbWUuaW5kZXhPZignaXMtbG9hZGVkJykgPT09IC0xKSB7XG4gICAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lICsgJyBpcy1sb2FkZWQnXG4gICAgICAgIH1cbiAgICAgICAgLy8gT25seSB3cml0ZSB0byBET00gaWYgc3JjIHRvIGNoYW5nZVxuICAgICAgICBpZiAoaW1nX2VsLnNyYyAhPT0gdXJpKSB7XG4gICAgICAgICAgYmFja2dyb3VuZF9lbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcgKyB1cmkgKyAnKSc7XG4gICAgICAgICAgaW1nX2VsLnNyYyA9IHVyaVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBcblxuICAgIHVwZGF0ZUltYWdlU3JjRm9yRWxXaWR0aCgpXG4gICAgd2luZG93Lm9ucmVzaXplID0gZGVib3VuY2UodXBkYXRlSW1hZ2VTcmNGb3JFbFdpZHRoLCAxMDApICAgIFxuICB9KSAvLyBmb3JFYWNoXG59XG5cblxuXG4vKlxuLy8gT2xkIG1ldGhvZCBmb3IgcGFyc2luZyBzdHJpbmcuXG4vLyBXZSBub3cgdXNlIGpzb24gaW4gYSBkYXRhIGF0dHJpYnV0ZSBpbnN0ZWFkXG5cbmxldCBwYXJzZVVyaVN0cmluZyA9IHVyaV9zdHJpbmcgPT4ge1xuICAvLyBlLmcuLCBwaWMuanBnLCBwaWMyLmpwZyA0ODAsIHBpYzMuanBnIDcyMFxuICBcbiAgaWYgKCAhIHVyaV9zdHJpbmcgKVxuICAgIGNvbnNvbGUubG9nKCdObyB1cmkgc3RyaW5nIGZvciBTcmNzZXQgZWxlbWVudCcpXG5cbiAgbGV0IHNldHMgPSB7fVxuICB1cmlfc3RyaW5nLnNwbGl0KCcsICcpLmZvckVhY2goc2V0ID0+IHtcbiAgICAvLyBlLmcuLCBwaWMuanBnIDMyMFxuICAgIGxldCBhcnIgPSBzZXQuc3BsaXQoJyAnKVxuICAgIGlmIChhcnIubGVuZ3RoID09PSAxKVxuICAgICAgLy8gaWYgbm8gd2lkdGggc3BlY2NlZCwgYXNzdW1lIHdlIGhhdmUgYW4gaW1nIHVyaSBhbmQgbm8gd2lkdGhcbiAgICAgIHNldHNbMF0gPSBhcnJbMF1cbiAgICBlbHNlXG4gICAgICBzZXRzW2FyclsxXSAqIDFdID0gYXJyWzBdXG4gIH0pXG4gIFxuICByZXR1cm4gc2V0c1xufVxuKi9cbiIsIi8vIEltYWdlIGxvYWRlZCBldmVudCBoYW5kZXJcblxubW9kdWxlLmV4cG9ydHMgPSAoc3JjLCBjYWxsYmFjaykgPT4ge1xuICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKVxuICBcbiAgaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xuICAgIGNhbGxiYWNrKHNyYylcbiAgICAvLyBAVE9ETyBkZXN0b3kgaW1hZ2UgcGVyaGFwcz8gQW55IHBlcmYgYmVuZWZpdD9cbiAgfVxuICBcbiAgaW1hZ2Uub25lcnJvciA9ICgpID0+IHtcbiAgICBsZXQgbXNnID0gJ0NvdWxkIG5vdCBsb2FkIGltYWdlIHNyYyAnICsgc3JjXG4gICAgY2FsbGJhY2sobmV3IEVycm9yKG1zZykpXG4gIH1cbiAgXG4gIGltYWdlLnNyYyA9IHNyY1xufVxuIl19
