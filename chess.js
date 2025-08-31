class Chess {
  constructor() {
    this.board = this.initializeBoard();
    this.turn = 'white';
  }

  initializeBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(' '));
    const backRank = ['R', 'C', 'B', 'Q', 'K', 'B', 'C', 'R'];

    // Black pieces
    for (let i = 0; i < 8; i++) {
      board[0][i] = backRank[i].toLowerCase();
      board[1][i] = 'p';
    }

    // White pieces
    for (let i = 0; i < 8; i++) {
      board[6][i] = 'P';
      board[7][i] = backRank[i];
    }

    return board;
  }

  printBoard() {
    console.log('  a b c d e f g h');
    for (let i = 0; i < 8; i++) {
      let row = (8 - i) + ' ';
      for (let j = 0; j < 8; j++) {
        row += this.board[i][j] + ' ';
      }
      console.log(row + (8 - i));
    }
    console.log('  a b c d e f g h');
  }

  parsePosition(pos) {
    if (/^[a-h][1-8]$/.test(pos)) {
      const col = pos.charCodeAt(0) - 97;
      const row = 8 - parseInt(pos[1], 10);
      return [row, col];
    }
    if (/^[0-7]\s*,\s*[0-7]$/.test(pos)) {
      let [row, col] = pos.split(',').map(v => parseInt(v.trim(), 10));
      row = 7 - row;
      return [row, col];
    }
    throw new Error('Invalid position format');
  }

  checkPathClear(fr, fc, tr, tc) {
    let rStep = Math.sign(tr - fr);
    let cStep = Math.sign(tc - fc);

    let r = fr + rStep;
    let c = fc + cStep;

    while (r !== tr || c !== tc) {
      if (this.board[r][c] !== ' ') return false;
      r += rStep;
      c += cStep;
    }
    return true;
  }

  isValidMove(piece, fr, fc, tr, tc) {
    const dr = tr - fr;
    const dc = tc - fc;
    const target = this.board[tr][tc];
    const white = piece === piece.toUpperCase();

    switch (piece.toUpperCase()) {
      case 'P': {
        const dir = white ? -1 : 1;
        if (dc === 0 && target === ' ') {
          if (dr === dir) return true;
          if ((white && fr === 6 || !white && fr === 1) &&
              dr === 2 * dir && this.board[fr + dir][fc] === ' ') return true;
        }
        if (Math.abs(dc) === 1 && dr === dir &&
            target !== ' ' &&
            ((white && target === target.toLowerCase()) ||
             (!white && target === target.toUpperCase()))) return true;
        return false;
      }
      case 'R':
        if (fr === tr || fc === tc) return this.checkPathClear(fr, fc, tr, tc);
        return false;
      case 'B':
        if (Math.abs(dr) === Math.abs(dc)) return this.checkPathClear(fr, fc, tr, tc);
        return false;
      case 'Q':
        if (fr === tr || fc === tc || Math.abs(dr) === Math.abs(dc)) 
          return this.checkPathClear(fr, fc, tr, tc);
        return false;
      case 'C':
        return (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
               (Math.abs(dr) === 1 && Math.abs(dc) === 2);
      case 'K':
        return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
    }
    return false;
  }

  move(from, to) {
    const [fr, fc] = this.parsePosition(from);
    const [tr, tc] = this.parsePosition(to);

    const piece = this.board[fr][fc];
    if (piece === ' ') throw new Error('No piece at source');

    if (this.turn === 'white' && piece !== piece.toUpperCase())
      throw new Error("It's white's turn");
    if (this.turn === 'black' && piece !== piece.toLowerCase())
      throw new Error("It's black's turn");

    const target = this.board[tr][tc];
    if (target !== ' ' &&
        ((piece === piece.toUpperCase() && target === target.toUpperCase()) ||
         (piece === piece.toLowerCase() && target === target.toLowerCase())))
      throw new Error('Cannot capture own piece');

    if (!this.isValidMove(piece, fr, fc, tr, tc))
      throw new Error('Illegal move for this piece');

    this.board[fr][fc] = ' ';
    this.board[tr][tc] = piece;

    if (target.toLowerCase() === 'k') return this.turn + ' wins!';

    this.turn = this.turn === 'white' ? 'black' : 'white';
    return 'moved';
  }
}

module.exports = Chess;