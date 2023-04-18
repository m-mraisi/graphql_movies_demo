export const movieTypeDefs = `#graphql

    scalar DateTime

    type Movie{
        id:ID!
        name:String
        description:String
        directorName:String
        releaseDate: DateTime
    }
`;
