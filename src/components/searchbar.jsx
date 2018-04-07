import React, {Component} from 'react';
import { Link } from 'react-router';
import SearchBar from 'material-ui-search-bar';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/umd/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/umd/parse';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { browserHistory, Router } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ReactLoading from 'react-loading';
import Promise from 'promise-polyfill';
import fetch from 'isomorphic-fetch';


function escapeRegexCharacters (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function getSuggestionValue (suggestion) {
  return `${suggestion.name}` ;
}



// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters


function renderSuggestion (suggestion, { query }) {
  const coinname = suggestion.name;
  const suggestionText = `${coinname} (${suggestion.ticker})`;
  const matches = AutosuggestHighlightMatch(suggestionText, query);
  const parts = AutosuggestHighlightParse(suggestionText, matches);
  return (
    <span>
      <span>
        <img src={suggestion.image} style={{maxWidth:25,maxHeight:25,marginRight:10}} />
        {parts.map((part, index) => {
          const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;
          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          );
        })}
      </span>
    </span>
  );
}

function loading ()  {
  return (
      <span>
        <ReactLoading type="cubes" color="#33A1FD" height='20px' width='40px' />
      </span>
    )
}




class Search extends Component {

  constructor (props, context) {
    super(props,context);
    this.state = {
      value: '',
      suggestions: [],
      isLoading: false,
    };
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);

  }
  getSuggestions (input, callback) {
      this.setState({isLoading:true});
      let value = input;
      if (typeof(value) === "object") {
        var newVal = value.coinname
        return newVal
      }

      const escapedValue = escapeRegexCharacters(value.trim());

      if (escapedValue === '') {
      return [];
      }
      const regex = new RegExp('^' + escapedValue, 'i');
  		if (!value) {
  			return Promise.resolve([]);
  		}
      return fetch(`/api/search/users?q=${value}`)
  		.then((response) => response.json())
  		.then((coins) => {

        if (coins == undefined) {

          callback(null, []);
        } else {
          this.setState({isLoading:false});
          callback(null, coins);
        }
  		})
      .catch(err => {
        callback(null, err);
      });



  }


  onSuggestionSelected (event, { suggestion, method }) {
    event.preventDefault();
    const target = suggestion.coinname.toLowerCase().replace(/\s/g, '');
    browserHistory.push(`/coin/${target}`);
    return window.location.reload();
  }

  onSubmit (event) {
    const target = this.state.value.toLowerCase().replace(/\s/g, '');
    browserHistory.push(`/coin/${target}`);
    this.setState({value:''});
    return window.location.reload();
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.getSuggestions (value, (err, data) => {
      this.setState({suggestions: data});
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
      isLoading: false,
    });
  };
  render () {
    const { value, suggestions } = this.state;
    let formW = '47%';
    if (window.innerWidth < 1000) {
      formW = '50%';
    }
    let inputText = 'Search';
    const style = this.props.style;
    if (this.context.router.location.pathname === '/') {
      if (window.innerWidth < 1000) {
        formW = '85%';
      } else {
        formW = '50%';
      }

      inputText = 'Learn about cryptocurrencies';
    }


    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: inputText,
      value,
      onChange: this.onChange,
    };
    return (
      <form style={{margin:'auto', width:formW, maxHeight:'650px', display:'flex'}} onSubmit={this.onSubmit}>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestions}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps}
        />
        <FlatButton
          icon={<i style={{color:'white'}} className="material-icons">&#xE8B6;</i>}
          style={{minWidth:50,height:45,marginTop:5,marginLeft: 5,borderRadius:3}}
          backgroundColor="rgb(34, 116, 165)"
          primary
          onClick={this.onSubmit}
          hoverColor="#33A1FD"
        />
      </form>
    );
  }
}
Search.contextTypes = {
  router: PropTypes.object.isRequired,
};
export default Search;
