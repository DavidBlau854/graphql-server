function info() {
    return 'this is the API of Hackernews'

}

function feed(parent, args, context) {
    const { filter, skip, take } = args
    let query = {}

    if (filter) {
        query = {
            OR: [
                { description: { contains: filter } },
                { url: { contains: filter } },
            ]
        }
    }

    return context.prisma.link.findMany({ where: query, skip, take })
}

module.exports = {
    info, feed
}