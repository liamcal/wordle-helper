import React from "react";
import { InfoIcon } from "./Icons/InfoIcon";
import { RestartIcon } from "./Icons/RestartIcon";

import "./gameheader.scss";

interface GameHeaderProps {
  onInfoClick: () => void;
  onRestartClick: () => void;
}

const GameHeader = ({ onInfoClick, onRestartClick }: GameHeaderProps) => {
  return (
    <>
      <header className="c-game-header">
        <div className="c-game-header__item">
          <button className="c-icon-button" onClick={onInfoClick}>
            <InfoIcon />
          </button>
        </div>
        <div className="c-game-header__item c-game-header__item--fill">
          <span className="c-game-header__title">WORDLE-HELPER</span>
        </div>
        <div className="c-game-header__item">
          <button className="c-icon-button" onClick={onRestartClick}>
            <RestartIcon />
          </button>
        </div>
      </header>
      <h2 className="c-game-subheading">
        An assistant for the popular language game{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.powerlanguage.co.uk/wordle/"
        >
          Wordle
        </a>
      </h2>
    </>
  );
};

export { GameHeader };
