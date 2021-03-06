'use strict';


angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'app.services.auth',
    'ui.load',
    'sails.io',
    'app.services.storage',
    'app.services.logger',
    'angularPayments',
    'app.controllers.payment',
    'app.interceptors.auth',
    'pascalprecht.translate'
]);