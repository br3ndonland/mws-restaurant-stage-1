/*
LazyLoad (vanilla-lazyload)
https://www.andreaverlicchi.eu/lazyload/
Conditional load: The best thing you can do for runtime performance is to conditionally load
the appropriate version of LazyLoad depending on browser support of IntersectionObserver.
 */
(function (w, d) {
  var b = d.getElementsByTagName('body')[0]
  var s = d.createElement('script')
  var v = !('IntersectionObserver' in w) ? '8.15.0' : '10.17.0'
  s.async = true
  s.src = `https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/${v}/lazyload.min.js`
  w.lazyLoadOptions = {/* Your options here */}
  b.appendChild(s)
}(window, document))
