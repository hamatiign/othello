'use client';

import { useState } from 'react';
import styles from './page.module.css';

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
    array.push(colorcheck(X, Y, i, tc, newBoard, directions));
    i++;
  }
  return array;
}
//ある方向に何枚挟めるかを返す TODO -1000減らす
function colorcheck(
  X: number,
  Y: number,
  I: number,
  tc: number,
  newBoard: number[][],
  directions: number[][],
): number {
  //  ＞０で挟める、ー１０００はそのため
  if (newBoard[Y + directions[I][1]] === undefined) return -1000;
  if (newBoard[Y + directions[I][1]][X + directions[I][0]] === undefined) return -1000;
  if (newBoard[Y + directions[I][1]][X + directions[I][0]] === 2 / tc) {
    return 1 + colorcheck(X + directions[I][0], Y + directions[I][1], I, tc, newBoard, directions);
  } else if (newBoard[Y + directions[I][1]][X + directions[I][0]] === tc) return 0;
  else return -1000;
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
//その色をおけるマスがあるか
function canput(newBoard: number[][], turnColor: number, directions: number[][]): boolean {
  let result = false;
  for (let i = 0; i < newBoard.length; i++) {
    for (let j = 0; j < newBoard.length; j++) {
      if (
        colorcheckvec(j, i, turnColor, newBoard, directions).some((k) => k > 0) &&
        newBoard[i][j] === 0
      )
        result = true;
    }
  }
  return result;
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

  //~~~~~~~~~クリックハンドラ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const turnchange = () => setTurnColor(2 / turnColor);

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);

    //実際挟む
    if (
      //挟める かつ 空いてる
      colorcheckvec(x, y, turnColor, newBoard, directions).some((i) => i > 0) &&
      newBoard[y][x] === 0
    ) {
      const cvector = colorcheckvec(x, y, turnColor, newBoard, directions); //関数が再読み込みされて結果が変わるのを防ぐ
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < cvector[i]; j++) {
          const newY = y + (j + 1) * directions[i][1];
          const newX = x + (j + 1) * directions[i][0];
          newBoard[newY][newX] = turnColor;
        }
      }

      newBoard[y][x] = turnColor;

      //パス判定
      setTurnColor(2 / turnColor);
      setBoard(newBoard);
    }
  }; //~~~~~~~~~~~~~~~~ハンドラ終わり~~~~~~~~~~~~~~~~~~~~~~

  const sum_b = calcScore_b(newBoard);
  const sum_w = calcScore_w(newBoard);

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
                colorcheckvec(x, y, turnColor, newBoard, directions).some((k) => k > 0) && (
                  <div className={styles.bluestone} />
                )}
            </div>
          )),
        )}
      </div>
      {canput(newBoard, 2 / turnColor, directions) === false &&
        canput(newBoard, turnColor, directions) === false &&
        sum_b > sum_w && (
          <div className={styles.result}>
            <p>
              {sum_b}対{sum_w}で黒の勝利です
            </p>
          </div>
        )}
      {canput(newBoard, 2 / turnColor, directions) === false &&
        canput(newBoard, turnColor, directions) === false &&
        sum_b === sum_w && (
          <div className={styles.result}>
            <p>
              {sum_b}対{sum_w}で引き分けです
            </p>
          </div>
        )}
      {canput(newBoard, 2 / turnColor, directions) === false &&
        canput(newBoard, turnColor, directions) === false &&
        sum_b < sum_w && (
          <div className={styles.result}>
            <p>
              {sum_b}対{sum_w}で白の勝利です
            </p>
          </div>
        )}
      {canput(newBoard, turnColor, directions) === false &&
        canput(newBoard, 2 / turnColor, directions) === true && (
          <div onClick={() => turnchange()}>
            <button className={styles.passbutton}>パス</button>
          </div>
        )}
    </div>
  );
}
