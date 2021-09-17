import logo from './logo.svg';
import './App.scss';
import * as React from "react"
import './scss/main.scss'
import TextLoop from "react-text-loop";
import Particles from 'react-particles-js';
import ConnectButton from "./components/ConnectButton";

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
  flex: "flex"
}

function App() {

  const [shineAnimationTitle, setShineAnimationTitle] = React.useState(false);

  return (
    <div className="pageContainer">
      <Particles
        style={{position: 'absolute'}}
        params={{
          "particles": {
              "number": {
                  "value": 160,
                  "density": {
                      "enable": false
                  }
              },
              "size": {
                  "value": 10,
                  "random": true
              },
              "move": {
                  "direction": "bottom",
                  "out_mode": "out",
                  "bounce": false
              },
              "line_linked": {
                  "enable": false
              }
          }
      }} />
      <main style={pageStyles}>
        <title>SnowgeCoin Re-floofinator</title>
        <div className={`title ${shineAnimationTitle ? 'title-animated' : ''}`} onMouseEnter={() => setShineAnimationTitle(() => true)} onAnimationEnd={() => setShineAnimationTitle(() => false)}>
          SnowgeCoin <TextLoop nowrap={false} interval={[3000,3000,6000]} springConfig={{ stiffness: 180, damping: 12}}><span>Upgrader</span><span>Migrator</span><span>Refloofinator</span></TextLoop>
        </div>
        <div class="container">
          <div class="loader"></div>
          <div className="in-loader">
            Coming Soon
            {/* <ConnectButton/> */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
