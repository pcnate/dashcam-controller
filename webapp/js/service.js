/**
 *
 */
angular.module('dashcamControllerApp')

  /**
   * @description wrap the socket.io library with a service for injection
   */
  .factory('socket', () => {
    var socket = io.connect();

    return socket;
  })

  /**
   * @description
   */
  .factory('viewFactory', function() {
    var viewFactory = {};

    var viewFactoryData = { current: '' };

    /**
     * @ngdoc
     * @description
     */
    viewFactory.returnBindObject = function() {
      return viewFactoryData;
    }

    /**
     * @ngdoc
     * @description
     */
    viewFactory.setView = function( view ) {
      viewFactoryData.current = view;
    }

    return viewFactory;
  })
