import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql/index.js';
import router from './routes/index.js';
import cors from 'cors';

async function run() {
    dotenv.config();
    const PORT = process.env.PORT || 3000;
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use('/api', router);
    const graphqlServer = new ApolloServer({ typeDefs, resolvers });
    await graphqlServer.start();
    graphqlServer.applyMiddleware({ app });
    app.listen(PORT, () => {
        console.log(`App is running. http://localhost:${PORT}`);
    });
}

run();
