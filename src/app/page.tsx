'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, -1, 0, 0, 0],
    [0, 0, 0, 1, 2, -1, 0, 0],
    [0, 0, -1, 2, 1, 0, 0, 0],
    [0, 0, 0, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const directions = [
    [1, 1],
    [1, 0],
    [1, -1],
    [0, 1],
    [0, -1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];
  let i: number = 0;
  let n = 0;
  function colorcheck(X: number, Y: number, I: number) {
    if (board[Y + directions[I][1]] !== undefined) {
      if (board[Y][X + directions[I][0]] !== undefined) {
        if (board[Y + directions[I][1]][X + directions[I][0]] === 2 / turnColor) {
          n++;
          colorcheck(X + directions[I][0], Y + directions[I][1], I);
        } else if (board[Y + directions[I][1]][X + directions[I][0]] === turnColor) return;
        else n = 0;
      } else n = 0;
    } else n = 0;
  }

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = structuredClone(board);

    while (i < 8) {
      n = 0;
      colorcheck(x, y, i);

      for (let j = 1; j <= n; j++)
        newBoard[y + j * directions[i][1]][x + j * directions[i][0]] = turnColor;

      i += 1;
    }

    setTurnColor(2 / turnColor);
    setBoard(newBoard);

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        i = 0;
        while (i < 8) {
          n = 0;
          colorcheck(row, col, i);
          if (n > 0 && board[row][col] === 0) newBoard[row][col] = -1;

          if (n === 0 && board[row][col] === -1) newBoard[row][col] = 0;
          i++;
        }
      }
    }
    for (let i = 0; i < 8; i++) console.log(board[i]);
    setBoard(newBoard);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div key={`${x}-${y}`} onClick={() => clickHandler(x, y)} className={styles.cell}>
              {color === 1 && <div className={styles.stone} />}
              {color === 2 && <div className={styles.stonew} />}
              {color === -1 && <div className={styles.bluestone} />}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
