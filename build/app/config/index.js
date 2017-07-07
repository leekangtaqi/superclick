'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config.base');

var _config2 = _interopRequireDefault(_config);

var _properties = require('../properties');

var _properties2 = _interopRequireDefault(_properties);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env;
var suffix = env === _properties2.default.env.QA ? 'qa' : env === _properties2.default.env.PRD ? 'prd' : 'dev';
var toMergeCfg = require('./config.' + suffix).default;

exports.default = _.merge({}, _config2.default, toMergeCfg);