
let btn1 = document.querySelector('#setting_ecommerce .tab-link');
if (btn1) {
  btn1.click();
}

app.controller("ecommerce_setting", function ($scope, $http) {
  $scope._search = {};

  $scope.product = {};

  $scope.displayAddProduct = function () {
    $scope.error = '';
    $scope.product = {
      image_url: '/images/product.png',
      active: true
    };
    $scope.product.$add = true;
    site.showModal('#productContentModal');

  };

  $scope.addProduct = function () {
    $scope.error = '';
    const v = site.validated('#productContentModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/product/add",
      data: $scope.product
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#productContentModal');
          $scope.getProductList();
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*Must Enter Code*')) {
            $scope.error = "##word.must_enter_code##"
          }
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayUpdateProduct = function (product) {
    $scope.error = '';
    $scope.viewProduct(product,'update');
    $scope.product = {};
    site.showModal('#productContentModal');
  };

  $scope.updateProduct = function () {
    $scope.error = '';
    const v = site.validated('#productContentModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/product/update",
      data: $scope.product
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#productContentModal');
          $scope.getProductList();
        } else {
          $scope.error = 'Please Login First';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDetailsProduct = function (product) {
    $scope.error = '';
    $scope.viewProduct(product,'view');
    $scope.product = {};
    site.showModal('#productViewModal');
  };

  $scope.viewProduct = function (product, type) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/product/view",
      data: {
        id: product.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.product = response.data.doc;
        if(type == 'view')  $scope.product.$view = true;
        if(type == 'update')  $scope.product.$update = true;
        if(type == 'delete')  $scope.product.$delete = true;

        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDeleteProduct = function (product) {
    $scope.error = '';
    $scope.viewProduct(product,'delete');
    $scope.product = {};
    site.showModal('#productViewModal');
  };

  $scope.deleteProduct = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: "POST",
      url: "/api/product/delete",
      data: {
        id: $scope.product.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#productViewModal');
          $scope.getProductList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.getProductList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: "POST",
      url: "/api/product/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.productsList = response.data.list;
          $scope.productsCount = response.data.count;
          site.hideModal('#productSearchModal');
          $scope.search = {};

        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getProductNumberingAuto = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/numbering/get_automatic",
      data: {
        screen: "product"
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.disabledProductCode = response.data.isAuto;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.displayProductSearchModal = function () {
    $scope.error = '';
    site.showModal('#productSearchModal');

  };

  $scope.searchAllProduct = function () {

    $scope.getProductList($scope.search);
    site.hideModal('#productSearchModal');
    $scope.search = {};
  };















  $scope.displayAddProductGroup = function () {
    $scope.error = '';
    $scope.product_group = {
      image_url: '/images/product_group.png',
      active: true
    };
    $scope.product_group.$add = true;
    site.showModal('#productGroupContentModal');

  };

  $scope.addProductGroup = function () {
    $scope.error = '';
    const v = site.validated('#productGroupContentModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/product_group/add",
      data: $scope.product_group
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#productGroupContentModal');
          $scope.getProductGroupList();
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*Must Enter Code*')) {
            $scope.error = "##word.must_enter_code##"
          }
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayUpdateProductGroup = function (product_group) {
    $scope.error = '';
    $scope.viewProductGroup(product_group,'update');
    $scope.product_group = {};
    site.showModal('#productGroupContentModal');
  };

  $scope.updateProductGroup = function () {
    $scope.error = '';
    const v = site.validated('#productGroupContentModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/product_group/update",
      data: $scope.product_group
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#productGroupContentModal');
          $scope.getProductGroupList();
        } else {
          $scope.error = 'Please Login First';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDetailsProductGroup = function (product_group) {
    $scope.error = '';
    $scope.viewProductGroup(product_group,'view');
    $scope.product_group = {};
    site.showModal('#productGroupViewModal');
  };

  $scope.viewProductGroup = function (product_group, type) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/product_group/view",
      data: {
        id: product_group.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.product_group = response.data.doc;
        if(type == 'view')  $scope.product_group.$view = true;
        if(type == 'update')  $scope.product_group.$update = true;
        if(type == 'delete')  $scope.product_group.$delete = true;

        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDeleteProductGroup = function (product_group) {
    $scope.error = '';
    $scope.viewProductGroup(product_group,'delete');
    $scope.product_group = {};
    site.showModal('#productGroupViewModal');
  };

  $scope.deleteProductGroup = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: "POST",
      url: "/api/product_group/delete",
      data: {
        id: $scope.product_group.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#productGroupViewModal');
          $scope.getProductGroupList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.getProductGroupList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: "POST",
      url: "/api/product_group/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.productsGroupsList = response.data.list;
          $scope.productsGroupsCount = response.data.count;
          site.hideModal('#productGroupSearchModal');
          $scope.search = {};

        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getProductGroupNumberingAuto = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/numbering/get_automatic",
      data: {
        screen: "products_groups"
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.disabledProductGroupCode = response.data.isAuto;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.displayProductGroupSearchModal = function () {
    $scope.error = '';
    site.showModal('#productGroupSearchModal');

  };

  $scope.searchAllProductGroup = function () {

    $scope.getProductGroupList($scope.search);
    site.hideModal('#productGroupSearchModal');
    $scope.search = {};
  };





  $scope.getProductList();
  $scope.getProductGroupList();
  $scope.getProductNumberingAuto();
  $scope.getProductGroupNumberingAuto();

});