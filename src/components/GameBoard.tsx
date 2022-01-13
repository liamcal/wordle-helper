import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { GameRow } from "./GameRow";
import { GameTileState } from "./GameTile";

import "./gameboard.scss";
import { useWordleSolver } from "./useWordleSolver";

interface GameBoardProps {
  rowCount: number;
  wordLength: number;
}

const GameBoard = ({ rowCount, wordLength }: GameBoardProps) => {
  const [letters, setLetters] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { wordCandidates, updateWordCandidates, guessHistory } =
    useWordleSolver(`${process.env.PUBLIC_URL}/fiveletterwords.txt`, 5);

  const [gameTileStates, setGameTileStates] = useState<GameTileState[][]>(
    [...Array(rowCount).keys()].map(() =>
      [...Array(wordLength).keys()].map(() => GameTileState.UNKNOWN)
    )
  );

  const updateTileStateForRow =
    (row: number) => (tile: number) => (newState: GameTileState) => {
      setGameTileStates((currentStates: GameTileState[][]) => {
        const copied = currentStates.slice(0);
        copied[row][tile] = newState;
        return copied;
      });
    };

  const words = [...Array(rowCount).keys()].map((i: number) =>
    letters.slice(i * wordLength, (i + 1) * wordLength)
  );

  const currentWord = isFinished ? undefined : words[currentRow];
  const currentStates = isFinished ? undefined : gameTileStates[currentRow];

  const isCurrentWordComplete =
    currentWord?.length === wordLength &&
    gameTileStates[currentRow].every(
      (tileState: GameTileState) => tileState !== GameTileState.UNKNOWN
    );

  const safeIncrementRow = useCallback(() => {
    if (currentRow === rowCount - 1) {
      setIsFinished(true);
    } else {
      setCurrentRow((value: number) => value + 1);
    }
  }, [currentRow, rowCount]);

  const submitWord = useCallback(() => {
    if (currentWord && currentStates) {
      updateWordCandidates({
        word: currentWord,
        letterStates: currentStates,
      });
      safeIncrementRow();
    }
  }, [currentStates, currentWord, safeIncrementRow, updateWordCandidates]);

  const onKeyDown = useCallback(
    (keyEvent: KeyboardEvent) => {
      const key = keyEvent.key;
      if (
        key.match(/[a-z]/i) &&
        key.length === 1 &&
        !isFinished &&
        currentWord!.length < wordLength
      ) {
        setLetters((currentLetters: string) => currentLetters + key);
      } else if (key === "Enter" && isCurrentWordComplete) {
        submitWord();
      } else if (
        key === "Backspace" &&
        !isFinished &&
        currentWord!.length > 0
      ) {
        updateTileStateForRow(currentRow)(currentWord!.length - 1)(
          GameTileState.UNKNOWN
        );
        setLetters((currentLetters: string) =>
          currentLetters.slice(0, currentLetters.length - 1)
        );
      }
    },
    [
      currentRow,
      currentWord,
      isCurrentWordComplete,
      isFinished,
      submitWord,
      wordLength,
    ]
  );

  useLayoutEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    if (guessHistory.length > 0) {
      console.log(wordCandidates);
    }
  }, [wordCandidates, guessHistory]);

  return (
    <div>
      <div className="c-game-board-container">
        <div className="c-game-board">
          {[...Array(rowCount).keys()].map((rowNumber: number) => (
            <GameRow
              key={`row-${rowNumber}`}
              tileStates={gameTileStates[rowNumber]}
              updateTileState={updateTileStateForRow(rowNumber)}
              wordLength={wordLength}
              rowNumber={rowNumber}
              word={words[rowNumber]}
              isActive={rowNumber === currentRow && !isFinished}
              onSubmit={() => {
                if (isCurrentWordComplete) {
                  submitWord();
                }
              }}
            />
          ))}
        </div>
        {guessHistory.length > 0 && (
          <div style={{ display: "flex" }}>
            <textarea rows={25} cols={6} readOnly={true} value={wordCandidates.join("\n")}/>
          </div>
        )}
      </div>
      <hr />
    </div>
  );
};

export { GameBoard };
