import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

export default function Card({ cardData, likes, onCardClick, onCardLike,setCardToDelete,setActive,isOpen }) {
    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = cardData.owner === currentUser._id;
    const isLiked = likes.some((user) => user === currentUser._id);
  const cardLikeButtonClassName = `elements__like ${
      isLiked && "elements__like_active"
  }`;
  return (
      <li className="elements__item">
        <img
            src={cardData.link}
            alt={cardData.name}
            className="elements__image"
            onClick={() => {
                onCardClick(cardData);
            }}
        />
        <div className="elements__info">
          <p className="elements__text">{cardData.name}</p>
          <div className="elements__like-container">
            <button
                type="button"
                className={cardLikeButtonClassName}
                onClick={() => onCardLike(cardData)}
            />
            <p className="elements__like-counter">{likes.length}</p>
          </div>
          {isOwn && (
              <button
                  type="button"
                  className="elements__delete"
                  onClick={() => {
                    setActive(!isOpen);
                    setCardToDelete(cardData);
                  }}
              />
          )}
        </div>
      </li>
  );
}