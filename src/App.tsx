import React from "react";
import { GameBoard } from "./components/GameBoard";

import "./App.scss";

const App = () => {
  return (
    <div className="App">
      <GameBoard wordLength={5} rowCount={6} />
    </div>
  );
};

export default App;
