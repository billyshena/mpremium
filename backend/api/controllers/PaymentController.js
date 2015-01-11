/**
 * Created by bshen on 11/01/15.
 */
var stripe = require("stripe")("sk_test_soc2iNWo7QPvYjUNJ1oML6OO");
module.exports = {


    pay: function(req,res){
        if(!req.param('stripeToken') || !req.param('currency') || !req.param('payment') || !req.param('email')){
            return ErrorService.sendError(400, 'parameters', req, res);
        }
        var payment = req.param('payment');


        User
            .findOrCreate(
                {
                    email: req.param('email') },
                {


                }
            )
            .exec(function(){

            });


        var charge = stripe.charges.create({
            amount: 1000, // amount in cents, again
            currency: "usd",
            card: stripeToken,
            description: "payinguser@example.com"
        }, function(err, charge) {
            if (err && err.type === 'StripeCardError') {
                // The card has been declined
                return sails.log('card', 'declined', err);
            }
        });
    }







};