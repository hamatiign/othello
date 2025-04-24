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

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = structuredClone(board);

    function colorcheck(X: number, Y: number, I: number) {
      if (newBoard[Y + directions[I][1]] !== undefined) {
        if (newBoard[Y][X + directions[I][0]] !== undefined) {
          if (newBoard[Y + directions[I][1]][X + directions[I][0]] === 2 / turnColor) {
            n++;
            colorcheck(X + directions[I][0], Y + directions[I][1], I);
          } else if (newBoard[Y + directions[I][1]][X + directions[I][0]] === turnColor) return;
          else n = 0;
        } else n = 0;
      } else n = 0;
    }
    while (i < 8) {
      n = 0;
      colorcheck(x, y, i);

      for (let j = 1; j <= n; j++)
        newBoard[y + j * directions[i][1]][x + j * directions[i][0]] = turnColor;

      i += 1;
    }
    newBoard[y][x] = turnColor;
    const turnColorupdate = () => {
      setTurnColor((turnColor) => 2 / turnColor);
    };
    turnColorupdate();
    console.log(turnColor);
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        i = 0;
        let N: boolean = false;
        while (i < 8) {
          n = 0;
          colorcheck(row, col, i);
          if (n > 0) N = true;
          if (n > 0 && newBoard[row][col] === 0) {
            newBoard[row][col] = -1;
            break;
          }
          i++;
        }

        if (N === false && newBoard[row][col] === -1) newBoard[row][col] = 0;
      }
    }
    for (let i = 0; i < 8; i++) console.log(newBoard[i]);
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
