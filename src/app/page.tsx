'use client';

import { useState } from 'react';
import styles from './page.module.css';
let n: number;
//各方向何枚返せるかの配列返す
function colorcheckvec(
  X: number,
  Y: number,
  tc: number,
  newBoard: number[][],
  directions: number[][],
): number[] {
  let i = 0;
  const array: number[] = [];
  while (i < 8) {
    n = 0;
    array.push(colorcheck(X, Y, i, tc, newBoard, directions));
    i++;
  }
  return array;
}
//ある方向に何枚挟めるかを返す
function colorcheck(
  X: number,
  Y: number,
  I: number,
  tc: number,
  newBoard: number[][],
  directions: number[][],
): number {
  if (newBoard[Y + directions[I][1]] !== undefined) {
    if (newBoard[Y][X + directions[I][0]] !== undefined) {
      if (newBoard[Y + directions[I][1]][X + directions[I][0]] === 2 / tc) {
        n++;
        return colorcheck(X + directions[I][0], Y + directions[I][1], I, tc, newBoard, directions);
      } else if (newBoard[Y + directions[I][1]][X + directions[I][0]] === tc) return n;
      else return 0;
    } else return 0;
  } else return 0;
}
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

  let sum_b = 2;
  let sum_w = 2;
  let pass: boolean = false;
  const [passpass, setpasspass] = useState(false);
  const newBoard = structuredClone(board);

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    pass = true;
    let newpasspass = structuredClone(passpass);

    //実際挟む
    if (newBoard[y][x] === -1) {
      const cvector = colorcheckvec(x, y, turnColor, newBoard, directions);
      for (let i = 0; i < 8; i++) {
        console.log(`方向 ${i}: colorcheckvec =`, cvector[i]);
        for (let j = 0; j < cvector[i]; j++) {
          const newY = y + (j + 1) * directions[i][1];
          const newX = x + (j + 1) * directions[i][0];
          newBoard[newY][newX] = turnColor;
          console.log(`更新対象の座標: (${newX}, ${newY})`);
        }
      }

      newBoard[y][x] = turnColor;

      //おける場所の表示 + 得点数える
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (
            colorcheckvec(col, row, 2 / turnColor, newBoard, directions).some((i) => i > 0) &&
            newBoard[row][col] === 0
          )
            newBoard[row][col] = -1;

          if (
            !colorcheckvec(col, row, 2 / turnColor, newBoard, directions).some((i) => i > 0) &&
            newBoard[row][col] === -1
          )
            newBoard[row][col] = 0;
        }
      }
      //パス判定
      pass = !newBoard.some((i) => i.some((j) => j === -1));
      //パスパスの判定
      if (pass) {
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            if (
              colorcheckvec(col, row, turnColor, newBoard, directions).some((i) => i > 0) &&
              newBoard[row][col] === 0
            )
              newBoard[row][col] = -1;

            if (
              !colorcheckvec(col, row, turnColor, newBoard, directions).some((i) => i > 0) &&
              newBoard[row][col] === -1
            )
              newBoard[row][col] = 0;
          }
        }
        newpasspass = !newBoard.some((i) => i.some((j) => j === -1));
      } else newpasspass = false;

      if (newpasspass) {
        //パスパス強制終了
        alert(`両者おける場所がなくなったため決着です.`);
      } else if (pass) {
        //片方パスの表示
        if (turnColor === 1) alert('白のおける場所がないためもう一度黒の番です。');
        else {
          alert('黒のおける場所がないためもう一度白の番です。');
        }
      }

      //for (let i = 0; i < 8; i++) console.log(newBoard[i]);
      setTurnColor(2 / turnColor);
      if (pass === true && newpasspass === false) setTurnColor(turnColor);

      setBoard(newBoard);
      setpasspass(newpasspass);
    }
  };
  sum_b = newBoard.reduce((acc, row) => {
    return acc + row.reduce((rowAcc, num) => (num === 1 ? rowAcc + 1 : rowAcc), 0);
  }, 0);

  sum_w = newBoard.reduce((acc, row) => {
    return acc + row.reduce((rowAcc, num) => (num === 2 ? rowAcc + 1 : rowAcc), 0);
  }, 0);

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
      {passpass === true && sum_b > sum_w && (
        <div className={styles.resurt}>
          <p>
            {sum_b}対{sum_w}で黒の勝利です
          </p>
        </div>
      )}
      {passpass === true && sum_b === sum_w && (
        <div className={styles.resurt}>
          <p>
            {sum_b}対{sum_w}で引き分けです
          </p>
        </div>
      )}
      {passpass === true && sum_b < sum_w && (
        <div className={styles.resurt}>
          <p>
            {sum_b}対{sum_w}で白の勝利です
          </p>
        </div>
      )}
      {passpass !== true && (
        <div className={styles.scores}>
          <p>黒{sum_b}</p>

          <p>白{sum_w}</p>
        </div>
      )}
    </div>
  );
}
