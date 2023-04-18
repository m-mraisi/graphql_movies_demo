import jwt from 'jsonwebtoken';

export const singIn = (userId, email) => {
  const token = jwt.sign({ userId, email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY_TIME,
  });

  return token;
};
