var WonderQ  = require("../wonderq");
var assert = require('assert').strict;
let wonderq = new WonderQ();

describe('Producers', () => {
    describe('#addProducer(producer)', () => {
        it('should add a producer to the wonderq and return the producer', () => {
            let producer = "1";
            let response = wonderq.addProducer(producer);
            assert.equal(producer, response.result);

        });
    });
    describe('#producers()', () => {
        it('should return a producer', () => {
            let producer = "1";
            wonderq.addProducer(producer);
            assert.equal(1, Object.keys(wonderq.producers).length);
        });
    }); 
    describe('#deleteProducer(producer)', () => {
        it('should delete a producer', () => {
            let producer = "1";
            wonderq.addProducer(producer);
            wonderq.deleteProducer(producer);
            assert.equal(0, Object.keys(wonderq.producers).length);
        });
    }); 
    describe('#createMessage(producer, text)', () => {
        it('should create a message and return an id', () => {
            let producer = "1";
            wonderq.addProducer(producer);
            let response = wonderq.createMessage(producer, 'my first message');
            assert.ok(response.result != null);
        });
    }); 
});
describe('Consumer', () => {
    describe('#addConsumer(consumer)', () => {
        it('should add a consumer to the wonderq and return the consumer', () => {
            let consumer = "1";
            let response = wonderq.addConsumer(consumer);
            assert.equal(consumer, response.result);

        });
    });
    describe('#consumers()', () => {
        it('should return a consumer', () => {
            let consumer = "1";
            wonderq.addConsumer(consumer);
            assert.equal(1, Object.keys(wonderq.consumers).length);
        });
    }); 
    describe('#deleteConsumer(consumer)', () => {
        it('should delete a consumer', () => {
            let consumer = "1";
            wonderq.addConsumer(consumer);
            wonderq.deleteConsumer(consumer);
            assert.equal(0, Object.keys(wonderq.consumers).length);
        });
    }); 
});
describe('Message', () => {
    describe('#messages(consumer)', () => {
        it('should send availible messages to consumer', () => {
            let consumer = "1";
            let producer = "1";
            wonderq.addProducer(producer);
            wonderq.addConsumer(consumer);
            var response = wonderq.messages(consumer);
            assert.ok(consumer == response.result[0].consumer && response.result.length == 1);
        });
    });
    describe('#acknowledge(consumer, id)', () => {
        it('should delete acknowledged messages', () => {
            let consumer = "1";
            let consumer2 = "2";
            let producer = "1";
            wonderq.addProducer(producer);
            wonderq.addConsumer(consumer);
            var response = wonderq.messages(consumer);
            response = wonderq.acknowledge(consumer, response.result[0].id);
            assert.ok(response.result == 'success');
        });
    });

    describe('#messages(consumer)', () => {
        it('should free messages to all consumers', () => {
            let consumer = "1";
            let consumer2 = "2";
            let producer = "1";
            wonderq.addProducer(producer);
            wonderq.addConsumer(consumer);
            wonderq.createMessage(producer, 'my second message');
            var response = wonderq.messages(consumer);
            setTimeout(() => {
                assert.ok(wonderq._messages[0].consumer == null);
            }, 3000);
        });
    });
    describe('#messages(consumer)', () => {
        it('should only let one consumer have a message', () => {
            let consumer = "1";
            let consumer2 = "2";
            let producer = "1";
            wonderq.addProducer(producer);
            wonderq.addConsumer(consumer);
             wonderq.addConsumer(consumer2);
            wonderq.createMessage(producer, 'my third message');
            wonderq.messages(consumer);
            let response = wonderq.messages(consumer2);
            assert.ok(response.result.length == 0);
        });
    });

});






