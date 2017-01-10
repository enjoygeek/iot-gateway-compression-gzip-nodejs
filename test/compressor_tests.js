
(function () {
    'use strict';
    require('mocha-jshint')({
        pretty: true
    });
    require('mocha-sinon');

    var sinonChai = require("sinon-chai");
    var sinon = require('sinon');
    var chai = require('chai');
    chai.use(sinonChai);

    var expect = chai.expect;

    var compressor = require('../compressor');

    var runCompressor = (message) => {
        return new Promise((resolve) => {
            compressor.receive(message);
            setTimeout(() => {
                resolve();
            }, 500);
        });
    };

    describe('calling compressor.destroy', function () {

        before(function (done) {
            sinon.spy(console, 'log');
            done();
        });

        after(function (done) {
            console.log.restore();
            done();
        });

        it('should log module destruction.', function (done) {
            compressor.destroy();
            expect(console.log.calledOnce).to.be.true;
            expect(console.log.calledWith('compressor.destroy')).to.be.true;
            done();
        });

    });

    describe('calling compressor.receive with a simple string', () => {

        var messageBroker = { publish: sinon.spy() };
        
        before((done) => {
            sinon.spy(console, 'log');
            done();
        });

        beforeEach((done) => {
            compressor.create(messageBroker, null);
            done();
        });

        after((done) => {
            console.log.restore();
            done();
        });

        afterEach((done) => {
            console.log.reset();
            messageBroker.publish.reset();
            done();
        });

        it('should call messageBus.publish once.', () => {
            var message = { content: "this is a message." };
            return runCompressor(message)
                .then(() => {
                    expect(messageBroker.publish.calledOnce).to.be.true;
                });
        });

        it('should publish expected array to message bus.', () => {

            var message = { content: "this is a message." };
            var array = new Uint8Array([ 72,52,115,73,65,65,65,65,65,65,65,65,67,121,
                                        118,74,121,67,120,87,65,75,74,69,104,100,122,
                                        85,52,117,76,69,57,70,81,57,65,80,110,83,85,
                                        85,85,83,65,65,65,65 ]);
            var expected = { content: array };

            return runCompressor(message)
                .then(() => {
                    // compare object structure.
                    expect(messageBroker.publish.calledWithMatch(sinon.match(expected)));
                    // compare array contents.
                    expect(messageBroker.publish.args[0][0].content).to.deep.equal(array);
                });
        });

        it('should call mesasgeBroker.publish once.', () => {
            var message = { content: "this is a message." };
            return runCompressor(message)
                .then(() => {
                    expect(messageBroker.publish.calledOnce).to.be.true;
                });
        });

        it('should not error.', () => {
            var message = { content: "this is a message." };
            return runCompressor(message)
                .then(() => {
                    expect(messageBroker.publish).to.not.throw;
                });
        });

        it('should throw.', function (done) {
            var message = { content: "" };
            // set a publish stub that will throw.
            compressor.create({ publish: sinon.stub().throws() }, null);
            runCompressor(message)
                .then(() => {
                    expect(messageBroker.publish).to.throw(new Error('Error running gzip compression for data blob: %s', message));
                });
            done();
        });
    });

} ());
