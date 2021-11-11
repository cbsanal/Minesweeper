import { MAX_ROWS, MAX_COLS, NUM_OF_BOMBS } from './../constans/index';
import { Value, Status, Cell } from '../types';

const grabAllAroundCells = (cells: Cell[][], i: number, j: number): {
    topLeftCell:Cell | null,
    topCell:Cell | null,
    topRightCell:Cell | null,
    leftCell:Cell | null,
    rightCell:Cell | null,
    bottomLeftCell:Cell | null,
    bottomCell:Cell | null,
    bottomRightCell:Cell | null,
} => {
    const topLeftCell = i > 0 && j > 0 ? cells[i - 1][j - 1]: null;
    const topCell = i > 0 ? cells[i - 1][j]: null;
    const topRightCell = i > 0 && j < MAX_COLS - 1 ? cells[i - 1][j + 1]: null;
    const leftCell = j > 0 ? cells[i][j - 1]: null;
    const rightCell = j < MAX_COLS - 1 ? cells[i][j + 1]: null;
    const bottomLeftCell = i < MAX_ROWS - 1 && j > 0 ? cells[i + 1][j - 1]: null;
    const bottomCell = i < MAX_ROWS - 1 ? cells[i + 1][j]: null;
    const bottomRightCell = i < MAX_ROWS - 1 && j < MAX_COLS - 1 ? cells[i + 1][j + 1]: null;
    return {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    }
}

export const generateCells = (): Cell[][] => {
    const cells: Cell[][] = [];
    for(let row = 0; row < MAX_ROWS; ++row){
        cells.push([]);
        for(let col = 0; col < MAX_COLS; ++col){
            cells[row].push({
                value: Value.none,
                status: Status.unopened
            })
        }
    }
    let bombsPlaced = 0;
    while(bombsPlaced < NUM_OF_BOMBS){
        const row = Math.floor(Math.random() * MAX_ROWS);
        const col = Math.floor(Math.random() * MAX_COLS);
        const currentCell = cells[row][col];
        if(currentCell.value === Value.bomb)
            continue;
        currentCell.value = Value.bomb;
        ++bombsPlaced;
    }
    for(let i = 0; i < MAX_ROWS; ++i){
        for(let j = 0; j < MAX_COLS; ++j){
            if(cells[i][j].value === Value.bomb)
                continue;
            let bombCounter = 0;
            const { topLeftCell,
                topCell,
                topRightCell,
                leftCell,
                rightCell,
                bottomLeftCell,
                bottomCell,
                bottomRightCell} = grabAllAroundCells(cells, i, j);
            if(topLeftCell?.value === Value.bomb)
                ++bombCounter;
            if(topCell?.value === Value.bomb)
                ++bombCounter;
            if(topRightCell?.value === Value.bomb)
                ++bombCounter;
            if(leftCell?.value === Value.bomb)
                ++bombCounter;
            if(rightCell?.value === Value.bomb)
                ++bombCounter;
            if(bottomLeftCell?.value === Value.bomb)
                ++bombCounter;
            if(bottomCell?.value === Value.bomb)
                ++bombCounter;
            if(bottomRightCell?.value === Value.bomb)
                ++bombCounter;
            if(bombCounter > 0)
                cells[i][j].value = bombCounter;
        }
    }
    return cells;
}

export const openMultipleCells = (cells: Cell[][], rowIndex: number, colIndex: number): Cell[][] => {
    const currentCell = cells[rowIndex][colIndex];
    if(currentCell.status === Status.opened ||currentCell.status === Status.flagged)
        return cells;
    currentCell.status = Status.opened;
    let newCells = [...cells];
    const { topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell} = grabAllAroundCells(cells, rowIndex, colIndex);
    if(topLeftCell?.status === Status.unopened && topLeftCell.value !== Value.bomb){
        if(topLeftCell.value === Value.none)
            newCells = openMultipleCells(cells, rowIndex - 1, colIndex - 1);
        else
            newCells[rowIndex - 1][colIndex - 1].status = Status.opened;
    }
    if(topCell?.status === Status.unopened && topCell.value !== Value.bomb){
        if(topCell.value === Value.none)
            newCells = openMultipleCells(cells, rowIndex - 1, colIndex);
        else
            newCells[rowIndex - 1][colIndex].status = Status.opened;
    }
    if(topRightCell?.status === Status.unopened && topRightCell.value !== Value.bomb){
        if(topRightCell.value === Value.none)
            newCells = openMultipleCells(cells, rowIndex - 1, colIndex + 1);
        else
            newCells[rowIndex - 1][colIndex + 1].status = Status.opened;
    }
    if(leftCell?.status === Status.unopened && leftCell.value !== Value.bomb){
        if(leftCell.value === Value.none)
            newCells = openMultipleCells(cells, rowIndex, colIndex - 1);
        else
            newCells[rowIndex][colIndex - 1].status = Status.opened;
    }
    if(rightCell?.status === Status.unopened && rightCell.value !== Value.bomb){
        if(rightCell.value === Value.none)
            newCells = openMultipleCells(cells, rowIndex, colIndex + 1);
        else
            newCells[rowIndex][colIndex + 1].status = Status.opened;
    }
    if(bottomLeftCell?.status === Status.unopened && bottomLeftCell.value !== Value.bomb){
        if(bottomLeftCell.value === Value.none)
            newCells = openMultipleCells(cells, rowIndex + 1, colIndex - 1);
        else
            newCells[rowIndex + 1][colIndex - 1].status = Status.opened;
    }
    if(bottomCell?.status === Status.unopened && bottomCell.value !== Value.bomb){
        if(bottomCell.value === Value.none)
            newCells = openMultipleCells(cells, rowIndex + 1, colIndex);
        else
            newCells[rowIndex + 1][colIndex].status = Status.opened;
    }
    if(bottomRightCell?.status === Status.unopened && bottomRightCell.value !== Value.bomb){
        if(bottomRightCell.value === Value.none)
            newCells = openMultipleCells(cells, rowIndex + 1, colIndex + 1);
        else
            newCells[rowIndex + 1][colIndex + 1].status = Status.opened;
    }
    return newCells;
}