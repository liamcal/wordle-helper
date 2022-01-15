import React from "react";

import "./wordleheader.scss";

const WordleHeader = () => {
  return (
    <>
      <header className="c-wordle-header">
        <div className="c-wordle-header__menu"></div>
        <div className="c-wordle-header__title">WORDLE-HELPER</div>
        <div className="c-wordle-header__menu"></div>
      </header>
      <h2 className="c-wordle-subheading">
        An assistant for the popular language game{" "}
        <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a>
      </h2>
    </>
  );
};

export { WordleHeader };
