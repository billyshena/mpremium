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
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {
          
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
                  templateUrl: 'tpl/app_dashboard_v1.html',
                  authenticate: true
              })
              .state('login', {
                  url: '/login',
                  templateUrl: appConfig.assetsUrl + 'tpl/page_signin.html',
                  authenticate: false
              })

      }
    ]
  );