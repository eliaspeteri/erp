import passport from 'passport';

import crypto from 'crypto';

import { Strategy as LocalStrategy } from 'passport-local';

passport.use(
  new LocalStrategy(
    async (
      username: string,
      password: string,
      done: (error: Error | null, user?: boolean, message?: { message: string }) => void
    ) => {
      const user = await fetch(`http://localhost:8082/users?username=${username}`).then((user) => user.json());
      if (!user)
        return done(null, false, {
          message: 'Incorrect username or password.',
        });

      crypto.pbkdf2(password, user.salt, 310_000, 32, 'sha256', (err, hashedPassword) => {
        if (err) return done(err);
        if (!crypto.timingSafeEqual(user.hashedPassword, hashedPassword))
          return done(null, false, {
            message: 'Incorrect username or password.',
          });
        return done(null, user);
      });
    }
  )
);
passport.serializeUser((user: any, done) => {
  process.nextTick(() => {
    done(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser((user: any, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

export default passport;
