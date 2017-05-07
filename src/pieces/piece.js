class Piece {
    constructor(name, size){
        this.name = name;
        this.size = size;
        this.isPlaced = false;
    }

    getName() {
        return this.name;
    }

    getSize() {
        return this.size;
    }

    isPlaced(){
        return this.isPlaced;
    }

    setPlacesStatus(status){
        this.isPlaced = status;
    }

}

module.exports = Piece;