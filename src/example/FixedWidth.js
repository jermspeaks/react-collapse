import React from 'react';
import {shouldComponentUpdate} from 'react-addons-pure-render-mixin';
import SideCollapse from '../SideCollapse';
import * as style from './style';


const FixedWidth = React.createClass({
  getInitialState() {
    return {
      isOpened: false,
      keepContent: false,
      width: 200,
      fixedWidth: 600
    };
  },


  shouldComponentUpdate,


  render() {
    const {isOpened, keepContent, width, fixedWidth} = this.state;

    return (
      <div>
        <div style={style.config}>
          <label style={style.label}>
            Opened:
            <input style={style.input}
              type="checkbox"
              checked={isOpened}
              onChange={({target: {checked}}) => this.setState({isOpened: checked})} />
          </label>

          <label style={style.label}>
            Keep content:
            <input style={style.input}
              type="checkbox"
              checked={keepContent}
              onChange={({target: {checked}}) => this.setState({keepContent: checked})} />
          </label>

          <label style={style.label}>
            Content width:
            <input style={style.input}
              type="range"
              value={width} step={50} min={0} max={600}
              onChange={({target: {value}}) => this.setState({width: parseInt(value, 10)})} />
            {width}
          </label>

          <label style={style.label}>
            Collapse width:
            <input style={style.input}
              type="range"
              value={fixedWidth} step={50} min={0} max={600}
              onChange={({target: {value}}) => this.setState({fixedWidth: parseInt(value, 10)})} />
            {fixedWidth}
          </label>
        </div>

        <SideCollapse
          style={style.container}
          isOpened={isOpened}
          fixedWidth={fixedWidth}
          keepCollapsedContent={keepContent}>
          <div style={{...style.getWidthContent(width), width}}></div>
        </SideCollapse>
      </div>
    );
  }
});


export default FixedWidth;
