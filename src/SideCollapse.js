import React from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import {Motion, spring} from 'react-motion';
import WidthReporter from './ReactWidth';

// Function for limiting width to one decimal point
const stringWidth = width => Math.max(0, parseFloat(width)).toFixed(1);

const SideCollapse = React.createClass({
  propTypes: {
    isOpened: React.PropTypes.bool.isRequired,
    children: React.PropTypes.node.isRequired,
    fixedWidth: React.PropTypes.number,
    style: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
    springConfig: React.PropTypes.objectOf(React.PropTypes.number),
    keepCollapsedContent: React.PropTypes.bool
  },


  getDefaultProps() {
    return {fixedWidth: -1, style: {}, keepCollapsedContent: false};
  },


  getInitialState() {
    return {fixedWidth: -1, isOpenedChanged: false};
  },

  componentWillMount() {
    this.width = stringWidth(0);
    this.renderStatic = true;
  },


  componentWillReceiveProps({isOpened}) {
    this.setState({isOpenedChanged: isOpened !== this.props.isOpened});
  },


  shouldComponentUpdate,


  onWidthReady(width) {
    if (this.renderStatic && this.props.isOpened) {
      this.width = stringWidth(width);
    }
    this.setState({width});
  },

  getMotionWidth(width) {
    const {isOpened, springConfig} = this.props;
    const {isOpenedChanged} = this.state;

    const newWidth = isOpened ? Math.max(0, parseFloat(width)).toFixed(1) : stringWidth(0);

    // No need to animate if content is closed and it was closed previously
    // Also no need to animate if width did not change
    const skipAnimation = !isOpenedChanged && !isOpened || this.width === newWidth;

    const springWidth = spring(isOpened ? Math.max(0, width) : 0, springConfig);
    const instantWidth = isOpened ? Math.max(0, width) : 0;

    return skipAnimation ? instantWidth : springWidth;
  },


  renderFixed() {
    const {isOpened, style, children, fixedWidth, springConfig, keepCollapsedContent,
      ...props} = this.props;

    if (this.renderStatic) {
      this.renderStatic = false;
      const newStyle = {overflow: 'hidden', width: isOpened ? fixedWidth : 0};

      if (!keepCollapsedContent && !isOpened) {
        return null;
      }
      this.width = stringWidth(fixedWidth);
      return <div style={{...newStyle, ...style}} {...props}>{children}</div>;
    }

    return (
      <Motion
        defaultStyle={{width: isOpened ? 0 : fixedWidth}}
        style={{width: this.getMotionWidth(fixedWidth)}}>
        {({width}) => {
          this.width = stringWidth(width);

          // TODO: this should be done using onEnd from ReactMotion, which is not yet implemented
          // See https://github.com/chenglou/react-motion/issues/235
          if (!keepCollapsedContent && !isOpened && this.width === stringWidth(0)) {
            return null;
          }

          const newStyle = {overflow: 'hidden', width};

          return <div style={{...newStyle, ...style}} {...props}>{children}</div>;
        }}
      </Motion>
    );
  },


  renderWidthReporter() {
    const {children} = this.props;

    return <WidthReporter onWidthReady={this.onWidthReady}>{children}</WidthReporter>;
  },


  render() {
    const {isOpened, style, children, fixedWidth, springConfig, keepCollapsedContent,
      ...props} = this.props;

    if (fixedWidth > -1) {
      return this.renderFixed();
    }

    const renderStatic = this.renderStatic;
    const {width} = this.state;
    const currentStringWidth = parseFloat(width).toFixed(1);

    if (width > -1 && renderStatic) {
      this.renderStatic = false;
    }

    // Cache Content so it is not re-rendered on each animation step
    const content = this.renderWidthReporter();

    if (renderStatic) {
      const newStyle = {overflow: 'hidden', width: isOpened ? 'auto' : 0};

      if (!isOpened && width > -1) {
        if (!keepCollapsedContent) {
          return null;
        }
        return (
          <div style={{width: 0, overflow: 'hidden', ...style}} {...props}>
            {content}
          </div>
        );
      }

      return <div style={{...newStyle, ...style}} {...props}>{content}</div>;
    }

    return (
      <Motion
        defaultStyle={{width: isOpened ? 0 : Math.max(0, width)}}
        style={{width: this.getMotionWidth(width)}}>
        {st => {
          this.width = stringWidth(st.width);

          // TODO: this should be done using onEnd from ReactMotion, which is not yet implemented
          // See https://github.com/chenglou/react-motion/issues/235
          if (!isOpened && this.width === '0.0') {
            if (!keepCollapsedContent) {
              return null;
            }
            return (
              <div style={{width: 0, overflow: 'hidden', ...style}} {...props}>
                {content}
              </div>
            );
          }

          const newStyle = (isOpened && this.width === currentStringWidth) ? {width: 'auto'} : {
            width: st.width, overflow: 'hidden'
          };

          return <div style={{...newStyle, ...style}} {...props}>{content}</div>;
        }}
      </Motion>
    );
  }
});


export default SideCollapse;
