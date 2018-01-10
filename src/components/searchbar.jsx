import React, {Component} from 'react';
import { Link } from 'react-router';
import SearchBar from 'material-ui-search-bar'
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/umd/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/umd/parse';

let coins = []
const req = new XMLHttpRequest();
req.open('GET', '/api/coins', true);
req.responseType = 'json'
req.addEventListener('load', ()=> {
  let results = req.response
  coins = results
})
req.send();


// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return coins.filter(coin => regex.test(coin.coinname));
}

function getSuggestionValue(suggestion) {
  return `${suggestion.coinname} ${suggestion.ticker}` ;
}

function renderSuggestion(suggestion, { query }) {
  const suggestionText = suggestion.coinname + ' (' + suggestion.ticker + ')'
  const matches = AutosuggestHighlightMatch(suggestionText, query);
  const parts = AutosuggestHighlightParse(suggestionText, matches);
  return (
    <span className={'suggestion-content '}>
      <span className="name">
        {
          parts.map((part, index) => {
            const className = part.highlight ? 'highlight' : null;
            return (
              <span className={className} key={index}><Link to={`/coin/${suggestion.coinname}`}>{part.text}</Link></span>
            );
          })
        }
      </span>
    </span>
  );
}


class Search extends Component {

  constructor (props, context) {
    super(props,context);
    this.state = {
      value: '',
      suggestions: []
    }
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
    // this.escapeRegexCharacters = this.escapeRegexCharacters.bind(this)
    // this.getSuggestionValue = this.getSuggestionValue.bind(this)
    // this.renderSuggestion = this.renderSuggestion.bind(this)

  }

  onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }){
    console.log('selecte')
    return this.context.router.replace(`/coin/${suggestion.coinname}`)
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render(){
    const { value, suggestions } = this.state;
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search for a coin',
      value,
      onChange: this.onChange
    };
    return (
      <div>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />

      </div>
    )
  }
}
export default Search;
