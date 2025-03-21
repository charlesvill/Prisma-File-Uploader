const prisma = require("../prisma/prisma");
const LocalStrategy = require('passport-local').Strategy;
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const bcrypt = require("bcryptjs");


function init(passport, prisma) {
  passport.use(new LocalStrategy(async (username, password, done) => {

    try {
      const user = await prisma.user.findFirst({
        where: {
          username: username,
        },
        select: {
          id: true,
          username: true,
          hash: true,
        },
      });
      if (!user) {
        throw new Error("No user found!");
      }

      const match = await bcrypt.compare(password, user.hash);

      if (!match) {
        return done(null, false, { message: "Incorrect password!" });
      }

      return done(null, user);

    } catch (err) {
      return done(err);
    }
  }
  ))

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: Number(id.id),
        },
        select: {
          id: true,
          username: true,
        }
      });

      done(null, user);
    } catch (error) {
      done(error)
    }
  });

}

module.exports = init;
