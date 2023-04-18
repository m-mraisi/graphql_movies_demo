import { db } from '../prisma/db';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper';

export const reviewResolver = {
  Query: {
    getReviews: async (_, { input }, context: any) => {
      try {
        const { user } = context;
        const { filter, sort, limit, offset } = input;

        // Build the query object
        const query: any = {};
        if (filter) {
          const filters: string[] = ['id', 'movieId', 'userId', 'rating'];

          filters.forEach((filterType) => {
            if (filter[filterType]) {
              query[filterType] = parseInt(filter[filterType]);
            }
          });
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

        const reviews = await db.review.findMany({
          where: query,
          orderBy: sortOrder,
          ...pagination,
        });

        const userReviews = reviews.filter((r) => r.userId === user?.userId);
        const otherReviews = reviews.filter((r) => r.userId !== user?.userId);

        const sortedReviews = userReviews.concat(otherReviews);

        return sortedReviews;
      } catch (error) {
        return throwCustomError(error, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
  },

  Mutation: {
    createReview: async (_, { review }, context: any) => {
      try {
        const { user } = context;
        console.log(user);

        const { movieId, userId, rating, comment } = review;

        if (!movieId) {
          return throwCustomError(
            'Must insert movieId',
            ErrorTypes.BAD_USER_INPUT
          );
        }

        if (!rating) {
          return throwCustomError(
            'Must insert rating',
            ErrorTypes.BAD_USER_INPUT
          );
        }

        const existingReview = await db.review.findFirst({
          where: {
            AND: [{ movieId: parseInt(movieId) }, { userId: user.userId }],
          },
        });

        if (existingReview) {
          return throwCustomError(
            'You have already reviewed this movie',
            ErrorTypes.BAD_USER_INPUT
          );
        }

        const createdReview = await db.review.create({
          data: {
            rating,
            comment,
            movie: { connect: { id: parseInt(movieId) } },
            user: { connect: { id: user.userId } },
          },
        });

        return createdReview;
      } catch (error) {
        return throwCustomError(error, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
    updateReview: async (_, { review }, context: any) => {
      try {
        const { user } = context;

        const { movieId, rating, comment } = review;

        if (!movieId) {
          return throwCustomError(
            'Must insert movieId',
            ErrorTypes.BAD_USER_INPUT
          );
        }

        if (!rating && !comment) {
          return throwCustomError(
            'Must insert at least one field to update',
            ErrorTypes.BAD_USER_INPUT
          );
        }

        const existingReview = await db.review.findFirst({
          where: {
            AND: [{ movieId: parseInt(movieId) }, { userId: user?.userId }],
          },
        });

        if (!existingReview) {
          return throwCustomError(
            'Review not found for this user and movie',
            ErrorTypes.NOT_FOUND
          );
        }

        const updatedReview = await db.review.update({
          where: {
            id: existingReview.id,
          },
          data: {
            rating,
            comment,
          },
        });

        return updatedReview;
      } catch (error) {
        return throwCustomError(error, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
    deleteReview: async (_, { movieId }, context: any) => {
      try {
        const { user } = context;
        const existingReview = await db.review.findFirst({
          where: {
            AND: [
              {
                movieId: parseInt(movieId),
              },
              {
                userId: user?.userId,
              },
            ],
          },
        });

        if (!existingReview) {
          return throwCustomError('Review not found', ErrorTypes.NOT_FOUND);
        }

        const deletedReview = await db.review.delete({
          where: {
            id: existingReview.id,
          },
        });

        return {
          message: 'review successfully deleted!',
        };
      } catch (error) {
        return throwCustomError(error, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
  },
};
