'use strict';
var util  = require('util');
module.exports = class WonderQ {
    constructor(producers, consumers, wait) {
        if (!arguments.length) {
            this._producers = {}; //only valid producers can produce 
            this._consumers = {};
            this._wait = 3;
        } else {
            this._producers = producers;
            this._consumers = consumers;
            this._wait = wait;
        }
        this._messages = []; //this is used as a temporary database for producers  
        this._semaphore = false; //used for message thread safety
        this._producer_semaphore = false; 
        this._consumer_semaphore = false; 
    }

    get status() {
        return util.format('Producers: %j, Consumers: %j, Messages: %j', this._producers, this._consumers, this._messages);
    }
    get producers() {
        return this._producers;
    }
    get consumers() {
        return this._consumers;
    }
    addProducer(producer) {
        while(this._producer_semaphore);
        this._producer_semaphore = true;
        let response;
        if (!this._producers[producer]) {
            this._producers[producer] = producer;
            response = {result:producer, msg:"successfully added producer"};
        } else  {
            response =  {result:producer, msg:"already added producer"};
        } 
        this._producer_semaphore = false;
        return response;
    }
    addConsumer(consumer) {
        while(this._consumer_semaphore);
        this._consumer_semaphore = true;
        let response;
        if (!this._consumers[consumer]) {
            this._consumers[consumer] = consumer;
            response = {result:consumer, msg:"successfully added consumer"};
        } else {
            response = {result:consumer, msg:"already added consumer"};
        }   
        this._consumer_semaphore = false;
        return response;
    }
    deleteProducer(producer) {
        while(this._producer_semaphore);
        this._producer_semaphore = true;
        let response;
        if (this._producers[producer]) {
            delete this._producers[producer];
            response =  {result:"success", msg:"successfully deleted producer"};
        } else  {
            response = {result:null, msg:"no producer found"};
        } 
        this._producer_semaphore = false;
        return response;
    }
    deleteConsumer(consumer) {
        while(this._consumer_semaphore);
        this._consumer_semaphore = true;
        let response;
        if (this._consumers[consumer]) {
            delete this._consumers[consumer];
            response =  {result:"success", msg:"successfully deleted consumer"};
        } else {
            response = {result:null, msg:"no consumer found"};
        }   
        this._consumer_semaphore = false;
        return response;
    }
    createMessage(producer, text) {
        if (!this._producers[producer])
        return {result:message.id, msg:"successfully created message"};;
        while(this._semaphore);
        this._semaphore = true;
        //keep a set of producers and consumers 
        let message = {
            id: Date.now(), 
            producer: producer,
            text: text
        };
        this._messages.push(message);
        this._semaphore = false;   //release the hold allowing other to write 
        return {result:message.id, msg:"successfully created message"};
    }

     //conditionally if not accessed by another consumer
    messages(consumer) {
        if (!this._consumers[consumer])
        return {result:null, msg:"add consumer first"}; //invalid consumers 
        let consumable = [];
        this._messages.forEach(message => {
            if (!message.consumer) {
                message.consumer = consumer;
                message.assigned = Date.now();
            } 
            if (message.consumer == consumer) {
                consumable.push(message);
            }
        });
        for (var message of consumable) {
            setTimeout(() => {
                this.freeMessageById(consumer, message.id);
            }, this._wait * 1000);
        }
        return {result:consumable, msg:"messages for consumer"};
    }
    messageById(consumer, id) {
        if (!this._consumers[consumer])
        return {result:null, msg:"add consumer first"}; //invalid consumers 
        let selected;
        for (var message of this._messages) {
            if (!message.consumer && id == message.id) {
                message.consumer = consumer;
                message.assigned =  Date.now();
            } 
            if (message.consumer == consumer && id == message.id) {
               selected = message;
               break;
            } 
        }
        if (selected) {
            setTimeout(() => {
                this.freeMessageById(consumer, id);
            }, this._wait * 1000);
            return {result:selected, msg:"message for consumer by id"};
        } else {
           return {result:null, msg:"message not found"};
        }
    }

    freeMessageById(consumer, id) {
        while(this._semaphore);
        this._semaphore = true;
        let response;
        let messageIndex = this._messages.map(message => message.id).indexOf(id);
        if (messageIndex >= 0) {
            if (this._messages[messageIndex].consumer == consumer) {
                delete this._messages[messageIndex].consumer;
                response = {result:this._messages[messageIndex], msg: 'successfully freed message'};
            } else {
                response = {result:null, msg: "cannot free another consumer's message"};
            }
        } else {
            response = {result: null, msg: 'message does not exist'};
        }
        this._semaphore = false;
        return response;
        
    }

    acknowledge(consumer, id) {
        while(this._semaphore);
        this._semaphore = true;
        let response;
        let remove = this._messages.map(message => message.id).indexOf(id);
        if (remove >= 0) {
            if (this._messages[remove].consumer == consumer || !this._messages[remove].consumer) {
                this._messages.splice(remove, 1);
                response = {result:'success', msg: 'successfully deleted message'};
            } else {
                response = {result:null, msg: 'can deleted message'};
            }
        } else {
            response = {result: null, msg: 'message does not exist'};
        }
        this._semaphore = false;
        return response;
    }
    updateMessageById(producer, id, text) {
        while(this._semaphore);
        this._semaphore = true;
        let response;
        let messageIndex = this._messages.map(message => message.id).indexOf(id);
        if (messageIndex >= 0) {
            if (this._messages[messageIndex].producer == producer) {
                this._messages[messageIndex].text = text;
                response = {result:this._messages[messageIndex], msg: 'successfully updated message'};
            } else {
                response = {result:'success', msg: 'cannot update  message'};
            }
        } else {
            response = {result: null, msg: 'message does not exist'};
        }
        this._semaphore = false;
        return response;
    }
}
