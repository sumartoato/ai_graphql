const { gql } = require('graphql-tag');

const typeDefs = gql`
  scalar DateTime

  # ─── User ───────────────────────────────────────────
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    role: String
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
    role: String
  }

  # ─── Auth ───────────────────────────────────────────
  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  # ─── Pagination ─────────────────────────────────────
  type UsersResult {
    data: [User!]!
    total: Int!
    page: Int!
    limit: Int!
  }

  # ─── Root ───────────────────────────────────────────
  type Query {
    """Ambil semua user (admin only)"""
    users(page: Int = 1, limit: Int = 10): UsersResult!

    """Ambil user by ID"""
    user(id: ID!): User

    """Ambil profil user yang sedang login"""
    me: User
  }

  type Mutation {
    # Auth
    login(input: LoginInput!): AuthPayload!
    register(input: RegisterInput!): AuthPayload!

    # User CRUD
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
