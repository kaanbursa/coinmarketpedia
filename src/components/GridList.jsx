import React, {Component} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import PropTypes from 'prop-types';
import { Link } from 'react-router';


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
    width: '100%',
    height: '400px',
    margin: 'auto'
  },
  titleStyle: {
    color: 'white'
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
    return (
      <div style={styles.root}>
        <GridList style={styles.gridList} cols={1.2}>
        {tilesData.map((tile) => (

            <GridTile
              key={tile.image}
              title={tile.coinname.toLocaleUpperCase()}
              actionIcon={<Link style={{color:'white',marginRight:'10px'}} to={`/coin/${tile.coinname.toLowerCase()}`}>Learn More!</Link>}
              titleStyle={styles.titleStyle}
              titleBackground="none"
              padding={5}
              style={{width:'310px', height:'310px',borderRadius:'5px'}}
            >
              <img src={tile.image} />
            </GridTile>
            ))}
        </GridList>

      </div>
  );
  }

}

GridListView.propTypes = {
  tilesData: PropTypes.object.isRequired,
};

export default GridListView;
