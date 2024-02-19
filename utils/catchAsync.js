//function to handle try and catch errors
function handleAsyncErr(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err)
        })
    }
}
module.exports = handleAsyncErr;