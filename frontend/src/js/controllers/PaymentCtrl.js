/**
 * Created by bshen on 11/01/15.
 */
'use strict';
angular.module('app.controllers.payment', []).controller('PaymentCtrl', [
    '$scope', 'Logger', '$sailsSocket', 'Auth', '$state',
    function($scope, Logger, $sailsSocket, Auth, $state) {

        $scope.handleStripe = function(status, response){
            if(response.error) {
                // there was an error. Fix it.
            } else {
                // got stripe token, now charge it or smt
                $sailsSocket
                    .post(appConfig.appUrl + '/payment/pay', {
                        stripeToken: response.id,
                        currency: r
                    })
            }
        }





    }
]);