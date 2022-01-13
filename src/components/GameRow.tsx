import React from "react";
import { GameTile, GameTileState } from "./GameTile";

interface GameRowProps {
  word: string;
  tileStates: GameTileState[];
  wordLength: number;
  rowNumber: number;
  isActive: boolean;
  onSubmit: (event: React.MouseEvent) => void;
  updateTileState: (tile: number) => (newState: GameTileState) => void;
}

const GameRow = ({
  word,
  tileStates,
  wordLength,
  rowNumber,
  isActive,
  onSubmit,
  updateTileState,
}: GameRowProps) => {

  return (
    <div className="c-game-row">
      {[...Array(wordLength).keys()].map((tileNumber: number) => (
        <GameTile
          key={`row-${rowNumber}-tile-${tileNumber}`}
          letter={word.charAt(tileNumber)}
          tileState={tileStates[tileNumber]}
          setTileState={updateTileState(tileNumber)}
        />
      ))}
      {isActive && (
        <div className="c-submit-button-wrapper">
          <button
            className="c-submit-button"
            disabled={
              word.length < wordLength ||
              tileStates.some(
                (tileState: GameTileState) =>
                  tileState === GameTileState.UNKNOWN
              )
            }
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export { GameRow };
