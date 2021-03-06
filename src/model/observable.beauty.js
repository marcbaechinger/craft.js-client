(function(a) {
    var b = function() {
        return this.observerMap = {}, this;
    };
    b.prototype.unbind = function(a, b) {
        var c = this.observerMap[a], d;
        if (c) for (d = 0; d < c.length; d += 1) if (c[d] === b) {
            c.splice(d, 1);
            break;
        }
    }, b.prototype.bind = function(a, b) {
        this.observerMap[a] || (this.observerMap[a] = []), this.observerMap[a].unshift(b);
    }, b.prototype.emit = function(a) {
        var b, c = Array.prototype.slice.call(arguments, 1);
        if (this.observerMap[a]) for (b = 0; b < this.observerMap[a].length; b += 1) this.observerMap[a][b].apply(this, c);
    }, a.Observable = b;
})(model);