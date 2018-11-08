const { forwardTo } = require("prisma-binding");

const Query = {
  //   async items(parent, args, ctx, info) {
  //     const items = await ctx.db.query.items();
  //     return items;
  //   }
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  async me(parent, args, ctx, info) {
    console.log("doslo?");
    console.log(ctx.request);
    console.log(ctx.response);
    const id = ctx.request.userId;
    if (!id) {
      return null;
    }
    return ctx.db.query.user({ where: { id } }, info);
  },
};

module.exports = Query;
