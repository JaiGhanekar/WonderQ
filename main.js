var WonderQ  = require("./wonderq");
let cutoff = 15;
let wonderq = new WonderQ({}, {}, cutoff);
const readline = require('readline');
console.log('Welcome to WonderQ!');
console.log(`Timeout:${cutoff}s`);
const ifstrem = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



function simulator() {
    ifstrem.question('How many Producers? ', (producers) => {
        ifstrem.question('How many Consumers? ', (consumers) => {
            for (let i = 0; i < producers; i++) {
                wonderq.addProducer(i.toString());
            }
            for (let i = 0; i < consumers; i++) {
                wonderq.addConsumer(i.toString());
            }
            console.log(wonderq.status);
            console.log('\n');
            prompt();
        });
    });
}
function prompt() {
        ifstrem.question('Commands:\ns:status\nm:message\nc:consume\na:acknowledge\nq:quit\n', (value) => {
        switch(value) {
            case 's':
                console.log(wonderq.status);
                console.log('\n');
                prompt();
                break;
            case 'm':
                ifstrem.question('producer and message in (producer,message) format:\n', (messagestr) => {
                    if (messagestr.indexOf(',') >= 0) {
                        let fragments = messagestr.split(',');
                        if (fragments.length == 2) {
                            console.log(wonderq.createMessage(fragments[0], fragments[1]));
                            console.log('\n');
                            prompt();
                        }   
                    } else {
                        console.log('incorrect format');
                        prompt();
                    }
                });
                break;
            case 'c':
                ifstrem.question('consumer id:\n', (consumerid) => {
                    console.log(wonderq.messages(consumerid));
                    console.log('\n');
                    prompt(); 
                });
                break;
            case 'a':
                ifstrem.question('consumer and messageid in (consumer,messageid) format:\n', (messagestr) => {
                    if (messagestr.indexOf(',') >= 0) {
                        let fragments = messagestr.split(',');
                        if (fragments.length == 2) {
                            console.log(wonderq.acknowledge(fragments[0], parseInt(fragments[1])));
                            console.log('\n');
                            prompt();
                        }   
                    } else {
                        console.log('incorrect format');
                        prompt();
                    }
                });
                break;
            case 'q':
                console.log('bye!');
                ifstrem.close();
                return;
            default:
                console.log('Invalid Command');
                prompt();
        }
    });
}
simulator();