# [postcss][postcss]-discard-font-face [![Build Status](https://travis-ci.org/ben-eb/postcss-discard-font-face.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/postcss-discard-font-face.svg)][npm] [![Dependency Status](https://gemnasium.com/ben-eb/postcss-discard-font-face.svg)][deps]

> Discard unused font faces with PostCSS.

Install via [npm](https://npmjs.org/package/postcss-discard-font-face):

```
npm install postcss-discard-font-face --save
```

## Example

```js
var postcss = require('postcss');
var fontFace = require('postcss-discard-font-face');

var css = '@font-face {font-family:Example;src:url("eg.woff") format("woff")}h1{font-family:Helvetica, sans-serif}';
console.log(postcss(fontFace()).process(css).css);

// => 'h1{font-family:Helvetica, sans-serif}'
```

This module will discard `@font-face` declarations in your CSS files when it
cannot find any rules that make use of them; or if they have no `font-family`
property to begin with.

For example, you might be loading the Bootstrap 3 framework which comes with a
whole suite of icons that you just aren't using; and now that you ran your CSS
file through [UnCSS][uncss] it stripped out all of the icon classes. This module
can then step in and remove the `@font-face` declaration for Glyphicons; now you
are no longer making an unnecessary HTTP request for an icon set that you are
not using.

Note that this plugin is not responsible for normalising font families, as it
makes the assumption that you will write your font names consistently, such that
it considers these two declarations differently:

```css
h1 {
    font-family: "Helvetica Neue"
}

h2 {
    font-family: Helvetica Neue
}
```

However, you can mitigate this by including [postcss-font-family][fontfam]
*before* this plugin, which will take care of normalising quotes, and
deduplicating. For more examples, see the [tests](test.js).

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.

## License

MIT © Ben Briggs

[ci]:      https://travis-ci.org/ben-eb/postcss-discard-font-face
[deps]:    https://gemnasium.com/ben-eb/postcss-discard-font-face
[npm]:     http://badge.fury.io/js/postcss-discard-font-face
[fontfam]: https://github.com/ben-eb/postcss-font-family
[postcss]: https://github.com/postcss/postcss
[uncss]:   https://github.com/giakki/uncss
