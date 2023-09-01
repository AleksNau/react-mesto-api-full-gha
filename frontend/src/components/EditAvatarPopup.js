import React from "react";
import PopupWithForm from "./PopupWithForm";
import LoadingText from "../contexts/loadingContext.js";

export default function EditAvatarPopup({
  isOpen,
  name,
  onClose,
  onUpdateAvatar,
}) {
  const imageLink = React.useRef();
  const isLoading = React.useContext(LoadingText);

  function handleSubmit() {
    onUpdateAvatar({
      avatar: imageLink.current.value,
    });
  }
  return (
    <PopupWithForm
      isOpen={isOpen}
      name={name}
      buttonValue={isLoading ? "Сохранение..." : "Сохранить"}
      onClose={onClose}
      onSubmit={handleSubmit}
      tittle={"Обновить аватар"}
      children={
        <>
          <label>
            <input
              name="link"
              ref={imageLink}
              id="avatar-link"
              type="url"
              className="popup__input popup__input_type_image-link"
              placeholder="Ссылка на аватар"
              required
            />
            <span id="avatar-link-error" className="popup__error"></span>
          </label>
        </>
      }
    />
  );
}
