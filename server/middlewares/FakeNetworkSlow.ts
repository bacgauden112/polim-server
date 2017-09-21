export = (ops) => {
    if (!ops.timeout) {
        ops.timeout = 1000;
    }

    return function(req, res, next) {
        //simply wait for timeout to call next
        setTimeout(()=> {
            next();
        }, ops.timeout);
    }
}