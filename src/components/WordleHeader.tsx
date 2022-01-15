import React from "react";
import { RestartIcon } from "./RestartIcon";

import "./wordleheader.scss";

interface WordleHeaderProps {
  onRestartClick: React.MouseEventHandler<HTMLButtonElement>;
}

const WordleHeader = ({onRestartClick}: WordleHeaderProps) => {
  return (
    <>
      <header className="c-wordle-header">
        <div className="c-wordle-header__menu"></div>
        <div className="c-wordle-header__title">WORDLE-HELPER</div>
        <div className="c-wordle-header__menu">
          <button className="c-wordle-header__menu-button" onClick={onRestartClick}>
            <RestartIcon />
          </button>
        </div>
      </header>
      <h2 className="c-wordle-subheading">
        An assistant for the popular language game{" "}
        <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a>
      </h2>
    </>
  );
};

export { WordleHeader };
