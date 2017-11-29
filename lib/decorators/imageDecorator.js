'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createImageDecorator;

var _imageStrategy = require('./imageStrategy');

var _imageStrategy2 = _interopRequireDefault(_imageStrategy);

var _imageComponent = require('./imageComponent');

var _imageComponent2 = _interopRequireDefault(_imageComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createImageDecorator() {
  return {
    strategy: _imageStrategy2.default,
    component: _imageComponent2.default
  };
};