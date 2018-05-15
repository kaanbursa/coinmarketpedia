import React from 'react';
import Auth from '../modules/auth.js';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { SyncLoader } from 'react-spinners';
import { AreaChart, Area, Label, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

function getTime (data,date) {
  if(data.length === 0) {
    return true
  } else {

    data.map(daily => {
      daily.timeBeauty =  new Date(daily.time*1000).toString()

    })

    switch (date) {

      case 0:

        data = data
        return data
        break;
      case 1:
        if (data.length <= 365) {
          return data
        } else {
          data = data.slice(data.length - 365,data.length)
          return data
        }
        break;
      case 2:
        if (data.length <= 180) {
          return data
        } else {
          data = data.slice(data.length - 180,data.length)
          return data
        }
        break;
      case 3:
          if (data.length <= 30) {
            return data
          } else {
            data = data.slice(data.length - 30,data.length)
            return data
          }
        break;
      case 4:
        if (data.length <= 7) {
          return data
        } else {
          data = data.slice(data.length - 7,data.length)
          return data
        }
        break;
      default:

    }

  }

}


function moment(str) {
    return str.substring(4,10)
}
let style={float:'right'}
if(window.innerWidth <= 500) {
  style={float:'left'}
}

const Chart = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  data,
  isLoading,
  coindetail,
  date,
  dateChange,
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
      <div style={{marginBottom: 20, display: 'inline-block', width:'100%'}}>
      <h1 className="chartHeader" >Price of {coindetail.name}</h1>
      <DropDownMenu value={date} onChange={dateChange} style={style}>
          <MenuItem value={0} primaryText="All time" />
          <MenuItem value={1} primaryText="1 Year" />
          <MenuItem value={2} primaryText="6 Months" />
          <MenuItem value={3} primaryText="1 Month" />
          <MenuItem value={4} primaryText="1 Week" />
        </DropDownMenu>
      </div>
      <AreaChart width={window.innerWidth - window.innerWidth * 0.18} height={350} data={getTime(data,date)} margin={{ top: 5, right: 20, bottom: 5, left: 15 }}>
        <Area type="monotone" dataKey="close" stroke="#8884d8" />

        <XAxis dataKey="timeBeauty" fontSize={12}  tickFormatter={timeStr => moment(timeStr)} textAnchor="middle" />
        <YAxis>
        <div>
          {window.innerWidth < 500 ? (
            <Label angle={270} position='left' style={{ color:"#8884d8", textAnchor: 'middle' }}>
              Price in $
             </Label>
          ) : (<span />)}
          </div>
        </YAxis>
        <Tooltip />
      </AreaChart>

      </div>
    )}

      </div>
);

Chart.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  errors: PropTypes.object,
  successMessage: PropTypes.string,
  date: PropTypes.number.isRequired,
  dateChange: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  coindetail: PropTypes.object.isRequired,
};

export default Chart;
