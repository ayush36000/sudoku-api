const {range} = require('lodash')

const getColumn = (gameProblem, columnIndex) => gameProblem.map((x) => x[columnIndex]);

const getThreeByThreeGrid = (gameProblem, gridIndex) => {
    let rowIndex = Math.floor(gridIndex / 3)
    let columnIndex = gridIndex % 3

    let startingRow = rowIndex * 3
    let startingColumn = columnIndex * 3

    let grid = gameProblem.slice(startingRow, startingRow+3)
                .map(row => row.slice(startingColumn, startingColumn+3))

    return grid.join().split(',')
}

const hasDuplicate = (arr, type='problem') => {
    let toMap = {};

    for (item of arr) {
        if(toMap[item]){
            if(type === 'problem' && item === '-' )
                continue //Skip in case of empty value in problem
            return true
        }

        toMap[item] = true;
    }
    return false
}

const validateGame = (gameProblem, type='problem') => {
    for (let row of gameProblem){
        let rowIndex = gameProblem.indexOf(row)
        
        for (item of row){
            if(type == 'problem' && item == '-')
                continue

            if(!range(1,10).includes(item)){
                return {
                    status: false, 
                    msg: `Invalid number at row ${rowIndex+1} and 
                        column ${row.indexOf(item)+1}`
                }
            }
        }
        
        if (hasDuplicate(row, type)){
            return {
                status: false, 
                msg: `Duplicate items at row ${rowIndex+1}`
            };
        }

    }

    for (let index=0; index<9; index++){
        column = getColumn(gameProblem, index)

        if (hasDuplicate(column, type)){
            return {
                status: false, 
                msg: `Duplicate items at column ${index+1}`
            };
        }
    }

    for(let gridIndex = 0; gridIndex < 9; gridIndex++){
        grid = getThreeByThreeGrid(gameProblem, gridIndex)

        if(hasDuplicate(grid, type)){
            return {
                status: false, 
                msg: `Duplicate items at grid ${gridIndex+1}`
            };
        }
    }

    return {
        status: true,
        msg: "Game valid"
    }
}

module.exports = validateGame
