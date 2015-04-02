'use strict';

var uniqs = require('uniqs');
var postcss = require('postcss');
var flatten = require('flatten');
var comma = postcss.list.comma;

module.exports = postcss.plugin('postcss-discard-font-face', function () {
    return function (css) {
        var cache = [];
        // Cache all font-family declarations
        css.eachRule(function (rule) {
            rule.eachInside(function (decl) {
                if (/font(|-family)/.test(decl.prop)) {
                    cache.push(comma(decl.value));
                }
            });
        });
        cache = uniqs(flatten(cache));
        css.eachAtRule('font-face', function (rule) {
            var fontFamilies = rule.nodes.filter(function (node) {
                return node.prop === 'font-family';
            });
            // Discard the @font-face if it has no font-family
            if (!fontFamilies.length) {
                return rule.removeSelf();
            }
            fontFamilies.forEach(function (family) {
                var hasFont = comma(family.value).some(function (font) {
                    return cache.some(function (c) {
                        return ~c.indexOf(font);
                    });
                });
                if (!hasFont) {
                    rule.removeSelf();
                }
            });
        });
    };
});
