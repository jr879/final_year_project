import React from 'react'
import './DisplaySearchResults.css'

export default function DisplaySearchResults({ type, result, genre}) {

  if (type === "Song"){
    console.log(result);
  }

  function callSongPanelCreation(songSeed, songTitle) {
    // window.dispatchEvent( new Event('createSongPanel', {'detail': songSeed}))
    window.dispatchEvent( new CustomEvent('createSongPanel',{'detail': {
      "songSeed" : songSeed,
      "songTitle" : songTitle
    }
  }));
  localStorage.setItem("songSeed", songSeed);
  localStorage.setItem("songTitle", songTitle);
  }

  if (type === "Song") {
    return (
      <div className="result-container">
        <img className="search-result" onClick={() => {callSongPanelCreation(result.uri, result.title)}} src={result.albumUrl} style={{ height: "64px", width: "64px" }} />
        <div className="title-container">
          <div>{result.title}</div>
          <div className="artist">{result.artist}</div>
        </div>
      </div>
    )
  } else if (type === "Genre") {
    return (
        <div className="result-container">
          <div className="genre-container">
            <div>{result}</div>
          </div>
        </div>
    )
  } else {
    return (
      "Placeholder"
    )
  }

}
