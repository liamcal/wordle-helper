import React from "react";

import "./helpcontent.scss";

const HelpContent = () => {
  return (
    <div className="c-help-content-container">
      <div className="c-help-content">
        <p>
          Wordle-Helper assists playing Wordle by keeping track of all possible
          solutions to today's puzzle
        </p>
        <p>
          After making a guess on Wordle, repeat the guess on Wordle-Helper, and
          tap the tiles to toggle the colors until they match your guess. Then
          hit the enter button to submit
        </p>
        <p>
          Wordle-Helper will suggest possible solutions for the Wordle. Repeat
          the process to narrow the list down further!
        </p>
        <p>
          <em>
            Note that Wordle-Helper will only ever suggest words that could be
            the solution based on previous guesses. Sometimes a better strategy
            is to guess a word that cannot be solution in the hopes of narrowing
            down the list even more
          </em>
        </p>
        <hr />
        <p>
          <strong>
            Play Wordle for free at{" "}
            <a
              href="https://www.powerlanguage.co.uk/wordle/"
              target="_blank"
              rel="noreferrer"
            >
              https://www.powerlanguage.co.uk/wordle/
            </a>
          </strong>
        </p>
      </div>
    </div>
  );
};

export { HelpContent };
