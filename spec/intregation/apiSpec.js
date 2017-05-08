const request = require('supertest');
const express = require('express');

const lodash = require('lodash');

const app = require('../../src/app');

describe('POST /api/startgame', function () {

    it('returns a game infomation', function (done) {
        return request(app)
            .post('/api/startgame')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body.key.length).toBe(16);
                expect(res.body.status).toBe(1);
                expect(_.isEqual(res.body.boardGame, [
                    ["","","","","","","","","",""],
                    ["","","","","","","","","",""],
                    ["","","","","","","","","",""],
                    ["","","","","","","","","",""],
                    ["","","","","","","","","",""],
                    ["","","","","","","","","",""],
                    ["","","","","","","","","",""],
                    ["","","","","","","","","",""],
                    ["","","","","","","","","",""],
                    ["","","","","","","","","",""]
                ])).toBe(true);
                expect(res.body.boardSize).toBe(10);
                expect(res.body.attackerMove).toBe(0);
                expect(res.body.missedShot).toBe(0);
                expect(_.isEqual(res.body.pieces, [
                    {
                        "name": "Battleship",
                        "size": 4
                    },
                    {
                        "name": "Cruiser",
                        "size": 3
                    },
                    {
                        "name": "Cruiser",
                        "size": 3
                    },
                    {
                        "name": "Destroyer",
                        "size": 2
                    },
                    {
                        "name": "Destroyer",
                        "size": 2
                    },
                    {
                        "name": "Destroyer",
                        "size": 2
                    },
                    {
                        "name": "Submarine",
                        "size": 1
                    },
                    {
                        "name": "Submarine",
                        "size": 1
                    },
                    {
                        "name": "Submarine",
                        "size": 1
                    },
                    {
                        "name": "Submarine",
                        "size": 1
                    }
                ])).toBe(true);
                expect(res.body.key.message).toBe("Battleship game start");
                done();
            })
    })
})

describe('GET /api/:gameKey', function () {

    it('returns a game infomation', function (done) {
        return request(app)
            .get('/api/xxyyzz')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    })
})