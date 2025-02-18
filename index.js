/** CONSTANT */
const COLS = 10; // số cột
const ROWS = 20; // số hàng
const BLOCK_SIZE = 30; // 1 khối hình vuông cố kích thước là 30x30
const COLOR_MAPPING = [
    'red',
    'orange',
    'green',
    'purple',
    'blue',
    'cyan',
    'yellow',
    'white' // giá trị màu sắc khi không có khôi nào trên board
] // giá trị màu sắc cho mỗi khối
const WHITE_COLOR_ID = 7;

// mô tả hướng quay của các loại gạch
const BRICK_LAYOUT = [
    [
      [
        [1, 7, 7],
        [1, 1, 1],
        [7, 7, 7],
      ],
      [
        [7, 1, 1],
        [7, 1, 7],
        [7, 1, 7],
      ],
      [
        [7, 7, 7],
        [1, 1, 1],
        [7, 7, 1],
      ],
      [
        [7, 1, 7],
        [7, 1, 7],
        [1, 1, 7],
      ],
    ],
    [
      [
        [7, 1, 7],
        [7, 1, 7],
        [7, 1, 1],
      ],
      [
        [7, 7, 7],
        [1, 1, 1],
        [1, 7, 7],
      ],
      [
        [1, 1, 7],
        [7, 1, 7],
        [7, 1, 7],
      ],
      [
        [7, 7, 1],
        [1, 1, 1],
        [7, 7, 7],
      ],
    ],
    [
      [
        [1, 7, 7],
        [1, 1, 7],
        [7, 1, 7],
      ],
      [
        [7, 1, 1],
        [1, 1, 7],
        [7, 7, 7],
      ],
      [
        [7, 1, 7],
        [7, 1, 1],
        [7, 7, 1],
      ],
      [
        [7, 7, 7],
        [7, 1, 1],
        [1, 1, 7],
      ],
    ],
    [
      [
        [7, 1, 7],
        [1, 1, 7],
        [1, 7, 7],
      ],
      [
        [1, 1, 7],
        [7, 1, 1],
        [7, 7, 7],
      ],
      [
        [7, 7, 1],
        [7, 1, 1],
        [7, 1, 7],
      ],
      [
        [7, 7, 7],
        [1, 1, 7],
        [7, 1, 1],
      ],
    ],
    [
      [
        [7, 7, 7, 7],
        [1, 1, 1, 1],
        [7, 7, 7, 7],
        [7, 7, 7, 7],
      ],
      [
        [7, 7, 1, 7],
        [7, 7, 1, 7],
        [7, 7, 1, 7],
        [7, 7, 1, 7],
      ],
      [
        [7, 7, 7, 7],
        [7, 7, 7, 7],
        [1, 1, 1, 1],
        [7, 7, 7, 7],
      ],
      [
        [7, 1, 7, 7],
        [7, 1, 7, 7],
        [7, 1, 7, 7],
        [7, 1, 7, 7],
      ],
    ],
    [
      [
        [7, 7, 7, 7],
        [7, 1, 1, 7],
        [7, 1, 1, 7],
        [7, 7, 7, 7],
      ],
      [
        [7, 7, 7, 7],
        [7, 1, 1, 7],
        [7, 1, 1, 7],
        [7, 7, 7, 7],
      ],
      [
        [7, 7, 7, 7],
        [7, 1, 1, 7],
        [7, 1, 1, 7],
        [7, 7, 7, 7],
      ],
      [
        [7, 7, 7, 7],
        [7, 1, 1, 7],
        [7, 1, 1, 7],
        [7, 7, 7, 7],
      ],
    ],
    [
      [
        [7, 1, 7],
        [1, 1, 1],
        [7, 7, 7],
      ],
      [
        [7, 1, 7],
        [7, 1, 1],
        [7, 1, 7],
      ],
      [
        [7, 7, 7],
        [1, 1, 1],
        [7, 1, 7],
      ],
      [
        [7, 1, 7],
        [1, 1, 7],
        [7, 1, 7],
      ],
    ],
];

const KEY_CODES = {
    RIGHT: 'ArrowRight',
    LEFT: 'ArrowLeft',
    DOWN: 'ArrowDown',
    UP: 'ArrowUp'
}


/** CANVAS */
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

// xét chiều rộng và chiều cao cho CANVAS
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

