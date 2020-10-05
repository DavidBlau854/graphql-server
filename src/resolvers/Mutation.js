const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { APP_SECRET, getUserId } = require('../utils')


function post(parent, args, context, info) {
    const userId = getUserId(context)

    const link = context.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId } }
        }
    })
    return link
}

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.user.create({ data: { ...args, password } })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    // return { token, user }
    return new AuthPayload(token, user)

}

async function login(parent, args, context, info) {
    const user = await context.prisma.user.findOne({ where: { email: args.email } })
    if (!user) throw new Error("no such user found")
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) throw new Error("password not valid")
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    // return { token, user }
    return new AuthPayload(token, user)
}

class AuthPayload {
    constructor(token, user) {
        this.token = token
        this.user = user
    }

}

module.exports = {
    signup,
    login,
    post
}