import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import typeDefs from './schemas/';
import resolvers from './resolvers';
import { context } from './context/context';

const API_PORT = parseInt(process.env.PORT) || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  includeStacktraceInErrorResponses: false, //to exclude stackTrace parameter from error messages
  introspection: true,
});

const main = async () => {
  const { url } = await startStandaloneServer(server, {
    context: context,
    listen: { port: API_PORT },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main();
