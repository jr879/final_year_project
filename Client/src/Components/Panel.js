import React, { Component } from 'react';
import './Panel.css'
import Recs from './Recs';

class Panel extends Component {
    constructor() {
        super();
        this.state = {
            toggleResizers: false,
            isPanelResizing: false,
            serverData: {}
        }
        this.displayResizers = this.displayResizers.bind(this);
    }
    
    // Toggle the resizers
    displayResizers(e) {
        this.setState({
            toggleResizers: true
        }, () => {
            let panelClass = e._reactInternals.child.memoizedProps.className;
            let id = panelClass.substr(panelClass.length - 1);
            this.toggleResizerCss(id, "visible");
            let dashboard = document.querySelector(".dashboardContainer");
            dashboard.addEventListener("click", () => {
                this.toggleResizerCss(id, "hidden");
            })
        });
    }

    // Toggles CSS
    // showOrHide should be a string of "visible" or "hidden"
    // TODO: there must be a better way to do this
    toggleResizerCss(id, showOrHide) {
        let resizerNwClass = ".resizer" + id + ".nw";
        let resizerNwElement = document.querySelector(resizerNwClass);
        resizerNwElement.setAttribute("style",
        ('style', resizerNwElement.getAttribute('style')+'; visibility: ' + showOrHide + ';'))

        let resizerNeClass = ".resizer" + id + ".ne";
        let resizerNeElement = document.querySelector(resizerNeClass);
        resizerNeElement.setAttribute("style",
        ('style', resizerNeElement.getAttribute('style')+'; visibility: ' + showOrHide + ';'))

        let resizerSeClass = ".resizer" + id + ".se";
        let resizerSeElement = document.querySelector(resizerSeClass);
        resizerSeElement.setAttribute("style",
        ('style', resizerSeElement.getAttribute('style')+'; visibility: ' + showOrHide + ';'))

        let resizerSwClass = ".resizer" + id + ".sw";
        let resizerSwElement = document.querySelector(resizerSwClass);
        resizerSwElement.setAttribute("style",
        ('style', resizerSwElement.getAttribute('style')+'; visibility: ' + showOrHide + ';'))
    }

