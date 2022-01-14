import React from "react";
import classnames from "classnames";

interface GameKeyboardKeyProps {
  keyCharacter: string | React.ReactNode;
  onKeyClick: () => void;
  isLargeKey?: boolean;
  isDisabled?: boolean;
}

const GameKeyboardKey = ({
  keyCharacter,
  onKeyClick,
  isLargeKey = false,
  isDisabled = false,
}: GameKeyboardKeyProps) => {
  const buttonClassnames = classnames({
    "c-keyboard-key": true,
    "c-keyboard-key--large": isLargeKey,
  });

  return (
    <button className={buttonClassnames} onClick={onKeyClick} disabled={isDisabled}>
      {keyCharacter}
    </button>
  );
};

export { GameKeyboardKey };
