import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { logger } from "./config/index.js";
import { resolvers } from "./api/graphql/resolvers/index.js";
import { typeDefs } from "./api/graphql/schema/index.js";

function configureGraphQL(PORT) {
  // create client
  const client = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });

  // start server
  startStandaloneServer(client, {
    listen: { port: PORT },
  })
    .then(() => {
      logger.info("GraphQL server started on " + "http://localhost:" + PORT);
    })
    .catch((err) => {
      logger.error(err.message);
    });
}

export default configureGraphQL;
