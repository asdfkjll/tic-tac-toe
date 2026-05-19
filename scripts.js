const gameboard = (() => {
    const gameboard = [
	["", "", ""],
	["", "", ""],
	["", "", ""]
    ] 

    const getGameboard = () => gameboard

    const getRow = (rowIndex) => gameboard[rowIndex] 

    const getCol = (colIndex) => {
	const col = []
	for(const i in gameboard) col.push(gameboard[i][colIndex]) 
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

	for(const i in gameboard) diagonal.push(gameboard[i][i]) 

	return diagonal
    }

    return {
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

    const placeMark = (position) => {
	// position: {x, y} 
	if(gameboard.getGameboard()[position.y][position.x] !== "") return
	gameboard.getGameboard()[position.y][position.x] = mark
    }

    return { name, mark, getScore, giveScore, placeMark }
} 

const game = (() => {
    // controls the main logic and game bucle

    // players
    const players = {x: player("gugu gaga", "x"), o: player("chikiro-chan", "o")}
    // game variables
    let gameOver = false
    let turn = players.x

    const arrayWinner = (array) => {
	// Iterate an array to determine an winner (ej: ["x", "x", "x"] returns "x")
	// returns the winner "x"/"o", if there is no winner, then returns null

	const firstElem = array[0]

	if(firstElem === "") return null
	for(const elem of array) if(elem !== firstElem) return null

	return firstElem
    }

    const gameboardWinner = () => {
	// reads the entire gameboard and returns a winner, if not, returns null

	for(const i in gameboard.getGameboard()) {
	    const winnerRow = arrayWinner(gameboard.getRow(i))
	    const winnerCol = arrayWinner(gameboard.getCol(i))

	    if(!(winnerRow === null && winnerCol === null)) {
		return winnerRow === null ? winnerCol : winnerRow
	    }
	}

	const winnerDiag = arrayWinner(gameboard.getDiagonal())
	const winnerReversedDiag = arrayWinner(gameboard.getDiagonal(true))

	if(!(winnerDiag === null && winnerReversedDiag === null)) {
	    return winnerDiag === null ? winnerReversedDiag : winnerDiag
	}

	return null
    }

    while(!gameOver) {
	console.log(`plays "${turn.name}" as "${turn.mark}"`)

	turn.placeMark({x: prompt("x"), y: prompt("y")})
	turn = turn == players.x ? players.o : players.x 
	turnWinner = gameboardWinner()

	if(!(turnWinner === null)) {
	    console.log(`GAME OVER! The winner is "${turnWinner === players.x ? players.x.name : players.o.name}" playing as "${turnWinner}"`)
	    gameOver = true
	}
    }

    return { }
})()


