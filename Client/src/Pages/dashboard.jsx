import React, { Component } from 'react';
import Navbar from '../Components/Navbar'
import Panel from '../Components/Panel'
import queryString from 'query-string'
import { useTransition, animated } from 'react-spring'
import Player from '../Components/Player';
import Delayed from '../Components/Delayed';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from "firebase/database";
import reactRouterDom from 'react-router-dom';


class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userFirstName: "",
      children: [],
      chosenPosition: [],
      locked: false,
      menu: "",
      menuOpen: false,
      trackURI: "",
      accessToken: "",
      deviceId: "",
      playback: "",
      currentTrack: "",
      createPanel: "",
      saveInProgress: ""
    }

    this.createPanel = this.createPanel.bind(this);
    this.getMousePosition = this.getMousePosition.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.toggleLock = this.toggleLock.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.setCurrentTrack = this.setCurrentTrack.bind(this);
    this.setToken = this.setToken.bind(this);
    this.setupSave = this.setupSave.bind(this);
  }

  // Save access token in state memory
  setToken(token) {
    this.setState({
      accessToken: token
    })
  }

  // Update current track being played
  setCurrentTrack(track) {
    this.setState({
      currentTrack: track
    })
  }

  // Toggle navigation menu
  toggleMenu(menuType) {
    this.setState({
      menu: menuType
    }, () => {
      console.log(this.state.menu);
    })

  }

  // Toggle locked status
  toggleLock() {
    this.setState({
      locked: !this.state.locked
    }, this.toggleLockCss)
  }

  // Work in progress, locking panels so they can't be edited when lock is true
  toggleLockCss() {
    console.log(this.state.locked);
  }

  // Get position that user clicks 
  getMousePosition() {
    document.addEventListener("click", this.setPosition);
  }

  // Update clicked position
  setPosition(event) {
    this.setState({
      chosenPosition: [event.clientX, event.clientY]
    }, this.checkClicked);
  }

  // Create panel at user's chosen location
  checkClicked() {
    console.log(this.state.chosenPosition);
    if (this.state.chosenPosition.length != 0) {
      this.createPanel();
    }
  }

  // Save song seed and track name within state for the purpose of rendering the panel
  createPanel() {
    let seed = localStorage.getItem("songSeed");
    let trackName = localStorage.getItem("songTitle");
    // Updating state for the purpose of dynamically addding panels to the dashboard
    if (this.state.children.length == "0") {
      this.setState({
        children: [
          [seed, trackName]
        ]
      }, this.updateCss);
    } else {
      this.setState({
        children: [
          ...this.state.children,
          [seed, trackName]
        ]
      }, this.updateCss);
    }
    document.removeEventListener("click", this.setPosition);
  }

  // Updates the CSS for the panels so that they can be resized and moved
  // TODO: Refactor this so JS isn't needed (maybe higher level containers with css?)
  updateCss() {
    // Adding CSS as required for new panels
    let panelNumber = JSON.stringify(this.state.children.length);
    // Retrieving users chosen location for panel (based on mouse click)
    let chosenX = this.state.chosenPosition[0];
    let chosenY = this.state.chosenPosition[1];

    let panelClass = ".panel" + panelNumber;
    let panelElement = document.querySelector(panelClass);
    panelElement.setAttribute("style",
      "left: " + chosenX + "px; top: " + chosenY + "px; height: 25vh; width: 20vw; position: absolute; background: black; right: 50%; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; border-radius: 7.5px;");

    let resizerNwClass = ".resizer" + panelNumber + ".nw";
    let resizerNwElement = document.querySelector(resizerNwClass);
    resizerNwElement.setAttribute("style",
      "top: -1px; left: -1px; cursor: nw-resize; position: absolute; width: 10px; height: 10px; border-radius: 5px; background-color: #1DB954; z-index: 2; visibility: hidden;")

    let resizerNeClass = ".resizer" + panelNumber + ".ne";
    let resizerNeElement = document.querySelector(resizerNeClass);
    resizerNeElement.setAttribute("style",
      "top: -1px; right: -1px; cursor: ne-resize; position: absolute; width: 10px; height: 10px; border-radius: 5px; background-color: #1DB954; z-index: 2; visibility: hidden;")

    let resizerSeClass = ".resizer" + panelNumber + ".se";
    let resizerSeElement = document.querySelector(resizerSeClass);
    resizerSeElement.setAttribute("style",
      "bottom: -1px; right: -1px; cursor: se-resize; position: absolute; width: 10px; height: 10px; border-radius: 5px; background-color: #1DB954; z-index: 2; visibility: hidden;")

    let resizerSwClass = ".resizer" + panelNumber + ".sw";
    let resizerSwElement = document.querySelector(resizerSwClass);
    resizerSwElement.setAttribute("style",
      "bottom: -1px; left: -1px; cursor: sw-resize; position: absolute; width: 10px; height: 10px; border-radius: 5px; background-color: #1DB954; z-index: 2; visibility: hidden;")
  }

  setDeviceId(id) {
    this.setState({
      deviceId: id
    })
  }

  setupSave() {
    // Listen for track updates and play the new track
    window.addEventListener('save', () => {
      console.log("Save code accessed");
      console.log(this.state.saveInProgress);
      let cancelTimer = this.cancellableTimer();
      if (this.state.saveInProgress === true) {
        cancelTimer();
      }
      if (this.state.saveInProgress === "" || this.state.saveInProgress === false) {
        this.setState({ saveInProgress: true })
      } else if (this.state.saveInProgress === true) {
        // If a save is already in progress, cancel the save and start a new save timer
        //cancelTimer();
        //this.setState({ saveInProgress: false })
      }
    })
  }

  cancellableTimer() {
    let timer = setTimeout(function () {
      console.log("TIMER WORKED");
      let panelLimit = ["panel1", "panel2", "panel3", "panel4", "panel5", "panel6", "panel7",
    "panel8", "panel9", "panel10", "panel11", "panel12", "panel13", "panel14", "panel15"];
    // Building a list of all current panels
    let panelList = [];
      let allDivs = document.getElementsByTagName("div");
      for (let i = 0; i < allDivs.length; i++) {
        let className = allDivs[i].classList;
        if (panelLimit.includes(className[0]) === true){
          // Getting X and Y coordinates of each panel
          let elementClass = className[0].toString();
          let elementList = document.getElementsByClassName(elementClass);
          let elementClassName = elementList[0].classList[0];
          let element = document.getElementsByClassName(elementClassName)[0];
          let coordinates = element.getBoundingClientRect();
          let panelData = {
            class: className[0],
            top: coordinates.top,
            bottom: coordinates.bottom,
            left: coordinates.left,
            right: coordinates.right
          }
          panelList.push(panelData);
        }
      }

      console.log(panelList);
      

      /**
       * Hardcoded test to post user layout database
       * TODO: Write function to get user layout details
       **/ 
      
      const db = getDatabase();
      let panels = [{
        top: 1,
        bottom: 2,
        left: 3,
        right: 4,
        title: "Test",
        seed: "i hope this works"
      }, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        title: "Test2",
        seed: "i hope this still works"
      }]
      set(ref(db, 'Users/' + "Jonny"), {
        panels
      })
    }, 5000);

    return function () { clearTimeout(timer) };
  }

  // Code to be executed once
  async componentDidMount() {

    // Retrieving database details
    let firebaseConfig = await fetch("http://localhost:8888/load").then((res) => {
      return res.text();
    })

    let jsonConfig = JSON.parse(firebaseConfig);

    const app = initializeApp(jsonConfig);
    const database = getDatabase(app);

    // Retrieving users display name
    let displayName = await fetch("http://localhost:8888/user").then((res) => {
      return res.text();
    })
    this.setState({ userFirstName: displayName })

    this.setupSave();

    // Obtaining the Access Token from the URL
    let parsedURL = queryString.parse(window.location.search);
    //this.state.accessToken = parsedURL.access_token;
    this.setToken(parsedURL.access_token)
    window.history.replaceState(null, null, window.location.pathname);
    this.token = parsedURL.access_token;

    console.log(this.state.accessToken);

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    console.log(window.screen.height);
    console.log(window.screen.width);
  }

  render() {
    return (
      <div className="dashboardContainer">
        <Navbar name={this.state.userFirstName} getMousePosition={this.getMousePosition} toggleMenu={this.toggleMenu}
          menuOpen={this.state.menuOpen} toggleLock={this.toggleLock} locked={this.state.locked} token={this.state.accessToken} />
        <div className="panel-container"></div>
        <div className="player-container">
          <Delayed waitBeforeShow={2000}>
            <div style={{ zIndex: 100 }}><Player token={this.state.accessToken} trackUri={"test"} /></div>
          </Delayed>
        </div>
        {this.state.children.map((child, index) => {
          return (
            <Panel key={index} id={index + 1} seed={child} togglePlayback={this.togglePlayback} saveLayout={this.saveLayout} />
          );
        })}
      </div>
    );
  }
}

export default DashboardScreen;