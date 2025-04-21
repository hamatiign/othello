'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
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

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = structuredClone(board);

    let can_palce: boolean = false;
    let i: number = 0;
    while (i < 8) {
      if (
        board[y + directions[i][1]][x + directions[i][0]] !== undefined &&
        board[y + directions[i][1]][x + directions[i][0]] === 2 / turnColor
      )
        can_palce = true;
      if (
        board[y + directions[i][1]][x + directions[i][0]] === 2 / turnColor &&
        board[y + 2 * directions[i][1]][x + 2 * directions[i][0]] === turnColor
      ) {
        newBoard[y][x] = turnColor;
        newBoard[y + directions[i][1]][x + directions[i][0]] = turnColor;
        setTurnColor(2 / turnColor);
        setBoard(newBoard);
      }
      i += 1;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div key={`${x}-${y}`} onClick={() => clickHandler(x, y)} className={styles.cell}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? `#000` : `#fff` }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
