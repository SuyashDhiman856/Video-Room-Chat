// auth.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const users = []; // In-memory user storage, replace with a database for production

module.exports = (passport) => {
  passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(user => user.username === username);
    if (!user) return done(null, false, { message: 'User not found' });
    
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password' });
      }
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = users.find(user => user.id === id);
    done(null, user);
  });
};
