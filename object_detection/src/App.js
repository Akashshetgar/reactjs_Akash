import React, { useEffect, useState, useRef } from "react";
import './App.css';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";

function App() {

  const webcamRef = React.useRef(null);

  const [videoWidth, setVideoWidth] = useState(960);
  const [videoHeight, setVideoHeight] = useState(640);

  const [model, setModel] = useState();
  return (
    <div className="App">
      
      <div className="navbar">
        <h2>"Healthcare company"</h2>
      </div>

      <div className="main_container">
        <h3>Object Detection through webcam!</h3>

      </div>

      <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js" type="text/javascript"></script>
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"></script>
    </div>
  );
}

export default App;
