import React from "react";
import LoadingText from "../contexts/loadingContext";
import PopupWithForm from "./PopupWithForm";

export default function AddCardPopup({
  isOpen,
  popupName,
  onClose,
  onAddPlace,
}) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");
  const isLoading = React.useContext(LoadingText);

  React.useEffect(() => {
    if (isOpen) {
      setName("");
      setLink("");
    }
  }, [isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit() {
    onAddPlace({
      name: name,
      link: link,
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      name={popupName}
      buttonValue={isLoading ? "Сохранение..." : "Создать"}
      onClose={onClose}
      onSubmit={handleSubmit}
      tittle={"Новое место"}
      children={
        <>
          <label>
            <input
              name="name"
              id="place"
              type="text"
              className="popup__input popup__input_type_place"
              placeholder="Название"
              minLength="2"
              maxLength="30"
              onChange={handleNameChange}
              value={name}
              required
            />
            <span id="place-error" className="popup__error"></span>
          </label>
          <label>
            <input
              name="link"
              id="image-link"
              type="url"
              className="popup__input popup__input_type_image-link"
              placeholder="Ссылка на картинку"
              onChange={handleLinkChange}
              value={link}
              required
            />
            <span id="image-link-error" className="popup__error"></span>
          </label>
        </>
      }
    />
  );
}
