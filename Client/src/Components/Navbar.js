import React, { useState, useEffect } from 'react'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import { Link } from 'react-router-dom'
import './Navbar.css'
import Panel from '../Components/Panel'
import Search from './Search'
import { IconContext } from 'react-icons'

function Navbar(props) {
    const [sidebar, setSidebar] = useState(false);
    const [createPanelMenu, setCreatePanelMenu] = useState(false);

    // Setting up tabs
    function setupTabs() {
        let tabsHeader = document.getElementsByClassName("tab-header")[0];
        if (tabsHeader != undefined) {
            let tabsIndicator = document.getElementsByClassName("tab-indicator")[0];
            let tabsBody = document.getElementsByClassName("tab-body")[0];
            let tabsPane = tabsHeader.getElementsByTagName("div");

            for (let i = 0; i < tabsPane.length; i++) {
                tabsPane[i].addEventListener("click", () => {
                    tabsHeader.getElementsByClassName("active")[0].classList.remove("active");
                    tabsPane[i].classList.add("active");

                    tabsBody.getElementsByClassName("active")[0].classList.remove("active");
                    if (i == 0) {
                        let element = document.getElementById("song-section")
                        element.classList.add("active");
                    } else if (i == 1) {
                        let element = document.getElementById("playlist-section")
                        element.classList.add("active");
                    } else if (i == 2) {
                        let element = document.getElementById("genre-section")
                        element.classList.add("active");
                    } else if (i == 3) {
                        let element = document.getElementById("for-you-section")
                        element.classList.add("active");
                    }
                    //tabsBody.getElementsByTagName("div")[i].classList.add("active");
                    tabsIndicator.style.left = `calc(calc(100% / 4) * ${i})`;
                })
            }
        }

    }
    setTimeout(setupTabs(), 2000);
    //setupTabs();

    window.addEventListener('createSongPanel', (response) => {
        let trackSeed = response.detail.songSeed;
        let trackTitle = response.detail.songTitle;
        console.log(trackSeed);
        createPanel("Song", trackSeed, trackTitle);
    });

    function createPanel(panelType, seed, title) {
        //let appendTarget = document.querySelector(".menu-container");
        //props.toggleMenu(menuType);

        // A small delay has been added to prevent the event from firing instantly when the Create Panel button is pressed
        if (panelType === "Song") {
            setTimeout(function () {
                props.getMousePosition(seed, title);
            }, 100);
        }
        toggleCreatePanelMenu();
        toggleSidebar();
    }

    function toggleMenus() {
        if (createPanelMenu === true) {
            toggleCreatePanelMenu();
            toggleSidebar();
        } else {
            toggleSidebar();
        }
    }

    function toggleLock() {
        props.toggleLock();
    }

    function toggleSidebar() {
        setSidebar(!sidebar);
    }

    function toggleCreatePanelMenu() {
        setCreatePanelMenu(!createPanelMenu);
        // Open panel here
    }

    return (
        <div>
            <IconContext.Provider value={{ color: '#fff' }}>
                <div className="navbar">
                    {/* {props.menuOpen ? <Link className="menu-back">Back</Link> : <Link className='menu-bars' onClick={toggleSidebar}> */}
                    <Link className='menu-bars' onClick={toggleMenus}>
                        {/* <FaIcons.FaBars onClick={toggleSidebar}/> */}
                        <div className="horizontal-bar" />
                        <div className={
                            sidebar ? "vertical-bar:active" : "vertical-bar"
                        } />
                    </Link>
                    <h1 className="navbar-greeting">Hello, {props.name}.</h1>
                </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' >
                        {/* <li className='navbar-toggle'>
                            <Link className='menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li> */}
                        <div className='nav-section-text'>Customise your dashboard.</div>
                        <li className="nav-text" onClick={toggleCreatePanelMenu}>
                            <span>Create Panel</span>
                        </li>
                        <li className="nav-text">
                            <span>Delete Panel</span>
                        </li>
                        <li className="nav-text" onClick={toggleLock}>
                            <span>{props.locked ? "Unlock Layout" : "Lock Layout"}</span>
                        </li>
                        <li className="nav-text">
                            <span>Theme</span>
                        </li>
                        <li className="nav-text">
                            <span>Help</span>
                        </li>
                    </ul>
                </nav>
                {/* <nav className={createPanelMenu ? 'create-panel-menu active' : 'create-panel-menu'}>
                    <ul className='nav-menu-items'>
                        <div className='nav-section-subtext'>Get recomendations based on...</div>
                        <li className="nav-text">
                            <span>For you</span>
                        </li>
                        <li className="nav-text">
                            <span>Playlist</span>
                        </li>
                        <li className="nav-text">
                            <span onClick={() => createPanel("song")}>Song</span>
                        </li>
                        <li className="nav-text">
                            <span>Genre</span>
                        </li>
                    </ul>
                </nav> */}
                <nav className={createPanelMenu ? 'create-panel-menu-1 active' : 'create-panel-menu-1'} style={{zIndex: '1000'}}>
                    <div class="tabs">
                        <div className="create-panel-text">
                            <span>Get recomendations based on...</span>
                        </div>
                        <div class="tab-header">
                            <div class="active">Song</div>
                            <div>Playlist</div>
                            <div>Genre</div>
                            <div>For you</div>
                        </div>
                        <div class="tab-indicator"></div>
                        <div class="tab-body">
                            <div id="song-section" class="active" style={{ width: "100%", height: "80%", top: "15px", }}>
                                <Search token={props.token} type={"Song"}></Search>
                            </div>
                            <div id="playlist-section" style={{ width: "100%", height: "80%", top: "15px", }}>
                                <Search token={props.token} type={"Playlist"}> aaa</Search>
                            </div>
                            <div id="genre-section" style={{ width: "100%", height: "80%", top: "15px", }}>
                                <Search token={props.token} type={"Genre"}></Search>
                            </div>
                            <div id="for-you-section" style={{ width: "100%", height: "80%", top: "15px", }}>
                                <Search token={props.token} type={"For You"}></Search>
                            </div>
                        </div>
                    </div>
                </nav>
            </IconContext.Provider>
        </div>
    )
}

export default Navbar