import React from "react";

enum GameTileState {
  UNKNOWN = "unknown",
  CORRECT = "correct",
  PRESENT = "present",
  ABSENT = "absent",
}

interface GameTileProps {
  tileState: GameTileState;
  setTileState: (newState: GameTileState) => void;
  letter?: string;
}

const toggleTileState = (currentState: GameTileState) => {
  if (currentState === GameTileState.ABSENT) {
    return GameTileState.PRESENT;
  }
  if (currentState === GameTileState.PRESENT) {
    return GameTileState.CORRECT;
  }
  if (currentState === GameTileState.CORRECT) {
    return GameTileState.UNKNOWN;
  }
  if (currentState === GameTileState.UNKNOWN) {
    return GameTileState.ABSENT;
  }
  return GameTileState.UNKNOWN;
};

const GameTile = ({ tileState, setTileState, letter = "" }: GameTileProps) => {
  const onTileClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (letter) {
      setTileState(toggleTileState(tileState));
    }
  };

  return (
    <input
      className={`c-game-tile c-game-tile--${tileState}`}
      value={letter}
      onClick={onTileClick}
      readOnly={true}
    />
  );
};

export { GameTile, GameTileState };
