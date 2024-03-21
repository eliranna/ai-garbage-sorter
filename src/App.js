import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import { useState } from "react";
import { ColorRing } from "react-loader-spinner";

const materials = [
  {
    title: "נייר",
    name: "Class 9",
    icon: "./paper.svg",
  },
  {
    title: "אורגני",
    name: "Biological",
    icon: "./9026641_flower_thin_icon 1.svg",
  },
  {
    title: "פלסטיק",
    name: "Plastic",
    icon: "./9026367_beer_bottle_thin_icon 1.svg",
  },
  {
    title: "זכוכית",
    name: "White Glass",
    icon: "./9026898_martini_thin_icon (1) 1.svg",
  },
  {
    title: "בגדים",
    name: "Clothes",
    icon: "./9027071_t_shirt_thin_icon (1) 1.svg",
  },
  {
    title: "קרטון",
    name: "Cardboard",
    icon: "./9026598_codesandbox_logo_thin_icon 1.svg",
  },
  {
    title: "נעליים",
    name: "Shoes",
    icon: "./cookie.svg",
  },
];

const Material = ({ icon, title, active }) => (
  <div
    className="material"
    style={{
      border: active ? "1px solid red" : "",
    }}
  >
    <div className="icon">
      <img src={icon} />
    </div>
    <div className="name">{title}</div>
  </div>
);

const Materials = () => {
  return (
    <div className="materials-bar">
      {materials.map((material) => (
        <Material {...material} />
      ))}
    </div>
  );
};

const Loader = () => <div id="loader">מתחבר למצלמה שלך...</div>;

function App() {
  const [identifiedMaterial, setIdentifiedMaterial] = useState();
  const [prob, setProb] = useState();

  // More API functions here:
  // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

  // the link to your model provided by Teachable Machine export panel
  const URL = "https://teachablemachine.withgoogle.com/models/H_hlj_0Pl/";

  let model, webcam, labelContainer, maxPredictions;

  useEffect(() => {
    init();
  }, []);

  // Load the image model and setup the webcam
  async function init() {
    // Create the screen element
    var screen = document.createElement("div");
    screen.className = "screen";
    var loader = document.createElement("img");
    loader.src = "./loader.svg";
    loader.id = "loader";
    screen.appendChild(loader);

    var note = document.createElement("span");
    note.className = "note";
    note.innerText = "מתחבר למצלמה שלך...";
    screen.appendChild(note);

    document.getElementById("webcam-container").appendChild(screen);

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await window.tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new window.tmImage.Webcam(512, 512, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    var ld = document.getElementById("loader");
    if (ld && ld.parentNode) {
      ld.parentNode.removeChild(ld);
    }
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    note.innerText = "הציגו של הפריט שברצונכם למיין";
    var circle = document.createElement("div");
    circle.id = "circle";
    screen.appendChild(circle);
  }

  async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
  }

  // run the webcam image through the image model
  async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    const objectWithMaxProbability = prediction.reduce((maxObj, currentObj) => {
      return currentObj.probability > maxObj.probability ? currentObj : maxObj;
    });
    const identifiedMaterial = materials.find(
      (material) => material.name == objectWithMaxProbability.className,
    );
    setIdentifiedMaterial(identifiedMaterial);
    setProb(objectWithMaxProbability.probability);
  }

  return (
    <div className="app">
      <div className="top-bar">
        <a href="https://www.shavitim.com" target="_blank" rel="noreferrer">
          <img
            className="logo"
            src="https://www.shavitim.com/shavitim-assets/logo.svg"
          />
        </a>
      </div>
      <div className="main-display">
        <div className="side-image" />
        <div className="content">
          <div className="content-inner">
            <div className="welcome">
              <div className="title">
                סורק פסולת מבוסס בינה מלאכותית
              </div>
              <div className="desc">
                התנסו בסורק פסולת חכם אשר נבנה ע״י תלמידי שביטים. הסורק שלנו
                יודע להבחין בין שמונה סוגי פסולת שונים.
              </div>
            </div>
            <div className="materials-bar-holder">
              <Materials />
            </div>
            <div id="webcam-container">
              <div
                className="ticket"
                style={{
                  height: identifiedMaterial ? "65px" : "0px",
                }}
              >
                <div className="name">
                  <div>{identifiedMaterial?.title}</div>
                  <div className="per">
                    {`ודאות: `}
                    {prob?.toFixed(2) * 100}
                    {`%`}
                  </div>
                </div>
                <div className="icon"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
