'use strict';

const _ = require('lodash');
const db = require('./db');
const Piece = require('./pieces/piece');

const STATUS = {
    'PLACE': 1,
    'ATTACK': 2
}

class GameController {
    constructor (boardSize = 10) {
        this.boardGame = this.createBoardGame(boardSize);
        this.boardSize = boardSize;
        this.status = STATUS.PLACE;

        this.pieces = {
            battleship : [new Piece('Battleship', 4)],
            cruisers : [new Piece('Cruiser', 3), new Piece('Cruiser', 3)],
            destroyers: [new Piece('Destroyer', 2), new Piece('Destroyer', 2), new Piece('Destroyer', 2)],
            submarines: [new Piece('Submarine', 1), new Piece('Submarine', 1), new Piece('Submarine', 1) , new Piece('Submarine', 1)]
        } 

        // console.log("GAME START");
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
        - update current pieces
        - create game history 
        */
    }

    playerMove(x, y, piece, axis) {
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
        var transX = this.positionAdapter(x,y).x;
        var transY = this.positionAdapter(x,y).y;

        if(this.getStatus() == STATUS.PLACE) {
            if (!this.isOverlapped(transY,transX, piece, axis) && !this.isDirectlyAdjacent(transY,transX, piece, axis)){
                return { status: 'success', message : `Successfully place a piece on position X:${x} Y:${y}` }
            }
            else {
                return { status: 'error' , message : `Cannot place a piece on position X:${x} Y:${y}, Please try agian` }
            }
        }
        else if (this.getStatus() == STATUS.ATTACK) {
            // implement
        }
        else {
            console.error("ERROR: Game status not supported");
        }
    }

    isOverlapped(y, x, piece, axis){
        for(var i=0; i<piece.getSize(); i++){
            if (axis == 'H'){
                if (this.getBoardGame()[y] && this.getBoardGame()[y][x+i]) return true;
            }
            else if (axis == 'V') {
                if (this.getBoardGame()[y+i] && this.getBoardGame()[y+i][x]) return true;
            }
        }
        return false;
    }

    isDirectlyAdjacent(y,x, piece, axis){
        for(var i=0; i<piece.getSize(); i++){
            if (axis == 'H'){
                if ((this.getBoardGame()[y-1] && this.getBoardGame()[y-1][x-1+i]) ||
                (this.getBoardGame()[y-1] && this.getBoardGame()[y-1][x+i])  || 
                (this.getBoardGame()[y-1] && this.getBoardGame()[y-1][x+1+i]) ||
                (this.getBoardGame()[y] && this.getBoardGame()[y][x-1+i]) ||
                (this.getBoardGame()[y] && this.getBoardGame()[y][x+1+i])||
                (this.getBoardGame()[y+1] && this.getBoardGame()[y+1][x-1+i]) ||
                (this.getBoardGame()[y+1] && this.getBoardGame()[y+1][x+i]) || 
                (this.getBoardGame()[y+1] && this.getBoardGame()[y+1][x+1+i])) 
                return true;
            }
            else if (axis == 'V') {
                if ((this.getBoardGame()[y-1+i] && this.getBoardGame()[y-1+i][x-1]) ||
                (this.getBoardGame()[y-1+i] && this.getBoardGame()[y-1+i][x]) || 
                (this.getBoardGame()[y-1+i] && this.getBoardGame()[y-1+i][x+1]) ||
                (this.getBoardGame()[y+i] && this.getBoardGame()[y+i][x-1]) ||
                (this.getBoardGame()[y+i] && this.getBoardGame()[y+i][x+1])||
                (this.getBoardGame()[y+1+i] && this.getBoardGame()[y+1+i][x-1]) ||
                (this.getBoardGame()[y+1+i] && this.getBoardGame()[y+1+i][x]) || 
                (this.getBoardGame()[y+1+i] && this.getBoardGame()[y+1+i][x+1])) 
                return true;
            }
        }
        return false;
    }

    positionAdapter (x, y){
        // transform board game position to array position 
        return { x: x-1, y: this.getBoardSize()-y }
    }

    endGame(){
        /* TODO: 
        1. show game results
        2. change status in DB that this game is ended */
    }

    getBoardGame(){
        return this.boardGame;
    }

    getStatus(){
        return this.status;
    }

    getBoardSize(){
        return this.boardSize;
    }
}

module.exports = GameController;