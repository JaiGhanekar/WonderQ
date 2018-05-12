# Project Title

WonderQ - A simple queing system

## Getting Started

npm install 


### Example
npm run demo //for the demo
npm run wonderq //for interactive cli


## Running the tests

npm test



## Built With

* [Node.js](https://nodejs.org/en/) - The language used

.

##Potential API Endpoints


POST /wait | change the queue's wait time  


GET: /producers |  returns json array of producers

GET: /producers/id | returns json for producer with id

POST: /producers | accepts and adds producer json and then returns producer json

PUT: /producers/id  | updates producer returns producer json

DELETE /producers/id |  deletes a producer with id returns boolean for completed 


GET: /consumers | returns json array of consumers 

GET: /consumers/id | returns json for consumer with id

POST: /consumers | accepts and adds consumer json and then returns consumer json

PUT: /consumers/id | updates consumer returns consumer json

DELETE /consumers/id | deletes a consumer with id returns boolean for completed 


POST: /messages | accepts json with producer id and creates message

GET: /messages/{consumerid} | returns free messages to a consumer or return 
consumer's messages

POST: /acknowledge{messageid>} | accepts json with consumer id in it


## Scaling

I would add a priority feature to service important messages first. Instead of a consumer polling for more messages, I'd use a websocket configuration to push new messages to availible consumers. I'd use  AWS IOT Websockets, Lambda, and AppSync for serverless websocket. I would run these things in Docker containers with Node.js as the backend, and a combination of Postgres for database storage and Redis for a quick key value store. 


## Authors

* **Jai Ghanekar**  - [Jai Ghanekar](https://github.com/JaiGhanekar)



## Acknowledgments
#[Mocha](https://mochajs.org/) for testing testing 
