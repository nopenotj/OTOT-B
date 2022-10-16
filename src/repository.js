const {MongoClient, ObjectId} = require('mongodb');
const {remove_undef} = require("./utils");

const MONGODB = process.env.MONGO || 'mongodb://root:example@db:27017/'

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
                $inc: {vote: val},
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
