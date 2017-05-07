'use strict';

const _ = require('lodash');
const db = require('./db');

class GameController {
    constructor (boardSize = 10) {
        this.boardGame = this.createBoardGame(boardSize);
        console.log("GAME START");
        // TODO: Init player 1 & 2
     }

    createBoardGame(size) {
        // create 2D array board game
        /* TODO:
        1. Create game 2d array 
        2. Create New game in DB
        3.  */
        var arr = [];

        for (var i = 0; i < size; i++) {
            arr[i] = [];
        }

        return arr;
    }
    
    updateBoardGame(){
        /* TODO:
        - update current board game 
        - create game history 
        */
    }

    playerMove() {
        /*  
        STATE: PLACE
        --------------------------------------------------
        1. check if overlap or be placed directly adjacent
        2. place a piece
        3. update board
        4. if all pieces is placed > switch player

        STATE: ATTCK
        --------------------------------------------------
        1. attck target square
        2. send result from the attack 
        3. check if game is over (all ships have been sunk)
        */
    }

    endGame(){
        /* TODO: 
        1. show game results
        2. change status in DB that this game is ended */
    }
}

module.exports = GameController;