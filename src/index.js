const { GraphQLServer } = require('graphql-yoga')
let links = [
    { id: 'link-0', url: 'www.howto.com', description: 'this is a nice site' },
    { id: 'link-1', url: 'www.google.com', description: 'this site is used for searching' }

]

let idCount = links.length

const resolvers = {
    Query: {
        info: () => 'this is the API of Hackernews',
        feed: () => links,
        getLink: (parent, args) => links.find(link => link.id == `link-${args.id}`)
    },
    Mutation: {
        delete: (parent, args) => {
            const id = args.id
            const linkIndx = links.findIndex(link => link.id == `link-${id}`)
            const deletedLink = links[linkIndx]
            if (linkIndx != -1) {
                links.splice(linkIndx, 1)
            }
            return deletedLink
        },
        put: (parent, args) => {
            const id = args.id
            const linkIndx = links.findIndex(link => link.id == `link-${id}`)

            links[linkIndx].url = args.url || links[linkIndx].url
            links[linkIndx].description = args.description || links[linkIndx].description
            return links[linkIndx]
        },

        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            }
            links.push(link)
            return link
        }
    },


}

const server = new GraphQLServer({ typeDefs: './src/schema.graphql', resolvers })
server.start(() => console.log(`server is running fine`))

// Link: {
//     id: (parent) => parent.id,
//     description: (parent) => parent.description,
//     url: (parent) => parent.url
// }