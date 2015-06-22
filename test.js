var test = require('tape');
var postcss = require('postcss');
var plugin = require('./');
var name = require('./package.json').name;

var tests = [{
    message: 'should filter sources with function',
    options: function (url) {
        var ext = url.split('#')[0].split('?')[0].split('.').pop();

        if(ext !== 'ttf' && ext !== 'svg') {
            return false;
        }
    },
    fixture: '@font-face { src: url("webfont.eot"); src: url("webfont.eot?#iefix") format("embedded-opentype"), url("webfont.woff2") format("woff2"), url("webfont.woff") format("woff"), url("webfont.ttf") format("truetype"), url("webfont.svg#svgFontName") format("svg"); }',
    expected: '@font-face { src: url("webfont.ttf") format("truetype"), url("webfont.svg#svgFontName") format("svg"); }'
}, {
    message: 'should replace return by function url',
    options: function (url) {
        return '../fonts/' + url;
    },
    fixture: '@font-face { src: url("webfont.eot"); src: url("webfont.eot?#iefix") format("embedded-opentype"), url("webfont.woff2") format("woff2"), url("webfont.woff") format("woff"), url("webfont.ttf") format("truetype"), url("webfont.svg#svgFontName") format("svg"); }',
    expected: '@font-face { src: url("../fonts/webfont.eot"); src: url("../fonts/webfont.eot?#iefix") format("embedded-opentype"), url("../fonts/webfont.woff2") format("woff2"), url("../fonts/webfont.woff") format("woff"), url("../fonts/webfont.ttf") format("truetype"), url("../fonts/webfont.svg#svgFontName") format("svg"); }'
}, {
    message: 'should not filter sources with function that return undefined',
    options: function (url) {},
    fixture: '@font-face { src: url("webfont.eot"); src: url("webfont.eot?#iefix") format("embedded-opentype"), url("webfont.woff2") format("woff2"), url("webfont.woff") format("woff"), url("webfont.ttf") format("truetype"), url("webfont.svg#svgFontName") format("svg"); }',
    expected: '@font-face { src: url("webfont.eot"); src: url("webfont.eot?#iefix") format("embedded-opentype"), url("webfont.woff2") format("woff2"), url("webfont.woff") format("woff"), url("webfont.ttf") format("truetype"), url("webfont.svg#svgFontName") format("svg"); }'
}, {
    message: 'should filter sources with [ttf, svg] array',
    options: ['ttf', 'svg'],
    fixture: '@font-face { src: url("webfont.eot"); src: url("webfont.eot?#iefix") format("embedded-opentype"), url("webfont.woff2") format("woff2"), url("webfont.woff") format("woff"), url("webfont.ttf") format("truetype"), url("webfont.svg#svgFontName") format("svg"); }',
    expected: '@font-face { src: url("webfont.ttf") format("truetype"), url("webfont.svg#svgFontName") format("svg"); }'
}, {
    message: 'should correctly works with function argument without quotes',
    options: ['ttf', 'svg'],
    fixture: '@font-face { src: url(webfont.eot); src: url(webfont.eot?#iefix) format(embedded-opentype), url(webfont.woff2) format(woff2), url(webfont.woff) format(woff), url(webfont.ttf) format(truetype), url(webfont.svg#svgFontName) format(svg); }',
    expected: '@font-face { src: url(webfont.ttf) format(truetype), url(webfont.svg#svgFontName) format(svg); }'
}, {
    message: 'should not filter sources with empty array',
    options: [],
    fixture: '@font-face { src: url("webfont.eot"); src: url("webfont.eot?#iefix") format("embedded-opentype"), url("webfont.woff2") format("woff2"), url("webfont.woff") format("woff"), url("webfont.ttf") format("truetype"), url("webfont.svg#svgFontName") format("svg"); }',
    expected: '@font-face { src: url("webfont.eot"); src: url("webfont.eot?#iefix") format("embedded-opentype"), url("webfont.woff2") format("woff2"), url("webfont.woff") format("woff"), url("webfont.ttf") format("truetype"), url("webfont.svg#svgFontName") format("svg"); }'
}];

function process (css, options) {
    return postcss(plugin(options)).process(css).css;
}

test(name, function (t) {
    t.plan(tests.length);

    tests.forEach(function (test) {
        var options = test.options || {};
        t.equal(process(test.fixture, options), test.expected, test.message);
    });
});

test('should use the postcss plugin api', function (t) {
    t.plan(2);
    t.ok(plugin().postcssVersion, 'should be able to access version');
    t.equal(plugin().postcssPlugin, name, 'should be able to access name');
});