    componentDidMount() {
        // Moving the Panel
        const panelClass = ".panel" + this.props.id;
        const panelElement = document.querySelector(panelClass);
        panelElement.addEventListener('mousedown', mousedown);
        let isPanelResizing = false;

        let panelContainer = document.querySelector(".panel-container");
        let panelCount = panelContainer.childElementCount;
        let panelList = [];
        for (let i = 1; i < panelCount + 1; i++) {
            let panel = ".panel" + i;
            panelList.push(panel);
        }
        
        // Drag and drop functionality
        function mousedown(e) {
            if (!isPanelResizing) {
                window.addEventListener('mousemove', mousemove);
                window.addEventListener('mouseup', mouseup);

                let prevX = e.clientX;
                let prevY = e.clientY;

                function mousemove(e) {
                    // Collision Detection
                    let collisionDetectedLeft = false;
                    let collisionDetectedRight = false;
                    let collisionDetectedTop = false;
                    let collisionDetectedBottom = false;

                    let movingPanel = document.querySelector(".panel1");
                    if (movingPanel != null) {

                        // let stillPanel = document.querySelector(panelList[1]);
                        let rect1 = movingPanel.getBoundingClientRect();
                        //let rect2 = stillPanel.getBoundingClientRect();
                        let rect3 = panelContainer.getBoundingClientRect();
                        console.log ("panel x: " + rect1.x + ". container x: " + rect3.left + "."); 
    
                        // Fixing a bug where if moved very fast, panels can pass through the border of the container
                        if (rect1.x < rect3.left) {
                            rect1.x = 0;
                        } else if (rect1.y < rect3.top) {
                            rect1.y = 80;
                        }
                        console.log(rect3.top);
                        if (rect1.x === rect3.left) {
                            console.log("Collision detected on the left hand side");
                            collisionDetectedLeft = true;
                        } 
    
                        if (rect1.y === rect3.top) {
                            console.log("Collision detected on the top");
                            collisionDetectedTop = true;
                        }
                    }

                    let newX = prevX - e.clientX;
                    let newY = prevY - e.clientY;
                    let rect = panelElement.getBoundingClientRect();
                    if (collisionDetectedLeft || collisionDetectedRight || collisionDetectedTop || collisionDetectedBottom) {
                        if (collisionDetectedLeft) {
                            if (newX < 0) {
                                panelElement.style.left = rect.left - newX + "px";
                                prevX = e.clientX;
                            }
                            // Handling corners of page where two collisions can occur
                            if (!collisionDetectedTop) {
                                panelElement.style.top = rect.top - newY + "px";
                                prevY = e.clientY;
                            }
                        }

                        if (collisionDetectedTop) {
                            if (newY < 0) {
                                panelElement.style.top = rect.top - newY + "px";
                                prevY = e.clientY;
                            }
                            // Handling corners of page where two collisions can occur
                            if (!collisionDetectedLeft) {
                                panelElement.style.left = rect.left - newX + "px";
                                prevX = e.clientX;
                            }   
                        }
                    }
                    else {
                        // No collision detected
                        let newX = prevX - e.clientX;
                        let newY = prevY - e.clientY;
    
                        let rect = panelElement.getBoundingClientRect();
    
                        panelElement.style.left = rect.left - newX + "px";
                        panelElement.style.top = rect.top - newY + "px";
    
                        prevX = e.clientX;
                        prevY = e.clientY;
                    }
                    collisionDetectedLeft = false;
                    collisionDetectedRight = false;
                    collisionDetectedTop = false;
                    collisionDetectedBottom = false;
                }
                function mouseup() {
                    window.removeEventListener('mousemove', mousemove);
                    window.removeEventListener('mouseup', mouseup);
                }
            }
        }

        // Resizing the Panel
        const resizerClass = ".resizer" + this.props.id;
        const resizers = document.querySelectorAll(resizerClass);
        let currentResizer;

        for (let resizer of resizers) {
            resizer.addEventListener('mousedown', mousedown);

            function mousedown(e) {
                isPanelResizing = true;
                currentResizer = e.target;

                let prevX = e.clientX;
                let prevY = e.clientY;

                window.addEventListener('mousemove', mousemove);
                window.addEventListener('mouseup', mouseup);

                function mousemove(e) {
                    const rect = panelElement.getBoundingClientRect();

                    if (currentResizer.classList.contains('ne')) {
                        panelElement.style.width = rect.width - (prevX - e.clientX) + "px";
                        panelElement.style.height = rect.height + (prevY - e.clientY) + "px";
                        panelElement.style.top = rect.top - (prevY - e.clientY) + "px";
                    } else if (currentResizer.classList.contains('nw')) {
                        panelElement.style.width = rect.width + (prevX - e.clientX) + "px";
                        panelElement.style.height = rect.height + (prevY - e.clientY) + "px";
                        panelElement.style.top = rect.top - (prevY - e.clientY) + "px";
                        panelElement.style.left = rect.left - (prevX - e.clientX) + "px";
                    } else if (currentResizer.classList.contains("se")) {
                        panelElement.style.width = rect.width - (prevX - e.clientX) + "px";
                        panelElement.style.height = rect.height - (prevY - e.clientY) + "px";
                    } else {
                        panelElement.style.width = rect.width + (prevX - e.clientX) + "px";
                        panelElement.style.height = rect.height - (prevY - e.clientY) + "px";
                        panelElement.style.left = rect.left - (prevX - e.clientX) + "px";
                    }
                    prevX = e.clientX;
                    prevY = e.clientY;
                    window.dispatchEvent( new Event('save') )
                }

                function mouseup() {
                    window.removeEventListener('mousemove', mousemove);
                    window.removeEventListener('mouseup', mouseup);
                    isPanelResizing = false;
                }
            }
        }
    }

    render() {
        return (
            <div className={"panel" + this.props.id} onClick={() => this.displayResizers(this)}>
                <Recs togglePlayback={this.props.togglePlayback} seed={this.props.seed}/>
                <div className={"ne resizer" + this.props.id}></div>
                <div className={"nw resizer" + this.props.id}></div>
                <div className={"se resizer" + this.props.id}></div>
                <div className={"sw resizer" + this.props.id}></div>
            </div>
        );
    }
}

export default Panel;
