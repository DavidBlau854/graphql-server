const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { APP_SECRET, getUserId } = require('../utils')
const { newLink } = require('./Subscription')


function post(parent, args, context, info) {
    const userId = getUserId(context)

    const link = context.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId } }
        }
    })

    context.pubsub.publish('NEW_LINK', link)
    return link
}

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.user.create({ data: { ...args, password } })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return new AuthPayload(token, user)

}

async function login(parent, args, context, info) {
    const user = await context.prisma.user.findOne({ where: { email: args.email } })
    if (!user) throw new Error("no such user found")
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) throw new Error("password not valid")
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return new AuthPayload(token, user)
}

async function vote(parent, args, context, info) {
    const userId = getUserId(context)

    throwIfVoteExists(args.linkId, userId)

    const newVote = context.prisma.vote.create({
        data: {
            user: { connect: { id: userId } },
            link: { connect: { id: Number(args.linkId) } }
        }
    })
    context.pubsub.publish("NEW_VOTE", newVote)
    return newVote
}


async function throwIfVoteExists(linkId, userId) {
    const vote = await context.prisma.vote.findOne({
        where: {
            linkId_userId: {
                linkId: Number(linkId),
                userId: userId
            }
        }
    })

    if (Boolean(vote)) throw new Error('Already voted for that link', linkId)
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
    post,
    vote
}