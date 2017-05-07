var GameContoller = require('../../src/gameController');


describe('GameContoller', function() {

    var gameController;
    var mockPiece = {
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
            expect(false).toBe(true);
        });

    });

    // describe('#getBoardGame()', function () {
    //     it('should show empty board game', function () {
    //         expect(false).toBe(true);
    //     });

    //     it('should show current postion in board game', function () {
    //         // gameController player moves 2-3 pieces
    //         expect(false).toBe(true);
    //     });
    // });

    // describe('#updateBoardGame()', function () {
    //     it('update current board game', function () {
    //         expect(false).toBe(true);
    //     });

    //     it('update game data in db', function () {
    //         // gameController player moves 2-3 pieces
    //         expect(false).toBe(true);
    //     });
    // });

    describe('#playerMove(x, y, piece, axis)', function () {

        describe('STATE = PLACE', function () {

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

            // it('should succesfully place a piece on square', function () {
            //     expect(false).toBe(true);
            // });

            // it('should update board', function () {
            //     expect(false).toBe(true);
            // });

            // it('should switch to ATTACK after all pieces has been placed', function () {
            //     expect(false).toBe(true);
            // });

        });

        // describe('STATE = ATTCK', function () {
        //     it('should create empty 10*10 board game', function () {
        //         expect(false).toBe(true);
        //     });

        //     it('should create new game in db', function () {
        //         expect(false).toBe(true);
        //     });

        // });

    });

    describe('#isOverlapped(x, y, piece, axis)', function () {
        beforeEach(function () {
            gameController.boardSize = 3;
            gameController.boardGame = [
                ['X', '', 'X'],
                ['X', '', '' ],
                ['X', '', '' ]
            ];
        });

        it('should be overlapped other pieces', function () {
            expect(gameController.isOverlapped(0, 2, mockPiece, 'V')).toBe(true);
            expect(gameController.isOverlapped(0, 1, mockPiece, 'H')).toBe(true);
            expect(gameController.isOverlapped(2, 0, mockPiece, 'H')).toBe(true);
        });

        it('should not be overlapped other pieces', function () {
            expect(gameController.isOverlapped(1, 2, mockPiece, 'V')).toBe(false);
            expect(gameController.isOverlapped(0, 1, mockPiece, 'V')).toBe(false);
            expect(gameController.isOverlapped(2, 1, mockPiece, 'H')).toBe(false);
        });
    });

    describe('#isDirectlyAdjacent(x, y, piece, axis)', function () {
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
            expect(gameController.isDirectlyAdjacent(1, 0, mockPiece, 'V')).toBe(true);
            expect(gameController.isDirectlyAdjacent(4, 1, mockPiece, 'H')).toBe(true);
            expect(gameController.isDirectlyAdjacent(1, 3, mockPiece, 'V')).toBe(true);
        });

        it('should not be directly adjacent other pieces', function () {
            expect(gameController.isDirectlyAdjacent(2, 2, mockPiece, 'V')).toBe(false);
            expect(gameController.isDirectlyAdjacent(3, 2, mockPiece, 'V')).toBe(false);
            expect(gameController.isDirectlyAdjacent(2, 2, mockPiece, 'H')).toBe(false);
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

    // describe('#endGame()', function () {
    //     it('should show game results', function () {
    //         expect(false).toBe(true);
    //     });

    //     it('change status in DB that this game is ended', function () {
    //         expect(false).toBe(true);
    //     });
    // });

});