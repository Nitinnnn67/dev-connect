const LocalStrategy = require("passport-local");
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user.js");

module.exports = function(passport) {
// ==================== Local Strategy ====================

passport.use(new LocalStrategy(User.authenticate()));

// ==================== GitHub Strategy ====================

    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
        passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL || 'http://localhost:5000'}/auth/github/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ githubId: profile.id });
            if (user) return done(null, user);

            const email = profile.emails?.[0]?.value || `${profile.username}@github.user`;
            user = await User.findOne({ email });

            if (user) {
                user.githubId = profile.id;
                user.github = profile.profileUrl;
                await user.save();
                return done(null, user);
            }

            const newUser = new User({
                username: profile.username || profile.displayName.replace(/\s+/g, '').toLowerCase(),
                email,
                name: profile.displayName || profile.username,
                githubId: profile.id,
                github: profile.profileUrl,
                profilePicture: profile.photos?.[0]?.value
            });

            await newUser.save();
            done(null, newUser);
        } catch (error) {
            done(error, null);
        }
        }));
    } else {
        console.log('⚠️  GitHub OAuth not configured - Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to .env');
    }

    // ==================== Google Strategy ====================
    // Only configure if credentials are provided
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL || 'http://localhost:5000'}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) return done(null, user);

            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                user.googleId = profile.id;
                await user.save();
                return done(null, user);
            }

            const newUser = new User({
                username: profile.emails[0].value.split('@')[0] + Math.floor(Math.random() * 1000),
                email: profile.emails[0].value,
                name: profile.displayName,
                googleId: profile.id,
                profilePicture: profile.photos[0]?.value
            });

            await newUser.save();
            done(null, newUser);
        } catch (error) {
            done(error, null);
        }
        }));
    } else {
        console.log('⚠️  Google OAuth not configured - Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env');
    }

    // ==================== Serialize & Deserialize ====================
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};