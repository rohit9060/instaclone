import { mergeTypeDefs } from "@graphql-tools/merge";
import { hello } from "./hello.js";

export const typeDefs = mergeTypeDefs([hello]);
