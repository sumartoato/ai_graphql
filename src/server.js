const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
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
  app.use(express.json({ limit: '10mb' }));
  app.use(logger);

  // REST routes
  app.use('/api', routes);

  // Redirect root ke /graphql
  app.get('/', (_req, res) => res.redirect('/graphql'));

  // GraphiQL IDE untuk development (GET /graphql)
  if (config.env !== 'production') {
    app.get('/graphql', (_req, res) => {
      res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>AI GraphQL — GraphiQL</title>
  <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.min.css" />
  <style>
    body, #root { height: 100vh; margin: 0; width: 100vw; overflow: hidden; }
    .graphiql-container { height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/graphiql/graphiql.min.js" crossorigin></script>
  <script>
    const fetcher = GraphiQL.createFetcher({ url: '/graphql' });
    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(GraphiQL, {
        fetcher,
        defaultQuery: \`# Selamat datang di AI GraphQL API
# Login dulu untuk mendapatkan token
mutation Login {
  login(input: { email: "admin@aigraphql.com", password: "Admin@123" }) {
    token
    user { id name email role }
  }
}

# Cari tahu schema lengkapnya di tab Docs (atas kanan)
\`,
        headerEditorEnabled: true,
        shouldPersistHeaders: true,
      })
    );
  </script>
</body>
</html>`);
    });
  }

  // Apollo Server v4
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Apollo Sandbox — GraphQL IDE di browser
      ...(config.env !== 'production'
        ? [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
        : []),
    ],
    introspection: config.env !== 'production',
    formatError: (formattedError) => {
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

  // expressMiddleware otomatis handle GET (landing page) + POST (query)
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

  const baseUrl = `http://${config.env === 'production' ? 'your-domain.com' : 'localhost:' + config.port}`;

  console.log(`
  ╔══════════════════════════════════════════════╗
  ║                                              ║
  ║   🚀  AI GraphQL API — RUNNING              ║
  ║                                              ║
  ║   Sandbox  : ${baseUrl}/graphql${' '.repeat(32 - String(baseUrl).length)}║
  ║   Health   : ${baseUrl}/api/health${' '.repeat(33 - String(baseUrl).length)}║
  ║   Env      : ${config.env.padEnd(36)}║
  ║   DB       : ${config.database.name}@${config.database.host.padEnd(17)}║
  ║                                              ║
  ╚══════════════════════════════════════════════╝
  `);
}

startServer().catch((err) => {
  console.error('Gagal start server:', err);
  process.exit(1);
});
