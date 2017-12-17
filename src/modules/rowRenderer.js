const ReactDataGrid = require('react-data-grid');
const { Row } = ReactDataGrid;
const React = require('react');

import PropTypes from 'prop-types';

export default class RowRenderer extends React.Component {
  static propTypes = {
    idx: PropTypes.number.isRequired,
  };

  setScrollLeft = (scrollBy) => {
    // if you want freeze columns to work, you need to make sure you implement this as apass through
    this.row.setScrollLeft(scrollBy);
  };

  getRowStyle = () => {
    return {
      color: this.getRowBackground(),
    };
  };

  getRowBackground = () => {
    const id = this.props.idx;
    if (id <= 8) {
      return '#C84630';
    } else if (id <= 12) {
      return '#A49E8D';
    } else if (id <= 14) {
      return '#DE6E4B';
    } else if (id <= 29) {
      return '#3D518C';
    } else if (id <= 33) {
      return '#0E7C7B';
    } else {
      return '#F9A03F';
    }
  };

  render () {
    // here we are just changing the style
    // but we could replace this with anything we liked, cards, images, etc
    // usually though it will just be a matter of wrapping a div, and then calling back through to the grid
    return (<div style={this.getRowStyle()}><Row ref={node => this.row = node} {...this.props} /></div>);
  }
}
