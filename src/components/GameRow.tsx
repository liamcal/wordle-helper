import React from "react";
import { GameTile, GameTileState } from "./GameTile";

interface GameRowProps {
  word: string;
  tileStates: GameTileState[];
  wordLength: number;
  rowNumber: number;
  isActiveRow: boolean;
  updateTileState: (tile: number) => (newState: GameTileState) => void;
}

const GameRow = ({
  word,
  tileStates,
  wordLength,
  rowNumber,
  isActiveRow,
  updateTileState,
}: GameRowProps) => {

  return (
    <div className="c-game-row">
      {[...Array(wordLength).keys()].map((tileNumber: number) => (
        <GameTile
          key={`row-${rowNumber}-tile-${tileNumber}`}
          isActiveRow={isActiveRow}
          letter={word.charAt(tileNumber)}
          tileState={tileStates[tileNumber]}
          setTileState={updateTileState(tileNumber)}
        />
      ))}
    </div>
  );
};

export { GameRow };
