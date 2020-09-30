const { GraphQLServer } = require('graphql-yoga')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const resolvers = {
    Query: {
        info: () => 'this is the API of Hackernews',
        feed: (async (parent, args, context) => context.prisma.link.findMany()),
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const link = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                }
            })
            return link
        }
    },
}

const server = new GraphQLServer({ typeDefs: './src/schema.graphql', resolvers, context: { prisma } })
server.start(() => console.log(`server is running fine`))