/** XÂY DỰNG CLASS */
class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.generateWhiteBoard();
        this.score = 0;
        this.gameOver = false; 
        this.isPlaying = false;
        this.playAudio = new Audio('../XepHinh/sounds/clear.wav')
    }

    // method xử lí resest khi ấn play
    resest() {
        this.score = 0;
        this.grid = this.generateWhiteBoard();
        this.gameOver = false;
        this.drawBoard()
    }

    // tạo một bảng trắng có kích thước là một mảng 2 chiều 20x10
    generateWhiteBoard() {
        return Array.from({length: 20}, () => Array(COLS).fill(WHITE_COLOR_ID));
    } 

    // vé ô trên board 
    drawCell(xAxis, yAxis, colorID) {
        this.ctx.fillStyle = COLOR_MAPPING[colorID] || COLOR_MAPPING[WHITE_COLOR_ID];
        this.ctx.fillRect(xAxis * BLOCK_SIZE, yAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        this.ctx.style = 'black';
        this.ctx.strokeRect(xAxis * BLOCK_SIZE, yAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    // kẻ ô cho board 
    drawBoard() {
        for (let row = 0; row < this.grid.length; row ++) {
            for (let col = 0; col < this.grid[0].length; col ++) {
                this.drawCell(col, row, this.grid[row][col]);
            }
        }
    }

    // hàm xử lí hàng thành công
    handleCompleteRows() {
        const latestGrid = board.grid.filter( (row) => {
            return row.some(col => col ===  WHITE_COLOR_ID)
        } )

        const newScore = ROWS - latestGrid.length;
        const newRows = Array.from({length: newScore}, () => Array(COLS).fill(WHITE_COLOR_ID))
        if(newScore) {
            board.grid = [...newRows, ...latestGrid]; 
            this.handleScore(newScore * 10); 
            this.playAudio.play();
        }
    }

    // hàm tăng điểm score khi hoàn thành một hàng
    handleScore(newScore) {
        this.score += newScore;
        document.getElementById('score').innerHTML = this.score;
    }

    // xử lí khi game over
    handleGameOver() {
        this.gameOver = true;
        this.isPlaying = false;
        alert('Game Over');
    }
}


class Brick {
    constructor(id) {
        this.id = id;
        this.layout = BRICK_LAYOUT[id];
        this.activeIndex = 0; // các trường hợp của viên gạch trong BRICK_LAYOUT
        this.colPos = 3; // vị trí viên gạch
        this.rowPos = -4 ; // vị trí viên gạch
    }

    // vẽ viên gạch
    draw() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row ++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col ++) {
                if( this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID ) [
                    board.drawCell(col + this.colPos, row + this.rowPos, this.id)
                ]
            }
        }
    }

    // method dùng để xoá Brick
    clear() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row ++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col ++) {
                if( this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID ) [
                    board.drawCell(col + this.colPos, row + this.rowPos, WHITE_COLOR_ID)
                ]
            }
        }
    }

    /** xây dựng các phương thức để di chuyển viên gạch */
    moveLeft() {
        if(!this.checkCollision(this.rowPos, this.colPos - 1, this.layout[this.activeIndex])) {
            this.clear(); // xoá brick trước khi dịch chuyển --> tính chất của canvas
            this.colPos--; // dịch chuyển
            this.draw(); // // vẽ lại brick tại vị trí mới
        }
    }

    moveRight() {
        if (!this.checkCollision(this.rowPos, this.colPos + 1, this.layout[this.activeIndex])) {
            this.clear();
            this.colPos++;
            this.draw();
        }
    }

    moveDown() {
        if (!this.checkCollision(this.rowPos + 1, this.colPos, this.layout[this.activeIndex])) {
            this.clear();
            this.rowPos++;
            this.draw();
            return;
        }
        this.handleLanded();
        if(!board.gameOver) {
            generateNewBrick(); 
        }
    }

    // method xoay brick
    rotate() {
        if (!this.checkCollision(this.rowPos, this.colPos, this.layout[[this.activeIndex + 1] % 4])) {
            this.clear()
            this.activeIndex = [this.activeIndex + 1] % 4; // luôn thuộc [0, 3]
            this.draw();
        }
    }

    // tạo method kiểm tra va chạm
    checkCollision(nextRow, nextCol, nextLayout) {
        for (let row = 0; row < nextLayout.length; row ++) {
            for (let col = 0; col < nextLayout[0].length; col ++) {
                if( nextLayout[row][col] !== WHITE_COLOR_ID && nextRow >= 0) {
                    if ( (col + nextCol < 0)  || (col + nextCol >= COLS) || (row + nextRow >= ROWS) || (board.grid[row + nextRow][col + nextCol] !== WHITE_COLOR_ID) ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    

    // hàm xử lí khi brick xuống đáy 
    handleLanded() {
        if(this.rowPos <= 0) {
            board.handleGameOver();
            return;
        }

        for (let row = 0; row < this.layout[this.activeIndex].length; row ++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col ++) {
                if( this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID ) {
                    board.grid[row + this.rowPos][col + this.colPos] = this.id
                }
            }
        }

        board.handleCompleteRows()
        board.drawBoard()
    }


    

}

// hàm tạo một viên gạch bắt kì
function generateNewBrick() {
    brick = new Brick(Math.floor(Math.random() * 10) % BRICK_LAYOUT.length);
}

let board = new Board(ctx)
board.drawBoard()
document.getElementById('btn-play').addEventListener('click', () => {
    board.resest();
    board.isPlaying = true;
    generateNewBrick();
    const refresh = setInterval(() => {
      if(!board.gameOver) {
        brick.moveDown();
      } else {
        clearInterval(refresh);
      }
    }, 500);

})



// xử lí sự kiện khi nhấn phím điều hướng
document.addEventListener('keydown', e => {
    // console.log(e.code);
    if(! board.gameOver && board.isPlaying) {
        switch(e.code) {
            case KEY_CODES.RIGHT:
                brick.moveRight();
                break;
            case KEY_CODES.LEFT: 
                brick.moveLeft();
                break;
            case KEY_CODES.DOWN:
                brick.moveDown();
                break;
            case KEY_CODES.UP:
                brick.rotate();
                break;
            default:
                break;
    }
    }
})