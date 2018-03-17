const fQueue = (function () {

    const qnb = function () {
        const dfd = new jQuery.Deferred();
        const funcs = Array.prototype.slice.call(arguments, 0);

        function worker() {
            if (funcs.length > 0) {
                const f = funcs.shift();
                f.func.apply(f, f.args).done(function () {
                    if (f.done)
                        f.done.call(f.args);
                    setTimeout(worker, 1);
                }).fail(function () {
                    dfd.reject.call(f.args);
                });
            } else
                dfd.resolve();
        };
        worker();
        return dfd.promise();
    };
    return {
        Func: function (func, args, done) {
            return {func: func, done: done, args: args};
        },
        Queue: qnb,
    };
})();

(function dfdQueue() {

    let q;
    const tasks = [],
        remain = 0;
    let await = null;   // callback

    const pushImpl = function (dfd) {
        remain++;
        dfd.done()
    };

    return q = {
        push: function (dfd) {
            pushImpl(dfd);
        },

        awaitAll: function (f) {
            await = f;
        }
    };

})();
