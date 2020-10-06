function info() {
    return 'this is the API of Hackernews'

}
/**
 * notice that filter passed in args.filter are only checked against desc or url on the links
 * 
 */
async function feed(parent, args, context) {
    const searchString = args.filter
    let query = {}

    if (searchString) {
        query = {
            OR: [
                { description: { contains: searchString } },
                { url: { contains: searchString } },
            ]
        }
    }

    return context.prisma.link.findMany({ where: query })
}

module.exports = {
    info, feed
}