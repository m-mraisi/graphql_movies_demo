export const movieSchema = `#graphql

    input MovieInput{
        name:String
        description:String
        directorName:String
        releaseDate: DateTime
    }

    type DeletedMessage{
        message:String
    }

    input MovieFilter {
        id: ID
        name: String
        directorName: String
        releaseDate: DateTime
    }

    enum MovieSortField {
        id
        name
        description
        directorName
        releaseDate
    }

    enum SortOrder {
        ASC
        DESC
    }

    input MovieSortOrder {
        field: MovieSortField!
        order: SortOrder!
    }

    input GetMoviesInput{
        filter: MovieFilter
        sort: [MovieSortOrder!]
        limit: Int
        offset: Int
    }

    type Query{
        getMovies(input:GetMoviesInput): [Movie!]!
        movie(id: ID!): Movie!
        searchMovie(name: String, description: String): Movie!
    }

    type Mutation{
        createMovie(movie:MovieInput):Movie!
        updateMovie(movie:MovieInput, id:ID!):Movie!
        deleteMovie(id:ID!):DeletedMessage
    }
    
`;
