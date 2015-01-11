'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [
        '$rootScope', '$state', '$stateParams', '$sailsSocket', 'Auth',
        function ($rootScope, $state, $stateParams, $sailsSocket, Auth) {
            $rootScope.$on("$stateChangeStart", function (event, toState) {
                if (toState.authenticate && !Auth.isAuthenticated()) {
                    event.preventDefault();
                    $state.go('login');
                }
            });
        }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', '$httpProvider', '$sailsSocketProvider',
      function ($stateProvider,   $urlRouterProvider, $httpProvider, $sailsSocketProvider) {

          $httpProvider.defaults.useXDomain = true;
          delete $httpProvider.defaults.headers.common['X-Requested-With'];

          $httpProvider.interceptors.push('AuthInterceptor');
          $sailsSocketProvider.interceptors.push('AuthInterceptor');




          $urlRouterProvider
              .otherwise('/app/dashboard');
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: 'tpl/app.html'
              })
              .state('app.dashboard', {
                  url: '/dashboard',
                  templateUrl: appConfig.assetsUrl + 'tpl/app_dashboard_v1.html',
                  authenticate: false
              })
              .state('login', {
                  url: '/login',
                  templateUrl: appConfig.assetsUrl + 'tpl/page_signin.html',
                  authenticate: false
              })
              .state('payment', {
                  url: '/payment',
                  templateUrl: appConfig.assetsUrl + 'tpl/payment.html'
              })

      }
    ]
  );