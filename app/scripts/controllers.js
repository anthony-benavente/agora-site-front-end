'use strict';

angular.module('angularRestfulAuth')
    .controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', function($rootScope, $scope, $location, $localStorage, Main) {
        $scope.signin = function() {
            var formData = {
                username: $scope.username,
                password: $scope.password
            }

            Main.signin(formData, function(res) {
                if (res.type == false) {
                    alert(res.data);
                } else {
                    $localStorage.token = res.data.token;
                    Main.changeUser(Main.getUserFromToken($localStorage.token));
                    window.location = '/#/preview';
                }
            }, function() {
                $rootScope.error = 'Failed to signin';
            });
        };

        $scope.register = function() {
            var formData = {
                name: $scope.name,
                username: $scope.username,
                password: $scope.password,
                email: $scope.email
            };

            if ($scope.password === $scope.confirmPassword) {
                Main.register(formData, function(res) {
                    if (res.type == false) {
                        alert(res.data);
                    } else {
                        $localStorage.token = res.data.token;
                        window.location = '/';
                    }
                }, function() {
                    $rootScope.error = 'Failed to register';
                });
            } else {
                $scope.passwordWarning = "Passwords do not match";
            }

        };

        $scope.me = function() {
            Main.me(function(res){
                $scope.myDetails = res;
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            });
        };

        $scope.logout = function() {
            Main.logout(function() {
                window.location = '/';
            }, function() {
                alert('Failed to logout');
            });
        };

        $scope.token = $localStorage.token;
    }])
.controller('AgoraPreviewCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main',
    function($rootScope, $scope, $location, $localStorage, Main) {
        function setSelected(arr, selected) {
            for (var i = 0; i < arr.length; i++) {
                arr[i] = selected == i;
            }
        }

        // if ($rootScope.)
        var currentUser = Main.getUserFromToken($localStorage.token);
        $scope.currentUser = currentUser;
        if (typeof currentUser !== 'undefined') {
            var pageContent = '/partials/agora';
            var focus = [true, false, false, false, false];

            if (window.location.href.indexOf('about') > -1) {
                pageContent += '/about.html';
                setSelected(focus, 4);
                $scope.canEdit = true;
            } else if (window.location.href.indexOf('contact') > -1) {
                pageContent += '/contact.html';
                setSelected(focus, 3);
                $scope.canEdit = true;
            } else if (window.location.href.indexOf('resume') > -1) {
                pageContent += '/resume.html';
                setSelected(focus, 2);
                $scope.canEdit = true;
            } else if (window.location.href.indexOf('portfolio') > -1) {
                pageContent += '/portfolio.html';
                setSelected(focus, 1);
                $scope.canEdit = false;
            } else {
                pageContent += '/home.html';
                setSelected(focus, 0);
                $scope.canEdit = true;
            }

            $scope.pageContent = pageContent;
            $scope.focus = focus;
        } else {
            window.location = '/#/signin';
        }

    }])
.controller('MeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main',
    function($rootScope, $scope, $location, $localStorage, Main) {
        $scope.currentUser = Main.getUserFromToken($localStorage.token);
    }]);
