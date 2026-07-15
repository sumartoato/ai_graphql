const { gql } = require('apollo-server-express');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const userTypes = require('../types/user.graphql');
const authTypes = require('../types/auth.graphql');

// Base schema
const baseSchema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;

const typeDefs = mergeTypeDefs([baseSchema, userTypes, authTypes]);

module.exports = typeDefs;
