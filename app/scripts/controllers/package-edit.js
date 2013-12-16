'use strict';

angular.module('toHELL')
  .controller('PackageEditCTRL', ['$scope', '$routeParams', '$http', '$document',
    'GLOBAL', 'sceneService', 'elementService', 'actionService', 'packageService', '$timeout',
    function ($scope, $routeParams, $http, $document, GLOBAL,
      sceneService, elementService, actionService, packageService, $timeout) {
      /**
       * 存储当前的编辑状态
       * @var {Object}
       */
      $scope.editStat = {
        selectedScene: null,
        selectedElement: null,
        selectedAction: null,
        gotoSignStyle: {
          top: '',
          right: ''
        },
        gotoLineStyle: {
          width: '264px'
        },
        sceneHasAdded: false // 表示场景列表中是否有后添加的场景。这个变量与新增场景自动聚焦相关。
      };

      $scope.package = {};
      /**
       * 存储整个工程的实时状态
       * @var {Object} $scope.package
       */
     // $http.get('/api/package/' + $routeParams.pkgId + '.json')
     // $http.get('/api/package/' + '1d9abf59bfade93c71fbb260b6dc7390.json')
      $http.get(GLOBAL.apiHost + 'fetchProject/?appid=' + $routeParams.pkgId)
        .success(function (data) {
          $scope.package = data;
          packageService.setPackage($scope.package);
          packageService.setStat($scope.editStat);
          // 默认选中第一个场景
          var sceneId = sceneService.findScene('order', '0');
          $scope.selectScene(sceneId);
        })
        .error(GLOBAL.errLogger);

      packageService.setStat($scope.editStat);

      $scope.addScene = function() {
        var newOne = sceneService.addScene();
        $scope.editStat.sceneHasAdded = true;
        elementService.deselectElement();
        actionService.deselectAction();
        sceneService.selectScene(newOne);
      };
      $scope.removeScene = function(scene) {
        elementService.deselectElement();
        actionService.deselectAction();
        sceneService.removeScene(scene);
      };

      $scope.selectAction = function(action) {
        return actionService.selectAction(action);
      };
      $scope.deselectAction = function() {
        actionService.deselectAction();
      };
      $scope.addAction = function() {
        actionService.addAction();
      };
      $scope.removeAction = function(action) {
        actionService.removeAction(action);
      };
      $scope.resizeHotspotTo = function(ele, w, h) {
        actionService.resizeHotspotTo(ele, w, h);
      };
      $scope.renderActionItem = function(action) {
        return actionService.renderActionItem(action);
      };

      $scope.addHotspotElement = function() {
        elementService.addHotspotElement();
        actionService.deselectAction();
      };

      $scope.removeElement = function(ele) {
        elementService.removeElement(ele);
      };

      /**
       * 选中一个场景
       * @func selectScene
       * @param {Scene} scene - 被选中的场景
       */
      $scope.selectScene = function (scene) {
        sceneService.selectScene(scene);
        // 清除掉之前可能有的其他元素、动作选择
        elementService.deselectElement();
        actionService.deselectAction();
      };

      $scope.defaults = {
        sceneBackground: 'images/dummy-scene-thumb.png'
      };

      /**
       * 释放选中的场景。连带释放选中的元素。
       * @func deselectScene
       */
      $scope.deselectScene = function () {
        sceneService.deselectScene();
        elementService.deselectElement();
        actionService.deselectAction();
      };

      /**
       * 编辑区空白区域点击时调用此函数，用以清除已选元素、动作
       * @func onBackgroundClick
       * @private
       */
      $scope.onBackgroundClick = function () {
        elementService.deselectElement();
      };

      $scope.onActorItemClick = function (element) {
        elementService.selectElement(element);
      };

      $scope.openUploaderWindow = function () {
        window.uploadSuccess = function (imageName) {
          var imgSrc = GLOBAL.host + 'packages/' + $routeParams.pkgId + '/' + imageName + '.png';
          $scope.editStat.selectedScene.background = imgSrc;
        };
        var x = screen.width / 2 - 700 / 2;
        var y = screen.height / 2 - 450 / 2;
        window.open(
//          '/api/uploader/#' + $routeParams.pkgId, //test
//          '/api/uploader/success.html#aaa' + $routeParams.pkgId, //test
          GLOBAL.host + 'api/uploader/#' + $routeParams.pkgId,
          'DescriptiveWindowName',
          'width=420,height=230,resizable,scrollbars=no,status=1,left=' + x + ',top=' + y
        );
      };

      /**
       * 保存编辑好的项目JSON数据
       */
      $scope.savePackage = function () {
        $http.post(GLOBAL.apiHost + 'saveProject/', {
          context: $scope.package
        })
          .success(function () {
            window.alert('已保存！');
            console.log('Package "' + $scope.package.appID + '" saved!');
          });
      };

    }]);
