import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { GameRow } from "./GameRow";
import { GameTileState } from "./GameTile";

import "./gameboard.scss";
import { useWordleSolver } from "./useWordleSolver";
import { GameKeyboard } from "./GameKeyboard";

interface GameBoardProps {
  rowCount: number;
  wordLength: number;
}

const GameBoard = ({ rowCount, wordLength }: GameBoardProps) => {
  const [letters, setLetters] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState("");
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

  const canSubmit =
    isCurrentWordComplete &&
    currentWord !== undefined &&
    currentStates !== undefined;

  const safeIncrementRow = useCallback(() => {
    if (currentRow === rowCount - 1) {
      setIsFinished(true);
    } else {
      setCurrentRow((value: number) => value + 1);
    }
  }, [currentRow, rowCount]);

  const submitWord = useCallback(() => {
    if (canSubmit) {
      updateWordCandidates({
        word: currentWord,
        letterStates: currentStates,
      });
      safeIncrementRow();
      setSelectedCandidate("");
    }
  }, [
    canSubmit,
    currentStates,
    currentWord,
    safeIncrementRow,
    updateWordCandidates,
  ]);

  const safeAddLetter = useCallback(
    (newLetter: string) => {
      if (!isFinished && currentWord!.length < wordLength) {
        setLetters((currentLetters: string) => currentLetters + newLetter);
      }
    },
    [currentWord, isFinished, wordLength]
  );

  const safeRemoveLetter = useCallback(() => {
    if (!isFinished && currentWord!.length > 0) {
      updateTileStateForRow(currentRow)(currentWord!.length - 1)(
        GameTileState.UNKNOWN
      );
      setLetters((currentLetters: string) =>
        currentLetters.slice(0, currentLetters.length - 1)
      );
    }
  }, [currentRow, currentWord, isFinished]);

  const onKeyDown = useCallback(
    (keyEvent: KeyboardEvent) => {
      const key = keyEvent.key;
      if (key.length === 1 && key.match(/[a-z]/i)) {
        safeAddLetter(key);
      } else if (key === "Backspace") {
        safeRemoveLetter();
      } else if (key === "Enter") {
        submitWord();
      }
    },
    [safeAddLetter, safeRemoveLetter, submitWord]
  );

  const onCandidateSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWord = event.target.value;
    setSelectedCandidate(selectedWord);
    setLetters(
      (currentLetters: string) =>
        currentLetters.slice(0, currentRow * wordLength) + selectedWord
    );
  };

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
    <div className="c-game">
      <div className="c-game-board-container">
        <div
          className="c-game-board"
          style={{ width: "350px", height: "420px" }}
        >
          {[...Array(rowCount).keys()].map((rowNumber: number) => (
            <GameRow
              key={`row-${rowNumber}`}
              tileStates={gameTileStates[rowNumber]}
              updateTileState={updateTileStateForRow(rowNumber)}
              wordLength={wordLength}
              rowNumber={rowNumber}
              word={words[rowNumber]}
            />
          ))}
        </div>
      </div>
      <div
        className="c-candidates-container"
      >
        {guessHistory.length > 0 ? (
          <>
            <label htmlFor="candidates" className="c-game-text">
              WORD CANDIDATES:
            </label>
            <select
              name="candidates"
              id="candidates"
              className="c-candidates"
              value={selectedCandidate}
              onChange={onCandidateSelected}
            >
              <option value="" disabled />
              {wordCandidates.map((candidate: string) => (
                <option key={candidate} value={candidate}>
                  {candidate}
                </option>
              ))}
            </select>
          </>
        ) : (
          <label className="c-game-text">SUBMIT YOUR INITIAL GUESS</label>
        )}
      </div>
      <GameKeyboard
        onLetterClick={(letter: string) => () => safeAddLetter(letter)}
        onBackspaceClick={safeRemoveLetter}
        onEnterClick={submitWord}
        isEnterKeyDisabled={!canSubmit}
      />
    </div>
  );
};

export { GameBoard };
