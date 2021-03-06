require('rootpath')();

var expect = require('chai').expect;
var sinon = require('sinon');

var Dispatcher = require('src/Dispatcher');

describe('Dispatcher.dispatch', function() {
	var next = function(payload, next) {
		next();
	};

	it('with dependencies', function() {
		var spy1 = sinon.spy(next);
		var spy2 = sinon.spy(next);
		var spy3 = sinon.spy(next);

		var dispatcher = new Dispatcher();

		var token1 = dispatcher.register('action1', [], spy1);
		var token2 = dispatcher.register('action1', [], spy2);
		dispatcher.register('action1', [token1, token2], spy3);

		dispatcher.dispatch('action1', {});

		expect(spy1.callCount).to.equal(1);
		expect(spy2.callCount).to.equal(1);
		expect(spy3.callCount).to.equal(1);

		expect(spy3.calledAfter(spy2)).to.be.true;
		expect(spy3.calledAfter(spy1)).to.be.true;
	});

	it('with no registered actions', function(done) {
		var onComplete = function() {
			done();
		};

		var dispatcher = new Dispatcher();
		dispatcher.dispatch('action', {}, onComplete);
	});

	it('with no registered actions and no callback', function() {
		var dispatcher = new Dispatcher();

		// Missing onComplete here
		dispatcher.dispatch('action', {});
	});

});