import React from "react";

export default function ImagePopup({ card, onClose }) {
  return (
    <div
      className={card.link ? "popup popup_image-zoom popup_opened" : "popup"}
      onClick={() => {
        onClose();
      }}
    >
      <div
        className="popup__conteiner-zoom"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="popup__close-button"
          onClick={() => onClose()}
        />
        <img src={card.link} alt={card.name} className="popup__image" />
        <p className="popup__place-name">{card.name}</p>
      </div>
    </div>
  );
}
