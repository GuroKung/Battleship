var _ = require('lodash');
var GameContoller = require('../../src/gameController');

var GameModel = require('../../models/game');
var HistoryModel = require('../../models/history');

describe('Play A Game', function() {

    /*
        Guildine
        ———————
        DEFENDER
        Battleship 1 1 H
        Cruiser 10 10 V
        Cruiser 8 3 H
        Destroyer 5 3 H
        Destroyer 1 10 V
        Submarine 5 5 V
        Submarine 3 6 V
        Submarine 5 10 V
        Submarine 1 6 V
        Destroyer 8 6 H   

        ATTACKER
        1 1
        2 1
        3 1
        4 1 SUNK Battleship !
        1 10
        1 9 SUNK Destroyer !
        1 6 SUNK Submarine !
        5 3
        6 3  SUNK Destroyer !
        8 3
        9 3
        10 3  SUNK Cruiser !
        10 10
        10 9
        10 8 SUNK Cruiser !
        8 6
        9 6 SUNK Destroyer !
        3 6 SUNK Submarine !
        5 5 SUNK Submarine !
        5 10 SUNK Submarine !
     */

    var gameController = new GameContoller();    
    var key = gameController.getData().key;

    beforeEach(function () {
        gameController.boardGame = _.chunk(gameController.boardGame, gameController.boardSize);
    });

    it('should have game status beigns with PLACE', function () {
        expect(gameController.status).toBe(1);
        expect(gameController.status).not.toBe(2);
    });

    describe('should place all pieces', function () {
        // it('move piece Battleship 1 1 H', function () {
        //     gameController.playerMove(1, 1, { size: 4, name: 'Battleship' }, 'H');
        //     expect(gameController.status).toBe(1);
        // });

        // it('move piece Cruiser 10 10 V', function () {
        //     gameController.playerMove(10, 10, { size: 3, name: 'Cruiser' }, 'V');
        // });

        // it('move piece Cruiser 8 3 H', function () {
        //     gameController.playerMove(8, 3, { size: 3, name: 'Cruiser' }, 'H');
        // });

        // it('move piece 1 1', function () {
        //     gameController.playerMove(1, 1, { size: 4, name: 'Battleship' }, 'H');
        // });

        // it('move piece 1 1', function () {
        //     gameController.playerMove(1, 1, { size: 4, name: 'Battleship' }, 'H');
        // });
    });


});