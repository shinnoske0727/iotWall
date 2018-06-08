import qs from 'querystring'

module.exports = {
    // shareの記述を簡潔化
    twitter: function(opts = {}) {
        return `https://twitter.com/intent/tweet?${qs.stringify(opts)}`
    },
    facebook: function(opts = {}) {
        return `http://www.facebook.com/sharer/sharer.php?${qs.stringify(opts)}`
    },
    line: function(opts = {}) {
        return `http://line.me/R/msg/text/?${encodeURIComponent(
            [opts.text || '', opts.url || ''].join(' ')
        )}`
    }
}
