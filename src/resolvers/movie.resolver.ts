import { db } from '../prisma/db';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper';

export const movieResolver = {
  Query: {
    getMovies: async (_, { input }) => {
      try {
        const { filter, sort, limit, offset } = input;

        // Build the query object
        const query: any = {};
        if (filter) {
          if (filter.id) {
            query.id = parseInt(filter.id);
          }
          if (filter.name) {
            query.name = {
              contains: filter.name,
              mode: 'insensitive',
            };
          }
          if (filter.directorName) {
            query.directorName = {
              contains: filter.directorName,
              mode: 'insensitive',
            };
          }
          if (filter.releaseDate) {
            query.releaseDate = {
              equals: new Date(filter.releaseDate),
            };
          }
        }

        // Build the sort object
        const sortOrder: any[] = [];
        if (sort) {
          sort.forEach((s) => {
            sortOrder.push({
              [s.field]: s.order.toLowerCase(),
            });
          });
        }

        // Build the pagination object
        const pagination: any = {};
        if (limit) {
          pagination.take = limit;
        }
        if (offset) {
          pagination.skip = offset;
        }

        const movies = await db.movie.findMany({
          where: query,
          orderBy: sortOrder,
          ...pagination,
        });

        return movies;
      } catch (error) {
        return throwCustomError(error, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },

    movie: async (_, { id }) => {
      const movie = await db.movie.findUnique({ where: { id: parseInt(id) } });

      console.log(movie);

      if (!movie)
        return throwCustomError('Movie not found', ErrorTypes.NOT_FOUND);

      return {
        ...movie,
      };
    },

    searchMovie: async (_, { name, description }) => {
      let query: any = {};

      // Check if name or description search is provided
      if (name || description) {
        query.OR = [];
        if (name) {
          query.OR.push({ name: { contains: name, mode: 'insensitive' } });
        }
        if (description) {
          query.OR.push({
            description: { contains: description, mode: 'insensitive' },
          });
        }
      }

      const movie = await db.movie.findFirst({ where: query });

      if (!movie) {
        return throwCustomError('Movie not found', ErrorTypes.NOT_FOUND);
      }

      return {
        ...movie,
      };
    },
  },

  Mutation: {
    createMovie: async (_, { movie }) => {
      const { name, description, directorName, releaseDate } = movie;

      const movieFromDB = await db.movie.findFirst({
        where: { name },
      });

      if (movieFromDB)
        return throwCustomError(
          'Movie Already Exists',
          ErrorTypes.ALREADY_EXISTS
        );

      try {
        const addMovie = await db.movie.create({
          data: {
            ...movie,
          },
        });

        if (!movie)
          return throwCustomError(
            'Error while inserting to DB',
            ErrorTypes.BAD_USER_INPUT
          );

        return addMovie;
      } catch (error) {
        return throwCustomError(error, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
    updateMovie: async (_, { movie, id }) => {
      const movieFromDB = await db.movie.findUnique({
        where: { id: parseInt(id) },
      });

      if (!movieFromDB)
        return throwCustomError('Movie not found', ErrorTypes.NOT_FOUND);
      try {
        const updatedMovie = await db.movie.update({
          data: {
            ...movie,
          },
          where: {
            id: parseInt(id),
          },
        });

        return updatedMovie;
      } catch (error) {
        return throwCustomError(error, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
    deleteMovie: async (_, { id }) => {
      const movieExists = await db.movie.findUnique({
        where: { id: parseInt(id) },
      });

      if (!movieExists)
        return throwCustomError('Movie not Found', ErrorTypes.NOT_FOUND);

      try {
        const deleteMovie = await db.movie.delete({
          where: {
            id: parseInt(id),
          },
        });

        return {
          message: 'movie deleted successfully!',
        };
      } catch (error) {
        return throwCustomError(error, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
  },
};
