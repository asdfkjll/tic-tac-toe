const game = (() => {
    return {}
})()

const gameboard = (() => {
    const gameboard = [
	["", "", ""],
	["", "", ""],
	["", "", ""]
    ] 

    const playerMark = (player, position) => {
	if(gameboard[position.x][position.y] !== "") return
	gameboard[position.x][position.y] = player.mark
    } 
    const getGameboard = () => gameboard
    const getRow = (rowIndex) => gameboard[rowIndex] 
    const getCol = (colIndex) => {
	const col = []

	for(let i = 0; i < gameboard.length; i++) {
	    newCol.push(gameboard[i][colIndex]) 
	}

	return col
    }
    const getDiagonal = (reverse = false) => {
	const diagonal = []

	if(reverse !== false) {
	    gameboard.reverse()
	    const reversedDiagonal = getDiagonal()
	    gameboard.reverse()

	    return reversedDiagonal 
	}

	for(const i in gameboard) {
	    diagonal.push(gameboard[i][i]) 
	}

	return diagonal
    }

    return {
	playerMark,
	getGameboard,
	getRow,
	getCol,
	getDiagonal
    }
})()

function player(name, mark) {
    let score = 0
    
    const getScore = () => score
    const giveScore = () => score++  

    return { name, mark, getScore, giveScore }
} 

const player1 = player("gugu gagaa", "x")
const player2 = player("waifu-chan", "o")
