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
  if (newBoard[Y + directions[I][1]] === undefined) return 0;
  if (newBoard[Y + directions[I][1]][X + directions[I][0]] === undefined) return 0;
  if (newBoard[Y + directions[I][1]][X + directions[I][0]] === 2 / tc) {
    n++;
    return colorcheck(X + directions[I][0], Y + directions[I][1], I, tc, newBoard, directions);
  } else if (newBoard[Y + directions[I][1]][X + directions[I][0]] === tc) return n;
  else return 0;
}
//点数数える
function calcScore_b(newBoard: number[][]) {
  const result = newBoard.reduce((acc, row) => {
    return acc + row.reduce((rowAcc, num) => (num === 1 ? rowAcc + 1 : rowAcc), 0);
  }, 0);
  return result;
}
//点数数える
function calcScore_w(newBoard: number[][]) {
  const result = newBoard.reduce((acc, row) => {
    return acc + row.reduce((rowAcc, num) => (num === 2 ? rowAcc + 1 : rowAcc), 0);
  }, 0);
  return result;
}
//おけるマスがあるか
function canput(newBoard: number[][], turnColor: number, directions: number[][]): boolean {
  for (let i = 0; i < newBoard.length; i++) {
    for (let j = 0; j < newBoard.length; j++) {
      if (colorcheckvec(i, j, turnColor, newBoard, directions).some((k) => k > 0)) return true;
    }
  }
  return false;
}
//～～～～～home～～～～～～～～～～～～
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

  const newBoard = structuredClone(board);
  let newturnColor = structuredClone(turnColor);

  let passpass = false;
  //~~~~~~~~~クリックハンドラ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);

    //実際挟む
    if (colorcheckvec(x, y, turnColor, newBoard, directions).some((i) => i > 0)) {
      const cvector = colorcheckvec(x, y, turnColor, newBoard, directions);
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < cvector[i]; j++) {
          const newY = y + (j + 1) * directions[i][1];
          const newX = x + (j + 1) * directions[i][0];
          newBoard[newY][newX] = turnColor;
        }
      }

      newBoard[y][x] = turnColor;

      setTurnColor(2 / turnColor);
      if (pass === true && passpass === false) setTurnColor(turnColor);

      setBoard(newBoard);
    }
  }; //~~~~~~~~~~~~~~~~ハンドラ終わり~~~~~~~~~~~~~~~~~~~~~~
  const sum_b = calcScore_b(newBoard);
  const sum_w = calcScore_w(newBoard);

  //パス判定
  const pass = !canput(newBoard, 2 / newturnColor, directions);
  console.log(canput(newBoard, newturnColor, directions));
  console.log('pass', pass);

  //パスパスの判定
  if (pass) {
    passpass = !canput(newBoard, newturnColor, directions);
    console.log(canput(newBoard, newturnColor, directions));
  } else passpass = false;
  console.log('passpass', passpass);

  if (passpass) {
    //パスパス強制終了
    alert(`両者おける場所がなくなったため決着です.`);
  } else if (pass) {
    //片方パスの表示
    if (newturnColor === 1) alert('白のおける場所がないためもう一度黒の番です。');
    else {
      alert('黒のおける場所がないためもう一度白の番です。');
    }
  }
  newturnColor = 2 / newturnColor;
  if (pass === true && passpass === false) newturnColor = 2 / newturnColor;
  //~~~~~~~~~return~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div key={`${x}-${y}`} onClick={() => clickHandler(x, y)} className={styles.cell}>
              {color === 1 && <div className={styles.stone} />}
              {color === 2 && <div className={styles.stonew} />}

              {color === 0 &&
                colorcheckvec(x, y, turnColor, board, directions).some((k) => k > 0) && (
                  <div className={styles.bluestone} />
                )}
            </div>
          )),
        )}
      </div>
      {passpass === true && sum_b > sum_w && (
        <div className={styles.result}>
          <p>
            {sum_b}対{sum_w}で黒の勝利です
          </p>
        </div>
      )}
      {passpass === true && sum_b === sum_w && (
        <div className={styles.result}>
          <p>
            {sum_b}対{sum_w}で引き分けです
          </p>
        </div>
      )}
      {passpass === true && sum_b < sum_w && (
        <div className={styles.result}>
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
