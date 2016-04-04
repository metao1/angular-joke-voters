var angularModule = angular.module("VoterApp", []);
angularModule.factory("VoteService", function ($http) {
    return {
        vote: function (query) {
            return $http.post("http://localhost:81/vote", query);
        },
        allVotes: function () {
            return $http.get("http://localhost:81/allvotes");
        },
        voteUp: function (q) {
            return $http.post("http://localhost:81/voteup", q);
        },
        voteDown: function (q) {
            return $http.post("http://localhost:81/votedown", q);
        },
        comment: function (q) {
            return $http.post("http://localhost:81/comment", q);
        }
    };
});

angularModule.filter('orderObjectBy', function () {
    return function (input, attribute) {
        if (!angular.isObject(input)) return input;
        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }
        array.sort(function (a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return b - a;
        });
        return array;
    }
});
angularModule.controller("VoterController", function ($scope, $timeout, VoteService) {
    $scope.ideas = [];
    var ideaArray = [];
    VoteService.allVotes().success(function (data) {
        $scope.ideas = [];
        ideaArray = data;
        $scope.ideas = ideaArray;
    });

    $scope.submitIdea = function () {
        if (!$scope.nameValue) {
            $timeout(caller, 4000);
            return $scope.error = " name";
        }
        if (!$scope.mindValue) {
            $timeout(caller, 4000);
            return $scope.error = " idea to show";
        }
        $scope.error = "";
        var data = {
            DisplayName: $scope.nameValue,
            Idea: $scope.mindValue
        };
        VoteService.vote(data).success(function (res) {
            console.log(res);
            ideaArray.push(res);
        });
        $scope.nameValue = "";
        $scope.mindValue = "";
    };

    $scope.voteClick = function (id, value) {
        if (value > 0) {
            console.log(id);
            VoteService.voteUp(id).success(function (data) {
                ideaArray[id].VoteUp.value = data.VoteUp.value;
                ideaArray[id].VoteUp.VoteDown = data.VoteDown.value;
                ideaArray[id].average = data.average;
                ideaArray[id].VoteDown.disabled = true;
                ideaArray[id].VoteUp.disabled = true;
                $scope.message = "Thanks for your feed back! Your feedback saved for this person. " +
                "\nYou can only vote once for " + ideaArray[id].DisplayName;
                $timeout(caller, 4000);
            });
        } else {
            VoteService.voteDown(id).success(function (data) {
                ideaArray[id].VoteUp.value = data.VoteUp.value;
                ideaArray[id].VoteUp.VoteDown = data.VoteDown.value;
                ideaArray[id].average = data.average;
                ideaArray[id].VoteDown.disabled = true;
                ideaArray[id].VoteUp.disabled = true;
                $scope.message = "Thanks for your feed back! Your feedback saved for this person. " +
                "\nYou can only vote once for " + ideaArray[id].DisplayName;
                $timeout(caller, 4000);
            });
        }
    };

    $scope.commentClick = function (id) {
        ideaArray[id].show = !ideaArray[id].show;
    };

    $scope.submitComment = function (id) {
        if (!$scope.comment) {
            $timeout(caller, 4000);
            return $scope.error = " comment value";
        }
        var commentVar = {"value": $scope.comment};
        var commentRequest = {
            "id": id,
            "value": commentVar.value
        };
        VoteService.comment(commentRequest).success(function (data) {
            ideaArray[id].comments.push(commentVar);
            $scope.comment = "";
            $scope.message = "Thanks for your message for " + ideaArray[id].DisplayName + " !";
            ideaArray[id].show = false;
            $timeout(caller, 4000);
        });
    };

    function caller() {
        $scope.message = "";
        $scope.error = "";
    }
});