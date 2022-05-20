import React, { useContext, useEffect, useState }from 'react'
import { PlayingSongContext } from '../Pages/dashboard.jsx'
import { PlayingSongContext2 } from './Recs.js';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player({ token }) {

  const [playingTrack, setPlayingTrack] = useState(localStorage.getItem('currentTrack'))
  const [play, setPlay] = useState(false)

  let trackUri = localStorage.getItem("currentTrack");

  // Listen for track updates and play the new track
  window.addEventListener('storage', () => {
    setPlayingTrack(localStorage.getItem('currentTrack'));
  });

  console.log("UPDATED TRACKURI = " + trackUri);

  useEffect(() => setPlay(true), [trackUri]);




//   if (!accessToken) return null
  return <SpotifyPlayer
  token={token}
  name={"Discoverify"}
  play={true}
  showSaveIcon
  styles={{
    activeColor: '#fff',
    bgColor: '#000',
    color: '#ffffff',
    loaderColor: '#fff',
    sliderColor: '#1cb954',
    trackArtistColor: '#ccc',
    trackNameColor: '#fff',
  }}
  uris={trackUri ? [playingTrack] : []}/>
  
}
