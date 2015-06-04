'use strict';

angular.module('angularRestfulAuth')
    .factory('Main', ['$http', '$localStorage', function($http, $localStorage) {
        var baseUrl = 'http://localhost:3000/api';

        function setAuth(token) {
            $httpProvider.defaults.headers.common.Authorization = 'Basic ' + token;
        }

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();
        return {
            register: function(data, success, error) {
                $http.post(baseUrl + '/register', data).success(success).error(error);
            },
            signin: function(data, success, error) {
                $http.post(baseUrl + '/signin', data).success(success).error(error);
            },
            me: function(data, success, error) {
                $http.get(baseUrl + '/me').success(success).error(error);
            },
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                success();
            },
            getPrograms: function(token, success, err) {
                setAuth(token);
                $http.get(baseUrl + '/programs').success(success).error(err);
            },
            getUserFromToken: getUserFromToken,
            changeUser: changeUser
        }
    }]);
