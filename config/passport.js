const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: '360897187474-3sa8smetkq9ka6oa6idttef1jlahmheh.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    const newUser = {
        googleId: profile.id,
        email: profile.emails[0].value
    };

    try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            done(null, user);
        } else {
            user = await User.create(newUser);
            done(null, user);
        }
    } catch (err) {
        console.error(err);
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});
