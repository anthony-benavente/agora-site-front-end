/* jslint node: true */
'use strict';

var CLASSES_TAB = 2;

function setSelected(arr, selected) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = selected == i;
    }
}

/* jslint angular: true */
angular.module('angularRestfulAuth').
controller('SignOutCtrl', ['$scope', '$localStorage', 'Main', function($scope, $localStorage, Main) {
    $scope.logout = function() {
        Main.logout(function() {
            window.location = '#/signin';
        }, function() {
            alert('Failed to logout');
        });
    };

    $scope.logout();
}]).
controller('HomeCtrl', ['$scope', '$localStorage', 'Main', function($scope, $localStorage, Main) {
        $scope.signin = function() {
            var formData = {
                username: $scope.username,
                password: $scope.password
            };

            Main.signin(formData, function(res) {
                if (res.type === false) {
                    alert(res.data);
                } else {
                    $localStorage.token = res.data.token;
                    Main.changeUser(Main.getUserFromToken($localStorage.token));
                    window.location = '/#/preview';
                }
            }, function() {
                $scope.error = 'Failed to signin';
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
                    if (res.type === false) {
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

        $scope.token = $localStorage.token;
}]).
controller('AgoraPreviewCtrl', ['$scope', '$localStorage', 'Main', function($scope, $localStorage, Main) {
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

}]).
controller('MeCtrl', ['$scope', '$localStorage', 'Main', function($scope, $localStorage, Main) {
    $scope.currentUser = Main.getUserFromToken($localStorage.token);
}]).
controller('DashboardCtrl', ['$scope', '$localStorage', 'Main', function($scope, $localStorage, Main) {
    var currentUser = Main.getUserFromToken($localStorage.token);
    $scope.currentUser = currentUser;
    $scope.years = [];
    for (var i = 2000; i < 2020; i++) {
        $scope.years.push(i);
    }
    $scope.semesters = ['Fall', 'Spring', 'Summer']
    if (typeof currentUser !== 'undefined') {
        var pageContent = '/partials/dashboard';
        var focus = [true, false, false, false, false];

        if (window.location.href.indexOf('account') > -1) {
            pageContent += '/account.html';
            setSelected(focus, 4);
        } else if (window.location.href.indexOf('assignments') > -1) {
            pageContent += '/assignments.html';
            setSelected(focus, 3);
        } else if (window.location.href.indexOf('classes') > -1) {
            pageContent += '/classes.html';
            setSelected(focus, 2);
        } else if (window.location.href.indexOf('semesters') > -1) {
            pageContent += '/semesters.html';
            setSelected(focus, 1);
        } else if (window.location.href.indexOf('class') > -1) {
            pageContent += '/class.html';
            setSelected(focus, 2);
        } else {
            pageContent += '/home.html';
            setSelected(focus, 0);
        }
        $scope.pageContent = pageContent;
        $scope.focus = focus;
    } else {
        window.location = '/#/signin';
    }
}]).
controller('DashboardClassCtrl', ['$scope', '$localStorage', '$routeParams', 'Main', function($scope, $localStorage, $routeParams, Main) {
    function initScope() {
        var data = {};

        $scope.currentUser = Main.getUserFromToken($localStorage.token);
        $scope.focus = {};
        $scope.pageContent = '/partials/dashboard/class.html';

        Main.getPrograms($localStorage.token, function(data) {
            $scope.programs = data.data;
            Main.getClass($routeParams.classId, $localStorage.token, function(classData) {
                $scope.class = classData.data;
                $scope.class.program = $scope.programs.find(function(item) {
                    return item.programId === $scope.class.programId;
                });
                Main.getAssignments(classData.classId, $localStorage.token, function(assignmentData) {
                    $scope.assignments = assignmentData.data;
                }, function() {
                    $scope.assignments = [];
                });
            }, function() {
                $scope.classes = [];
            });
        }, function() {
            $scope.programs = [];
        });

        Main.getClass($routeParams.classId, $localStorage.token, function(data) {
            $scope.class = data.data;
        }, function(err) {
            $scope.class = {};
        });

        // Makes the class tab item in the menu focused
        $scope.focus[CLASSES_TAB] = true;
    }

    initScope();
}]).
controller('DashboardClassesCtrl', ['$scope', '$localStorage', 'Main', function($scope, $localStorage, Main) {
    function initScope() {
        $scope.currentUser = Main.getUserFromToken($localStorage.token);
        $scope.years = [];
        $scope.focus = {};
        $scope.semesters = ['Fall', 'Spring', 'Summer'];
        $scope.newClass = {};
        $scope.pageContent = '/partials/dashboard/classes.html';
        var thisYear = new Date(Date.now()).getFullYear();
        for (var i = thisYear; i >= thisYear - 15; i--) {
            $scope.years.push(i);
        }

        Main.getPrograms($localStorage.token, function(data) {
            $scope.programs = data.data;
            Main.getClasses($localStorage.token, function(classData) {
                $scope.classes = classData.data;
                var comparisonFunc = function(item) {
                    return item.programId === $scope.classes[i].programId;
                };
                for (var i = 0;  i < $scope.classes.length ;i++) {
                    $scope.classes[i].program = $scope.programs.find(comparisonFunc);
                }
            }, function() {
                $scope.classes = [];
            });
        }, function() {
            $scope.programs = [];
        });

        // Makes the class tab item in the menu focused
        $scope.focus[CLASSES_TAB] = true;
    }

    $scope.saveClass = function() {
        var toSave = {
            className: $scope.newClass.name,
            programId: $scope.newClass.programId,
            courseCode: $scope.newClass.courseCode,
            semester: $scope.newClass.semester,
            year: $scope.newClass.year,
            program: $scope.programs.find(function(item) {
              return item.programId === $scope.newClass.programId;
          }),
          professorId: $scope.currentUser.userId
        };
        Main.saveClass(toSave, $localStorage.token, function(data) {
            $scope.classes.push(toSave);
        }, function(data) {

        });
    };

    initScope();
}]);
