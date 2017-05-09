var _ = require('lodash');

var GameModel = require('../../models/game');
var HistoryModel = require('../../models/history');

var GameContoller = require('../../src/gameController');
var Piece = require('../../src/pieces/piece');

describe('GameContoller', function() {

    var gameController;
    var mockPiece = {
        size: 2,
        getName: function () { return 'Mock' },
        getSize: function () { return 2 },
        isPlaced: false
    }

    beforeEach(function () {
        gameController = new GameContoller();  
    });

    it('should init board game', function () {
        spyOn(GameContoller.prototype, 'createBoardGame').and.callFake(() => ([ [], [] , [], [] , [], [] , [], [] , [], [] ]));
        newCreatedGameController = new GameContoller();  
        expect(GameContoller.prototype.createBoardGame).toHaveBeenCalled();
        expect(newCreatedGameController.boardGame.length).toBe(10);
    });

    it('should have game status beigns with PLACE', function () {
        expect(gameController.status).toBe(1);
        expect(gameController.status).not.toBe(2);
    });

    describe('#createBoardGame()', function () {
        it('should create empty 2*2 board game', function () {
            expect(gameController.createBoardGame(2).length).toBe(2);
        });

        it('should create empty 10*10 board game', function () {
            expect(gameController.createBoardGame(10).length).toBe(10);
        });

        it('should create new game in db', function () {
            spyOn(GameModel.prototype, 'save').and.callFake(() => Promise.resolve(null)); 
            gameController.createGameInDB();
            expect(GameModel.prototype.save).toHaveBeenCalled();
        });

    });

    describe('#updateBoardGame()', function () {
        var moved;

        beforeEach(function () {
            gameController.boardSize = 5;
                gameController.boardGame = [
                    ['', '', '', '', '' ],
                    ['', '', '', '', '' ],
                    ['', '', '', '', '' ],
                    ['', '', '', '', '' ],
                    ['', '', '', '', '' ]
                ];
            gameController.pieces = [ new Piece('Mock', 2), new Piece('Mock', 2), new Piece('Mock', 2) ];
            moved = gameController.pieces[0];
        });

        it('update current board game', function () {
            gameController.updateBoardGame(2, 2 , moved, 'H');
            expect(gameController.boardGame[2][2]).toBe(moved);
            expect(gameController.boardGame[2][3]).toBe(moved);
            expect(gameController.boardGame[2][4]).not.toBe(moved);
        });

        it('should remove placed piece from avaliable pieces', function () {
            expect(gameController.pieces.length).toBe(3);
            gameController.updateBoardGame(2, 2 , moved, 'H');
            expect(gameController.pieces.length).toBe(2);
        });

        // should stub call to update document in DB
        it('update game data in db', function () {
            expect(false).toBe(true);
        });
    });

    // not 100% unit test
    describe('#playerMove(x, y, piece, axis)', function () {

        describe('STATE = PLACE', function () {

            beforeEach(function () {
                spyOn(GameContoller.prototype, 'updateBoardGame').and.callFake(_.noop);
                gameController.boardSize = 5;
                gameController.boardGame = [
                    ['X', 'X', 'X', '', '' ],
                    ['' , '' , '' , '', '' ],
                    ['' , '' , '' , '', '' ],
                    ['X', '' , '' , '', '' ],
                    ['X', '' , '' , '', 'X']
                ];
            });

            it('should not place a piece on overlap square', function () {
                expect(gameController.playerMove(1,1,mockPiece,'H').status).toBe('error');
                expect(gameController.playerMove(1,1,mockPiece,'H').message).toBe('Cannot place a piece on position X:1 Y:1, Please try agian');
                
                expect(gameController.playerMove(5,2,mockPiece,'V').status).toBe('error');
                expect(gameController.playerMove(5,2,mockPiece,'V').message).toBe('Cannot place a piece on position X:5 Y:2, Please try agian');
            });

            it('should not place a piece on directly adjacent square', function () {
                expect(gameController.playerMove(2,3,mockPiece,'V').status).toBe('error');
                expect(gameController.playerMove(2,3,mockPiece,'V').message).toBe('Cannot place a piece on position X:2 Y:3, Please try agian');
                
                expect(gameController.playerMove(4,5,mockPiece,'V').status).toBe('error');
                expect(gameController.playerMove(4,5,mockPiece,'V').message).toBe('Cannot place a piece on position X:4 Y:5, Please try agian');
            });

            it('should succesfully place a piece on square when moved to 3 3', function () {
                var moved = gameController.playerMove(3,3,mockPiece,'V');
                expect(moved.status).toBe('success');
                expect(moved.message).toBe('Successfully place a piece on position X:3 Y:3');
            });

            it('should succesfully place a piece on square when moved to 4 3', function () {
                var moved = gameController.playerMove(4,3,mockPiece,'H');

                expect(moved.status).toBe('success');
                expect(moved.message).toBe('Successfully place a piece on position X:4 Y:3');
            });

            it('should update board', function () {
                gameController.playerMove(4,3,mockPiece,'H');
                expect(GameContoller.prototype.updateBoardGame).toHaveBeenCalled();
            });

            it('should switch to ATTACK after all pieces has been placed', function () {
                gameController.pieces = [];
                var moved = gameController.playerMove(4,3,mockPiece,'H');
                expect(moved.status).toBe('success');
                expect(moved.message).toBe('Successfully place a piece on position X:4 Y:3, Now ATTACKER turn');
                expect(gameController.getStatus()).toBe(2);
            });

        });

        describe('STATE = ATTCK', function () {
            it('should call for attack target', function () {
                gameController.status = 2;
                spyOn(GameContoller.prototype, 'attackTarget').and.callFake(_.noop);
                gameController.playerMove(1,1);
                expect(GameContoller.prototype.attackTarget).toHaveBeenCalled();
            });
        });

    });

    describe('#attackTarget(y, x)', function () {
        var attack

        beforeEach(function () {
            spyOn(GameContoller.prototype, 'endGame').and.callFake(_.noop);
            gameController.status = 2;
            gameController.boardSize = 5;
            gameController.boardGame = [
                [new Piece('Mock1', 3), new Piece('Mock1', 3), new Piece('Mock1', 3), '', '' ],
                ['' , '' , '' , '', '' ],
                ['' , '' , '' , '', '' ],
                [new Piece('Mock2', 2), '' , '' , '', '' ],
                [new Piece('Mock2', 2), '' , '' , '', new Piece('Mock3', 1)]
            ];
        });

        it('should say Miss when attack empty square', function () {
            attack = gameController.attackTarget(1, 1);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Miss');

            attack = gameController.attackTarget(2, 0);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Miss');
        });

        it('should say Hit when hit ship but not sunk', function () {
            attack = gameController.attackTarget(4, 0);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Hit');
        });

        it('should remove the piece after hit', function () {
            attack = gameController.attackTarget(4, 0);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Hit');
            expect(gameController.getBoardGame()[4][0]).toBe('');
        });

        // Known bug
        it('should be able to sunk ship which already loss in the middle', function () {
            /* Attack Step
            ----------------------- 
            1. | X | X | X |  |  |
            2. | X |   | X |  |  |
            3. |   |   | X |  |  | 
            4. SHIP SUNK !
            */
            attack = gameController.attackTarget(0, 1);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Hit');

            attack = gameController.attackTarget(0, 0);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Hit');

            attack = gameController.attackTarget(0, 2);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('You just sank the Mock1');
        });

        it('should say You just sank the "Mock"', function () {
            attack = gameController.attackTarget(4, 0);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Hit');

            attack = gameController.attackTarget(3, 0);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('You just sank the Mock2');
        });

        it('should increase attacker move', function () {
            attack = gameController.attackTarget(0, 0);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Hit');

            attack = gameController.attackTarget(0, 1);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Hit');

            attack = gameController.attackTarget(0, 2);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('You just sank the Mock1');

            expect(gameController.getAttackerMove()).toBe(3);
        });

        it('should increase missed shots', function () {
            attack = gameController.attackTarget(1, 1);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Miss');

            attack = gameController.attackTarget(2, 0);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Miss');

            expect(gameController.getMissedShots()).toBe(2);
        });

        it('should say Win ! You completed the game in 6 moves', function () {
            attack = gameController.attackTarget(0, 0);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Hit');

            attack = gameController.attackTarget(0, 1);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Hit');

            attack = gameController.attackTarget(0, 2);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('You just sank the Mock1');

            attack = gameController.attackTarget(4, 0);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Hit');

            attack = gameController.attackTarget(3, 0);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('You just sank the Mock2');

            attack = gameController.attackTarget(4, 4);
            expect(attack.status).toBe('success');
            expect(attack.message).toBe('Win ! You completed the game in 6 moves and total of 0 missed shots​.');
        });
    });

    describe('#isGameEnd()', function () {
        beforeEach(function () {
            gameController.boardSize = 3;
        });

        it('should not end the game while pieces remain on board', function () {
            gameController.boardGame = [
                ['X', '', 'X'],
                ['X', '', ''],
                ['X', '', '']
            ];
            expect(gameController.isGameEnd()).toBe(false);
        });

        it('should end game when there are no pieces left', function () {
            gameController.boardGame = [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
            ];
            expect(gameController.isGameEnd()).toBe(true);
        });
    });

    describe('#isOverlapped(x, y, size, axis)', function () {
        beforeEach(function () {
            gameController.boardSize = 3;
            gameController.boardGame = [
                ['X', '', 'X'],
                ['X', '', '' ],
                ['X', '', '' ]
            ];
        });

        it('should be overlapped other pieces', function () {
            expect(gameController.isOverlapped(0, 2, mockPiece.getSize(), 'V')).toBe(true);
            expect(gameController.isOverlapped(0, 1, mockPiece.getSize(), 'H')).toBe(true);
            expect(gameController.isOverlapped(2, 0, mockPiece.getSize(), 'H')).toBe(true);
        });

        it('should not be overlapped other pieces', function () {
            expect(gameController.isOverlapped(1, 2, mockPiece.getSize(), 'V')).toBe(false);
            expect(gameController.isOverlapped(0, 1, mockPiece.getSize(), 'V')).toBe(false);
            expect(gameController.isOverlapped(2, 1, mockPiece.getSize(), 'H')).toBe(false);
        });
    });

    describe('#isDirectlyAdjacent(x, y, size, axis)', function () {
        beforeEach(function () {
            gameController.boardSize = 5;
            gameController.boardGame = [
                ['X', 'X', 'X', '', '' ],
                ['' , '' , '' , '', '' ],
                ['' , '' , '' , '', '' ],
                ['X', '' , '' , '', '' ],
                ['X', '' , '' , '', 'X']
            ];
        });

        it('should be directly adjacent other pieces', function () {
            expect(gameController.isDirectlyAdjacent(1, 0, mockPiece.getSize(), 'V')).toBe(true);
            expect(gameController.isDirectlyAdjacent(4, 1, mockPiece.getSize(), 'H')).toBe(true);
            expect(gameController.isDirectlyAdjacent(1, 3, mockPiece.getSize(), 'V')).toBe(true);
        });

        it('should not be directly adjacent other pieces', function () {
            expect(gameController.isDirectlyAdjacent(2, 2, mockPiece.getSize(), 'V')).toBe(false);
            expect(gameController.isDirectlyAdjacent(3, 2, mockPiece.getSize(), 'V')).toBe(false);
            expect(gameController.isDirectlyAdjacent(2, 2, mockPiece.getSize(), 'H')).toBe(false);
        });
    });

    describe('#positionAdapter(x, y)', function () {
        it('should return new transform position', function () {
            gameController.boardSize = 3;
            expect(gameController.positionAdapter(1, 3).x).toBe(0);
            expect(gameController.positionAdapter(1, 3).y).toBe(0);

            expect(gameController.positionAdapter(2, 2).x).toBe(1);
            expect(gameController.positionAdapter(2, 2).y).toBe(1);

            expect(gameController.positionAdapter(3, 3).x).toBe(2);
            expect(gameController.positionAdapter(3, 3).y).toBe(0);

            expect(gameController.positionAdapter(2, 1).x).toBe(1);
            expect(gameController.positionAdapter(2, 1).y).toBe(2);
        });
    });

    describe('#endGame()', function () {
        it('change status in DB that this game is ended', function () {
            expect(false).toBe(true);
        });
    });   

    describe('#createGameHistory()', function () {
        it('should create can history in db', function () {
            expect(false).toBe(true);
        });
    });  

});