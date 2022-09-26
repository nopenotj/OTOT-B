process.env.TESTING = 'true'

const request = require('supertest');
const assert = require('assert');
const express = require('express');

const app = express();
const meme_router = require('../src/routes/memes')
app.use(express.json());
app.use('/', meme_router);



// Mocking Repository
let repo = require('../src/repository')
sample_memes = [
    {
        id: 123,
        link:"https://abc.jpg",
        description:"test1",
        "votes": 0,
        "last_modified": "2022-09-26T08:19:17.247Z"
    },
    {
        id: 456,
        link:"https://def.jpg",
        description:"test2",
        "votes": 0,
        "last_modified": "2022-09-26T08:19:17.247Z"
    }
]
repo.read = () => new Promise((res,_) => res(sample_memes))
repo.read_item = (id) => new Promise((res,_) => res(sample_memes.filter(i=> i.id == id)[0]))
repo.create = (obj) => new Promise((res,_) => res(post_sucess))
repo.update = (id, {link,description}) => new Promise((res,_) => res(sample_memes.filter(i=> i.id==id).length == 1 ? update_response(1) : update_response(0)))
repo.delete_all = () => new Promise((res,_) => res(delete_response(2)))
repo.delete_item = (id) => new Promise((res,_) => res(delete_response(sample_memes.filter(i=> i.id == id).length)))

post_sucess = {"acknowledged": true, "insertedId": "678"}
not_found_err = {"err": "MemeId not found"}
invalid_post_err = {"err": 'Invalid link/description'}
update_response = (mc) => ({"matchedCount": mc})
delete_response = (no) => ({"acknowledged": true, "deletedCount": no})

describe('Meme Endpoint', function () {
    describe('GET /', function () {
        it('should return all memes', function () {
            request(app)
                .get('/')
                .end(function(err, res) {
                    assert.deepEqual(res.body,sample_memes)
                    if (err) throw err;
                });
        });
    });
    describe('GET /:meme_id', function () {
        it('should return selected meme when given valid memeid', function () {
            request(app)
                .get('/123')
                .end(function(err, res) {
                    assert.deepEqual(res.body,sample_memes[0])
                    if (err) throw err;
                });
        });
        it('should return error when given invalid memeid', function () {
            request(app)
                .get('/124')
                .end(function(err, res) {
                    assert.deepEqual(res.body,not_found_err)
                    if (err) throw err;
                });
        });
    });
    describe('POST /', function () {
        it('should create item if link and description is valid', function () {
            request(app)
                .post('/')
                .send({
                    "link" : "https://valid.jpg",
                    "description": "second meme"
                })
                .end(function(err, res) {
                    assert.deepEqual(res.body,post_sucess)
                    if (err) throw err;
                });
        });
        it('should return err if link is invalid', function () {
            request(app)
                .post('/')
                .send({
                    "link" : "https://invalid.com",
                    "description": "second meme"
                })
                .end(function(err, res) {
                    assert.deepEqual(res.body,invalid_post_err)
                    if (err) throw err;
                });
        });
    });
    describe('PUT /:meme_id', function () {
        it('should update item if memeid,link and description is valid', function () {
            request(app)
                .put('/123')
                .send({
                    "link" : "https://updated.jpg",
                    "description": "updated desc"
                })
                .end(function(err, res) {
                    assert.deepEqual(res.body,update_response(0))
                    if (err) throw err;
                });
        });
        it('should return err if memeid is invalid', function () {
            request(app)
                .put('/456')
                .send({
                    "link" : "https://invalid.com",
                    "description": "second meme"
                })
                .end(function(err, res) {
                    assert.deepEqual(res.body,invalid_post_err)
                    if (err) throw err;
                });
        });
    });
    describe('DELETE /', function () {
        it('should delete all memes', function () {
            request(app)
                .delete('/')
                .end(function(err, res) {
                    assert.deepEqual(res.body,delete_response(2))
                    if (err) throw err;
                });
        });
    });
    describe('DELETE /:meme_id', function () {
        it('should delete selected meme', function () {
            request(app)
                .delete('/123')
                .end(function(err, res) {
                    assert.deepEqual(res.body,delete_response(1))
                    if (err) throw err;
                });
        });
        it('should delete nothing if given invalid id', function () {
            request(app)
                .delete('/590')
                .end(function(err, res) {
                    assert.deepEqual(res.body,delete_response(0))
                    if (err) throw err;
                });
        });
    });
});