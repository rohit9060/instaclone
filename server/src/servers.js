// import files
import configureExpress from "./express.js";
import configureGraphQL from "./graphql.js";
import { env, connectDB } from "./utils/index.js";

// connect to database
await connectDB();

// configure express
configureExpress(env.PORT, env.TOKEN_SECRET);

// configure GraphQL
configureGraphQL(env.GRAPH_PORT);
