/**
 * Created by bshen on 11/01/15.
 */
'use strict';
angular.module('app.controllers.payment', []).controller('PaymentCtrl', [
    '$scope', 'Logger', '$http', 'Auth', '$state',
    function($scope, Logger, $http, Auth, $state) {

        $scope.handleStripe = function(status, response){
            if(response.error) {
                // there was an error. Fix it.
            } else {
                // got stripe token, now charge it or smt
                $http
                    .post(appConfig.appUrl + '/payment/pay', {
                        stripeToken: response.id,
                        email: 'billy.shen@noos.fr',
                        productId: 1,
                        card: {
                            brand: response.card.brand,
                            country: response.card.country,
                            last4: response.card.last4
                        }
                    })
                    .then(function(response){
                        console.log(response);
                    }, function(err){
                        console.log(err);
                    });
            }
        }





    }
]);