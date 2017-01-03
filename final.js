var game = {};
game.array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 'hole'];

$(document).ready(function() {
    game.array = shuffle(game.array);

    createField(game.array);
    var items = $('.move');
    items.click(function(event) {

        var index = $(this).index();
        var holePos = game.array.indexOf('hole')
        makeTurn(game.array, $(this).index());

        // анимация
        if ((index == holePos - 1) && (index % 4 !== 3)) {
            $(this).css("z-index", "100").animate({
                right: '-=110px'
            }, 900).animate({
                right: '+=110px'
            }, 0);
        } else if ((index == holePos + 1) && (index % 4 !== 0)) {
            $(this).css("z-index", "100").animate({
                right: '+=110px'
            }, 900).animate({
                right: '-=110px'
            }, 0);
        } else if (index == holePos - 4) {
            $(this).css("z-index", "100").animate({
                top: '+=110px'
            }, 900).animate({
                top: '-=110px'
            }, 0);
        } else if (index == holePos + 4) {
            $(this).css("z-index", "100").animate({
                top: '-=110px'
            }, 900).animate({
                top: '+=110px'
            }, 0);
        }

        $(this).delay(0).queue(function(next) {
            $(this).css("z-index", "10");
            reflectTurn();
            if (chechWin(game.array)) {
                alert('you win')
            }
            next();
        });
    })
})

// отображаем изменения в массиве игры
function reflectTurn() {
    var items = $('.move');
    for (var i = 0; i < items.length; i++) {
        items[i].innerHTML = game.array[i];
    }
    for (var i = 0; i < items.length; i++) {
        if (items[i].innerHTML == 'hole') {
            items[i].classList.add('hole')
        } else {
            items[i].classList.remove('hole')
        }
    }
}

// создаем игровое поле
function createField(array) {
    for (var k = 0; k < 16; k++) {
        var item = $('<div></div>'); // создаем пустой div
        if (typeof array[k] == 'number') { // заполняем поле, если элемент масива - число
            $('.gamefield').append($('<div></div>').addClass('move').text(array[k]));
        } else {
            $('.gamefield').append($('<div></div>').addClass('move hole').text(array[k])); // если слово "дыра"
            //game.holePos = k;
        }
    }
}

// проверка массива игры на существование решения
function isUndecidable(arr) {
    var c = 0;
    var h = 1 + (arr.indexOf('hole') - (arr.indexOf('hole') % 4)) / 4;
    for (var i = 0; i < arr.length - 1; i++) {
        var elem = arr[i];
        if (typeof elem == 'number') {
            for (var j = i + 1; j < arr.length; j++) { //here
                if (elem > arr[j]) {
                    c++;
                }
            }
        }
    }
    return ((c + h) % 2 == 0) ? true : false;
}

// получение перемешеного масива, решение которого существует
function shuffle(arr) {
    var b = true;
    while (b) {
        arr = arr.sort(function() {
            return 0.5 - Math.random()
        });
        if (isUndecidable(arr)) {
            b = false;
        }
    }
    return arr;
}

// определение начальной позиции пустой ячейки
function findHolePos(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == 'hole') {
            return i;
        }
    }
}

// проверка на возможность хода в ячейку (ход по правилам)
function isPossibleToTurn(index, holePos) {
    if ((index == holePos + 1) && (index % 4 !== 0) ||
        (index == holePos - 1) && (index % 4 !== 3) ||
        index == holePos - 4 || index == holePos + 4) {
        return true;
    } else {
        return false;
    }
}

// делаем ход (меняем местами ячейку хода и пустую ячейку)
function makeTurn(array, index) {
    var e;
    var holePos = findHolePos(array)
    array.forEach(function(elem, i) {
        if (i == index) {
            e = elem;
        }
    })
    if (isPossibleToTurn(index, holePos)) {
        array.forEach(function(elem, i) {
            if (typeof elem == 'string') {
                array.splice(i, 1, e);
            }
        })
        return array.splice(index, 1, 'hole');
    }
}

// проверака, достигнута ли победа
function chechWin(array) {
    var c = 0;
    array.forEach(function(elem, i) {
        if (elem == i + 1) {
            c++;
        }
    })
    return (c === 15) ? true : false;
}
