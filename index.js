const readline = require('readline');
const Chess = require('./chess');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const game = new Chess();
game.printBoard();

function askMove() {
    rl.question(`${game.turn}'s move (e2 e4 or 6,4 4,4): `, (input) => {
        try {
            const [from, to] = input.split(' ');
            const result = game.move(from, to);
            game.printBoard();
            if (result.includes('wins')) {
                console.log(result);
                rl.close();
                return;
            }
        } catch (e) {
            console.log('Error:', e.message);
            game.printBoard();
        }
        askMove();
    });
}

askMove();