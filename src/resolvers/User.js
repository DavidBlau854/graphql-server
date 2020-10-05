function links(parent, args, context,) {
    return context.prisma.user.findOne({ where: { id: parent.id } }).links()
}
module.exports = {
    links
}
/**
 * user:
 * email:"shirel@pink.com", password:"pink"
 */