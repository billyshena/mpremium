/**
 * Created by bshen on 11/01/15.
 */
var stripe = require("stripe")("sk_test_soc2iNWo7QPvYjUNJ1oML6OO");
module.exports = {


    pay: function(req,res){
        if(!req.param('stripeToken') || !req.param('card') || !req.param('email') || !req.param('productId')){
            return ErrorService.sendError(400, 'parameters', req, res);
        }
        Client
            .findOrCreate(
                {
                    email: req.param('email') },
                {
                    email: req.param('email')
                }
            )
            .exec(function(err, client){
                if(err){
                    return ErrorService.sendError(500, err, req, res);
                }

                if(!user){
                    return ErrorService.sendError(500, 'User object not found', req, res);
                }

                var charge = stripe.charges.create({
                    amount: 1000, // amount in cents, again
                    currency: "eur",
                    card: req.param("stripeToken"),
                    description: client.email
                }, function(err, charge) {
                    if (err && err.type === 'StripeCardError') {
                        // The card has been declined
                        return sails.log('card', 'declined', err);
                    }

                    async.parallel(

                        {
                            /* Create Card object */
                            createCard: function(cb){
                                Card
                                    .create(req.param('card'))
                                    .exec(cb);
                            },

                            /* Create the Sale object */
                            createSale: function(cb2){
                                Sale
                                    .create({
                                        product: req.param('productId'),
                                        client: client.id
                                    })
                                    .exec(cb2);
                            }
                        },
                        function(err){
                            if(err){
                                return ErrorService.sendError(500, err, req, res);
                            }
                            sails.log('Payment', 'DONE');
                            return res.json(200);
                        }
                    );
                });
            });
    }







};