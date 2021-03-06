const init = (app, data) => {
    const config = require('./config');
    const passport = require('passport');
    const {
        Strategy,
        ExtractJwt,
    } = require('passport-jwt');
    const LocalStrategy = require('passport-local').Strategy;
    const cookieParser = require('cookie-parser');
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWT_SECRET,
        issuer: config.JWT_ISS,
    };
    const localOpts = {
        usernameField: 'email',
        passwordField: 'password',
    };

    // passport.use(new LocalStrategy(localOpts,
    //     async (email, password, done) => {
    //         const userFound = await data.user.getByEmail(email);
    //         try {
    //             if (userFound) {
    //                 return done(null, userFound);
    //             }
    //             return done('Not authenticated', false);
    //         } catch (err) {
    //             return done(err);
    //         }
    //     }
    // ));

    passport.use('jwt', new Strategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: opts.secretOrKey,
        },
        async (jwtPayload, done) => {
            const userFound = await data.user.getById(jwtPayload.sub);
            try {
                if (userFound) {
                    return done(null, userFound);
                }
                return done('Not authenticated', false);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.use('jwt-more-data', new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: opts.secretOrKey,
    },
    async (jwtPayload, done) => {
        console.log('-----------> server/config/auth', jwtPayload);
        // jwtPayload has no id property
        // data has no use nor getById method
        // const userFound = await data.user.getById(jwtPayload.sub);
        // console.log(userFound);
        // try {
        //     if (userFound) {
        //         return done(null, userFound);
        //     }
        //     return done('Not authenticated', false);
        // } catch (err) {
        //     return done(err);
        // }
    }
));

    passport.use('jwt-admin', new Strategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: opts.secretOrKey,
        },
        async (jwtPayload, done) => {
            const userFound = await data.user.getById(jwtPayload.sub);

            try {
                if (userFound && userFound.isAdmin === true) {
                    return done(null, userFound);
                }
                return done('You don\'t have permissions to access this resource', false);
            } catch (err) {
                return done(err);
            }
        }
    ));
    app.use(cookieParser());
    app.use(passport.initialize());
};

module.exports = {
    init,
};
