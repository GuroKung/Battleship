# Battleship Game
_An API for the famous board game_  

## How to run
__NOTE: This project requires Mongo DB__  
clone this repository
> npm install  
> npm start

## Game Data
_Example of game data for this API_
```    
{
"_id": OBJECT_ID,
"key": YOUR_GAME_KEY,
"status": 1,
"boardSize": 10,
"attackerMove": 0,
"missedShot": 0,
"__v": 0,
"pieces": [
    {
    "size": 4,
    "name": "Battleship"
    },
    {
    "size": 3,
    "name": "Cruiser"
    },
    {
    "size": 3,
    "name": "Cruiser"
    },
    {
    "size": 2,
    "name": "Destroyer"
    },
    {
    "size": 2,
    "name": "Destroyer"
    },
    {
    "size": 2,
    "name": "Destroyer"
    },
    {
    "size": 1,
    "name": "Submarine"
    },
    {
    "size": 1,
    "name": "Submarine"
    },
    {
    "size": 1,
    "name": "Submarine"
    },
    {
    "size": 1,
    "name": "Submarine"
    }
],
"boardGame": [["","","","","","","","","",""],
                ["","","","","","","","","",""],
                ["","","","","","","","","",""],
                ["","","","","","","","","",""],
                ["","","","","","","","","",""],
                ["","","","","","","","","",""],
                ["","","","","","","","","",""],
                ["","","","","","","","","",""],
                ["","","","","","","","","",""],
                ["","","","","","","","","",""]]
}
```

## POST api/startgame
__RESPONSE: Game Data (newly created)__

## GET api/game/:gameKey
__RESPONSE: Game Data (by given game key)__

## PUT api/game/:gameKey/move
_For DEFENDER Move_
```
{
    "content": {
        "status": 1,
        "position" : {
            "x" : 1,
            "y": 1
        },
        "meta": {
            "piece": {
                "size": 4,
                "name": "Battleship"
            },
            "axis" : "H"
        }
    }
}
```

_For ATTACKER Move_
```
{
    "content": {
        "status": 2,
        "position" : {
            "x" : 1,
            "y": 1
        }
    }
}
```
__RESPONSE: Due to scenario__  
_For DEFENDER Move_
- "Successfully place a piece on position X:POSITION_X Y:POSITION_Y" successfully place a ship
- "Cannot place a piece on position X:POSITION_X Y:POSITION_Y, Please try agian" when place on overlap or directly adjacent square.
- "Successfully place a piece on position X:POSITION_X Y:POSITION_Y, Now ATTACKER turn" switch to ATTACKER turn after all pieces has been placed.  

_For ATTACKER Move_
- “Miss” when the Attacker misses.
- “Hit” when a ship has been hit but not sunk. Do NOT provide any additional info about what
kind of ship was hit.
- “You just sank the X” followed by a the ship type. Show this message when the Attacker has
successfully sunk a ship, i.e. all squares making up that ship on the board has successfully
been hit..
- “Win ! You completed the game in X moves” together with the number of moves (attacks) it
took the Attacker to sink all the ships and a total of all missed shots.
```
    {
        "status": 'success' or 'error',
        "message": MESSAGE_HERE
    }
```


### Axis
---
'V' means vertically  
'H' means horizontally

### Status
---
1 means DEFENDER  
2 means ATTACKER

### Test
---
> npm test
