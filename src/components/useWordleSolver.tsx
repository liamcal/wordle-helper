import { useEffect, useState } from "react";
import { GameTileState } from "./GameTile";

interface WordGuess {
  word: string;
  letterStates: GameTileState[];
}

interface ProcessedGuess extends WordGuess {
  requiredLetters: string[];
  bannedLetters: string[];
}

const letterMatchesState = (
  candidateLetter: string,
  referenceLetter: string,
  referenceState: GameTileState
) => {
  if (referenceState === GameTileState.CORRECT) {
    return candidateLetter === referenceLetter;
  }
  if (
    referenceState === GameTileState.ABSENT ||
    referenceState === GameTileState.PRESENT
  ) {
    return candidateLetter !== referenceLetter;
  }
};

const wordMatchesGuess = (candidateWord: string, guess: ProcessedGuess) => {
  const candidateLetters = candidateWord.split("");
  for (const [i, letter] of candidateLetters.entries()) {
    const matchState = letterMatchesState(
      letter,
      guess.word[i],
      guess.letterStates[i]
    );

    if (!matchState) {
      return false;
    }
    if (guess.bannedLetters.includes(letter)) {
      return false;
    }
  }

  if (
    guess.requiredLetters.some(
      (requiredLetter: string) => !candidateLetters.includes(requiredLetter)
    )
  ) {
    return false;
  }
  return true;
};

const useWordleSolver = (wordLength: number) => {
  const [wordCandidates, setWordCandidates] = useState<string[]>([]);
  const [guessHistory, setGuessHistory] = useState<WordGuess[]>([]);

  const updateWordCandidates = (guess: WordGuess) => {
    if (
      guess.word.length !== wordLength ||
      guess.letterStates.length !== wordLength
    ) {
      console.error(`Invalid guess ${guess}`);
      return;
    }

    const guessLetters = guess.word.split("");

    const bannedLetters = guessLetters.filter(
      (_letter: string, i: number) =>
        guess.letterStates[i] === GameTileState.ABSENT
    );
    const requiredLetters = guessLetters.filter(
      (_letter: string, i: number) =>
        guess.letterStates[i] === GameTileState.PRESENT
    );

    const processedGuess = { ...guess, bannedLetters, requiredLetters };
    setWordCandidates((currentCandidates: string[]) =>
      currentCandidates.filter((word: string) =>
        wordMatchesGuess(word, processedGuess)
      )
    );

    setGuessHistory((pastGuesses: WordGuess[]) => [...pastGuesses, guess]);
  };

  const processWords = (rawWords: string) => {
    setWordCandidates(rawWords.trimEnd().split("\n"));
  };

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/wordlewords.txt`)
      .then((res: Response) => res.text())
      .then((text: string) => {
        processWords(text);
      });
  }, []);

  return {
    wordCandidates,
    updateWordCandidates,
    guessHistory,
  };
};

export { useWordleSolver };
