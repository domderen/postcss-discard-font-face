'use strict';

var postcss = require('postcss');
var bmatch = require('balanced-match');
var comma = postcss.list.comma;

function trimQuotes(str) {
    var first = str[0];
    if (first === '"' || first === '\'') {
        return str.slice(1, -1);
    }
}

function getFilter(filter) {
    if (typeof filter === 'function') {
        return filter;
    } else if (Array.isArray(filter) && filter.length) {
        return function (url) {
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
        };
    } else {
        return function () {};
    }
}

function filterArray(array, fn) {
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

module.exports = postcss.plugin('postcss-discard-font-face', function (filter) {
    filter = getFilter(filter);

    return function (css) {
        css.eachAtRule('font-face', function (rule) {
            rule.eachDecl('src', function (node) {
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
            });
        });
    };
});
