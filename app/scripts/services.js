'use strict';

angular.module('angularRestfulAuth')
    .factory('Main', ['$http', '$localStorage', function($http, $localStorage) {
        var baseUrl = 'http://localhost:3000/api';

        function buildRequest(method, url, data, token) {
            var requestData = {
                method: method,
                url: url,
                data: data
            };
            if (token) {
                requestData.headers = { 'Authorization': 'Token ' + token };
            }
            return requestData;
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
            if (typeof token === "string") {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();
        return {
            register: function(data, success, error) {
                $http.post(baseUrl + '/users/register', data).success(success).error(error);
            },
            signin: function(data, success, error) {
                $http.post(baseUrl + '/users/signin', data).success(success).error(error);
            },
            me: function(data, success, error) {
                $http.get(baseUrl + '/users/me').success(success).error(error);
            },
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                success();
            },
            getPrograms: function(token, success, err) {
                $http.get(baseUrl + '/programs').success(success).error(err);
            },
            getUserFromToken: getUserFromToken,
            changeUser: changeUser,
            getClasses: function(token, success, err) {
                console.log(getUserFromToken(token));
                $http.get(baseUrl + '/classes/', {
                    headers: {
                        'Authorization': 'Basic ' + token
                    }
                }).success(success).error(err);
            },
            saveClass: function(data, token, success, err) {
                console.log('Saving data...');
                console.log(JSON.stringify(data));
                $http.post(baseUrl + '/classes/', data, {
                    headers: {
                        'Authorization': 'Basic ' + token
                    }
                }).success(success).error(err);
            }
        }
    }]);
