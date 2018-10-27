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
  }
};

module.exports = mutations;
