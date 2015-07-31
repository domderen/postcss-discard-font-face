'use strict';

var postcss = require('postcss');
var bmatch = require('balanced-match');
var comma = postcss.list.comma;

function noop () {};

function trimQuotes (str) {
    var first = str[0];
    if (first === '"' || first === '\'') {
        str = str.slice(1, -1);
    }

    return str;
}

function getSrcFilter (filter) {
    return filter.length ? function (url) {
        var index;

        // Trim ? and # tails
        index = url.lastIndexOf('#');
        if (~index) {
            url = url.slice(0, index);
        }

        index = url.lastIndexOf('?');
        if (~index) {
            url = url.slice(0, index);
        }

        // Check extension
        return !!~filter.indexOf(url.split('.').pop());
    } : noop;
}

function filterArray (array, fn) {
    var i, max, result;
    var filtered = [];

    for (i = 0, max = array.length; i < max; i += 1) {
        result = fn(array[i]);

        if (result !== false) {
            if (typeof result === 'string') {
                filtered.push(result);
            } else {
                filtered.push(array[i]);
            }
        }
    }

    return filtered;
}

function transformDecl (filter) {
    return function (node) {
        var result = filterArray(comma(node.value), function (item) {
            var url, format, index, post, result, quote;

            index = item.lastIndexOf('url(');
            if (~index) {
                url = bmatch('(', ')', item.slice(index));
                if (url) {
                    post = url.post;
                    result = url.body[0];
                    quote = result === '\'' || result === '"' ? result : '';
                    url = trimQuotes(url.body);
                    index = post.indexOf('format(');
                    if (~index) {
                        format = bmatch('(', ')', post);
                        format = format ? trimQuotes(format.body) : null;
                    }

                    result = filter(url, format);

                    if (typeof result === 'string') {
                        result = 'url(' + quote + result + quote + ')' + post;
                    }

                    return result;
                }
            }
        }).join(', ');

        if (result) {
            node.value = result;
        } else {
            node.removeSelf();
        }
    };
}

function transformRule (srcFilter, fontFilter) {
    return function (rule) {
        var font;
        var family;
        var weight;
        var style;

        rule.eachDecl(function (decl) {
            var prop = decl.prop;
            var value = decl.value;

            if (prop === 'font-family') {
                family = trimQuotes(value);
            } else if (prop === 'font-weight') {
                weight = parseInt(value, 10);
                weight = isNaN(weight) ? value : weight;
            } else if (prop === 'font-style') {
                style = value;
            }
        });

        font = fontFilter[family];

        if (font) {
            if (weight && !~font.weight.indexOf(weight) ||
                style && !~font.style.indexOf(style)) {
                return rule.removeSelf();
            }
        }

        rule.eachDecl('src', transformDecl(srcFilter));
    };
}

module.exports = postcss.plugin('postcss-discard-font-face', function (filter) {
    var srcFilter;
    var fontFilter;

    if (Array.isArray(filter) || typeof filter === 'function') {
        srcFilter = filter;
    } else if (typeof filter === 'object') {
        srcFilter = filter.src;
        fontFilter = filter.font;
    }

    if (typeof srcFilter === 'function') {
        srcFilter = srcFilter;
    } else if (Array.isArray(srcFilter)) {
        srcFilter = getSrcFilter(srcFilter);
    } else {
        srcFilter = noop;
    }

    if (typeof fontFilter !== 'object') {
        fontFilter = {};
    }

    return function (css) {
        css.eachAtRule('font-face', transformRule(srcFilter, fontFilter));
    };
});
