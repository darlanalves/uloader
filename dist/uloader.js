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
(function(global) {
	'use strict';

	var JS_RE = /\.js$/i;
	var CSS_RE = /\.css$/i;

	function load(URL) {
		var file = URL.split('?')[0];

		if (JS_RE.test(file)) {
			return fetchUrl(URL).then(runScript, runScript);
		}

		if (CSS_RE.test(file)) {
			return fetchUrl(URL).then(addStylesheet, addStylesheet);
		}
	}

	function loadAll(list) {
		var scripts = [],
			styles = [];

		list.forEach(function(url) {
			var f = url.split('?')[0];

			if (JS_RE.test(f)) {
				scripts.push(url);
				return;
			}

			if (CSS_RE.test(f)) {
				styles.push(url);
			}
		});

		var queue = [];

		if (scripts.length) {
			scripts = scripts.map(fetchUrl);
			scripts = Promise.all(scripts).then(runScriptList);
			queue.push(scripts);
		}

		if (styles.length) {
			styles = styles.map(fetchUrl);
			styles = Promise.all(styles).then(runStyleList);
			queue.push(styles);
		}

		return new Promise(function (resolve, reject) {
			Promise.all(queue).then(function (scripts, styles) {
				resolve(scripts.concat(styles));
			}, reject);
		});
	}

	function runScript(script) {
		return new Promise(function(resolve, reject) {
			if (script.success) {
				var node = document.createElement('script');
				script.type = 'text/javascript';
				node.setAttribute('rel', script.URL);
				node.text = script.text;
				getHeadTag().appendChild(node);
				resolve(script);
			} else {
				reject(new Error('Failed to load ' + script.URL + ' (' + script.error + ')'));
			}
		});
	}

	function addStylesheet(style) {
		return new Promise(function(resolve, reject) {
			if (style.success) {
				var node = document.createElement('style');
				node.setAttribute('rel', style.URL);
				node.innerText = style.text;
				getHeadTag().appendChild(node);
				resolve(style);
			} else {
				reject(new Error('Failed to load ' + style.URL + ' (' + style.error + ')'));
			}
		});
	}

	function runScriptList (list) {
		list.forEach(runScript);
	}

	function runStyleList (list) {
		list.forEach(addStylesheet);
	}

	var $$head;
	function getHeadTag() {
		if (!$$head) {
			$$head = document.getElementsByTagName('head')[0];
		}

		return $$head;
	}

	function fetchUrl(url, handler) {
		var promise = new Promise(function(resolve, reject) {
			var req = new XMLHttpRequest();
			req.open('GET', url);

			req.onload = function() {
				if (req.status == 200) {
					resolve(req.response);
				} else {
					reject(new Error(req.statusText));
				}
			};

			req.onerror = function() {
				reject(new Error('Network Error'));
			};

			req.send();
		});

		return promise.then(function(text) {
			return {
				success: true,
				text: text,
				URL: url
			};
		}, function(reason) {
			return Promise.reject({
				success: false,
				error: reason,
				URL: url
			});
		}).then(handler, handler);
	}

	global.Uloader.strategy.ajax = function(src) {
		if (Array.isArray(src)) {
			return loadAll(src);
		} else {
			return load(src);
		}
	};

})(this);
