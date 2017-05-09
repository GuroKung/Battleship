var _ = require('lodash');
var GameContoller = require('../../src/gameController');

var GameModel = require('../../models/game');
var HistoryModel = require('../../models/history');

describe('Play A Game', function() {

    // var gameController = new GameContoller();    
    // var key = gameController.getData().key;

    // beforeEach(function () {
    //     gameController.boardGame = _.chunk(gameController.boardGame, gameController.boardSize);
    // });

    // it('move piece Battleship 1 1 H', function () {
    //     gameController.playerMove(1,1,{ size: 4, name: 'Battleship'}, 'H');
    // });

    // it('move piece Cruiser 10 10 V', function () {
    //     gameController.playerMove(10,10,{ size: 3, name: 'Cruiser'}, 'V');
    // });

    // it('move piece Cruiser 8 3 H', function () {
    //     gameController.playerMove(8,3,{ size: 3, name: 'Cruiser'}, 'H');
    // });

    // it('move piece 1 1', function () {
    //     gameController.playerMove(1,1,{ size: 4, name: 'Battleship'}, 'H');
    // });

    // it('move piece 1 1', function () {
    //     gameController.playerMove(1,1,{ size: 4, name: 'Battleship'}, 'H');
    // });

    // it('should start a game', function () {
    //     spyOn(GameContoller.prototype, 'createBoardGame').and.callFake(() => ([ [], [] , [], [] , [], [] , [], [] , [], [] ]));
    //     newCreatedGameController = new GameContoller();  
    //     expect(GameContoller.prototype.createBoardGame).toHaveBeenCalled();
    //     expect(newCreatedGameController.boardGame.length).toBe(10);
    // });

    // it('should have game status beigns with PLACE', function () {
    //     expect(gameController.status).toBe(1);
    //     expect(gameController.status).not.toBe(2);
    // });

    it('should place all pieces', function () {
        expect(gameController.pieces.length).toBe(6);
        gameController.playerMove();

        expect(gameController.pieces.length).toBe(0);
    });


});