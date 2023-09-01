import React from "react";
import ok from "../images/Union.svg";
import stop from "../images/Unionstop.svg";

export default function InfoTooltip({ isOpen, name, onClose, statusReg }) {
  return (
    <div
      className={isOpen ? `popup popup_${name} popup_opened ` : `popup`}
      onClick={() => {
        onClose();
      }}
    >
      <div
        className="popup__conteiner popup__conteiner_register"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="popup__close-button"
          onClick={onClose}
        />
        <img
          src={statusReg ? ok : stop}
          alt="логотип"
          className="popup__status-image"
        />
        <h2 className="popup__title popup__title_register">
          {statusReg
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте ещё раз."}
        </h2>
      </div>
    </div>
  );
}
