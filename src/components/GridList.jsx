import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

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
    width: 1500
  },
  titleStyle: {
    color: 'rgb(95, 168, 211)',
  },

};

const tilesData = [
  {
    img: 'https://i.amz.mshcdn.com/r7Q3xO_JRhAY1_hP9p38Mo2qddo=/950x534/https%3A%2F%2Fblueprint-api-production.s3.amazonaws.com%2Fuploads%2Fstory%2Fthumbnail%2F48693%2F1522f97a-a929-47ff-b696-d541496cc55c.png',
    title: 'ICO',
  },
  {
    img: 'https://cdn-images-1.medium.com/max/1600/0*GYklXzMrfhKDjGnt.png',
    title: 'Decentralized',

  },
  {
    img: 'https://i1.wp.com/psychlearningcurve.org/wp-content/uploads/2017/04/I-O.jpg?resize=625%2C425',
    title: 'Blockchain',
  },
];

/**
 * This example demonstrates the horizontal scrollable single-line grid list of images.
 */
const GridListView = () => (
  <div style={styles.root}>
    <GridList style={styles.gridList} cols={2.2}>
      {tilesData.map((tile) => (
        <GridTile
          key={tile.img}
          title={tile.title}
          actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
          titleStyle={styles.titleStyle}
          titleBackground="linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 70%,rgba(0,0,0,0) 100%)"
          padding={5}
          cellWidth={300}
        >
          <img src={tile.img} />
        </GridTile>
      ))}
    </GridList>
  </div>
);

export default GridListView;
