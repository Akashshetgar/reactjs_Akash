//imports
import React, { useEffect, useState,   useRef } from "react";
import './App.css';
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";


function App() {
  //settig references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const footercanvasRef = useRef(null);

  //setting states
  const [b1_val, setb1] = useState(true);
  const [b2_val, setb2] = useState(false);
  const [webcam, setwebcam] = useState(webcamRef);
  
  // loading cocossd model
  const runCoco = async () => {
    const net = await cocossd.load();
    setInterval(() => {
      detect(net);
    }, 10);
  };
  //function for starting and stopping stream
  const btn_display = (value)=>{
    if (
      value===1
    ){
      setb1(true)
      setb2(false)
      setwebcam(webcamRef)
    }
    else{
      setb1(false)
      setb2(true)
      setwebcam(null)
    }
  }
  //function to display video stream along with detections
  const display = () =>{
    if(webcam!==null){
      return(
        <div>

          <Webcam
              ref={webcam}
              muted={true} 
              style={{
                position: "relative",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 8,
                width: 640,
                height: 480,
              }}
            />

          <canvas
            className="result_canvas"
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 7,
              width: 640,
              height: 480,
            }}
          />
        </div>
      );
    }
  }
  //function to detect objects
  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4 
      
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      
      //getting objects detected and drawing rectangles
      const obj = await net.detect(video);
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx); 
    }
  };
  //use effect for canvas in footer
  React.useEffect(() => {
    const context = footercanvasRef.current.getContext('2d');
    buildfooter(context,  1500);
  });
  //funciton to build canvas in footer
  const buildfooter = (ctx,width)=>{
    ctx.beginPath();
    ctx.rect(0, 0, 1550, 400);
    ctx.fillStyle = "#282c34";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(95,-400,500,0,1*Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }
  //function to draw rectangle aroud detected object
  const drawRect = (detections, ctx) =>{
    // Loop through each prediction
    detections.forEach(prediction => {
  
      // Extract boxes and classes
      const [x, y, width, height] = prediction['bbox']; 
      const text = prediction['class']; 
  
      // Set styling
      ctx.strokeStyle = '#310e59'
      ctx.font = '18px Arial';
  
      // Draw rectangles and text
      ctx.beginPath();   
      ctx.fillStyle = '#310e59'
      ctx.fillText(text, x+4, y+18);
      ctx.rect(x, y, width, height); 
      ctx.lineWidth = 4;
      ctx.stroke();
    });
  }
  //detections have to run continuously of each frame
  useEffect(()=>{runCoco()},[]);


  return (
    <div className="App">
      {/* navbar */}
      <div className="navbar">
        <h2>Healthcare company</h2>
      </div>
      
      <div className="main_container">
        <h3 className="main_heading">Object Detection through webcam!</h3>
        <br></br>
        {/* start and stop buttons */}
        <div className="btns">
          <button class='cam_start' onClick={()=>{
            
            btn_display(1);
          }} disabled={b1_val}>Start Camera</button>
          <button onClick={()=>{
            console.log("hello");
            btn_display(0);
          }} class='cam_stop' disabled={b2_val}>Stop Camera</button>
        </div>
        <br></br>

        {display()}

      </div>
        {/* footer canvas */}
        <canvas
          ref={footercanvasRef}
          style={{
            // position: "absolute",
            marginLeft: 0,
            marginRight: 0,
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 1550,
            height: 200,
          }}
        />
    
    <footer>
        <ul className="footer_links">
          <li>About us</li>
          <li>Our mission</li>
          <li>Follow us</li>
          <li>Read more</li>
        </ul>
        
    </footer>
    
    </div>
  );
}

export default App;
