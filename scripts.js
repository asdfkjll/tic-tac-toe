const gameboard = (() => {
    let gameboard = [
	["", "", ""],
	["", "", ""],
	["", "", ""]
    ] 

    const resetGameboard = () => {
	gameboard = [
	    ["", "", ""],
	    ["", "", ""],
	    ["", "", ""]
	] 
    } 

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

    const getFreeSpaces = () => {
	let freeSpaces = 0
 
	gameboard.forEach((row) => {
	    for(const elem of row) {
		if(elem === "") freeSpaces++ 
	    }
	})
	
	return freeSpaces
    }

    return {
	resetGameboard,
	getGameboard,
	getRow,
	getCol,
	getDiagonal,
	getFreeSpaces
    }
})()

function player(name, mark) {
    let score = 0
    
    const getScore = () => score
    const giveScore = () => score++  

    const placeMark = (position) => {
	// position: {x, y} 
	// place a mark in the gameboard array at the specified position, returns an object with the move info, if cannot place the mark then returns null 

	// error checkers
	// * index overflow
	if(position.y >= gameboard.getGameboard().length || position.x >= gameboard.getGameboard()[0].length) {
	    console.warn(`${name}, placeMark(): invalid index x: ${position.x}/${gameboard.getGameboard()[0].length}, y: ${position.y}/${gameboard.getGameboard().length}`)
	    return null
	}

	// * occupied space
	if(gameboard.getGameboard()[position.y][position.x] !== "") { 
	    console.warn(`${name}, placeMark(): invalid move at position x: ${position.x}, y: ${position.y} its been already taken`)
	    return null 
	} 

	gameboard.getGameboard()[position.y][position.x] = mark

	return { x: position.x, y: position.y, name, mark } 
    }

    return { name, mark, getScore, giveScore, placeMark }
} 

const ui = (() => {
    const $board = document.querySelector(".board")

    const renderGameboard = () => {
	const board = gameboard.getGameboard()

	for(const y in board) {
	    for(const x in board[y]) {
		const space = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
		space.textContent = board[y][x]
	    }
	}	
    }

    const renderHudInfo = (p1, p2) => {
	const $p1Name = document.querySelector(".info-p1 .name")
	const $p1Score = document.querySelector(".info-p1 .score")

	const $p2Name = document.querySelector(".info-p2 .name")
	const $p2Score = document.querySelector(".info-p2 .score")

	$p1Name.textContent = p1.name 
	$p1Score.textContent = p1.getScore()

	$p2Name.textContent = p2.name 
	$p2Score.textContent = p2.getScore()
    }

    const gameDialogController = function() {
	const dialog = document.querySelector("dialog")
	const showButton = document.querySelector("#open-dialog-btn")
	const closeButton = document.querySelector("dialog button")
	const gameForm = document.querySelector("dialog form")

	// "Show the dialog" button opens the dialog modally
	showButton.addEventListener("click", () => dialog.showModal())

	// "Close" button closes the dialog
	closeButton.addEventListener("click", () => dialog.close())

	// Controls the form inside the dialog
	gameForm.addEventListener("submit", (e) => {
	    e.preventDefault()
	    
	    const playerOneName = document.querySelector("#playerOne-name").value
	    const playerTwoName = document.querySelector("#playerTwo-name").value

	    gameboard.resetGameboard()
	    game.start(playerOneName, playerTwoName)
	    dialog.close()
	})
    }

    gameDialogController()
    
    const getSpaceClicked = () => {
	return new Promise((resolve) => {
	    $board.addEventListener('click', function onClick(event) {
		const targetSpace = event.target 

		if (targetSpace && targetSpace.dataset.x !== undefined) {
		    $board.removeEventListener('click', onClick)
		    resolve(targetSpace) 
		}
	    })
	})
    }

    return { renderGameboard, renderHudInfo, getSpaceClicked }
})()

const game = (() => {
    // controls the main logic and game bucle

    const arrayWinner = (array) => {
	// Iterate an array to determine an winner (ej: ["x", "x", "x"] returns "x")
	// returns the winner object, if there is no winner then returns null

	const firstElem = array[0]

	if(firstElem === "") return null
	for(const elem of array) if(elem !== firstElem) return null

	return firstElem
    }

    const gameboardWinner = () => {
	// reads the entire gameboard and returns a winner, if tie returns "tie", otherwise returns null

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

	if (gameboard.getFreeSpaces() === 0) {
	    return "tie"
	}

	return null
    }

    const start = async (playerOneName = "gugu gaga", playerTwoName = "chikiro-chan") => {
	const players = {"x": player(playerOneName, "x"), "o": player(playerTwoName, "o")}
	let gameOver = false
	let turn = players["x"]

	ui.renderGameboard()
	ui.renderHudInfo(players["x"], players["o"])

	while(!gameOver) {
	    console.log(`plays "${turn.name}" as "${turn.mark}"`)

	    let winner
	    let spaceSelected
	    let playerMove
	    let cordinates

	    // reads player's move and play it if valid
	    do {
		spaceSelected = undefined
		spaceSelected = await ui.getSpaceClicked()
		cordinates = {x: spaceSelected.dataset.x, y: spaceSelected.dataset.y}
		playerMove = turn.placeMark(cordinates)
	    } while(spaceSelected === undefined || playerMove === null)

	    // render 
	    ui.renderGameboard()

	    // determine if there is a winner/tie in the gameboard after the move, if so then break the game bucle, otherwise continue
	    winner = gameboardWinner()

	    if(winner === "tie") {
		console.log("GAME OVER! its a tie")
		gameOver = true
	    } else if(winner !== null) {
		console.log(`GAME OVER! The winner is "${players[winner].name}" playing as "${players[winner].mark}"`)
		players[winner].giveScore()
		gameOver = true
	    } 

	    ui.renderHudInfo(players["x"], players["o"])

	    // flip turn to the other player
	    turn = turn == players["x"] ? players["o"] : players["x"] 
	}
    }

    return { start }
})()

