const userResolvers = require('./userResolvers');
const authResolvers = require('./authResolvers');

const resolvers = {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};

module.exports = resolvers;
