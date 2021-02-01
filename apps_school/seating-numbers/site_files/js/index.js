app.controller("seating_numbers", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.seating_numbers = {};

  $scope.displayAddSeatingNumbers = function () {
    $scope._search = {};
    $scope.error = '';
    $scope.seating_numbers = {
      image_url: '/images/seating_numbers.png',
      students_list: [],
      active: true
    };

    if ($scope.defaultSettings.general_Settings) {
      $scope.seating_numbers.school_year = $scope.schoolYearsList.find(_school_year => { return _school_year.id === $scope.defaultSettings.general_Settings.school_year.id });

    }
    
    site.showModal('#seatingNumbersAddModal');
  };

  $scope.addSeatingNumbers = function () {
    if ($scope.busy) {
      return;
    }
    $scope.error = '';

    const v = site.validated('#seatingNumbersAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    };
    $scope.busy = true;

    $http({
      method: "POST",
      url: "/api/seating_numbers/add",
      data: $scope.seating_numbers
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#seatingNumbersAddModal');
          $scope.getSeatingNumbersList();
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*duplicate key error*')) {
            $scope.error = "##word.code_exisit##"
          } else if (response.data.error.like('*Please write code*')) {
            $scope.error = "##word.enter_code_inventory##"
          } else if (response.data.error.like('*Must Enter Code*')) {
            $scope.error = "##word.must_enter_code##"
          }
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayUpdateSeatingNumbers = function (seating_numbers) {
    $scope._search = {};

    $scope.error = '';
    $scope.detailsSeatingNumbers(seating_numbers);
    $scope.seating_numbers = {
      image_url: '/images/vendor_logo.png',

    };
    site.showModal('#seatingNumbersUpdateModal');
  };

  $scope.updateSeatingNumbers = function () {
    if ($scope.busy) {
      return;
    }
    $scope.error = '';

    const v = site.validated('#seatingNumbersUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;

    $http({
      method: "POST",
      url: "/api/seating_numbers/update",
      data: $scope.seating_numbers
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#seatingNumbersUpdateModal');
          $scope.list.forEach((b, i) => {
            if (b.id == response.data.doc.id) {
              $scope.list[i] = response.data.doc;
            }
          });
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDetailsSeatingNumbers = function (seating_numbers) {
    $scope.error = '';
    $scope.detailsSeatingNumbers(seating_numbers);
    $scope.seating_numbers = {};
    site.showModal('#seatingNumbersDetailsModal');
  };

  $scope.detailsSeatingNumbers = function (seating_numbers) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/seating_numbers/view",
      data: {
        id: seating_numbers.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          response.data.doc.date = new Date(response.data.doc.date);
          $scope.seating_numbers = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDeleteSeatingNumbers = function (seating_numbers) {
    $scope.error = '';
    $scope.detailsSeatingNumbers(seating_numbers);
    $scope.seating_numbers = {};
    site.showModal('#seatingNumbersDeleteModal');
  };

  $scope.deleteSeatingNumbers = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/seating_numbers/delete",
      data: {
        id: $scope.seating_numbers.id

      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#seatingNumbersDeleteModal');
          $scope.list.forEach((b, i) => {
            if (b.id == response.data.doc.id) {
              $scope.list.splice(i, 1);
              $scope.count -= 1;
            }
          });
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.getSeatingNumbersList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: "POST",
      url: "/api/seating_numbers/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
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
    $scope.getSeatingNumbersList($scope.search);
    site.hideModal('#seatingNumbersSearchModal');
    $scope.search = {}

  };

  $scope.getSchoolGrade = function () {
    $http({
      method: "POST",
      url: "/api/school_grade/all",
      data: {
        select: {
          id: 1,
          name: 1,
          code: 1,
          subjects_list: 1
        },
        where: {
          active: true
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.schoolGradeList = response.data.list;
      },
      function (err) {
        $scope.error = err;
      }
    )
  };

  $scope.searchStudents = function () {
    if ($scope.busy) {
      return;
    }
    $scope.error = '';

    const v = site.validated('#seatingNumbersAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    };
    $scope.busy = true;

    $http({
      method: "POST",
      url: "/api/customers/all",
      data: {
        where: {
          school_grade: $scope.seating_numbers.school_grade,
          active: true
        }

      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.seating_numbers.students_list = response.data.list;
          let seating_n = $scope.seating_numbers.from - 1;
          $scope.seating_numbers.students_list.forEach(_student => {
            if (seating_n < $scope.seating_numbers.to) {
              seating_n = seating_n + 1;
              _student.seating_n = seating_n;
            }
          });
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.loadSchoolYears = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/school_years/all",
      data: {
        select: {
          id: 1,
          name: 1,
          code: 1
        }
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.schoolYearsList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
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

  $scope.getNumberingAuto = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/numbering/get_automatic",
      data: {
        screen: "seating_numbers"
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.disabledCode = response.data.isAuto;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getNumberingAuto();
  $scope.getSchoolGrade();
  $scope.loadSchoolYears();
  $scope.getDefaultSettings();
  $scope.getSeatingNumbersList();

});