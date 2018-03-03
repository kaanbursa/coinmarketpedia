import React, {Component} from 'react';
import { Link } from 'react-router';
import SearchBar from 'material-ui-search-bar';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/umd/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/umd/parse';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { browserHistory, Router } from 'react-router';
import FontIcon from 'material-ui/FontIcon'



let coins = [];
const req = new XMLHttpRequest();
req.open('GET', '/api/coins', true);
req.responseType = 'json';
req.addEventListener('load', () => {
  const results = req.response;
  coins = results.sort(function(a, b){
   var nameA=a.coinname.toLowerCase(), nameB=b.coinname.toLowerCase();
   if (nameA < nameB) //sort string ascending
    return -1;
   if (nameA > nameB)
    return 1;
   return 0; //default return value (no sorting)
  });
});
req.send();


// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions (value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return coins.filter(coin => regex.test(coin.name) || regex.test(coin.ticker));
}

function getSuggestionValue (suggestion) {

  return `${suggestion.name}` ;
}





function renderSuggestion (suggestion, { query }) {
  const coinname = suggestion.name
  const suggestionText = `${coinname} (${suggestion.ticker})`;
  const matches = AutosuggestHighlightMatch(suggestionText, query);
  const parts = AutosuggestHighlightParse(suggestionText, matches);
  return (
    <span>
      <span>
      <img src={suggestion.image} style={{maxWidth:25,maxHeight:25,marginRight:10}}/>
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


class Search extends Component {

  constructor (props, context) {
    super(props,context);
    this.state = {
      value: '',
      suggestions: [],
    };
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onSubmit = this.onSubmit.bind(this);


  }

  onSuggestionSelected (event, { suggestion, method }) {
    event.preventDefault()
    const target = suggestion.coinname.toLowerCase().replace(/\s/g, '');
    browserHistory.push(`/coin/${target}`)
    return window.location.reload();
  }

  onSubmit(event) {

      const target = this.state.value.toLowerCase().replace(/\s/g, '');
      browserHistory.push(`/coin/${target}`);
      this.setState({value:''})
      return window.location.reload();


  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };
  render () {
    const { value, suggestions } = this.state;
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search',
      value,
      onChange: this.onChange,
    };
    return (
      <form onSubmit={this.onSubmit}>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps}
        />
      </form>
    );
  }
}
Search.contextTypes = {
  router: PropTypes.object.isRequired,
};
export default Search;
