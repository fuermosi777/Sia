'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _utils = require('./utils');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _handleInsertText = require('./handlers/handleInsertText');

var _handleInsertText2 = _interopRequireDefault(_handleInsertText);

var _handleInsertEmptyBlock = require('./handlers/handleInsertEmptyBlock');

var _handleInsertEmptyBlock2 = _interopRequireDefault(_handleInsertEmptyBlock);

var _handleLoadText = require('./handlers/handleLoadText');

var _handleLoadText2 = _interopRequireDefault(_handleLoadText);

var _imageDecorator = require('./decorators/imageDecorator');

var _imageDecorator2 = _interopRequireDefault(_imageDecorator);

var _linkDecorator = require('./decorators/linkDecorator');

var _linkDecorator2 = _interopRequireDefault(_linkDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sia = function (_React$Component) {
  _inherits(Sia, _React$Component);

  function Sia(props) {
    _classCallCheck(this, Sia);

    var _this = _possibleConstructorReturn(this, (Sia.__proto__ || Object.getPrototypeOf(Sia)).call(this, props));

    var compositeDecorator = new _draftJs.CompositeDecorator([(0, _imageDecorator2.default)(), (0, _linkDecorator2.default)()]);

    var editorState = void 0;

    if (props.raw) {
      editorState = _draftJs.EditorState.createWithContent((0, _draftJs.convertFromRaw)(props.raw), compositeDecorator);
    } else {
      editorState = _draftJs.EditorState.createEmpty(compositeDecorator);
    }

    _this.state = { editorState: editorState };
    return _this;
  }

  _createClass(Sia, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.text) {
        var newEditorState = (0, _handleLoadText2.default)(this.state.editorState, this.props.text);

        if (newEditorState !== this.state.editorState) {
          this.handleChange.call(this, newEditorState);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'Sia' },
        _react2.default.createElement(_draftJs.Editor, {
          ref: function ref(editor) {
            return _this2.editor = editor;
          },
          editorState: this.state.editorState,
          onChange: this.handleChange.bind(this),
          blockRendererFn: this.blockRendererFn.bind(this),
          handleKeyCommand: this.handleKeyCommand.bind(this),
          handleBeforeInput: this.handleBeforeInput.bind(this),
          onFocus: this.handleFocus.bind(this),
          handleReturn: this.handleReturn.bind(this),
          customStyleMap: _utils.styleMap,
          onTab: this.handleTab.bind(this),
          stripPastedStyles: true,
          handlePastedText: this.handlePastedText.bind(this)
        })
      );
    }
  }, {
    key: 'handleChange',
    value: function handleChange(editorState) {
      var _getCurrent = (0, _utils.getCurrent)(editorState),
          content = _getCurrent.content;

      this.setState({ editorState: editorState });
    }
  }, {
    key: 'handleTab',
    value: function handleTab(ev) {
      var newEditorState = (0, _handleInsertText2.default)(this.state.editorState, '\t');
      this.handleChange(newEditorState);
      ev.preventDefault();
    }
  }, {
    key: 'handleKeyCommand',
    value: function handleKeyCommand(command, editorState) {
      console.log('key', command);
      var newState = _draftJs.RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.handleChange(newState);
        return 'handled';
      }
      return 'not-handled';
    }
  }, {
    key: 'handlePastedText',
    value: function handlePastedText(text, html, editorState) {
      var newEditorState = (0, _handleLoadText2.default)(editorState, text, false);

      if (editorState !== newEditorState) {
        this.handleChange(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    }
  }, {
    key: 'handleBeforeInput',
    value: function handleBeforeInput(character, editorState) {
      var newEditorState = (0, _utils.checkCharacterForState)(editorState, character);

      if (editorState !== newEditorState) {
        this.setState({ editorState: newEditorState });
        return "handled";
      }

      return "not-handled";
    }
  }, {
    key: 'handleReturn',
    value: function handleReturn(e, editorState) {
      var newEditorState = (0, _utils.checkReturnForState)(editorState, e);
      if (editorState !== newEditorState) {
        this.setState({ editorState: newEditorState });
        return "handled";
      }

      return "not-handled";
    }
  }, {
    key: 'handleFocus',
    value: function handleFocus() {
      // console.log('focus')
    }
  }, {
    key: 'blockRendererFn',
    value: function blockRendererFn(contentBlock) {
      // console.log(contentBlock.getType())

    }
  }]);

  return Sia;
}(_react2.default.Component);

Sia.propTypes = {
  raw: _propTypes2.default.object,
  text: _propTypes2.default.string
};
Sia.defaultPropTypes = {
  raw: null,
  text: ''
};
exports.default = Sia;