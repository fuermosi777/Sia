'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLinkDecorator;

var _linkStrategy = require('./linkStrategy');

var _linkStrategy2 = _interopRequireDefault(_linkStrategy);

var _linkComponent = require('./linkComponent');

var _linkComponent2 = _interopRequireDefault(_linkComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createLinkDecorator() {
  return {
    strategy: _linkStrategy2.default,
    component: _linkComponent2.default
  };
};