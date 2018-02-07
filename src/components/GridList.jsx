import React, {Component} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import PropTypes from 'prop-types';
import { Link } from 'react-router';


function getRandom(arr, n) {
    var result = new Array(n)
    let len = arr.length

    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    result = arr.sort( function() { return 0.5 - Math.random() } )
    return result.slice(0,n);
}

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width:'100%',
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
    let tilesData = this.props.tilesData;
    const n = this.props.num
    tilesData = getRandom(tilesData, n)
    let style = this.props.style;
    return (
      <div style={styles.root}>
        <GridList style={styles.gridList} cols={1.2}>
        {tilesData.map((tile) => (
          <div>
            <Link style={style.head} to={`/coin/${tile.coinname.toLowerCase()}`}  >{tile.coinname.toLocaleUpperCase()}</Link>
            <GridTile
              key={tile}
              title={`${tile.coinname.toLocaleUpperCase()} - ${tile.ticker}`}
              containerElement={<Link style={style.linkStyle}  to={`/coin/${tile.coinname.toLowerCase()}`} />}
              titleStyle={style.text}
              titleBackground="none"
              padding={0}
              style={style.image}
            >
              <img src={tile.image} />
            </GridTile>
            </div>
            ))}
        </GridList>

      </div>
  );
  }

}

GridListView.propTypes = {
  tilesData: PropTypes.array.isRequired,
  style: PropTypes.object,
  num: PropTypes.number.isRequired
};

export default GridListView;
