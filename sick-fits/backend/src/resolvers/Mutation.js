const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mutations = {
  // return promise
  async createItem(parent, args, ctx, info) {
    // console.log(args);
    // console.log(ctx);
    // console.log(info);
    // const item = await ctx.db.mutation.createItem({ data: { ...args } }, info);
    // const item = await ctx.db.mutation.createItem({ data: { ...args } }, info);
    const item = await ctx.db.mutation.createItem({ data: { ...args } });
    return item;
  },

  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    const item = await ctx.db.mutation.updateItem(
      {
        data: updates,
        where: { id: args.id },
      },
      // this is the type which needs to be returned
      info,
    );
    return item;
  },

  async deleteItem(parent, args, ctx, info) {
    // 1. find the item
    // 2.check permissions (owner or has permission to delete it)
    // delete the item
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{id title}`); //info contains data from FE (delete query)
    if (!item) {
      console.error("Item not present");
      return null;
    }
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signUp(parent, args, ctx, info) {
    const email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);

    const user = ctx.db.mutation.createUser(
      { data: { ...args, password, email, permissions: { set: ["USER"] } } },
      info,
    );
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    console.log(ctx);
    ctx.response.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
    return user;
  },
};

module.exports = mutations;
