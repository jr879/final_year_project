import React, { useState, useEffect } from 'react'
import './Search.css'
import SpotifyWebApi from 'spotify-web-api-node';
import DisplaySearchResults from './DisplaySearchResults';

const spotifyApi = new SpotifyWebApi({
    //TODO : CANT BE HARDCODED
    clientId: "a765a06391984149aa1582fe7ff77a89",
})
export default function Search({ token, type }) {
    const [search, setSearch] = useState("");
    const [songSearchResults, setSongSearchResults] = useState([]);
    const [playlistSearchResults, setPlaylistSearchResults] = useState([]);
    const [availableGenres, setAvailableGenres] = useState([]);
    // spotifyApi.setAccessToken(token)

    // Setup spotify-web-api-node dependency with user's access token
    useEffect(() => {
        if (!token) {
            return
        }
        spotifyApi.setAccessToken(token)
    }, [token])

    // Update state every time the search is changed
    useEffect(() => {

        let searchBar = document.getElementById("search-bar");

        searchBar.addEventListener("keyup", (event) => {
            setSearch(String(searchBar.value));
        })
    }, [])

    // Every time state is updated, return new search results
    useEffect(() => {
        if (!search) return setSongSearchResults([])
        if (!token) return

        if (type === "Song") {
            spotifyApi.searchTracks(search).then(res => {
                setSongSearchResults(res.body.tracks.items.map(track => {
                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: track.album.images[0].url
                    }
                }))
            })
        } 
    }, [search])

    useEffect(() => {
        setTimeout(()=>{
            spotifyApi.getAvailableGenreSeeds().then(function (data) {
                let genreSeeds = data.body;
                setAvailableGenres(data.body.genres);
                console.log(genreSeeds);
                console.log(availableGenres);
            }, function (err) {
                console.log('Something went wrong!', err);
            });
           }, 3000)
    }, [])

    // Render the appropriate results in the appropriate tab 
    let searchResults = "";
    if (type === "Song") {
        searchResults = songSearchResults.map((track) => {
            return (
                <DisplaySearchResults type = "Song" result={track} key={track.uri} />
            )
        })
    } else if (type === "Playlist") {
        searchResults = playlistSearchResults.map((track) => {
            return (
                <DisplaySearchResults result={track} key={track.uri} />
            )
        })
    } else if (type === "Genre") {
        searchResults = availableGenres.map((genre) => {
            return (
                <DisplaySearchResults type={type} result={genre}/>
            )
        })
    }

    return (
        <div class="wrapper">
            <form class="search-container">
                <input type="text" id="search-bar" placeholder={"Search " + type} autocomplete="off" style={{ width: "75%" }}></input>
            </form>
            <div className="results-container" style={{ overflowY: "auto" }}>

                {searchResults}
                {/* {songSearchResults.map((track) => {
                    return(
                        <DisplaySearchResults result={track} key={track.uri} />
                    )
                })} */}
            </div>
        </div>
    )
}