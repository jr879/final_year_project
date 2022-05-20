import React, { useState, useEffect } from 'react'
import './Recs.css'

export const PlayingSongContext2 = React.createContext();

function Recs(props) {
    const [tracks, setTracks] = useState([])
    const [fetchedData, setFetchedData] = useState(false)
    const [currentTrack, setCurrentTrack] = useState("")
    const [playedTrackCount, setPlayedTrackCount] = useState(0);

    // Code to be executed once
    useEffect(()=>{
        getTracks()
    }, [])

    async function getTracks() {
        console.log("Getting recommendations for: " + props.seed[0] + " " + props.seed[1]);
        // Making the seed & title available application wide for use in saving a user's layout
        let newPanel = [
            props.seed[0],
            props.seed[1]
        ]
        let seedTitleList = localStorage.getItem("panelCustomisation");
        console.log(seedTitleList);
        if (seedTitleList === undefined || seedTitleList === null) {
            seedTitleList = newPanel;
            localStorage.setItem("panelCustomisation", JSON.stringify(seedTitleList));
        } else if (seedTitleList != undefined){
            console.log(seedTitleList);
            let extendedSeedTitleList = [
                ...seedTitleList,
                [props.seed[0], props.seed[1]]
            ]
            localStorage.setItem("panelCustomisation", extendedSeedTitleList);
        }


        let recommendations = await fetch("http://localhost:8888/recs?seed=" + props.seed[0]).then((res) => {
            return res.json()
        })
        setTracks(recommendations)
        console.log(recommendations)
    }

    async function test() {
        console.log("Refreshing token...");
        let newToken = await fetch("http://localhost:8888/refresh");
        console.log(newToken);
    }
    
    // This function helps budget the third party API requests to Spotify by preventing unnecessary play requests
    function updateTrack(track) {
        if (track != currentTrack) {
            console.log("NEW TRACK: " + track);
            //playTrack(track);
            setCurrentTrack(track);
            localStorage.setItem("currentTrack", track);
            window.dispatchEvent( new Event('storage') )
        } else {
            console.log("ALREADY PLAYING");
        }
    }

    async function pauseTrack() {
        console.log("pausing track");
        await fetch("http://localhost:8888/pause");
    }

    return (
        <PlayingSongContext2.Provider value={currentTrack}>
        <div className="cover-art-container">
            <div className="panel-title">{props.seed[1]}</div>
            {tracks.map((track, index) => {
                return (
                    <div className="cover-art double" key={index} id={track} style={{backgroundImage : "url(" + track.album.images[2].url + ")"}}
                    onClick={() => test()} onMouseOver={() => updateTrack(track.album.uri)}/>
                );
            })}
        </div>
        </PlayingSongContext2.Provider>
    )
}

export default Recs