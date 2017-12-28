var cards = [];
var game_width = 4;
var game_height = 3;
var board;
var game = document.getElementById('game');

function Card() {
    this.color;
    this.shape;
    this.number;
    this.texture;
    this.id;

    this.init = function(color, shape, number, texture, id) {
        this.color = color;
        this.shape = shape;
        this.number = number;
        this.texture = texture;
        this.id = id;
    }

    this.classes = function() {
        var classes = "";
        switch (this.color) {
            case 0:
                classes += "red ";
                break;
            case 1:
                classes += "green ";
                break;
            case 2:
                classes += "purple ";
                break;
        }
        switch (this.shape) {
            case 0:
                classes += "rectangle ";
                break;
            case 1:
                classes += "oval ";
                break;
            case 2:
                classes += "wave ";
                break;
        }
        switch (this.texture) {
            case 0:
                classes += " ";
                break;
            case 1:
                classes += "clear ";
                break;
            case 2:
                classes += "noise ";
                break;
        }
        return classes += (this.number+1);
    }
}

function isSet(A, B, C) {
    if (!checkProperty(A.color, B.color, C.color))
        return false;
    if (!checkProperty(A.shape, B.shape, C.shape))
        return false;
    if (!checkProperty(A.number, B.number, C.number))
        return false;
    if (!checkProperty(A.texture, B.texture, C.texture))
        return false;
    return true;
}

function checkProperty(A, B, C) {
    return (A==B)&&(B==C) || (A!=B)&&(A!=C)&&(B!=C);
}

function generateCards() {
    var id=0;
    for (var c=0; c<3; c++) {
        for (var s=0; s<3; s++) {
            for (var n=0; n<3; n++) {
                for (var t=0; t<3; t++) {
                    var card = new Card();
                    card.init(c, s, n, t, id);
                    cards.push(card);
                    id++;
                }
            }
        }
    }
}


function setupBoard() {
    board = new Array(game_height);
    var tbody = game.appendChild(document.createElement("tbody"));
    tbody.innerHTML = "";

    for (var y=0; y<game_height; y++) {
        board[y] = new Array(game_width);
        tbody.appendChild(document.createElement("tr"));
        for (var x=0; x<game_width; x++) {
            board[y][x] = cards.splice(Math.floor(Math.random()*cards.length), 1)[0];
            var td = document.createElement("td");
            tbody.children[y].appendChild(td);
        }
    }

    console.log(board);
    updateBoard();
}

function updateBoard() {
    for (var y=0; y<game_height; y++) {
        for (var x=0; x<game_width; x++) {
            var card = board[y][x];
            var element = game.firstElementChild.children[y].children[x];
            element.className = card.classes();
            element.innerHTML = "";
            for (var i=0; i<=card.number; i++) {
                element.appendChild(document.createElement("div"));
            }
        }
    }
}

generateCards();
console.log(cards);
setupBoard();

