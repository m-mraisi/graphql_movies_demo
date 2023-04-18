export const reviewTypeDefs = `#graphql
    type Review {
    id:ID!
    movieId:ID!
    userId:ID!
    rating: Int
    comment: String
    }
`;
