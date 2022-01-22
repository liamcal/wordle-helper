import React, { useState } from "react";
import classNames from "classnames";
import { CloseIcon } from "./Icons/CloseIcon";

import "./gameoverlay.scss";

interface GameOverlayProps {
  heading: string;
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const GameOverlay = ({
  heading,
  isVisible,
  onClose,
  children,
}: GameOverlayProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const overlayClassnames = classNames({
    "c-overlay": true,
    "c-overlay--visible": isVisible,
    "c-overlay--closing": isClosing,
  });

  const handleClose = () => {
    setIsClosing(true);
    onClose();
  };

  return (
    <div
      className={overlayClassnames}
      onAnimationEnd={() => setIsClosing(false)}
    >
      <div className="c-overlay__content">
        <header className="c-overlay-heading">
          <h1 className="c-overlay-heading__text">{heading}</h1>
          <button
            className="c-icon-button c-overlay-button"
            onClick={handleClose}
          >
            <CloseIcon />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
};

export { GameOverlay };
