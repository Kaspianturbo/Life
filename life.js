let width = 20;
let height = 20;
let intensity = 0.4; //How many percents of cells will be created by the start of the game.

let map;

function GetFirstGeneration(width, height, intensity) {
    return [...Array(width)].map(
        (row) => row = [...Array(height)].map(
            (cell) => cell = RandomLogical(intensity)));
}

function RandomLogical(probability) {
    if (Math.random() > probability)
        return 0;
    else return 1;
}

function GetCellNeighbors(x, y) {
    let result = 0;
    if (x !== 0) {
        if (map[x - 1][y] === 1) result++;
        if (y !== 0) {
            if (map[x - 1][y - 1] === 1) result++;
        }
        if (y < height - 1) {
            if (map[x - 1][y + 1] === 1) result++;
        }
    }
    if (x < width - 1) {
        if (map[x + 1][y] === 1) result++;
        if (y !== 0) {
            if (map[x + 1][y - 1] === 1) result++;
        }
        if (y < height - 1) {
            if (map[x + 1][y + 1] === 1) result++;
        }
    }
    if (y !== 0) {
        if (map[x][y - 1] === 1) result++;
    }
    if (y < height - 1) {
        if (map[x][y + 1] === 1) result++;
    }

    return result;
}

function GetNextGeneration(currentGeneration) {
    let nextGeneration = [...Array(currentGeneration.length)].map(
        (row) => row = [...Array(currentGeneration[0].length)].map(
            (cell) => cell = 0
        ));

    currentGeneration.map(
        (row, x) => row.map(
            (cell, y) => {
                let neighborsCount = GetCellNeighbors(x, y);
                if (cell === 1 && (neighborsCount === 2 || neighborsCount === 3)) nextGeneration[x][y] = 1;
                if (cell === 1 && neighborsCount < 2) nextGeneration[x][y] = 0;
                if (cell === 1 && neighborsCount > 3) nextGeneration[x][y] = 0;
                if (cell === 0 && neighborsCount === 3) nextGeneration[x][y] = 1;
            }

        ));

    return nextGeneration;
}

const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen()

let generationCounterBox = contrib.markdown()
let generationCount = 0;

screen.append(generationCounterBox);
generationCounterBox.setMarkdown(`Generation: ${generationCount}`);

function IncreaseGenetarionCount() {
    generationCounterBox.setMarkdown(`Generation: ${++generationCount}`)
};

function CreateGameBox() {
    return blessed.box({
        parent: screen,
        top: 1,
        left: 0,
        width: width * 2 + 2,
        height: height + 2,
        border: {
            type: 'line'
        },
        style: {
            fg: 'black',
            bg: 'black',
            border: {
                fg: 'yellow',
            }
        },
    })
};

function CreateCells(map) {
    map.map(
        (row, x) => row.map(
            (cell, y) => {
                if (cell === 1) {
                    blessed.box({
                        parent: gameBox,
                        top: y,
                        left: x * 2,
                        height: 1,
                        width: 2,
                        style: { bg: 'red' }
                    })
                }

            }))
};

function ClearScreen() {
    gameBox = CreateGameBox()
};

let gameBox = CreateGameBox();
map = GetFirstGeneration(width, height, intensity);
screen.render();

screen.key(['next', 'enter'], function () {
    IncreaseGenetarionCount();
    map = GetNextGeneration(map);
    ClearScreen();
    CreateCells(map);
    screen.render();
});

screen.key(['escape', 'q'], function () {
    return process.exit(0);
});