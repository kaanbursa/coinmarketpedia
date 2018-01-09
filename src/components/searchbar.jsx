import React, {Component} from 'react';
import { Link } from 'react-router';
import SearchBar from 'material-ui-search-bar'
import Autosuggest from 'react-autosuggest';


function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



function getSuggestionValue(suggestion) {
  return `${suggestion.first} ${suggestion.last}`;
}

function renderSuggestion(suggestion, { query }) {
  const suggestionText = `${suggestion.first} ${suggestion.last}`;
  const matches = AutosuggestHighlightMatch(suggestionText, query);
  const parts = AutosuggestHighlightParse(suggestionText, matches);

  return (
    <span className={'suggestion-content ' + suggestion.twitter}>
      <span className="name">
        {
          parts.map((part, index) => {
            const className = part.highlight ? 'highlight' : null;

            return (
              <span className={className} key={index}>{part.text}</span>
            );
          })
        }
      </span>
    </span>
  );
}

class Search extends Component {

  constructor (props, context) {
    super(props);
    this.state = {
      value: '',
      results: [],
      suggestions: []
    }
    this.getSuggestions = this.getSuggestions.bind(this)

  }
  componentDidMount(){
    const req = new XMLHttpRequest();
    req.open('GET', '/api/coins', true);
    req.responseType = 'json'
    req.addEventListener('load', ()=> {
      let results = []
      req.response.forEach(element => {
        results.push(element.coinname)
      })

      this.setState({results})
    })
    req.send();
  }

  getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('\\b' + escapedValue, 'i');

    return this.state.results.filter(coin => regex.test(getSuggestionValue(coin)));
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
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
      placeholder: 'Search your coin',
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
        style={{
          width:'55%',
          margin: '0 auto',
          height:55,
        }}
      />

      </div>
    )
  }
}
export default Search;
