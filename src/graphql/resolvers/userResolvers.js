const userResolvers = {
  Query: {
    users: async (_, __, { db }) => {
      // TODO: implementasi query users
      return [];
    },
    user: async (_, { id }, { db }) => {
      // TODO: implementasi query user by id
      return null;
    },
  },
  Mutation: {
    createUser: async (_, { input }, { db }) => {
      // TODO: implementasi create user
      return null;
    },
    updateUser: async (_, { id, input }, { db }) => {
      // TODO: implementasi update user
      return null;
    },
    deleteUser: async (_, { id }, { db }) => {
      // TODO: implementasi delete user
      return false;
    },
  },
};

module.exports = userResolvers;
