import { mergeResolvers } from "@graphql-tools/merge";
import { Hello } from "./hello.js";

export const resolvers = mergeResolvers([Hello]);
