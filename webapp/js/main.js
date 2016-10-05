/**
 * @ngdoc app
 */
angular.module('dashcamControllerApp', ['ngRoute', 'ngAnimate'])

  /**
   * route configuration and html5 mode
   */
  .config( function( $routeProvider, $locationProvider ) {

    $routeProvider

      .when('/', {
        templateUrl: '/views/home.html',
        controller: 'HomeController',
        controllerAs: 'homeCtrl'
      })
      .when('/settings', {
        templateUrl: '/views/settings.html',
        controller: 'SettingsController',
        controllerAs: 'settingsCtrl'
      })

    $locationProvider.html5Mode(true);

  })

  /**
   * @ngdoc controller
   * @name dashcamControllerApp.MainController
   * @description main view controller
   */
  .controller('MainController', function( $scope, socket ) {
    var mainCtrl = this;
    $scope.t = 0;

    mainCtrl.settings = {};
    mainCtrl.connected = false;

    mainCtrl.onConnect = () => {
      mainCtrl.connected = true;
      $scope.$apply( () => {
        $scope.t++;
      });
    }

    mainCtrl.onDisconnect = () => {
      mainCtrl.connected = false;
      $scope.$apply(function() {
        $scope.t++;
      });

      setTimeout( function() {
        window.location.reload();
      }, 3000);
    }

    socket.on( 'connect',    mainCtrl.onConnect    );
    socket.on( 'disconnect', mainCtrl.onDisconnect );

    $scope.$on('$destroy', function() {
      socket.removeListener('connect',    mainCtrl.onConnect    );
      socket.removeListener('disconnect', mainCtrl.onDisconnect );
    })

  })

  /**
   * @ngdoc controller
   * @name dashcamControllerApp.HomeController
   * @description home page controller
   */
  .controller('HomeController', function( $scope, socket ) {
    var homeCtrl = this;
    $scope.t = 0;

    homeCtrl.serial = [];

    homeCtrl.sendSerial = () => {
      let serialCommand = homeCtrl.serialInput;
      let serial = { direction:'tx',message: serialCommand };
      homeCtrl.serialInput = '';
      homeCtrl.serial.unshift( serial );
      socket.emit('command', { action: 'newSerial', serial: serial });
    }

    homeCtrl.onSerial = ( serial ) => {
      homeCtrl.serial = serial;
      $scope.$apply(function() {
        $scope.t++;
      });
    }

    homeCtrl.onNewSerial = ( serial ) => {
      homeCtrl.serial.unshift( serial );
      $scope.$apply( () => {
        $scope.t++;
      })
    }

    socket.on( 'serial',      homeCtrl.onSerial    );
    socket.on( 'newSerial',   homeCtrl.onNewSerial );

    $scope.$on('$destroy', function() {
      socket.removeListener('serial',      homeCtrl.onSerial    );
      socket.removeListener('newSerial',   homeCtrl.onNewSerial );
    })

    socket.emit('command', { action: 'loadSerial' })

  })

  /**
   * @ngdoc controller
   * @name dashcamControllerApp.SettingsController
   * @description settings page controller
   */
  .controller('SettingsController', function( $scope, socket ) {
    var settingsCtrl = this;
    $scope.t = 0;

    settingsCtrl.settings = {};

    settingsCtrl.onSettings = ( settings ) => {
      console.log( settings );
      settingsCtrl.settings = settings;
      $scope.$apply(function() {
        $scope.t++;
      });
    }

    socket.on( 'settings',   settingsCtrl.onSettings   );

    $scope.$on('$destroy', function() {
      socket.removeListener('settings',   settingsCtrl.onSettings   );
    })

    socket.emit('command', { action: 'loadSettings' })

  })
