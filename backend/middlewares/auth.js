const jwt = require('jsonwebtoken');

const { SECRET_CODE = 'SECRET' } = process.env;
const { UnauthorizedError } = require('../errors/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError('Необходима авторизация!'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_CODE);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация!'));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};
