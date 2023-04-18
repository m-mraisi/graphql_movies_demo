export const reviewSchema = `#graphql
    type DeletedMessage{
        message:String
    }

    input ReviewInput{
        movieId: ID!
        rating:Int
        comment: String
    }
    input ReviewFilter {
        id: ID
        movieId: ID
        userId: ID
        rating:Int
    }

    enum ReviewSortField {
        id
        movieId
        userId
        rating
    }

    enum SortOrder {
        ASC
        DESC
    }

    input ReviewSortOrder {
        field: ReviewSortField!
        order: SortOrder!
    }

    input GetReviewsInput{
        filter: ReviewFilter
        sort: [ReviewSortOrder!]
        limit: Int
        offset: Int
    }

    type Query{
        getReviews(input:GetReviewsInput): [Review!]!
    }

    type Mutation{
        createReview(review:ReviewInput):Review!
        updateReview(review:ReviewInput):Review!
        deleteReview(movieId:ID!):DeletedMessage
    }

`;
