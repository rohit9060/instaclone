// import files
import configureExpress from "./express.js";
import configureGraphQL from "./graphql.js";
import { connectDB } from "./config/index.js";
import { env } from "./config/index.js";

// connect to database
await connectDB();

// configure express
configureExpress(env.PORT, env.TOKEN_SECRET);

// configure GraphQL
configureGraphQL(env.GRAPH_PORT);
