import { useEffect, useRef, React } from 'react';
import lottie from 'lottie-web';
import LoginButton from '../Components/LoginButton';

const SplashScreen = () => {
    const container = useRef(null)

    // Setup the splash page animation
    useEffect(() => {
      lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: require('../Assets/Animations/splash.json')
      })
    }, []);

    return (
        <div className="app">
          <div className="column" id="textColumn">
            <h1 className="appTitle">
              Discoverify
            </h1>
            <h1 className="appTitleSubtext">
              Discover music your way
            </h1>
            <LoginButton></LoginButton>
          </div>
          <div className="column">
            <div className="container" ref={container}></div>
          </div>
        </div>
      );
}

export default SplashScreen;