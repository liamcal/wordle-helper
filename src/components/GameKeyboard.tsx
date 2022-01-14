import React from "react";
import { GameKeyboardRow } from "./GameKeyboardRow";

import "./gamekeyboard.scss";

const topRowKeys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const middleRowKeys = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const bottomRowKeys = ["Z", "X", "C", "V", "B", "N", "M"];

interface GameKeyboardProps {
  onLetterClick: (letter: string) => () => void;
  onEnterClick: () => void;
  onBackspaceClick: () => void;
  isEnterKeyDisabled: boolean;
}

const GameKeyboard = ({
  onLetterClick,
  onEnterClick,
  onBackspaceClick,
  isEnterKeyDisabled,
}: GameKeyboardProps) => {
  return (
    <div className="c-keyboard">
      <GameKeyboardRow letterKeys={topRowKeys} onLetterClick={onLetterClick} />
      <GameKeyboardRow
        letterKeys={middleRowKeys}
        onLetterClick={onLetterClick}
        hasSpacers={true}
      />
      <GameKeyboardRow
        letterKeys={bottomRowKeys}
        onLetterClick={onLetterClick}
        hasEnterKey={true}
        hasBackspaceKey={true}
        onEnterClick={onEnterClick}
        onBackspaceClick={onBackspaceClick}
        isEnterKeyDisabled={isEnterKeyDisabled}
      />
    </div>
  );
};

export { GameKeyboard };
