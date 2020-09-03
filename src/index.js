const { GraphQLServer } = require('graphql-yoga')
const typeDefs = `
type Query {
    users: [User!]!
    user(id:ID!): User
}

type Mutations { 
    createUer(name:String!):User!
}

type User {
    id: ID!
    name : String!
}
`

const resolvers = {
    Query: { info: () => null }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log(`server is running fine`))