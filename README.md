# Battle
_An API for the famous board game_  

## How to run
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
RESPONSE: Game Data (newly created)

## GET api/game/:gameKey
RESPONSE: Game Data (by given game key)

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


### Axis
---
'V' means vertically​  
'H' means horizontally

### Status
---
1 means DEFENDER
2 means ATTACKER

### Test
---
> npm test
