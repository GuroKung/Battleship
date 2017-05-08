var GameContoller = require('../../src/gameController');

var GameModel = require('../../models/game');
var HistoryModel = require('../../models/history');

describe('Play A Game', function() {

    var gameController;
    var mockPiece = {
        getName: function () { return 'Mock' },
        getSize: function () { return 2 },
        isPlaced: false
    }

    beforeEach(function () {
        spyOn(GameModel.prototype, 'save').and.callFake( () => Promise.resolve(null));  
        spyOn(HistoryModel.prototype, 'save').and.callFake( () => Promise.resolve(null));  
        gameController = new GameContoller();    
    });

    it('should start a game', function () {
        spyOn(GameContoller.prototype, 'createBoardGame').and.callFake(() => ([ [], [] , [], [] , [], [] , [], [] , [], [] ]));
        newCreatedGameController = new GameContoller();  
        expect(GameContoller.prototype.createBoardGame).toHaveBeenCalled();
        expect(newCreatedGameController.boardGame.length).toBe(10);
    });

    it('should have game status beigns with PLACE', function () {
        expect(gameController.status).toBe(1);
        expect(gameController.status).not.toBe(2);
    });


});