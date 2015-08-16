'use strict';
/* jshint jasmine: true */
/* globals Uloader */

describe('uloader', function() {
	var loader;

	beforeEach(function() {
		loader = new Uloader();
	});

	describe('::strategy', function() {
		it('should have a table of registered load strategies', function() {
			expect(typeof Uloader.strategy).toBe('object');
			expect(typeof Uloader.strategy.ajax).toBe('function');
		});
	});

	describe('@strategy', function() {
		it('should hold the default load strategy', function() {
			expect(loader.strategy).toBe('ajax');
		});
	});

	describe('#load()', function() {
		it('should load a file using the global load strategy', function() {
			spyOn(Uloader.strategy, 'ajax');
			loader.load('file.css');
			expect(Uloader.strategy.ajax).toHaveBeenCalledWith('file.css');
		});
	});
});