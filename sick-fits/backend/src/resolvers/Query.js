const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  //   async items(parent, args, ctx, info) {
  //     const items = await ctx.db.query.items();
  //     return items;
  //   }
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  async me(parent, args, ctx, info) {
    const id = ctx.request.userId;
    if (!id) {
      return null;
    }
    return ctx.db.query.user({ where: { id } }, info);
  },
  async users(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw Error("You need to be logged in to do that");
    }
    const { permissions } = await ctx.db.query.user({ where: { id: userId } }, "{permissions}");
    const permissionsNeeded = ["ADMIN", "PERMISSION_UPDATE"];
    if (!hasPermission(permissions, ["ADMIN", "PERMISSION_UPDATE"])) {
      throw new Error(`You do not have sufficient permissions!\n\
      Required: ${permissionsNeeded}\n\
      You Have: ${permissions}`);
    }
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;
