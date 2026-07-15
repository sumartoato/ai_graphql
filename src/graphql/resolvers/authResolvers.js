const authResolvers = {
  Mutation: {
    login: async (_, { email, password }, { db }) => {
      // TODO: implementasi login
      return null;
    },
    register: async (_, { input }, { db }) => {
      // TODO: implementasi register
      return null;
    },
  },
};

module.exports = authResolvers;
