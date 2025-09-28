import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { fileURLToPath } from 'url';
import { dirname} from 'path';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'), { extensions: ['graphql'] });
const resolversArray = loadFilesSync(path.join(__dirname, '**/*.resolver.js'), {
    extensions: ['js'],
});

const typeDefs = mergeTypeDefs(typesArray);
const resolvers = mergeResolvers(resolversArray);

export { typeDefs, resolvers };
