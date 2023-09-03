class Api {
  constructor(url) {
    this._url = url;
  }

  _checkResponse(response) {
    if (response.ok) {
      return response.json();
    }

    return Promise.reject(`Ошибка: ${response.status}`);
  }

  //функция отрисовки стандартных карточек
  getCards(token) {
    return fetch(this._url + "/cards", {
      headers: {
        "Authorization" : `Bearer ${token}`
    },
    }).then(this._checkResponse);
  }

  //функция получения и установки имени профиля
  getProfileInfo(token) {
    return fetch(this._url + "/users/me", {
      headers: {
        "Authorization" : `Bearer ${token}`
    },
    }).then(this._checkResponse);
  }

  //функция отправки имени на серв
  setName(profile,token) {
    return fetch(this._url + "/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
    },
      body: JSON.stringify({
        name: profile.Name,
        about: profile.Info,
      }),
    }).then(this._checkResponse);
  }

  //функция добавления новой карточки на серв
  newCard(cardName, cardLink,token) {
    return fetch(this._url + "/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
    },
      body: JSON.stringify({
        name: cardName,
        link: cardLink,
      }),
    }).then(this._checkResponse);
  }

  //функция удаления карточки по id
  deleteCard(id,token) {
    return fetch(this._url + `/cards/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
    },
    }).then(this._checkResponse);
  }

  //функция аватара отправки ссылки аватара
  sendAvatar(avatarLink,token) {
    return fetch(this._url + "/users/me/avatar", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
    },
      body: JSON.stringify({
        avatar: avatarLink,
      }),
    }).then(this._checkResponse);
  }
//возможно убрать "Content-Type": "application/json"
  putLike(cardId) {
    const token = localStorage.getItem("jwt");
    return fetch(this._url + `/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
      },
    }).then(this._checkResponse);
  }

  deleteLike(cardId) {
    const token = localStorage.getItem("jwt");
    return fetch(this._url + `/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
      },
    }).then(this._checkResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return fetch(this._url + `/cards/${cardId}/likes`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        method: "DELETE",
      }).then((res) => this._checkResponse(res));
    } else {
      return fetch(this._url + `/cards/${cardId}/likes`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        method: "PUT",
      }).then((res) => this._checkResponse(res));
    }
  }


}

const api = new Api("http://api.pr15.aleksnau.nomoredomainsicu.ru");
export default api;
