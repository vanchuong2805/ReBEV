import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql/index.js';
async function run() {
    const PORT = process.env.PORT || 3000;
    dotenv.config();
    const app = express();
    app.use(express.json());

    const graphqlServer = new ApolloServer({ typeDefs, resolvers });
    await graphqlServer.start();
    graphqlServer.applyMiddleware({ app});
    app.listen(PORT, () => {
        console.log(`App is running. http://localhost:${PORT}`);
    });
}

run();
