import React from "react";
import { Cell, Status, Value } from "../../types";
import "./buttonCell.scss";

interface ButtonProps {
  cell: Cell;
  setFace: (value: string) => void;
  setFlagNumber: (value: number) => void;
  flagNumber: number;
  face: string;
  red?: boolean;
}

const ButtonCell: React.FC<ButtonProps> = ({
  cell,
  setFace,
  setFlagNumber,
  flagNumber,
  face,
  red,
}) => {
  const renderContent = (): React.ReactNode => {
    if (cell.status === Status.opened) {
      if (cell.value === Value.bomb) {
        return (
          <span role="img" aria-label="bomb">
            💣
          </span>
        );
      } else {
        return cell.value === 0 ? "" : cell.value;
      }
    } else if (cell.status === Status.flagged) {
      return (
        <span role="img" aria-label="flag">
          🚩
        </span>
      );
    }
  };

  return (
    <div
      onMouseDown={(e) => {
        if (e.button === 0 && face !== "lost" && face !== "win") setFace("oh");
      }}
      onMouseUp={(e) => {
        if (e.button === 0 && face !== "lost" && face !== "win") {
          if (cell.value !== Value.none && cell.value !== Value.bomb)
            cell.status = Status.opened;
          setFace("smile");
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (cell.status === Status.flagged) {
          cell.status = Status.unopened;
          setFlagNumber(++flagNumber);
        } else if (cell.status === Status.unopened) {
          if (flagNumber > 0) {
            cell.status = Status.flagged;
            setFlagNumber(--flagNumber);
          }
        }
      }}
      className={`cell ${
        cell.status === Status.opened ? `opened value-${cell.value}` : ""
      } ${red ? "red" : ""}`}
    >
      {renderContent()}
    </div>
  );
};

export default ButtonCell;
