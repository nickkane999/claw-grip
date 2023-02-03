const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    email: String
    createdDate: String!
    updatedDate: String!
  }
  type AuthUser {
    user: User!
    token: String!
  }
  input CreateUserInput {
    username: String!
    password: String!
    confirmPassword: String
  }
  input EditUserInput {
    username: String
    password: String
    email: String
  }
  input LoginInput {
    username: String!
    password: String!
  }

  type Chart {
    id: ID!
    name: String!
    type: String!
    createdDate: String!
    updatedDate: String!
    user: User!
    json: String!
    plugins: String
  }

  input CreateChartInput {
    name: String!
    type: String!
    json: String!
    plugins: String
    userId: ID!
  }

  input UpdateChartInput {
    name: String
    type: String
    json: String
    plugins: String
  }

  type Query {
    login(loginInput: LoginInput!): AuthUser!
    user(id: ID!): User
    userByName(username: String!): User
    getUsers(amount: Int!): [User]
    getCharts(amount: Int!): [Chart]
    getChartsByUser(userId: ID!): [Chart]
  }
  type Mutation {
    createUser(createUserInput: CreateUserInput): User!
    createChart(createChartInput: CreateChartInput): Chart!
    updateChart(id: ID!, updateChartInput: UpdateChartInput): Chart!
    deleteChart(id: ID!): Boolean!
    deleteUser(id: ID!): Boolean!
    editUser(id: ID!, editUserInput: EditUserInput): User!
  }
`;
