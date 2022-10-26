const {MongoClient, ObjectId} = require('mongodb');
const {remove_undef} = require("./utils");

const USER = process.env.MONGO_USER
const PASSWORD = process.env.MONGO_PASSWORD
const MONGODB = process.env.ENV == 'local' ?
    "mongodb://root:example@db:27017/"
    :`mongodb+srv://${USER}:${PASSWORD}@cs3219.snhnixj.mongodb.net/?retryWrites=true&w=majority`

console.log('Using mongo user', USER)
let client, connection, collection;
if(!process.env.TESTING) [client, connection, collection] = setup()

function setup() {
    const client = new MongoClient(MONGODB)
    const connection = client.connect()
    const collection = client.db("otot-b").collection("memes");
    return [client, connection, collection]
}

function get_obj_id(id) {
    try {
        return ObjectId(id)
    } catch {
        return null
    }
}

function create({link, description}) {
    return connection.then(() => {
        return collection.insertOne({
            link: link,
            description: description,
            votes: 0,
            last_modified: new Date(),
        })
    })
}

function read(limit = -1) {
    return connection.then(() => {
        if (limit == -1) return collection.find({}).toArray()
        return collection.find({}, {limit: limit}).toArray()
    })
}

function read_item(id) {
    return connection.then(() => {
        return collection.findOne({_id: get_obj_id(id)})
    })
}

function update(id, {link, description}) {
    return connection.then(() => {
        return collection.updateOne(
            {_id: get_obj_id(id)},
            {
                $set: remove_undef({link, description}),
                $currentDate: {last_modified: true}
            }
        );
    })
}

function change_vote(id, val) {
    return connection.then(() => {
        return collection.updateOne(
            {_id: get_obj_id(id)},
            {
                $inc: {votes: val},
                $currentDate: {last_modified: true}
            }
        );
    })
}

function upvote(id) {
    return change_vote(id, +1)
}

function downvote(id) {
    return change_vote(id, -1)
}

function delete_item(id) {
    return connection.then(() => {
        return collection.deleteOne({_id: get_obj_id(id)});
    })
}

function delete_all() {
    return connection.then(() => {
        return collection.deleteMany({});
    })
}

// Seed some local data if deploying locally
if (process.env.ENV == 'local') {
	create({description:"cat", link:"https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1"})
	create({description:"patrick", link:"https://media0.giphy.com/media/LXHJRRjnviw7e/giphy.gif"})
	create({description:"simpsons", link:"https://compote.slate.com/images/697b023b-64a5-49a0-8059-27b963453fb1.gif"})
}

module.exports = {
    create,
    read,
    read_item,
    update,
    delete_item,
    delete_all,
    upvote,
    downvote,
}
