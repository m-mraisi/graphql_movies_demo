import { db } from '../prisma/db';
import bcrypt from 'bcrypt';

export const userExist = async (email, password) => {
  const userFromDB = await db.user.findUnique({
    where: { email },
  });

  const isPassCorrect = await bcrypt.compare(password, userFromDB.password);
  if (userExist && isPassCorrect) {
    return userFromDB;
  }
  return null;
};
