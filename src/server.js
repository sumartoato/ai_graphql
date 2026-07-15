const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const config = require('./config');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { authMiddleware } = require('./middleware/auth');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors(config.cors));
  app.use(express.json());
  app.use(logger);
  app.use(authMiddleware);

  // REST routes
  app.use('/api', routes);

  // Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        user: req.user,
        db: {}, // TODO: inject database connection
      };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  // Error handler
  app.use(errorHandler);

  // Start server
  app.listen(config.port, () => {
    console.log(`
  🚀 Server ready at http://localhost:${config.port}
  📭 GraphQL at http://localhost:${config.port}${apolloServer.graphqlPath}
  🌍 Environment: ${config.env}
    `);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
