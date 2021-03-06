'use strict';

angular.module('toHELL')

/**
 *  Navbar directive
 */

.directive('navbar', function (accountService, $rootScope, $route) {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'partials/navbar.html',
    link: function ($scope) {

      /**
       *  Navbar Status
       */

      $scope.isLoggedIn = function () {
        return accountService.isLoggedIn();
      };

      $scope.isEditing = function () {
        return $route.current.originalPath === '/package/:pkgId';
      };

      /**
       *  登出账号
       */

      $scope.logout = function (e) {

        // 登出按钮的有效计时
        var readyTimeout = 1000;

        var tar = angular.element(e.target);

        if (tar.hasClass('ready')) {
          accountService.logout();
        } else {
          tar.addClass('ready');
          setTimeout(function () {
            tar.removeClass('ready');
          }, readyTimeout);
        }
        //
      };

      /**
       * 保存项目
       */
      $scope.savePackage = function () {
        $rootScope.$broadcast('package.save');
      };
    }
  };
});
