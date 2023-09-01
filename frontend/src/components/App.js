import React, { useEffect, useState } from "react";
import "../index.css";
import Footer from "./Footer.js";
import Header from "./Header.js";
import Main from "./Main.js";
import api from "../utils/Api";
import AddCardPopup from "./AddCardPopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import SubmitPopup from "./SubmitPopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import LoadingText from "../contexts/loadingContext";
import InfoTooltip from "./InfoTooltip";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import authMesto from "../utils/mestoApi";

const App = () => {
  const [cards, setCards] = useState([]);

  //обработчики попапов
  const [isPopupAvatar, setPopupAvatar] = useState(false);
  const [isEditProfilePopupOpen, setPopupProfile] = useState(false);
  const [isAddPlacePopupOpen, setPopupAdd] = useState(false);
  const [isSubmitPopupOpen, setPopupSubmit] = useState(false);
  const [isRegisterPopupOpen, setRegisterPopup] = useState(false);

  const [cardToDelete, setCardToDelete] = useState({});
  //установить карточку
  const [selectedCard, handleCardClick] = useState({});
  //обработчик загрузки
  const [isLoading, setIsLoading] = useState(false);

  //проверка авторизации
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  //статус регистрации
  const [statusReg, setstatusReg] = useState(false);
  const [headerEmail, setHeaderEmail] = useState("");

  //элемент navigate
  const navigate = useNavigate();

  function auth(jwt) {
    return authMesto
      .getContent(jwt)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setCurrentUser({
            username: res.name,
            email: res.email,
          });
          setHeaderEmail(res.email);
          navigate("/")
        }
      })
      .catch(console.error);
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth(token);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);

  const onLogin = (email, password) => {
    authMesto
      .signin(email, password)
      .then((res) => {
        if (!res) throw new Error("Неправильное имя и пароль!");
        if (res.token) {
          setLoggedIn(true);
          localStorage.setItem("jwt", res.token);
          setHeaderEmail(email);
          navigate("/");
        }
      })
      .catch(console.error);
  };

  const onRegister = (email, password) => {
    return authMesto
      .registration(email, password)
      .then((res) => {
        if (res) {
          setstatusReg(true);
          navigate("/sign-in");
        }
      })
      .catch(() => {
        console.error();
        setstatusReg(false);
      })
        .finally(()=> {setRegisterPopup(true);})
  };
  function closeAllPopups() {
    setPopupAvatar(false);
    setPopupProfile(false);
    setPopupAdd(false);
    setPopupSubmit(false);
    setRegisterPopup(false);
    handleCardClick({});
  }

  const isOpen =
    isPopupAvatar ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard.link;

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }

    if (isOpen) {
      // навешиваем только при открытии
      document.addEventListener("keydown", closeByEscape);
      return () => {
        document.removeEventListener("keydown", closeByEscape);
      };
    }
  }, [isOpen]);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    if (!isLiked) {
      api
        .putLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard.data : c))
          );
        })
        .catch(console.error);
    } else {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard.data : c))
          );
        })
        .catch(console.error);
    }
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id, localStorage.getItem("jwt"))
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .setName(data,localStorage.getItem("jwt"))
      .then((newUser) => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api
      .sendAvatar(data.avatar,localStorage.getItem("jwt"))
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api
      .newCard(data.name, data.link, localStorage.getItem("jwt"))
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }

  function signOut() {
    localStorage.removeItem("jwt");
    setHeaderEmail("");
    setLoggedIn(false);
    navigate("/sign-in");
  }

  React.useEffect(() => {
    Promise.all([api.getProfileInfo(localStorage.getItem("jwt")), api.getCards(localStorage.getItem("jwt"))])
      .then(([info, cards]) => {
        setCurrentUser(info);
        setCards(cards);
      })
      .catch(console.error);
  }, [loggedIn]);

  return (
    <div className="root">
      <LoadingText.Provider value={isLoading}>
        <CurrentUserContext.Provider value={currentUser}>
          <div className="page">
            <Header email={headerEmail} signOut={signOut} />

            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    loggedIn={loggedIn}
                    component={Main}
                    cards={cards}
                    isPopupSubmit={isSubmitPopupOpen}
                    handleEditAvatarClick={setPopupAvatar}
                    handleEditProfileClick={setPopupProfile}
                    onSubmitDelete={setPopupSubmit}
                    handleAddPlaceClick={setPopupAdd}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    setCardToDelete={setCardToDelete}
                  />
                }
              />
              <Route
                path="/sign-up"
                element={<Register onRegister={onRegister} />}
              />
              <Route
                path="/sign-in"
                element={<Login onLogin={onLogin} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
              <Route
                element={
                  loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
                }
              />
            </Routes>
            <Footer />
          </div>

          <AddCardPopup
            isOpen={isAddPlacePopupOpen}
            name={"add"}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            popupName={"profile"}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isPopupAvatar}
            name={"avatar"}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <SubmitPopup
            isOpen={isSubmitPopupOpen}
            name={"remove"}
            onClose={closeAllPopups}
            onDelete={handleCardDelete}
            cardToDelete={cardToDelete}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <InfoTooltip
            isOpen={isRegisterPopupOpen}
            name={"register"}
            onClose={closeAllPopups}
            statusReg={statusReg}
          />
        </CurrentUserContext.Provider>
      </LoadingText.Provider>
    </div>
  );
};

export default App;
