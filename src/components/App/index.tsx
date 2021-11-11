import React, { useState, useEffect } from "react";
import Cell from "../ButtonCell";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../utils";
import { Face, Status, Value } from "../../types";
import { MAX_COLS, MAX_ROWS } from "../../constans";
import "./app.scss";

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells());
  const [face, setFace] = useState("smile");
  const [time, setTime] = useState(0);
  const [isGameStart, setIsGameStart] = useState(false);
  const [flagNumber, setFlagNumber] = useState(10);
  let timer: NodeJS.Timeout;

  const renderCells = (): React.ReactNode => {
    const checkIsWon = (): void => {
      let numOfOpenedCells = 0;
      for (let i = 0; i < MAX_ROWS; ++i) {
        for (let j = 0; j < MAX_COLS; ++j) {
          if (cells[i][j].status === Status.opened) ++numOfOpenedCells;
        }
      }
      if (numOfOpenedCells === 71) {
        clearInterval(timer);
        setIsGameStart(false);
        setFace("win");
      }
    };

    const handleCellClick = (rowIndex: number, colIndex: number): void => {
      if (face !== "lost") {
        if (!isGameStart) setIsGameStart(true);
        if (cells[rowIndex][colIndex].value === Value.none)
          setCells(openMultipleCells(cells, rowIndex, colIndex));
        if (cells[rowIndex][colIndex].value === Value.bomb) {
          cells[rowIndex][colIndex].red = true;
          for (let i = 0; i < MAX_ROWS; ++i) {
            for (let j = 0; j < MAX_COLS; ++j) {
              if (cells[i][j].value === Value.bomb)
                cells[i][j].status = Status.opened;
            }
          }
          clearInterval(timer);
          setIsGameStart(false);
          setFace("lost");
        }
        checkIsWon();
      }
    };

    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <button
          className="button"
          onClick={() => handleCellClick(rowIndex, colIndex)}
          key={`${rowIndex} - ${colIndex}`}
        >
          <Cell
            cell={cell}
            setFace={setFace}
            face={face}
            flagNumber={flagNumber}
            setFlagNumber={setFlagNumber}
            red={cell.red}
          />
        </button>
      ))
    );
  };

  useEffect(() => {
    if (isGameStart) {
      timer = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [isGameStart]);

  const faceClick = (): void => {
    if (!isGameStart || flagNumber < 10) {
      setFace("smile");
      setIsGameStart(false);
      setTime(0);
      setCells(generateCells());
      setFlagNumber(10);
    }
  };

  return (
    <div className="app">
      <div className="tips">{}</div>
      <div className="header">
        <NumberDisplay value={flagNumber} />
        <div className="face" onClick={faceClick}>
          <span role="img" aria-label="face">
            {face === "smile" && Face.smile}
            {face === "oh" && Face.oh}
            {face === "lost" && Face.lost}
            {face === "win" && Face.win}
          </span>
        </div>
        <NumberDisplay value={time <= 999 ? time : 999} />
      </div>
      <div className="body">{renderCells()}</div>
    </div>
  );
};

export default App;
