app.controller("report_invoices", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.report_invoices = {};

  $scope.getPaymentMethodList = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.paymentMethodList = [];
    $http({
      method: "POST",
      url: "/api/payment_method/all"

    }).then(
      function (response) {
        $scope.busy = false;
        $scope.paymentMethodList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getSourceType = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.sourceTypeList = [];
    $http({
      method: "POST",
      url: "/api/source_type/all"
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.sourceTypeList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getReportInvoicesList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: "POST",
      url: "/api/report_invoices/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;          
          $scope.count = response.data.count;
          $scope.remain_amount = 0;
          $scope.paid_require = 0;
          $scope.paid_up = 0;
          $scope.total_tax = 0;
          $scope.total_discount = 0;
          $scope.list.forEach(invoice => {
            $scope.remain_amount += invoice.remain_amount ||0;
            $scope.paid_require += invoice.paid_require ||0;
            $scope.total_discount += invoice.total_discount ||0;
          });


          $scope.paid_up = $scope.paid_require - $scope.remain_amount
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
    $scope.getReportInvoicesList($scope.search);
    site.hideModal('#reportInvoicesSearchModal');
    $scope.search = {}
  };
 
  $scope.getReportInvoicesList();
  $scope.getPaymentMethodList();
  $scope.getSourceType();

});