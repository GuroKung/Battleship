'use strict';

const _ = require('lodash');
const randtoken = require('rand-token');
const db = require('./db');

const Piece = require('./pieces/piece');
const GameModel = require('../models/game');
const HistoryModel = require('../models/history');

const STATUS = { DEFENDER: 1 , ATTACKER: 2 };
const MESSAGE_STATUS = { SUCCESS: 'success', ERROR: 'error' };

class GameController {
    constructor (key = randtoken.generate(16), boardGame, boardSize = 10, status = STATUS.DEFENDER,
        attackerMove = 0, missedShot = 0, pieces = [
            new Piece('Battleship', 4), new Piece('Cruiser', 3), new Piece('Cruiser', 3),
            new Piece('Destroyer', 2), new Piece('Destroyer', 2), new Piece('Destroyer', 2), new Piece('Submarine', 1),
            new Piece('Submarine', 1), new Piece('Submarine', 1), new Piece('Submarine', 1)
        ]) {
        this.key = key;
        this.boardGame = boardGame ? boardGame : this.createBoardGame(boardSize);
        this.boardSize = boardSize;
        this.status = status;
        this.attackerMove = attackerMove;
        this.missedShot = missedShot;
        this.pieces = pieces;
        // console.log("GAME START");
    }

    createGameInDB () {
        var game = new GameModel({
            key: this.key,
            status: this.status,
            boardGame: _.flatten(this.boardGame),
            boardSize: this.boardSize,
            attackerMove: this.attackerMove,
            missedShot: this.missedShot,
            pieces: this.pieces
        });
        game.save()
            .then(saved => console.log("Game Saved", saved))
            .catch(err => console.error("ERROR: Game Save Failed", err));
    }

    createGameHistory(status, message){
        var history = new HistoryModel({ status, message });
        history.save()
            .then(saved => console.log("History Saved", saved))
            .catch(err => console.error("ERROR: History Save Failed", err));
    }

    createBoardGame(size) {
        // create 2D array board game
        var arr = [];

        for (var i = 0; i < size; i++) {
            arr[i] = Array(size).join(".").split(".");
        }
        
        return arr;
    }
    
    updateBoardGame(y, x, piece, axis){
        /* TODO:
        - update current board game 
        - update current pieces
        - create game history 
        */
        for (var i = 0; i < piece.getSize(); i++) {
            if (axis == 'H') {
                this.boardGame[y][x + i] = piece;
            }
            else if (axis == 'V') {
                this.boardGame[y + i][x] = piece;
            }
        }
        _.pull(this.pieces, piece);
        // console.log('UPDATED BOARD');
        // console.log(this.printBoardGame());
        // console.log('UPDATED PIECES', this.pieces);
        
    }

    playerMove(x, y, piece, axis) {
        /*  
        STATE: DEFENDER
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

        if(this.getStatus() == STATUS.DEFENDER) {
            if (!this.isOverlapped(transY,transX, piece.getSize(), axis) && !this.isDirectlyAdjacent(transY,transX, piece.getSize(), axis)){
                this.updateBoardGame(transY,transX, piece, axis);
                if(this.pieces.length == 0){
                    this.status = STATUS.ATTACKER;
                    return { status: MESSAGE_STATUS.SUCCESS, message : `Successfully place a piece on position X:${x} Y:${y}, Now ATTACKER turn` }
                }
                return { status: MESSAGE_STATUS.SUCCESS, message : `Successfully place a piece on position X:${x} Y:${y}` }
            }
            else {
                return { status: MESSAGE_STATUS.ERROR , message : `Cannot place a piece on position X:${x} Y:${y}, Please try agian` }
            }
        }
        else if (this.getStatus() == STATUS.ATTACKER) {
            return this.attackTarget(transY, transX);
        }
        else {
            console.error("ERROR: Game status not supported");
        }
    }

    attackTarget(y, x){
        /*
        The list below are the response messages from API based on the current game situation.
            - “Miss”​ when the Attacker​ misses.
            - “Hit”​ when a ship has been hit but not sunk. Do NOT provide any additional info about what
            kind of ship was hit.
            - “You just sank the X”​ followed by a the ship type. Show this message when the Attacker​ has
            successfully sunk a ship, i.e. all squares making up that ship on the board has successfully
            been hit..
            - “Win ! You completed the game in X moves”​ together with the number of moves (attacks) it
            took the Attacker​ to sink all the ships ​and a total of all missed shots​.
        */
        this.attackerMove++;
        if (!this.isOverlapped(y,x, 1, 'V')) {
            this.missedShot++;
            return { status: MESSAGE_STATUS.SUCCESS, message : 'Miss' };
        }
        else if (this.isDirectlyAdjacent(y , x, 1, 'V')) {
            this.boardGame[y][x] = '';
            return { status: MESSAGE_STATUS.SUCCESS, message : 'Hit' };
        }
        else if (!this.isDirectlyAdjacent(y , x, 1, 'V')) {
            let piece = this.boardGame[y][x];
            this.boardGame[y][x] = '';
            if (this.isGameEnd()) {
                this.endGame();
                return { status: MESSAGE_STATUS.SUCCESS, message : `Win ! You completed the game in ${this.getAttackerMove()} moves ​and total of ${this.missedShot} missed shots​.` };
            }
            return { status: MESSAGE_STATUS.SUCCESS, message : `You just sank the ${piece.getName()}` };
        }
    }

    isGameEnd () {
        // no pieces left on the board
        for (var i = 0; i < this.boardSize; i++) {
            for (var j = 0; j < this.boardSize; j++) {
                if (this.boardGame[i][j] != '') return false; 
            }
        }
        return true;
    }

    isOverlapped(y, x, size, axis){
        for(var i=0; i<size; i++){
            if (axis == 'H'){
                if (this.getBoardGame()[y] && this.getBoardGame()[y][x+i]) return true;
            }
            else if (axis == 'V') {
                if (this.getBoardGame()[y+i] && this.getBoardGame()[y+i][x]) return true;
            }
        }
        return false;
    }

    isDirectlyAdjacent(y,x, size, axis){
        for(var i=0; i<size; i++){
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

    printBoardGame(){
        var boardText = '';
        for(var i=0; i<this.boardSize; i++){
            for (var j = 0; j < this.boardSize; j++) {
                boardText += `| ${JSON.stringify(this.boardGame[i][j])} | `;
            }
            boardText+='\n';
        }
        console.log(boardText);
    }

    endGame(){
        // change status in DB that this game is ended 

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

    getAttackerMove(){
        return this.attackerMove;
    }

    getMissedShots(){
        return this.missedShot;
    }

    getData(){ 
        return {
            key: this.key,
            status: this.status,
            boardGame: this.boardGame,
            boardSize: this.boardSize,
            attackerMove: this.attackerMove,
            missedShot: this.missedShot,
            pieces: this.pieces
        }
    }
}

module.exports = GameController;