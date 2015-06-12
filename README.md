# [postcss][postcss]-discard-font-face [![Build Status](https://travis-ci.org/ben-eb/postcss-discard-font-face.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/postcss-discard-font-face.svg)][npm] [![Dependency Status](https://gemnasium.com/ben-eb/postcss-discard-font-face.svg)][deps]

> Discard font faces by type, with PostCSS.

## Install

With [npm](https://npmjs.org/package/postcss-discard-font-face) do:

```
npm install postcss-discard-font-face --save
```

## Example

When discarding TTF fonts:

### Input

```css
@font-face {
    src: url("webfont.ttf") format("truetype"),
         url("webfont.svg#svgFontName") format("svg");
}
```

### Output

```css
@font-face {
    src: url("webfont.svg#svgFontName") format("svg");
}
```

## API

### discardFonts([filter])

#### filter

Type: `function|array`
Return: `boolean|string`
Arguments: The function is passed the URL of the font as the first argument,
and the format as the second.

For each font, return false to remove, or a new string if you would like to
transform the URL.

```js
// Remove fonts of an unknown type

discardFonts(function (url, format) {
    if (~url.indexOf('.exe')) {
        return false;
    }
});
```

Alternately, you can whitelist an array of types:

```js
discardFonts(['ttf', 'svg']);
```

With this setting, all extensions that do not match will be removed.

## Usage

See the [PostCSS documentation](https://github.com/postcss/postcss#usage) for
examples for your environment.

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.

## License

MIT © Ben Briggs

[ci]:      https://travis-ci.org/ben-eb/postcss-discard-font-face
[deps]:    https://gemnasium.com/ben-eb/postcss-discard-font-face
[npm]:     http://badge.fury.io/js/postcss-discard-font-face
[postcss]: https://github.com/postcss/postcss
