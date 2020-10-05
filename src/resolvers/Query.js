function info() {
    return 'this is the API of Hackernews'

}

async function feed(parent, args, context) {
    return context.prisma.link.findMany()
}

module.exports = {
    info, feed
}