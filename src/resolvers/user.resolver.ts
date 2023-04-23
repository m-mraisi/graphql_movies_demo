import { db } from '../prisma/db';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper';
import bcrypt from 'bcrypt';
import { userExist } from '../helpers/user.helper';
import { singIn } from '../jwt/jwt';

export const userResolver = {
  Query: {
    user: async (_, { id }) => {
      // look for user based on their id
      const user = await db.user.findUnique({ where: { id: parseInt(id) } });

      if (!user)
        return throwCustomError('User not found', ErrorTypes.NOT_FOUND);

      return {
        ...user,
      };
    },
  },
  Mutation: {
    signUp: async (_, { user }) => {
      // the user can access this api without the need for authentication
      const { username, email, password } = user;
      const userExist = await db.user.findFirst({
        where: {
          email,
        },
      });
      if (!userExist) {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          const createdUser = await db.user.create({
            data: {
              ...user,
              password: hashedPassword,
            },
          });
          const token = singIn(createdUser.id, createdUser.email);
          return {
            ...createdUser,
            token: {
              token,
            },
          };
        } catch (error) {
          return throwCustomError(error, ErrorTypes.INTERNAL_SERVER_ERROR);
        }
      } else {
        throwCustomError('Email already taken', ErrorTypes.ALREADY_EXISTS);
      }
    },
    login: async (_, { user }) => {
      // the user can access this api without the need for authentication
      const userFromDB = await userExist(user.email, user.password);
      if (userFromDB) {
        const token = singIn(userFromDB.id, userFromDB.email);
        return {
          id: userFromDB.id,
          email: userFromDB.email,
          userName: userFromDB.userName,
          token: {
            token,
          },
        };
      }
      throwCustomError(
        'Invalid email or password entered.',
        ErrorTypes.BAD_USER_INPUT
      );
    },
    changePassword: async (_, { changePassInput }) => {
      const { email, oldPassword, newPassword } = changePassInput;

      const user = await userExist(email, oldPassword);
      if (user) {
        const updatePassword = await db.user.update({
          data: {
            password: await bcrypt.hash(newPassword, 10),
          },
          where: {
            id: user.id,
          },
        });

        const token = singIn(user.id, user.email);

        return {
          id: user.id,
          email: user.email,
          userName: user.userName,
          token: {
            token,
          },
        };
      }
      return throwCustomError('User not found', ErrorTypes.NOT_FOUND);
    },
  },
};
