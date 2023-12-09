const gameBoard = (() => {
    let board = [];
    let countEmpty = 9;
    let turn = 1;    // 1 mean x, -1 mean o
    let endGame = 0; // endGame === 1 mean x wins, -1 mean o wins, 2 mean draw, 0 mean not end yet
    const newBoard = (() => {
        for (let i = 0; i < 3; i++) {
            board.push([]);
            for (let j = 0; j < 3; j++) {
                board[i].push(0);
            }
        }
        return board;        
    })();
    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = 0;
            }
        }
        countEmpty = 9;
        endGame = 0;
        turn = 1;
    }
    const xMove = (i, j) => {
        if (endGame !== 0 || !checkMove(i, j)) {return};
        countEmpty -= 1;
        board[i][j] = 1;   // 1 mean X, -1 mean O, zero mean empty
        checkEndgame(i, j);
        turn = -1;
    }
    const oMove = (i, j) => {
        if (endGame !== 0 || !checkMove(i, j)) {return};
        countEmpty -= 1;
        board[i][j] = -1;  // 1 mean X, -1 mean O, zero mean empty
        checkEndgame(i, j);
        turn = 1;
    }
    const makeMove = (i, j) => {
        if (turn === 1) {
            xMove(i, j);
        } else {
            oMove(i, j);
        }        
    }
    const checkMove = (i, j) => {
        if (board[i][j] !== 0) {
            return false
        };
        return true;        
    }
    const outOfMove = () => {
        if (countEmpty === 0) {
            return true;
        }
        return false;
    }
    const checkEndgame = (i, j) => {
        let sumRow = 0;
        let sumCol = 0;
        for (let k = 0; k < 3; k++) {
            sumRow += board[i][k];
            sumCol += board[k][j];
        }
        if (sumRow === 3 || sumCol === 3) {
            endGame = 1;
            return endGame;
        } else if (sumRow === -3 || sumCol === -3) {
            endGame = -1;
            return endGame;
        }
        if (i === j) {
            let sumDiag1 = 0;
            for (let k = 0; k < 3; k++) {
                sumDiag1 += board[k][k];
            }
            if (sumDiag1 === 3) {
                endGame= 1;
                return endGame;
            } else if (sumDiag1 === -3) {
                endGame= -1;
                return endGame;
            }
        } 
        if (i + j === 2) {
            let sumDiag2 = 0;
            for (let k = 0; k < 3; k++) {
                sumDiag2 += board[k][2-k];
            }
            if (sumDiag2 === 3) {
                endGame= 1;
                return endGame;
            } else if (sumDiag2 === -3) {
                endGame= -1;
                return endGame;
            }
        }
        if (outOfMove()) {
            endGame = 2;            
        }
        return endGame;
    }
    const getEndgame = () => endGame;
    const getTurn = () => turn;


    return {board, resetBoard, makeMove, getEndgame, getTurn};
})();


const dom = (() => {
    const box = document.querySelector('.box');
    const restart = document.querySelector('#restart');
    const noti = document.querySelector('#notification');
    let i;
    let j;
    const endTheGame = () => {        
        if (gameBoard.getEndgame() === 1) {
            noti.textContent = `X won the game`;
        } else if (gameBoard.getEndgame() === -1) {
            noti.textContent = `O won the game`;
        } else {
            noti.textContent = `Its a tie`;
        }
    };
    const resetBox = () => {
        const divs = box.querySelectorAll('div');
        divs.forEach((div) => {
            div.textContent = '';
        });
    };
    // Event listener for all cel when player click onthem
    (() => {
        box.addEventListener('click', (event) => {
            const target = event.target;
            if (target.className !== 'cel' || gameBoard.getEndgame() !== 0) {return;}        
            i = Number(target.dataset.row);
            j = Number(target.dataset.col);
            target.innerHTML = (gameBoard.getTurn() === 1) ? '<i class="fa-solid fa-xmark fa-2xl"></i>' : '<i class="fa-solid fa-o fa-xl"></i>';
            gameBoard.makeMove(i, j);
            if (gameBoard.getEndgame() !== 0) {
                endTheGame();               
            }
        });
    })();
    // Event listener for reset button
    (() => {
        restart.addEventListener('click', () => {
            gameBoard.resetBoard();
            resetBox();
            noti.textContent = '';
        });
    })();
    return;
})();
