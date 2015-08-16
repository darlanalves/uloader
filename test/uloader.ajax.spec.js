'use strict';
/* jshint jasmine: true */
/* globals Uloader */

describe('Ajax strategy', function() {
	it('should load a JS file via AJAX and run it after loading', function(done) {
		var loader = new Uloader();

		var error = jasmine.createSpy('error');
		var success = jasmine.createSpy('success');

		loader.load('base/fixture/file.js', 'ajax').then(success, error);

		// Promises are async
		setTimeout(function() {
			expect(success).toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
			expect(typeof window.DummyClass).toBe('function');
			done();
		}, 10);
	});

	it('should load a list of JS files via AJAX and run them in the right sequence after loading', function(done) {
		var loader = new Uloader();

		var error = jasmine.createSpy('error');
		var success = jasmine.createSpy('success');

		var files = [
			'base/fixture/file.js',
			'base/fixture/other.js'
		];

		loader.load(files, 'ajax').then(success, error);

		// Promises are async
		setTimeout(function() {
			expect(success).toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
			expect(typeof window.DummyClass).toBe('function');
			expect(window.dummyInstance instanceof window.DummyClass).toBe(true);

			done();
		}, 10);
	});

	it('should load a CSS file via AJAX and run it after loading', function(done) {
		var loader = new Uloader();

		var error = jasmine.createSpy('error');
		var success = jasmine.createSpy('success');

		loader.load('base/fixture/file.css', 'ajax').then(success, error);

		// Promises are async
		setTimeout(function() {
			expect(success).toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
			var cssValue = parseInt(getComputedStyle(document.body).getPropertyValue('zoom'));
			expect(cssValue).toBe(2);
			done();
		}, 10);
	});

	it('should load a list of CSS files via AJAX and run them after loading', function(done) {
		var loader = new Uloader();

		var error = jasmine.createSpy('error');
		var success = jasmine.createSpy('success');

		var files = [
			'base/fixture/file.css',
			'base/fixture/other.css'
		];

		loader.load(files, 'ajax').then(success, error);

		// Promises are async
		setTimeout(function() {
			expect(success).toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
			var computedSyles = getComputedStyle(document.body);

			var zoom = parseInt(computedSyles.getPropertyValue('zoom'));
			var zIndex = parseInt(computedSyles.getPropertyValue('z-index'));

			expect(zoom).toBe(2);
			expect(zIndex).toBe(100);

			done();
		}, 10);
	});

	it('should load mixed JS and CSS files via AJAX and run them after loading', function(done) {
		var loader = new Uloader();

		var error = jasmine.createSpy('error');
		var success = jasmine.createSpy('success');

		var files = [
			'base/fixture/file.js',
			'base/fixture/file.css'
		];

		loader.load(files, 'ajax').then(success, error);

		// Promises are async
		setTimeout(function() {
			expect(success).toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
			expect(typeof window.DummyClass).toBe('function');

			expect(success).toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
			var cssValue = parseInt(getComputedStyle(document.body).getPropertyValue('zoom'));
			expect(cssValue).toBe(2);

			done();
		}, 10);
	});
});
