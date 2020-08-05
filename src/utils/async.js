export const deferredPromise = function deferredPromise(timeOut=5000) {
    // adapted to add timeOut from:
    // https://lea.verou.me/2016/12/resolve-promises-externally-with-this-one-weird-trick/
	let res, rej;

	let promise = new Promise((resolve, reject) => {
		res = resolve;
		rej = reject;
	});

	promise.resolve = res;
	promise.reject = rej;

    setTimeout( () => promise.reject(`timeOut after ${timeOut/1000} seconds.`), timeOut );

	return promise;
}