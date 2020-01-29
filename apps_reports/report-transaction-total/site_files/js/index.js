app.controller("report_transaction_total", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.report_transaction_total = {};

  $scope.getReportTransactionList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: "POST",
      url: "/api/report_transaction_total/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;

        if (response.data.done) {
          $scope.count = response.data.doc.length;
          $scope.list = response.data.doc;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.searchAll = function () {
    $scope._search = {};
    $scope.getReportTransactionList($scope.search);
    site.hideModal('#reportTransactionSearchModal');
    $scope.search = {}
  };

  $scope.getReportTransactionList({ date: new Date() });
});