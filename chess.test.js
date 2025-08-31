const Chess = require('./chess');

describe('Chess Class', () => {
  let game;

  beforeEach(() => {
    game = new Chess();
  });

  test('Board initializes correctly', () => {
    const b = game.board;
    expect(b[7][0]).toBe('R');
    expect(b[7][1]).toBe('C');
    expect(b[7][2]).toBe('B');
    expect(b[7][3]).toBe('Q');
    expect(b[7][4]).toBe('K');
    for (let i = 0; i < 8; i++) expect(b[6][i]).toBe('P');
    expect(b[0][0]).toBe('r');
    expect(b[0][1]).toBe('c');
    expect(b[0][2]).toBe('b');
    expect(b[0][3]).toBe('q');
    expect(b[0][4]).toBe('k');
    for (let i = 0; i < 8; i++) expect(b[1][i]).toBe('p');
  });

  test('White pawn moves forward 1 square', () => {
    expect(game.move('1,0','2,0')).toBe('moved');
    expect(game.board[5][0]).toBe('P');
    expect(game.board[6][0]).toBe(' ');
  });

  test('White pawn moves forward 2 squares from starting position', () => {
    expect(game.move('1,1','3,1')).toBe('moved');
    expect(game.board[4][1]).toBe('P');
    expect(game.board[6][1]).toBe(' ');
  });

  test('White pawn cannot move into occupied square', () => {
    game.turn = 'white';
    game.board[5][0] = 'p';
    expect(() => game.move('1,0','2,0')).toThrow('Illegal move for this piece');
  });

  test('White knight jumps over pieces', () => {
    expect(game.move('0,1','2,2')).toBe('moved');
    expect(game.board[5][2]).toBe('C');
    expect(game.board[7][1]).toBe(' ');
  });

  test('White bishop blocked by pawn cannot move', () => {
    expect(() => game.move('0,2','2,4')).toThrow('Illegal move for this piece');
  });

  test('Cannot capture own piece', () => {
    expect(() => game.move('0,0','0,1')).toThrow('Cannot capture own piece');
  });

  test('Turn alternates correctly', () => {
    expect(game.turn).toBe('white');
    game.move('1,0','2,0');
    expect(game.turn).toBe('black');
  });

  test('Capturing black king ends game', () => {
    game.board[1][4] = 'Q';
    game.board[6][4] = 'k';
    expect(game.move('6,4','1,4')).toBe('white wins!');
  });

  test('Move throws error if no piece at source', () => {
    expect(() => game.move('4,4','5,4')).toThrow('No piece at source');
  });

  test('Move throws error if moving wrong turn', () => {
    expect(() => game.move('6,0','5,0')).toThrow("It's white's turn");
  });
});