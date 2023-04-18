import { movieSchema } from './movie.schema';
import { reviewSchema } from './review.schema';
import { movieTypeDefs } from './typeDefs/movie.typeDefs';
import { reviewTypeDefs } from './typeDefs/review.typeDefs';
import { userTypeDefs } from './typeDefs/user.typeDefs';
import { UserSchema } from './user.schema';

export default [
  userTypeDefs,
  UserSchema,
  movieTypeDefs,
  movieSchema,
  reviewTypeDefs,
  reviewSchema,
];
