import React from "react";
import PopupWithForm from "./PopupWithForm";
import LoadingText from "../contexts/loadingContext";

export default function SubmitPopup({
  isOpen,
  name,
  onClose,
  onDelete,
  cardToDelete,
}) {
  const isLoading = React.useContext(LoadingText);

  function handleSubmit() {
    // Передаём значения управляемых компонентов во внешний обработчик
    onDelete(cardToDelete);
  }
  return (
    <PopupWithForm
      isOpen={isOpen}
      name={name}
      buttonValue={isLoading ? "Сохранение..." : "Да"}
      onClose={onClose}
      onSubmit={handleSubmit}
      tittle={"Вы уверены?"}
    />
  );
}
