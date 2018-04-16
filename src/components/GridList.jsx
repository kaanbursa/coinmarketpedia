import React, {Component} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { SyncLoader } from 'react-spinners';


function getRandom (arr, n) {
  let result = new Array(n);
  const len = arr.length;
  if (n > len) {
    result = [
      {id: 1, name: "Bitcoin", coinname: "bitcoin", homeImage: "https://storage.googleapis.com/coinmarketpedia/bitcoinHome.png"},
      {id: 2, name: "Ethereum", coinname: "ethereum", homeImage: "https://storage.googleapis.com/coinmarketpedia/ethereumHome.png"},
      {id: 3, name: "OmiseGo", coinname: "omisego", homeImage: "https://storage.googleapis.com/coinmarketpedia/omisegoHome.png"}]
    return result
  }

  result = arr.sort(() => {
    return 0.5 - Math.random();
  });
  console.log(result.slice(0,3))

  return result.slice(0,3);
}

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    width:'100%',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    width: '100%',
    height: '300px',
    margin: 'auto',
    whiteSpace: 'nowrap',
    overflow: 'hidden',

  },
  titleStyle: {
    color: 'white',
  },
  head: {
    flexWrap: 'nowrap',
    textOverflow: 'clip',
  },

};


/**
 * This example demonstrates the horizontal scrollable single-line grid list of images.
 */


class GridListView extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.update) {
      return true;
    } else {
      return false;
    }
  }


  render () {
    let tilesData = this.props.tilesData;
    const n = this.props.num;
    const style = this.props.style;
    tilesData = getRandom(tilesData)

    styles.gridList.height = style.height;

    return (
      <div style={styles.root}>
      {tilesData.length != 0 ? (
        <div>
          <GridList style={styles.gridList} cols={1.2}>
            {tilesData.map((tile,i) => (
              <div key={i} >
                <Link style={style.head} to={`/coin/${tile.coinname.toLowerCase()}`}  >{tile.name.toLocaleUpperCase()}</Link>
                <GridTile
                  key={i}
                  title={`${tile.name} - ${tile.ticker}`}
                  containerElement={<Link style={style.linkStyle}  to={`/coin/${tile.coinname.toLowerCase().replace(/\s/g, '-')}`} />}
                  titleStyle={style.text}
                  titleBackground="none"
                  padding={0}
                  style={{width:'31%',height:100,display:'table-cell',borderRadius:3, maxWidth:125}}
                >
                  <img src={tile.homeImage} style={{borderRadius:3, maxWidth:125}}/>
                </GridTile>
              </div>
              ))}
          </GridList>
        </div>
      ) : (
        <div className='sweet-loading' style={{width:60,paddingTop:'50px',margin:'auto'}}>
          <SyncLoader
            color={'#7D8A98'}
            loading={!tilesData}
          />
        </div>
      )}


      </div>
    );
  }

}

GridListView.propTypes = {
  tilesData: PropTypes.array.isRequired,
  style: PropTypes.object,
  num: PropTypes.number.isRequired,
};

export default GridListView;
