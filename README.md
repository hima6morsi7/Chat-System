# Demo-chat

Demo-chat the system consists on two services that run in separate containers:

+ Web service: [node.js] server. Using the official [node image].
+ Database service: [MongoDB] database. Using the official [mongo image].

Usage

$ cd app
$ npm install
$ npm start
// connect in your browser to http://localhost:4000

## Usage with docker

```groovy
$ cd demo-chat
$ docker-compose up
// connect in your browser to <host IP>:8080
```
## Usage with Docker Hub

```groovy
// run mongo service
$ docker run -v "$(pwd)"/database:/data --name mongo_chat_db -d mongo mongod --smallfiles
// run docker-chat image
$ docker run -d --name node_chat_server -v "$(pwd)"/database:/data --link mongo_chat_db:db -p 8080:4000 ageapps/docker-chat
// connect in your browser to <host IP>:8080
```

## Resources
+ [Docker]: Software containerization platform
+ [node.js]: Server enviroment.
+ [MongoDB]: NoSQL database system.
+ [mongoose]: MongoDB object modeling for *node.js*.
+ [docker-build]: Automated build of *Docker* images.
+ [docker-compose]: Automated configuration and run of multi-container *Docker* applications.


[Microservices architecture]: http://microservices.io/patterns/microservices.html
[node image]: https://hub.docker.com/_/node/
[mongo image]: https://hub.docker.com/_/mongo/
[MongoDB]: https://www.mongodb.com
[mongoose]: http://mongoosejs.com/index.html
[node.js]: http://nodejs.org
[Docker]: https://docs.docker.com/
[docker-compose]:https://docs.docker.com/compose/compose-file/
[docker-build]:https://docs.docker.com/engine/reference/builder/
