import React from 'react';
import Auth from '../modules/auth.js';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { SyncLoader } from 'react-spinners';
import { LineChart, Line, Label, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function getTime (data) {
  if(data.length === 0) {
    return true
  } else {

    data.map(daily => {
      daily.time =  new Date(daily.time*1000).toString()

    })
    return data
  }

}

function moment(str) {
    return str.substring(4,10)
}

const Chart = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  data,
  isLoading,
  coindetail,
}) => (
  <div>

    {isLoading ? (
      <div className='sweet-loading' style={{width:60,paddingTop:'50px',margin:'auto'}}>
        <SyncLoader
          color={'#7D8A98'}
          loading={isLoading}
        />
      </div>
    ) : (
      <div style={{margin:'auto',width:'90%',marginTop:20}}>
      <h1 style={{textAlign:'left'}} className="homeHeader" >Price of {coindetail.name} Last Month</h1>
      <LineChart width={window.innerWidth - window.innerWidth * 0.18} height={350} data={getTime(data)} margin={{ top: 5, right: 20, bottom: 5, left: 15 }}>
        <Line type="monotone" dataKey="close" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="time" fontSize={12}  tickFormatter={timeStr => moment(timeStr)} textAnchor="middle" />
        <YAxis>
          <Label angle={270} position='left' style={{ color:"#8884d8", textAnchor: 'middle' }}>
            Price in $
           </Label>
        </YAxis>
        <Tooltip />
      </LineChart>

      </div>
    )}

      </div>
);

Chart.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  errors: PropTypes.object,
  successMessage: PropTypes.string,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  coindetail: PropTypes.object.isRequired,
};

export default Chart;
