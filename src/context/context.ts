import jwt from 'jsonwebtoken';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper';

const getUser = async (token) => {
  try {
    if (token) {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const context = async ({ req, res }) => {
  if (req.body.operationName === 'IntrospectionQuery') {
    return {};
  }
  // allowing the 'sinUup' and 'login' queries to pass without giving the token

  if (
    req.body.operationName === 'signUp' ||
    req.body.operationName === 'login'
  ) {
    return {};
  }

  // get the user token from the headers
  const token = req.headers.authorization;

  if (!token) {
    throwCustomError('User is not Authorized', ErrorTypes.UNAUTHENTICATED);
  }
  // check for a user with token
  const user = await getUser(token);

  if (!user) {
    throwCustomError('User is Forbidden', ErrorTypes.FORBIDDEN);
  }

  // add the user to the context
  return { user };
};
