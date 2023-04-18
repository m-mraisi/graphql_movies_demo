# Apollo GraphQL API - Movies

This project contains a GraphQL API with user and review resolvers. The API uses the Prisma ORM to interact with the database.

## Prerequisites

To run this project, you will need:

- Node.js installed on your machine
- A running PostgreSQL server

## Installation

1. Clone the repository to your local machine
2. Run `npm install` to install the required dependencies
3. Create a `.env` file in the root of the project and set the following environment variables:

```bash
DATABASE_URL=postgresql://yourusername:yourpassword@localhost:5432/yourdatabasename
PORT=3001
ACCESS_TOKEN_SECRET=yourjwtsecret
TOKEN_EXPIRY_TIME="token_expiry_time"
```

4.Run `npm run prisma:migrate` to run the database migrations
5.Run `npm start` to start the GraphQL server

## Usage

The GraphQL server exposes the following endpoints:

- `GET /graphql` - a GraphiQL interface for testing queries and mutations
- `POST /graphql` - the endpoint for executing GraphQL queries and mutations

## Resolvers

### User Resolver

The user resolver provides the following queries and mutations:

#### Queries

- `getUsers`: returns all users in the database
- `user(id: Int!)`: returns a single user by their ID

#### Mutations

- `signUp(user: UserInput!)`: AuthPayload: creates a new user in the database and returns an authentication token
- `login(user: LoginInput!)`: AuthPayload: authenticates a user and returns an authentication token
- `changePassword(changePassInput: ChangePassInput!)`: User: changes a user's password and returns the updated user

### Movie Resolver

The Movie resolver provides the following queries and mutations:

#### Queries

- `getMovies(input:GetMoviesInput): [Movie!]!` : returns all movies and it has filter, sort, and pagination options
- `movie(id: ID!): Movie!` : returns Movie based on it's id
- `searchMovie(name: String, description: String): Movie!` : search the db for movies based on name or description

#### Mutations

- `createMovie(movie:MovieInput):Movie!` : to create a movie in the DB
- `updateMovie(movie:MovieInput, id:ID!):Movie!` : to update an existing movie
- `deleteMovie(id:ID!):DeletedMessage` : to delete a movie

### Review Resolver

The review resolver provides the following queries and mutations:

#### Queries

- `getReviews(input: GetReviewsInput!): [Review!]!`: returns all reviews in the database, filtered and sorted by the provided input parameters

#### Mutations

- `createReview(review: CreateReviewInput!): Review!`: creates a new review in the database
- `updateReview(review:ReviewInput):Review!` : updates an existing review in the db
- `deleteReview(movieId:ID!):DeletedMessage` : delete a review in the DB

## Error Handling

Errors are handled using custom error types defined in the `helpers/error-handler.helper.ts` file. The following error types are defined:

`BAD_USER_INPUT`: the user input is invalid or incomplete
`NOT_FOUND`: the requested resource was not found in the database
`ALREADY_EXISTS`: the requested resource already exists in the database
`INTERNAL_SERVER_ERROR`: an internal server error occurred

## Authentication

Authentication is implemented using JSON Web Tokens (JWT). The jwt/jwt.ts file contains helper functions for generating and verifying JWTs.

To authenticate a user, include their JWT in the `Authorization` header of the HTTP request:

Authorization: Bearer yourjwttoken
