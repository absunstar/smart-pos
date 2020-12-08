app.controller("class_schedule", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.class_schedule = {};

  $scope.displayAddClassSchedule = function () {
    $scope._search = {};
    $scope.error = '';
    $scope.class_schedule = {
      image_url: '/images/class_schedule.png',
      sunday: true,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      max_school_class: 0,
      active: true
    };
    site.showModal('#classScheduleAddModal');
  };

  $scope.addClassSchedule = function () {
    if ($scope.busy) {
      return;
    }
    $scope.error = '';
    $scope.busy = true;

    const v = site.validated('#classScheduleAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    };

    $http({
      method: "POST",
      url: "/api/class_schedule/add",
      data: $scope.class_schedule
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#classScheduleAddModal');
          $scope.getClassScheduleList();
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

  $scope.displayUpdateClassSchedule = function (class_schedule) {
    $scope._search = {};

    $scope.error = '';
    $scope.detailsClassSchedule(class_schedule);
    $scope.class_schedule = {
      image_url: '/images/vendor_logo.png',

    };
    site.showModal('#classScheduleUpdateModal');
  };

  $scope.updateClassSchedule = function () {
    if ($scope.busy) {
      return;
    }
    $scope.error = '';
    $scope.busy = true;

    const v = site.validated('#classScheduleUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $http({
      method: "POST",
      url: "/api/class_schedule/update",
      data: $scope.class_schedule
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#classScheduleUpdateModal');
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

  $scope.displayDetailsClassSchedule = function (class_schedule) {
    $scope.error = '';
    $scope.detailsClassSchedule(class_schedule);
    $scope.class_schedule = {};
    site.showModal('#classScheduleDetailsModal');
  };

  $scope.detailsClassSchedule = function (class_schedule) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/class_schedule/view",
      data: {
        id: class_schedule.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          response.data.doc.date = new Date(response.data.doc.date);
          $scope.class_schedule = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDeleteClassSchedule = function (class_schedule) {
    $scope.error = '';
    $scope.detailsClassSchedule(class_schedule);
    $scope.class_schedule = {};
    site.showModal('#classScheduleDeleteModal');
  };

  $scope.deleteClassSchedule = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/class_schedule/delete",
      data: {
        id: $scope.class_schedule.id

      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#classScheduleDeleteModal');
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

  $scope.getClassScheduleList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: "POST",
      url: "/api/class_schedule/all",
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
    $scope.getClassScheduleList($scope.search);
    site.hideModal('#classScheduleSearchModal');
    $scope.search = {}

  };

  $scope.createSchedule = function () {

    $scope.class_schedule.schedulesList = [];
    $scope.class_schedule.school_class_list = new Array($scope.class_schedule.max_school_class);

    if ($scope.class_schedule.saturday) $scope.class_schedule.schedulesList.push({ day: { name: 'saturday', ar: 'السبت', en: 'Saturday' } });
    if ($scope.class_schedule.sunday) $scope.class_schedule.schedulesList.push({ day: { name: 'sunday', ar: 'الأحد', en: 'Sunday' } });
    if ($scope.class_schedule.monday) $scope.class_schedule.schedulesList.push({ day: { name: 'monday', ar: 'الإثنين', en: 'Monday' } });
    if ($scope.class_schedule.tuesday) $scope.class_schedule.schedulesList.push({ day: { name: 'tuesday', ar: 'الثلاثاء', en: 'Tuesday' } });
    if ($scope.class_schedule.wednesday) $scope.class_schedule.schedulesList.push({ day: { name: 'wednesday', ar: 'الأربعاء', en: 'Wednesday' } });
    if ($scope.class_schedule.thursday) $scope.class_schedule.schedulesList.push({ day: { name: 'thursday', ar: 'الخميس', en: 'Thursday' } });
    if ($scope.class_schedule.friday) $scope.class_schedule.schedulesList.push({ day: { name: 'friday', ar: 'الجمعة', en: 'Friday' } });

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

  $scope.getHalls = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/hall/all",
      data: {
        where: {
          active: true
        },
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.hallsList = response.data.list;
        }
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
        screen: "class_schedule"
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
  $scope.getHalls();
  $scope.getClassScheduleList();

});