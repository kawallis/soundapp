import React, { Component } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import api from './api/api';
import SC from 'soundcloud';

SC.initialize({ client_id: process.env.CLIENT_ID});

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery: '',
      searchList: [], 
      track: null,
    }
    this.updatebox = this.updatebox.bind(this);
    this.playplay = this.playplay.bind(this);
    this.loop = this.loop.bind(this);
  }

  updatebox(value) {
    this.setState({searchQuery: value})
    let {searchQuery} = this.state;
    api.getLists(value)
    .then(res => {
      this.setState({searchList: res});
    })
    .catch(err =>  console.log(err));
  }

  playplay(track) {
    SC.stream(`/tracks/${track}`)
    .then(player => {
      this.streamData = new Uint8Array(128);
      let AUDIO = new (window.AudioContext || window.webkitAudioContext)();
      let analyzer;
      analyzer.fftSize = 256;
      analyzer = AUDIO.createAnalyser();
      player.play();
      var source = AUDIO.createMediaElementSource(player);
      source.connect(analyzer);
      analyzer.connect(AUDIO.destination);
      this.loop(analyzer)
    });
  }

  loop(analyzer) {
    console.log('ayo');
    analyzer.getByteFrequencyData(this.streamData);
  }

  render() {
    return (
      <div className="App">
        <SearchBar updatebox={this.updatebox} value={this.state.searchQuery}/>
        <div className="SearchContainer">
          {this.state.searchList.map((item, i) => {
            return (
              <div key={i} className="ItemContainer" data-track={item.id} onClick={ e => {
              
                e.preventDefault();
                this.playplay(e.target.getAttribute('data-track'));  
              }}>
                <img src={`${item.user.avatar_url}`} className="ArtistPic" data-track={item.id}/>
                <h4 className="Artist" data-track={item.id}>{item.title}</h4>
                <h4 className="Artist" data-track={item.id}>{item.user.username}</h4>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
