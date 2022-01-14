import React from "react";
import { BackspaceIcon } from "./BackspaceIcon";
import { GameKeyboardKey } from "./GameKeyboardKey";

interface GameKeyboardRowProps {
  letterKeys: string[];
  onLetterClick: (letter: string) => () => void;
  hasSpacers?: boolean;
  hasEnterKey?: boolean;
  hasBackspaceKey?: boolean;
  onEnterClick?: () => void;
  onBackspaceClick?: () => void;
  isEnterKeyDisabled?: boolean;
}

const GameKeyboardRow = ({
  letterKeys,
  onLetterClick,
  hasSpacers = false,
  hasEnterKey = false,
  hasBackspaceKey = false,
  onEnterClick = () => {},
  onBackspaceClick = () => {},
  isEnterKeyDisabled = false,
}: GameKeyboardRowProps) => {
  return (
    <div className="c-keyboard-row">
      {hasSpacers && <div className="c-keyboard-spacer" />}
      {hasEnterKey && (
        <GameKeyboardKey
          key={"keyboard-key-enter"}
          keyCharacter="Enter"
          isLargeKey={true}
          onKeyClick={onEnterClick}
          isDisabled={isEnterKeyDisabled}
        />
      )}
      {letterKeys.map((letterKey: string) => (
        <GameKeyboardKey
          key={`keyboard-key-${letterKey}`}
          keyCharacter={letterKey}
          onKeyClick={onLetterClick(letterKey)}
        />
      ))}
      {hasBackspaceKey && (
        <GameKeyboardKey
          key={"keyboard-key-backspace"}
          keyCharacter={<BackspaceIcon />}
          isLargeKey={true}
          onKeyClick={onBackspaceClick}
        />
      )}
      {hasSpacers && <div className="c-keyboard-spacer" />}
    </div>
  );
};

export { GameKeyboardRow };
