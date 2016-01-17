import 'styles/style.config.less!';

import angular from 'angular';
import 'angular-ui-router';
import routeConfig from './router.js';
import MainController from './controllers/mainController.js';
import AboutController from './controllers/aboutController.js';

angular.module('partnerApp', ['ui.router'])
  .controller('mainController', MainController)
  .controller('aboutController', AboutController)
  .config(routeConfig);
