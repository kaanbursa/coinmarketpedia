import React from 'react';
import Auth from '../modules/auth.js';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { SyncLoader } from 'react-spinners';

function getValues(obj) {
  const tifs = obj.text;
  return Object.keys(tifs).map(key =>
    <div>
      <h1 style={{fontSize:14}} value={key}>{key.toLocaleUpperCase()}</h1>
      <p className="submittedP" value={key}>{tifs[key]}</p>
    </div>
    );
}

function checkIfVoted (arr, id) {
  let ans = false
  arr.map(obj => {
    if (parseInt(obj.userId) === parseInt(id)) {

      ans = true;
    }
  })
  return ans


}


const Contribution = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  contributions,
  isLoading,
  userId,
  downVote,
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
      <div>
        {contributions.length === 0 ? (
          <p className="pageDesc" style={{borderBottom: 'none'}}>No contribution has been made for this coin</p>
        ) : (
          <div>
            {contributions.map(cont => (
              <Card style={{marginTop:10}}>
                <CardHeader
                  title={cont.user.username}
                  subtitle={`Voted Correct by ${cont.valId.length}`}
                  avatar={<img src={`https://storage.googleapis.com/coinmarketpedia/rank${cont.user.rank}.png`} style={{borderRadius:20, width:28,height:28}} />}
                  actAsExpander

                />
                <CardActions>
                {checkIfVoted(cont.valId, userId) ? (
                  <div>
                    <FlatButton label="Voted!"
                    backgroundColor="#5C626C"
                    labelStyle={{color:'white'}}
                    hoverColor="#82C09A"
                    disabled={true}
                    icon={<i style={{color:'white',fontSize:14}} className="material-icons">&#xE8DC;</i>}
                    onClick={() => console.log('DownVote')}
                    />
                    <FlatButton label="DownVote!"
                    style={{marginLeft:10}}
                    backgroundColor="#222E50"
                    labelStyle={{color:'white'}}
                    hoverColor="#82C09A"
                    icon={<i style={{color:'white',fontSize:14}} className="material-icons">&#xE8DB;</i>}
                    onClick={() => downVote(cont.id,userId)}
                    />
                  </div>
                ) : (
                  <FlatButton label="Upvote"
                  backgroundColor="#58BC82"
                  labelStyle={{color:'white'}}
                  hoverColor="#82C09A"
                  icon={<i style={{color:'white',fontSize:14}} className="material-icons">&#xE8DC;</i>}
                  onClick={() => onSubmit(cont.id,userId)}
                  />
                )}


                </CardActions>
                <CardText>

                  {getValues(cont)}
                </CardText>
              </Card>

          ))}
      </div>
    )}
    </div>
    )}

      </div>
);

Contribution.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  errors: PropTypes.object,
  successMessage: PropTypes.string,
  contributions: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
  downVote: PropTypes.func.isRequired,
};

export default Contribution;
