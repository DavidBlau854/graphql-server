const { GraphQLServer } = require('graphql-yoga')
const typeDefs = `
type Query {
    info: String
}
`

const resolvers = {
    Query: { info: () => `this is the API of hackernews clone` }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log(`server is running fine`))