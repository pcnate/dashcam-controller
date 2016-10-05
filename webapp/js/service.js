/**
 *
 */
angular.module('dashcamControllerApp')

  /**
   * @description
   */
  .factory('socket', function() {
    var socket = io.connect();

    return socket;
  })
