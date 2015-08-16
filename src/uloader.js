(function(global) {
	'use strict';

	var loadFn = function load(file, strategy) {
		strategy = strategy || this.strategy;
		var loader = Uloader.strategy[strategy];

		if (!loader) {
			throw new TypeError('Load strategy ' + strategy + ' is invalid');
		}

		return new Promise(function(resolve, reject) {
			try {
				loader(file).then(function(result) {
					resolve(result);
				}, function (error) {
					reject(error);
				});
			} catch (e) {
				reject(e);
			}
		});
	};

	function Uloader() {
		this.strategy = 'ajax';
	}

	Uloader.strategy = {};
	Uloader.prototype = {
		constructor: Uloader,
		load: loadFn
	};

	global.Uloader = Uloader;
})(this);
