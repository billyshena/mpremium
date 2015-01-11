/**
 * Created by bshen on 11/01/15.
 */
/**
 * AuthController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 *
 *
 * Contains different login or registration functions:
 *     - Basic login /auth/login
 *     - Facebook /facebook
 *     - LinkedIn /linkedIn
 *     - Google /google
 *
 */

var validator = require('validator');
var sanitizer = require('sanitizer');
var jwt = require('jsonwebtoken');
var https = require('https');

module.exports = {

    /**
     * Action blueprints:
     *    `/auth/login`
     */
    login: function (req, res) {

        // Check for email and password in params sent via the form, if none
        // redirect the browser back to the sign-in form.
        if (!req.param('email') || !req.param('password')) {
            return ErrorService.sendError(400, "Email ou mot de passe manquant", req, res);
        }
        else {
            if (!validator.isEmail(req.param('email'))) {
                return ErrorService.sendError(400, "Adresse email invalide.", req, res);
            }
            // Try to find the user by there email address.
            // findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
            // User.findOneByEmail(req.param('email')).done(function(err, user) {
            User
                .findOne({
                    or: [{
                        schoolEmail: sanitizer.escape(req.param('email'))
                    }, {
                        email: sanitizer.escape(req.param('email'))
                    }]
                })
                .exec(function (err, user) {
                    if (err) {
                        return ErrorService.sendError(400, "Aucun compte avec cette email", req, res);
                    }

                    // If no user was found / invalid credentials
                    if (!user) {
                        return ErrorService.sendError(400, "Email ou mot de passe invalide", req, res);
                    }

                });
        }
    },


    /**
     * Action blueprints:
     *    `/auth/forgot`
     */
    forgot: function (req, res, next) {
        // Check for email
        if (!req.param('email')) {
            return ErrorService.sendError(400, "Adresse email manquante", req, res);
        }
        else {
            User.findOneByEmail(sanitizer.escape(req.param('email'))).exec(function(err, user) {
                if(err || !user) {
                    return ErrorService.sendError(404, err, req, res);
                }
                else {

                    bcrypt.hash(Math.random() + user.email, 10, function (err, hash) {
                        if(err) {
                            return ErrorService.sendError(500, "Error while creating the hash", req, res);
                        }

                        // removing all '/' so we don't have issues after in the URL
                        hash = hash.replace(/\//g,"");

                        // creating the token
                        PassToken.create({
                            owner: user.id,
                            hash: hash
                        }).exec(function(err, token) {
                            if(err) {
                                return ErrorService.sendError(500, "Error while creating the token object", req, res);
                            }

                            // Sending email
                            EmailService.send(
                                {
                                    sender: sails.config.custom.scoledgeEmail,
                                    to: user.email,
                                    subject: 'Redéfinition de mot de passe',
                                    body: "Bonjour,\n\n" +
                                        "Il semblerait que vous ayez égaré votre mot de passe de Scoledge, vous pourrez le redéfinir à cette adresse:\n" +
                                        sails.config.custom.frontendUrl + "/#/redefine/" + token.hash + "\n" +
                                        "Si vous n\'êtes pas l\'auteur de cette demande, veuillez nous contacter au plus vite.\n\n" +
                                        "Bonne journée,\nL\'équipe de Scoledge"
                                }, function (error, success) {
                                    if(error) {
                                        return ErrorService.sendError(500, error, req, res);
                                    }
                                    return res.json(200);
                                }
                            );
                        });
                    });
                }
            });
        }
    },


    /**
     * Action blueprints:
     *    `/auth/token`
     */
    token: function (req, res) {
        // Check for email
        if (!req.param('token')) {
            return ErrorService.sendError(400, "Missing arguments", req, res);
        }
        else {
            PassToken.findOne({
                hash: req.param('token')
            }).exec(function(err, token) {
                if(err || !token) {
                    return res.json({
                        isValid: false
                    });
                }
                else {
                    return res.json({
                        isValid: true
                    });
                }
            });
        }
    },


    /**
     * Action blueprints:
     *    `/auth/token`
     */
    resetPassword: function (req, res) {
        // Check for params
        if (!req.param('token') || !req.param('password')) {
            return ErrorService.sendError(400, "Paramètres manquants", req, res);
        }
        else {
            // finding the token first, to get the owner id
            PassToken.find({
                hash: req.param('token')
            }).exec(function(err, token) {
                if(err) {
                    return ErrorService.sendError(404, err, req, res);
                }
                else {
                    // updating the user
                    User.update({
                        id: token[0].owner
                    }, {
                        id: token[0].owner,
                        password: req.param('password')
                    }).exec(function(err, user) {
                        if(err) {
                            return ErrorService.sendError(500, err, req, res);
                        }
                        else {
                            console.log(user)
                            // finally, removing all the token for the user
                            PassToken.destroy({
                                owner: user[0].id
                            }).exec(function(err) {
                                if(err) {
                                    return ErrorService.sendError(500, err, req, res);
                                }
                                return res.json('ok');
                            });
                        }
                    })

                }
            })
        }
    },

    /**
     * Action blueprints:
     *    `/facebook`
     */
    facebook: function (req, res) {


        var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token?code=' + req.body.code
            + '&client_id=' + req.body.clientId
            + '&client_secret=' + sails.config.custom.fbSecret
            + '&redirect_uri=' + req.body.redirectUri;

        console.log(req.body.redirectUri);

        var graphApiUrl = 'https://graph.facebook.com/me';

        // First, getting an access token
        https.request(accessTokenUrl, function (result) {

            var accessToken = '';

            result.on('data', function (d) {
                accessToken += d;
            });

            result.on('end', function () {
                try {

                    // Step 2. Retrieve profile information about the current user.
                    https.get(graphApiUrl + '?' + accessToken, function (result) {

                        var profile = '';

                        result.on('data', function (d) {
                            profile += d;
                        });

                        result.on('end', function () {

                            profile = JSON.parse(profile);

                            User.findOne({
                                or: [{
                                    facebook: profile.id
                                }, {
                                    email: profile.email
                                }, {
                                    schoolEmail: profile.email
                                }]
                            }).exec(function (err, user) {

                                if (err) {
                                    return ErrorService.sendError(500, err, req, res);
                                }

                                // If the user was found, we log him in
                                if (user && user.id) {

                                    var jsonToken = JSON.stringify({
                                        id: user.id,
                                        type: user.type,
                                        hash: TokenService.issueToken(user)
                                    });

                                    return res.json({
                                        token: jsonToken
                                    });

                                }

                                // Otherwise, we create the account
                                else {

                                    if(!req.param('validationToken')) {
                                        return res.json(403, {message: 'Not allowed to create an account.'});
                                    }

                                    Token
                                        .findOne({
                                            hash: req.param('validationToken')
                                        }).exec(function(err, token) {

                                            User.create({
                                                facebook: profile.id,
                                                email: profile.email,
                                                schoolEmail: token.email,
                                                school: token.school,
                                                firstName: profile.first_name,
                                                lastName: profile.last_name,
                                                middleName: profile.middle_name || null,
                                                gender: profile.gender,
                                                locale: profile.locale,
                                                timezone: profile.timezone,
                                                type: 9,
                                                password: 'test'
                                            }).exec(function (err, user) {

                                                if (err) {
                                                    return ErrorService.sendError(500, err, req, res);
                                                }
                                                sails.log('User created through FB', user);

                                                return res.json({
                                                    token: {
                                                        id: user.id,
                                                        type: user.type,
                                                        school: user.school,
                                                        hash: TokenService.issueToken(user)
                                                    }
                                                });


                                            })
                                        });
                                }

                            })
                        });
                    });
                }
                catch (e) {
                    sails.log.warn('Could not parse response from options.hostname: ' + e);
                }
            })

        }).end();
    },

    /**
     * Action blueprints:
     *    `/linkedIn`
     */
    linkedIn: function (req, res) {

    },

    /**
     * Action blueprints:
     *    `/google`
     */
    google: function (req, res) {

    }

};