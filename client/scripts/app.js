import angular from 'angular';
import 'angular-ui-router';

import routeConfig from './app.router.js';

import MainController from './controllers/mainController.js';
import AboutController from './controllers/aboutController.js';

angular.module('testApp', ['ui.router'])
  .controller('mainController', MainController)
  .controller('aboutController', AboutController)
  .config(routeConfig);
