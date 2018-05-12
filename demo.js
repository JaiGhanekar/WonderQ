var WonderQ  = require("./wonderq");
let wonderq = new WonderQ();
let consumer = "1";
let consumer2 = "2";
let producer = "1";
let producer2 = "2";
wonderq.addProducer(producer);
console.log('Producer 1 added');
console.log(wonderq.status);
console.log('\n');
console.log('\n');
wonderq.addProducer(producer2);
console.log('Producer 2 added');
console.log(wonderq.status);
console.log('\n');
console.log('\n');
wonderq.addConsumer(consumer);
console.log('Consumer 1 added');
console.log(wonderq.status);
console.log('\n');
console.log('\n');
wonderq.addConsumer(consumer2);
console.log('Consumer 2 added');
console.log(wonderq.status);
console.log('\n');
console.log('\n');
let msg = wonderq.createMessage(producer, 'my first message').result;
console.log('Message added from producer 1');
console.log('MessageId ' + msg);
console.log(wonderq.status);
console.log('\n');
console.log('\n');

let first = wonderq.messages(consumer).result;
console.log('Consumer1 got the following messages');
console.log(first);
console.log(wonderq.status);
console.log('\n');
console.log('\n');

let msg2 = wonderq.createMessage(producer2, 'my second message').result;
console.log('Message added from producer 2');
console.log('MessageId ' + msg2);
console.log(wonderq.status);
console.log('\n');
console.log('\n');
let second = wonderq.messages(consumer2).result;
console.log('Consumer2 got the following messages');
console.log(second);
console.log(wonderq.status);
console.log('\n');
console.log('\n');
setTimeout(() => {
    console.log('Consumer2 does not acknowledge message');
    console.log(wonderq.status);
    let msg3 = wonderq.createMessage(producer, 'my third message').result;
    console.log('Message added from producer 1');
    console.log('MessageId ' + msg3);
    console.log(wonderq.status);
    console.log('\n');
    console.log('\n');
    let third = wonderq.messages(consumer).result;
    console.log('Consumer1 got the following messages');
    console.log(third);
    console.log(wonderq.status);
    console.log('\n');
    console.log('\n');
}, 3000);
console.log('Consumer1 acknowledged the message');
console.log(wonderq.acknowledge(consumer, first[0].id));
console.log(wonderq.status);
console.log('\n');
console.log('\n');










