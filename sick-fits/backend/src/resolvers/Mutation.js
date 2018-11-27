const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { randomBytes } = require("crypto");
const { transport, generateResetTokenEmail } = require("../mail");
const { hasPermission } = require("../utils");

const PERMISSIONS_UPDATE_PERMISSIONS = ["ADMIN", "PERMISSION_UPDATE"]; // TODO add to middleware?
const ITEM_DELETE_PERMISSIONS = ["ADMIN", "ITEM_DELETE"]; // TODO add to middleware?

const mutations = {
  // return promise
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userID) {
      throw Error("you need to be logged in to do that");
    }
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args,
        user: {
          connect: {
            id: ctx.request.userID,
          },
        },
      },
    });
    return item;
  },

  async updateItem(parent, args, ctx, info) {
    if (!ctx.request.userID) {
      throw Error("you need to be logged in to do that");
    }
    // TODO add comparison of the owner
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
    const caller = await getVerifiedUser(ctx);
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{id title user{id}}`); //info contains data from FE (delete query)
    if (!item) {
      throw Error("requested item does not exists");
    }
    verifyAuthorization(caller, ITEM_DELETE_PERMISSIONS, item.user.id);
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signUp(parent, args, ctx, info) {
    const email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);

    const user = await ctx.db.mutation.createUser(
      { data: { ...args, password, email, permissions: { set: ["USER"] } } },
      info,
    );
    const token = jwt.sign({ userID: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
    return user;
  },
  async signIn(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw Error(`no user with email: ${email} is registered`);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw Error("invalid password");
    }

    token = jwt.sign({ userID: user.id }, process.env.APP_SECRET);

    ctx.response.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
    return user;
  },

  async logout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return ctx.request.userID;
  },

  async requestResetToken(parent, { email }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw Error(`no user with email: ${email} is registered`);
    }

    const resetToken = promisify(randomBytes)(20);
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60; // hour
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken: (await resetToken).toString("hex"), resetTokenExpiry },
    });

    await transport.sendMail({
      to: updatedUser.email,
      from: "hardcore@brazzers.com",
      subject: "Reset Password",
      html: generateResetTokenEmail(updatedUser.resetToken),
    });

    return updatedUser.resetToken;
  },

  async resetPassword(parent, { resetToken, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { resetToken } });
    if (!user) {
      throw Error(`token ${resetToken} does not exist`);
    }
    if (user.resetTokenExpiry < Date.now()) {
      ctx.db.mutation.updateUser({ where: { resetToken }, data: { resetToken: null, resetTokenExpiry: null } });
      throw Error(`token ${resetToken} is expired`);
    }
    const hashedPass = await bcrypt.hash(password, 10);

    const updatedUser = await ctx.db.mutation.updateUser({
      where: { resetToken },
      data: { resetToken: null, resetTokenExpiry: null, password: hashedPass },
    });

    token = jwt.sign({ userID: updatedUser.id }, process.env.APP_SECRET);

    ctx.response.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
    return { mesage: null };
  },

  async updatePermissions(parent, { id, permissions }, ctx, info) {
    const caller = await getVerifiedUser(ctx);
    verifyAuthorization(caller, PERMISSIONS_UPDATE_PERMISSIONS);
    const userToUpdate = await ctx.db.query.user({ where: { id } }, `{permissions}`);
    if (!userToUpdate) {
      throw Error(`requested user was not found`);
    }
    return ctx.db.mutation.updateUser({ where: { id }, data: { permissions: { set: permissions } } }, info);
  },

  async addToCart(parent, { id }, ctx, info) {
    const caller = await getVerifiedUser(ctx);
    const [cartItem] = await ctx.db.query.cartItems(
      { where: { user: { id: caller.id }, item: { id } } },
      `{id quantity}`,
    );

    return ctx.db.mutation.upsertCartItem(
      {
        where: { id: cartItem ? cartItem.id : "" },
        create: { user: { connect: { id: caller.id } }, item: { connect: { id } } },
        update: { quantity: cartItem ? cartItem.quantity + 1 : 1 },
      },
      info,
    );
  },

  async removeCartItem(parent, { id }, ctx, info) {
    const cartItem = await ctx.db.query.cartItem({ where: { id } }, `{user {id}}`);
    if (!cartItem) {
      throw Error("no cartItem found");
    }
    if (ctx.request.userID !== cartItem.user.id) {
      throw Error("you can't delete somebody else's item");
    }
    return ctx.db.mutation.deleteCartItem({ where: { id } }, info);
  },
};

async function getVerifiedUser(ctx) {
  if (!ctx.request.userID) {
    throw Error("you need to be logged in to do that");
  }

  const caller = await ctx.db.query.user({ where: { id: ctx.request.userID } }, `{id permissions}`);
  if (!caller) {
    throw Error(`user from ctx was not found`);
  }

  return caller;
}
function verifyAuthorization(user, expectedPermissions, userIDToCompare = null) {
  const sameUser = user.id === userIDToCompare;
  const permissionIsGranted = hasPermission(user.permissions, expectedPermissions);
  if (!sameUser && !permissionIsGranted) {
    throw Error(`unauthorized,  - request for one of ${expectedPermissions} scopes`);
  }
}

module.exports = mutations;
