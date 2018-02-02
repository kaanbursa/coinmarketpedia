import React, {Component} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import PropTypes from 'prop-types';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    width: 500
  },
  titleStyle: {
    color: 'rgb(95, 168, 211)',
    border: 'solid',
  },

};


/**
 * This example demonstrates the horizontal scrollable single-line grid list of images.
 */


class GridListView extends Component {
  constructor(props) {
    super(props);

  }

  render(){

    let tilesData = this.props.tilesData
    console.log(tilesData)
    console.log(tilesData.image)
    return (
      <div style={styles.root}>
        <GridList style={styles.gridList} cols={2.2}>
            <GridTile
              key={tilesData.image}
              title={tilesData.coinname}
              actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
              titleStyle={styles.titleStyle}
              titleBackground="linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 70%,rgba(0,0,0,0) 100%)"
              padding={5}
            >
              <img src={tilesData.image} />
            </GridTile>

        </GridList>
      </div>
  );
  }

}

GridListView.propTypes = {
  tilesData: PropTypes.object.isRequired,
};

export default GridListView;
