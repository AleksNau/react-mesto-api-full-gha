import React from 'react';

export default function PopupWithForm({isOpen, children, name, buttonValue, onClose, onSubmit,tittle}) {
    return (
        <div className={isOpen ? `popup popup_${name} popup_opened ` : `popup`} onClick={() => {
            onClose();
        }}>
            <div className="popup__conteiner" onClick={event => event.stopPropagation()}>
                <button type="button" className="popup__close-button" onClick={onClose}/>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit(event)
                }} name={`${name}-form`} className={`popup__form popup__form_${name}`} id={`${name}-form`}
                      method="post"
                      >
                        
                    <fieldset className="popup__fieldset">
                    <legend className="popup__title">{tittle}</legend>
                        {children}
                        <button type="submit" className="popup__submit" form={`${name}-form`}
                                value="Сохранить изменения">{buttonValue}</button>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}