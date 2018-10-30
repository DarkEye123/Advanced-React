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
        where: { id: args.id }
      },
      // this is the type which needs to be returned
      info
    );
    return item;
  }
};

module.exports = mutations;
