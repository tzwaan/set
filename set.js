var cards = [];
var emptyCard;
var currentSet = [];
var game_width = 4;
var game_height = 3;
var board;
//var game = document.getElementById('game');
var game = $('#game');

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

function noSet() {
    var noSet = true;
    board.forEach(function(A) {
        board.forEach(function(B) {
            board.forEach(function(C) {
                if (isSet(A,B,C))
                    noSet = false;
            });
        });
    });
    return noSet;
}

function isSet(A, B, C) {
    if (A==B || A==C || B==C)
        return false;
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
    if (A<0 || B<0 || C<0)
        return false;
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
    emptyCard = new Card();
    emptyCard.init(-1, -1, -1, -1, -1);
}

function setupBoard() {
    board = new Array(game_height*game_width);
    var tbody = $("<tbody>");
    game.append(tbody);

    for (var y=0; y<game_height; y++) {
        tbody.append($("<tr>"));
        for (var x=0; x<game_width; x++) {
            board[y*game_width + x] = cards.splice(Math.floor(Math.random()*cards.length), 1)[0];
            tbody.children().eq(y).append($("<td>"));
        }
    }

    console.log(board);

    var cards_replace = []
    while (noSet()) {
        var i_replace = Math.floor(Math.random()*board.length);
        var card = board[i_replace];
        cards_replace.push(card);
        board[i_replace] = cards.splice(Math.floor(Math.random()*cards.length),1)[0];
    }
    cards = cards.concat(cards_replace);

    $("td").click(selectCard);
    $("#colorblind_toggle").click(function() {
        if ($("tbody").hasClass('colorblind'))
            $("tbody").removeClass('colorblind');
        else
            $("tbody").addClass('colorblind');
    });
    updateBoard();
}

function updateBoard() {
    for (var y=0; y<game_height; y++) {
        for (var x=0; x<game_width; x++) {
            var card = board[y*game_width + x];
            var element = game.children(":first").children().eq(y).children().eq(x);
            element.empty().removeClass().addClass(card.classes()).attr("x", x).attr("y", y);
            for (var i=0; i<=card.number; i++) {
                element.append($("<div>"));
            }
        }
    }
}

function selectCard() {
    var x = Number($(this).attr("x"));
    var y = Number($(this).attr("y"));
    var card_nr = y*game_width + x;
    if (!currentSet.includes(card_nr)) {
        currentSet.push(card_nr);
        $(this).addClass("selected");
    } else {
        currentSet.splice(currentSet.indexOf(card_nr), 1);
        $(this).removeClass("selected");
    }

    if (currentSet.length==3) {
        if (isSet(
                board[currentSet[0]],
                board[currentSet[1]],
                board[currentSet[2]])) {
            if (cards.length>0) {
                for (var i=0; i<3; i++) {
                    board[currentSet[i]] = cards.splice(Math.floor(Math.random()*cards.length),1)[0];
                }
            } else {
                for (var i=0; i<3; i++) {
                    board[currentSet[i]] = emptyCard;
                }
            }
            var limit = 0;
            if (cards.length==0) {
                if (noSet())
                    window.alert("no more sets");
            } else {
                while (noSet()) {
                    for (var i=0; i<3; i++) {
                        cards.push(board[currentSet[i]]);
                    }
                    for (var i=0; i<3; i++) {
                        board[currentSet[i]] = cards.splice(Math.floor(Math.random()*cards.length),1)[0];
                    }
                    limit++;
                    if (limit>1000) {
                        window.alert("no more sets");
                        break;
                    }
                }
            }
            updateBoard();

        }
        currentSet.length = 0;
        $('td').removeClass("selected");
    }
}

generateCards();
console.log(cards);
setupBoard();
