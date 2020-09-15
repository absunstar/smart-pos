app.controller("report_daily", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.report_daily = {};

  $scope.getTransactionTypeList = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.transactionTypeList = [];
    $http({
      method: "POST",
      url: "/api/order_invoice/transaction_type/all"

    }).then(
      function (response) {
        $scope.busy = false;
        $scope.transactionTypeList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

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
        if (site.feature('gym')) $scope.sourceTypeList = response.data.filter(i => i.id != 3 && i.id != 5 && i.id != 6 && i.id != 7);
        else if (site.feature('restaurant')) $scope.sourceTypeList = response.data.filter(i => i.id != 4 && i.id != 5 && i.id != 6 && i.id != 7);
        else if (site.feature('pos')) $scope.sourceTypeList = response.data.filter(i => i.id != 4 && i.id != 3 && i.id != 5 && i.id != 6 && i.id != 7);
        else if (site.feature('academy')) $scope.sourceTypeList = response.data.filter(i => i.id != 4 && i.id != 3);
        else $scope.sourceTypeList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getReportDailyList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: "POST",
      url: "/api/report_daily/all",
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
          $scope.net_value = 0;
          $scope.total_tax = 0;
          $scope.total_discount = 0;
          $scope.cash = 0;
          $scope.bank = 0;
          if (!site.feature('academy')) $scope.list.splice(4, 3);
          if (!site.feature('gym')) $scope.list.splice(3, 1);
          if (!site.feature('pos') && !site.feature('restaurant')) $scope.list.splice(2, 1);

          $scope.list.forEach(_invoice => {

            _invoice.net_value = site.toNumber(_invoice.net_value);
            _invoice.paid_up = site.toNumber(_invoice.paid_up);
            _invoice.remain_amount = site.toNumber(_invoice.remain_amount);
            _invoice.total_discount = site.toNumber(_invoice.total_discount);
            _invoice.total_tax = site.toNumber(_invoice.total_tax);

            $scope.remain_amount += site.toNumber(_invoice.remain_amount);
            $scope.net_value += site.toNumber(_invoice.net_value);
            $scope.total_tax += site.toNumber(_invoice.total_tax);
            $scope.total_discount += site.toNumber(_invoice.total_discount);

            if (_invoice.payment_method) {
              if (_invoice.payment_method.id === 1)
                $scope.cash += site.toNumber(_invoice.paid_up);
              else $scope.bank += site.toNumber(_invoice.paid_up);
            }

          });

          $scope.remain_amount = site.toNumber($scope.remain_amount);
          $scope.net_value = site.toNumber($scope.net_value);
          $scope.total_tax = site.toNumber($scope.total_tax);
          $scope.total_discount = site.toNumber($scope.total_discount);

          $scope.paid_up = $scope.net_value - $scope.remain_amount;
          $scope.paid_up = site.toNumber($scope.paid_up);
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.printAccountInvoive = function (_itemsList) {
    $scope.error = '';
    if ($scope.busy) return;
    $scope.busy = true;

    let ip = '127.0.0.1';
    let port = '11111';

    let InvoiceDate = new Date();

    if ($scope.defaultSettings.printer_program) {
      ip = $scope.defaultSettings.printer_program.ip || '127.0.0.1';
      port = $scope.defaultSettings.printer_program.port || '11111';
    };

    let obj_print = { data: [] };

    if ($scope.defaultSettings.printer_program) {

      if ($scope.defaultSettings.printer_program.printer_path)
        obj_print.printer = $scope.defaultSettings.printer_program.printer_path.ip.trim();


      if ($scope.defaultSettings.printer_program.invoice_top_title) {
        obj_print.data.push({
          type: 'invoice-top-title',
          name: $scope.defaultSettings.printer_program.invoice_top_title
        });
      } else {
        obj_print.data.push({
          type: 'invoice-top-title',
          name: "Smart Code"
        });
      }

      if ($scope.defaultSettings.printer_program.invoice_logo) {

        obj_print.data.push({
          type: 'invoice-logo',
          url: document.location.origin + $scope.defaultSettings.printer_program.invoice_logo
        });
      } else {
        obj_print.data.push({
          type: 'invoice-logo',
          url: "http://127.0.0.1/images/logo.png"
        });
      }

      if ($scope.defaultSettings.printer_program.invoice_header && $scope.defaultSettings.printer_program.invoice_header.length > 0) {
        $scope.defaultSettings.printer_program.invoice_header.forEach(_ih => {
          obj_print.data.push({
            type: 'header',
            value: _ih.name
          });
        });
      }
    }

    obj_print.data.push(
      {
        type: 'title',
        value: 'Total Accounts Daily'
      }, {
      type: 'space'
    }, {
      type: 'text2',
      value: 'Date',
      value2: site.toDateXF(InvoiceDate)
    }, {
      type: 'line'
    }, {
      type: 'space'
    });

    $scope.list.forEach(_l => {
      obj_print.data.push({
        type: 'text2',
        value2: _l.paid_up,
        value: '##session.lang##' == 'ar' ? _l.source_type.ar : _l.source_type.en
      });
    });

    obj_print.data.push({ type: 'space' });

    if ($scope.defaultSettings.printer_program && $scope.defaultSettings.printer_program.invoice_footer && $scope.defaultSettings.printer_program.invoice_footer.length > 0) {
      $scope.defaultSettings.printer_program.invoice_footer.forEach(_if => {
        obj_print.data.push({
          type: 'header',
          value: _if.name
        });
      });

    };

    $http({
      method: "POST",
      url: `http://${ip}:${port}/print`,
      data: obj_print
    }).then(
      function (response) {
        if (response)
          $scope.busy = false;
      },
      function (err) {
        console.log(err);
      }
    );

  };

  $scope.getDefaultSettings = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/default_setting/get",
      data: {}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.doc) {
          $scope.defaultSettings = response.data.doc;
        };
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadCurrencies = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/currency/all",
      data: {
        select: {
          id: 1,
          name: 1,
          minor_currency: 1,
          ex_rate: 1
        },
        where: {
          active: true
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.currenciesList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.showDetails = function (c) {
    $scope.details = c;
    site.showModal('#detailsModal');
  };

  $scope.searchAll = function () {

    $scope.error = '';

    const v = site.validated('#reportDailySearchModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope._search = {};
    $scope.getReportDailyList($scope.search);
    if ($scope.search) {

      $scope.date = $scope.search.date;
      $scope.date_from = $scope.search.date_from;
      $scope.date_to = $scope.search.date_to;
      $scope.shift_code = $scope.search.shift_code;
      $scope.currency = $scope.search.currency;
    }
    site.hideModal('#reportDailySearchModal');
    $scope.search = {}
  };


  $scope.getReportDailyList({ date: new Date() });
  if (site.feature('restaurant') || site.feature('pos'))
    $scope.getTransactionTypeList();
  $scope.getPaymentMethodList();
  $scope.loadCurrencies();
  $scope.getDefaultSettings();
  $scope.getSourceType();

});