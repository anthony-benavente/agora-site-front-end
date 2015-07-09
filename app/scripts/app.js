Array.prototype.find = function(callback) {
  for (var i = 0; i < this.length; i++) {
    if (callback(this[i])) {
      return this[i];
    }
  }
  return null;
};

angular.module('angularRestfulAuth', [
    'ngStorage', 'ngRoute'
])
.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        }).
        when('/signin', {
            templateUrl: 'partials/signin.html',
            controller: 'HomeCtrl'
        }).
        when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'HomeCtrl'
        }).
        when('/me', {
            templateUrl: 'partials/me.html',
            controller: 'MeCtrl'
        }).
        when('/dashboard', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl'
        }).
        when('/dashboard/classes', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardClassesCtrl'
        }).
        when('/preview', {
            templateUrl: 'partials/preview.html',
            controller: 'AgoraPreviewCtrl'
        }).
        when('/preview/:pageOrName', {
            templateUrl: 'partials/preview.html',
            controller: 'AgoraPreviewCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });



    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/signin');
                }
                return $q.reject(response);
            }
        };
    }]);

}]);
