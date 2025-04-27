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
  const [sum_b, setsum_b] = useState(2);
  const [sum_w, setsum_w] = useState(2);
  const [pass, setpass] = useState(true);
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
    let newSum_b = structuredClone(sum_b);
    let newSum_w = structuredClone(sum_w);
    let newpass = structuredClone(pass);
    newSum_b = 0;
    newSum_w = 0;
    newpass = true;

    //ある方向に何枚挟めるかを返す
    function colorcheck(X: number, Y: number, I: number, tc: number) {
      if (newBoard[Y + directions[I][1]] !== undefined) {
        if (newBoard[Y][X + directions[I][0]] !== undefined) {
          if (newBoard[Y + directions[I][1]][X + directions[I][0]] === 2 / tc) {
            n++;
            colorcheck(X + directions[I][0], Y + directions[I][1], I, tc);
          } else if (newBoard[Y + directions[I][1]][X + directions[I][0]] === tc) return;
          else n = 0;
        } else n = 0;
      } else n = 0;
    }

    if (newBoard[y][x] === -1) {
      //実際挟む
      while (i < 8) {
        n = 0;
        colorcheck(x, y, i, turnColor);

        for (let j = 1; j <= n; j++)
          newBoard[y + j * directions[i][1]][x + j * directions[i][0]] = turnColor;

        i += 1;
      }
      newBoard[y][x] = turnColor;

      setTurnColor(2 / turnColor);

      //おける場所の表示 + 得点数える
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          i = 0;
          let N: boolean = false;
          if (newBoard[row][col] === 1) newSum_b++;
          if (newBoard[row][col] === 2) newSum_w++;

          while (i < 8) {
            n = 0;
            colorcheck(col, row, i, 2 / turnColor);
            if (n > 0) N = true;
            if (n > 0 && newBoard[row][col] === 0) {
              newBoard[row][col] = -1;
              break;
            }
            i++;
          }

          if (N === false && newBoard[row][col] === -1) newBoard[row][col] = 0;
          if (newBoard[row][col] === -1) newpass = false;
        }
      }
      //パス
      if (newpass) {
        setTurnColor(turnColor);
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            i = 0;
            let N: boolean = false;

            while (i < 8) {
              n = 0;
              colorcheck(col, row, i, turnColor);
              if (n > 0) N = true;
              if (n > 0 && newBoard[row][col] === 0) {
                newBoard[row][col] = -1;
                break;
              }
              i++;
            }

            if (N === false && newBoard[row][col] === -1) newBoard[row][col] = 0;
            if (newBoard[row][col] === -1) newpass = false;
          }
        }

        if (newpass) {
          //パスパス
          alert('両者おける場所がなくなったため決着です');
        } else {
          //片方パス
          if (turnColor === 1) alert('白のおける場所がないためもう一度黒の番です。');
          else {
            alert('黒のおける場所がないためもう一度白の番です。');
          }
        }
      }

      //for (let i = 0; i < 8; i++) console.log(newBoard[i]);
      setBoard(newBoard);
      setsum_b(newSum_b);
      setsum_w(newSum_w);
      setpass(newpass);
    }
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
      <div className={styles.scores}>
        <p>黒{sum_b}</p>

        <p>白{sum_w}</p>
      </div>
    </div>
  );
}
