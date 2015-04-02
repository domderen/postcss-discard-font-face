var test = require('tape');
var postcss = require('postcss');
var plugin = require('./');
var name = require('./package.json').name;

var tests = [{
    message: 'should remove unused fonts',
    fixture: '@font-face {font-family:"Does Not Exist";src:url("fonts/does-not-exist.ttf") format("truetype")}',
    expected: ''
}, {
    message: 'should remove unused fonts (2)',
    fixture: '@font-face {font-family:"Does Not Exist";src:url("fonts/does-not-exist.ttf") format("truetype")}@font-face {font-family:"Does Exist";src: url("fonts/does-exist.ttf") format("truetype")}',
    expected: ''
}, {
    message: 'should remove unused fonts & keep used fonts',
    fixture: '@font-face {font-family:"Does Not Exist";src:url("fonts/does-not-exist.ttf") format("truetype")}@font-face {font-family:"Does Exist";src: url("fonts/does-exist.ttf") format("truetype")}body{font-family:"Does Exist",Helvetica,Arial,sans-serif}',
    expected: '@font-face {font-family:"Does Exist";src: url("fonts/does-exist.ttf") format("truetype")}body{font-family:"Does Exist",Helvetica,Arial,sans-serif}',
}, {
    message: 'should work with the font shorthand',
    fixture: '@font-face {font-family:"Does Exist";src: url("fonts/does-exist.ttf") format("truetype")}body{font: 10px/1.5 "Does Exist",Helvetica,Arial,sans-serif}',
    expected: '@font-face {font-family:"Does Exist";src: url("fonts/does-exist.ttf") format("truetype")}body{font: 10px/1.5 "Does Exist",Helvetica,Arial,sans-serif}'
}, {
    message: 'should not be responsible for normalising fonts',
    fixture: '@font-face {font-family:"Does Exist";src:url("fonts/does-exist.ttf") format("truetype")}body{font-family:Does Exist}',
    expected: 'body{font-family:Does Exist}'
}, {
    message: 'should remove font faces if they have no font-family property',
    fixture: '@font-face {src:url("fonts/does-not-exist.ttf") format("truetype")}',
    expected: ''
}, {
    message: 'should pass through if it doesn\'t find a font family',
    fixture: 'h1{font-weight:bold;color:blue}',
    expected: 'h1{font-weight:bold;color:blue}'
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
