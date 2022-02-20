import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import { GameRow } from "./GameRow";
import { GameTileState } from "./GameTile";
import { useWordleSolver } from "./Hooks/useWordleSolver";
import { GameKeyboard } from "./GameKeyboard";
import { GameHeader } from "./GameHeader";

import "./gameboard.scss";
import { GameOverlay } from "./GameOverlay";
import { HelpContent } from "./HelpContent";

interface GameBoardProps {
  rowCount: number;
  wordLength: number;
}

const candidatePlaceholder = "...";
const GameBoard = ({ rowCount, wordLength }: GameBoardProps) => {
  const [letters, setLetters] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isInfoShowing, setIsInfoShowing] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState(candidatePlaceholder);
  const { wordCandidates, updateWordCandidates, guessHistory, resetSolver } =
    useWordleSolver(5);

  const hasSolution = wordCandidates.length === 1;

  const [gameTileStates, setGameTileStates] = useState<GameTileState[][]>(
    [...Array(rowCount).keys()].map(() =>
      [...Array(wordLength).keys()].map(() => GameTileState.UNKNOWN)
    )
  );

  const [boardWidth, setBoardWidth] = useState(0);
  const { ref: boardRef } = useResizeObserver<HTMLDivElement>({
    onResize: ({ height: boardHeight }) => {
      if (boardHeight) {
        setBoardWidth(boardHeight / 1.2 + 20);
      }
    },
  });

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
      setSelectedCandidate(candidatePlaceholder);
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
        safeAddLetter(key.toUpperCase());
      } else if (key === "Backspace") {
        safeRemoveLetter();
      } else if (key === "Enter") {
        submitWord();
      }
    },
    [safeAddLetter, safeRemoveLetter, submitWord]
  );

  const onCandidateSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    selectWord(event.target.value);
  };

  const selectWord = useCallback(
    (word: string) => {
      setSelectedCandidate(word);
      setLetters(
        (currentLetters: string) =>
          currentLetters.slice(0, currentRow * wordLength) + word
      );
    },
    [currentRow, wordLength]
  );

  const restartGame = () => {
    setLetters("");
    setCurrentRow(0);
    setIsFinished(false);
    setSelectedCandidate(candidatePlaceholder);
    setGameTileStates(
      [...Array(rowCount).keys()].map(() =>
        [...Array(wordLength).keys()].map(() => GameTileState.UNKNOWN)
      )
    );
    resetSolver();
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

  useEffect(() => {
    if (hasSolution) {
      selectWord(wordCandidates[0]);
    }
  }, [hasSolution, selectWord, wordCandidates]);

  return (
    <div className="c-game">
      <GameHeader
        onInfoClick={() => setIsInfoShowing(true)}
        onRestartClick={restartGame}
      />
      <div className="c-game-board-container">
        <div
          className="c-game-board"
          ref={boardRef}
          style={{ width: boardWidth }}
        >
          {[...Array(rowCount).keys()].map((rowNumber: number) => (
            <GameRow
              key={`row-${rowNumber}`}
              tileStates={gameTileStates[rowNumber]}
              updateTileState={updateTileStateForRow(rowNumber)}
              wordLength={wordLength}
              rowNumber={rowNumber}
              isActiveRow={rowNumber === currentRow}
              word={words[rowNumber]}
            />
          ))}
        </div>
      </div>
      <div className="c-candidates-container">
        {guessHistory.length > 0 ? (
          <>
            <label htmlFor="candidates" className="c-game-text">
              {hasSolution ? "THE WORDLE IS: ": "WORDLE CANDIDATES: "}
            </label>
            <select
              name="candidates"
              id="candidates"
              className="c-candidates"
              value={selectedCandidate}
              onChange={onCandidateSelected}
            >
              <option value={candidatePlaceholder} disabled>
                {candidatePlaceholder}
              </option>
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

      <GameOverlay
        isVisible={isInfoShowing}
        heading="ABOUT WORDLE-HELPER"
        onClose={() => setIsInfoShowing(false)}
      >
        <HelpContent />
      </GameOverlay>
    </div>
  );
};

export { GameBoard };
