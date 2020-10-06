function info() {
    return 'this is the API of Hackernews'

}
/**
 * 
 *filters firsts and then skips and takes like asked.. 
 */
async function feed(parent, args, context) {
    const { filter, skip, take, orderBy } = args
    let query = {}

    if (filter) {
        query = {
            OR: [
                { description: { contains: filter } },
                { url: { contains: filter } },
            ]
        }
    }

    const links = await context.prisma.link.findMany({ where: query, skip, take, orderBy })
    const count = await context.prisma.link.count({ where: query })
    return new Feed(links, count)
}

class Feed {
    constructor(links, count) {
        this.links = links
        this.count = count
    }
}

module.exports = {
    info, feed
}