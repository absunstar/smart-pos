app.controller("trainer", function ($scope, $http, $timeout) {

  $scope.trainer = {};

  $scope.displayAddTrainer = function () {
    $scope.error = '';
    $scope.trainer = {
      image_url: '/images/trainer.png',
      class_rooms_list : [{}],
      courses_list : [{}],
      active: true
      
    };
    site.showModal('#trainerAddModal');
    document.querySelector('#trainerAddModal .tab-link').click();

  };

  $scope.addTrainer = function () {
    $scope.error = '';
    const v = site.validated('#trainerAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/trainer/add",
      data: $scope.trainer
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainerAddModal');
          $scope.getTrainerList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayUpdateTrainer = function (trainer) {
    $scope.error = '';
    $scope.detailsTrainer(trainer);
    $scope.trainer = {};
    site.showModal('#trainerUpdateModal');
    document.querySelector('#trainerUpdateModal .tab-link').click();
  };

  $scope.updateTrainer = function () {
    $scope.error = '';
    const v = site.validated('#trainerUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/trainer/update",
      data: $scope.trainer
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainerUpdateModal');
          $scope.getTrainerList();
        } else {
          $scope.error = 'Please Login First';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDetailsTrainer = function (trainer) {
    $scope.error = '';
    $scope.detailsTrainer(trainer);
    $scope.trainer = {};
    site.showModal('#trainerViewModal');
    document.querySelector('#trainerViewModal .tab-link').click();

  };

  $scope.detailsTrainer = function (trainer) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/trainer/view",
      data: {
        id: trainer.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.trainer = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDeleteTrainer = function (trainer) {
    $scope.error = '';
    $scope.detailsTrainer(trainer);
    $scope.trainer = {};
    site.showModal('#trainerDeleteModal');
    document.querySelector('#trainerDeleteModal .tab-link').click();

  };

  $scope.deleteTrainer = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: "POST",
      url: "/api/trainer/delete",
      data: {
        id: $scope.trainer.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainerDeleteModal');
          $scope.getTrainerList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.getTrainerList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: "POST",
      url: "/api/trainer/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#trainerSearchModal');
          $scope.search ={};

        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }

    )

  };

  $scope.getClassRoomsList = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/class_rooms/all",
      data: {
        where: {
          active: true
        },
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.classRoomsList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }

    )

  };

  $scope.getCoursesList = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/courses/all",
      data: {
        where: {
          active: true
        },
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.coursesList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }

    )

  };

  $scope.getJobsList = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/jobs/all",
      data: {
        where: {
          active: true
        },
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.jobsList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }

    )

  };

  $scope.getIndentfy = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.indentfyList = [];
    $http({
      method: "POST",
      url: "/api/indentfy_trainer/all"

    }).then(
      function (response) {
        $scope.busy = false;
        $scope.indentfyList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getGovList = function (where) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/goves/all",
      data: {
        where: {
          active: true
        },
        select : {id : 1 , name : 1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.govList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }

    )

  };

  $scope.getNeighborhoodList = function (gov) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/neighborhood/all",
      data: {
        where: {
          'gov.id': gov.id,
          active: true
        },
        select : {id : 1 , name : 1}
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.neighborhoodList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };
  
  $scope.getAreaList = function (neighborhood) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/area/all",
      data: {
        where: {
          'neighborhood.id': neighborhood.id,
          active: true
        },
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.areaList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#trainerSearchModal');

  };

  $scope.searchAll = function () {
  
    $scope.getTrainerList($scope.search);
    site.hideModal('#trainerSearchModal');
    $scope.search ={};
  };

  $scope.getTrainerList();
  $scope.getGovList();
  $scope.getClassRoomsList();
  $scope.getCoursesList();
  $scope.getJobsList();
  $scope.getIndentfy();

});