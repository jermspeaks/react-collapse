/* eslint "react/no-did-mount-set-state":0, "react/no-did-update-set-state":0 */

import React from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';


const ReactWidth = React.createClass({
  propTypes: {
    children: React.PropTypes.node.isRequired,
    onWidthReady: React.PropTypes.func.isRequired,
    hidden: React.PropTypes.bool,
    dirty: React.PropTypes.bool
  },


  getDefaultProps() {
    return {hidden: false, dirty: true};
  },


  getInitialState() {
    return {
      width: 0, dirty: this.props.dirty
    };
  },


  componentDidMount() {
    if (!this.refs.wrapper) {
      return;
    }
    const width = this.refs.wrapper.clientWidth;
    const dirty = false;

    this.setState({width, dirty}, () => this.props.onWidthReady(this.state.width));
  },


  componentWillReceiveProps({children, dirty}) {
    if (children !== this.props.children || dirty) {
      this.setState({dirty: true});
    }
  },


  shouldComponentUpdate,


  componentDidUpdate() {
    if (!this.refs.wrapper) {
      return;
    }
    const width = this.refs.wrapper.clientWidth;
    const dirty = false;

    if (width === this.state.width) {
      this.setState({dirty});
    } else {
      this.setState({width, dirty}, () => this.props.onWidthReady(this.state.width));
    }
  },


  render() {
    const {onWidthReady, hidden, children, ...props} = this.props;
    const {dirty} = this.state;

    if (hidden && !dirty) {
      return null;
    }

    if (hidden) {
      return (
        <div style={{width: 0, overflow: 'hidden'}}>
          <div ref="wrapper" {...props}>{children}</div>
        </div>
      );
    }

    return <div ref="wrapper" {...props}>{children}</div>;
  }
});


export default ReactWidth;
