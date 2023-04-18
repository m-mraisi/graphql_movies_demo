import { db } from '../prisma/db';

export const movieExists = async (movie) => {
  const movieFromDB = await db.movie.findFirst({
    where: { name: movie.name },
  });
  if (movieFromDB) {
    return movieFromDB;
  }
  return null;
};
