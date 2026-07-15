const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const http = require('http');
const config = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { authenticateUser } = require('./middleware/auth');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Middleware global
  app.use(cors({ origin: config.cors.origin }));
  app.use(express.json());
  app.use(logger);

  // REST routes
  app.use('/api', routes);

  // Apollo Server v4
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: config.env !== 'production',
    formatError: (formattedError) => {
      // Log error di server
      if (formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
        console.error('[GraphQL Error]', formattedError.message);
      }
      return {
        message: formattedError.message,
        code: formattedError.extensions?.code || 'BAD_USER_INPUT',
      };
    },
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({
        user: authenticateUser(req),
      }),
    }),
  );

  // Error handler (REST fallback)
  app.use(errorHandler);

  // Start server
  await new Promise((resolve) => httpServer.listen({ port: config.port }, resolve));

  console.log(`
  ╔══════════════════════════════════════════════╗
  ║                                              ║
  ║   🚀  AI GraphQL API — RUNNING              ║
  ║                                              ║
  ║   GraphQL : http://localhost:${String(config.port).padEnd(5)}/graphql  ║
  ║   Health  : http://localhost:${String(config.port).padEnd(5)}/api/health  ║
  ║   Env     : ${config.env.padEnd(36)}║
  ║   DB      : ${config.database.name}@${config.database.host.padEnd(17)}║
  ║                                              ║
  ╚══════════════════════════════════════════════╝
  `);
}

startServer().catch((err) => {
  console.error('Gagal start server:', err);
  process.exit(1);
});
