const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { randomBytes } = require("crypto");
const { transport, generateResetTokenEmail } = require("../mail");

const mutations = {
  // return promise
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw Error("You need to be logged in to do that");
    }
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args,
        user: {
          connect: {
            id: ctx.request.userId,
          },
        },
      },
    });
    return item;
  },

  async updateItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw Error("You need to be logged in to do that");
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

    const user = await ctx.db.mutation.createUser(
      { data: { ...args, password, email, permissions: { set: ["USER"] } } },
      info,
    );
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
    return user;
  },
  async signIn(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw Error(`No user with email: ${email} is registered`);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw Error("Invalid password");
    }

    token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.response.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
    return user;
  },

  async logout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return ctx.request.userId;
  },

  async requestResetToken(parent, { email }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw Error(`No user with email: ${email} is registered`);
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
      throw Error(`Token ${resetToken} does not exist`);
    }
    if (user.resetTokenExpiry < Date.now()) {
      ctx.db.mutation.updateUser({ where: { resetToken }, data: { resetToken: null, resetTokenExpiry: null } });
      throw Error(`Token ${resetToken} is expired`);
    }
    const hashedPass = await bcrypt.hash(password, 10);

    const updatedUser = await ctx.db.mutation.updateUser({
      where: { resetToken },
      data: { resetToken: null, resetTokenExpiry: null, password: hashedPass },
    });

    token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    ctx.response.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
    return { mesage: null };
  },
};

module.exports = mutations;
