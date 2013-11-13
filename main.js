var app = angular.module('app', []);

app.factory('signalRService', ['$rootScope', function ($rootScope) {
    var messages = [];
    var users = [];

    return {
        addMessage: function (name, message, date) {
            $rootScope.$apply(function() {
                messages.unshift({ name: name, message: message, date: date});
            });
        },
        
        getMessages: function () {
            return messages;
        },

        setUsers: function (allUsers) {
            $rootScope.$apply(function () {
                while (users.length > 0) {
                    users.splice(0, 1);
                }
                
                for (var i = 0; i < allUsers.length; i++) {
                    users.push(allUsers[i]);
                }
            });
        },

        getUsers: function () {
            return users;
        },
    };
}]);

var ChatController = function ($scope, signalRService) {
    $scope.username = '';
    $scope.message = '';
    $scope.messages = signalRService.getMessages();
    $scope.users = signalRService.getUsers();

    $scope.login = function () {
        if ($scope.username != '') {
            var chat = $.connection.chatHub;
            chat.server.login($scope.username);
            $scope.messageform.message.$setValidity("username", true);
        }
    };

    $scope.addMessage = function () {
        if ($scope.username != '') {
            var chat = $.connection.chatHub;
            chat.server.send($scope.username, $scope.message, new Date());
            $scope.messageform.message.$setValidity("username", true);
            $scope.message = '';
        } else {
            $scope.messageform.message.$setValidity("username", false);
        }
    };
};

$(function () {
    // Getting the angular injector
    var injector = angular.element('*[ng-app]').injector();

    // Declare a proxy to reference the hub. 
    var chat = $.connection.chatHub;
    // Create a function that the hub can call to broadcast messages.
    chat.client.broadcastMessage = function (name, message, date) {
        // Invoking the angular service to add message
        injector.invoke(['signalRService', function (signalRService) {
            signalRService.addMessage(name, message, date);
        }]);
    };

    chat.client.broadcastUsers = function (users) {
        // Invoking the angular service to add message
        injector.invoke(['signalRService', function (signalRService) {
            signalRService.setUsers(users);
        }]);
    };

    //// Start the connection.
    $.connection.hub.start();

});