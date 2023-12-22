import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { useState } from 'react';

const materials = [
  {
    title: 'נייר',
    name: 'Class 9',
    icon: './paper.svg'
  },
  {
    title: 'פסולת אורגנית',
    name: 'Biological',
    icon: './cookie.svg'
  },
  {
    title: 'פלסטיק',
    name: 'Plastic',
    icon: './cookie.svg'
  },
  {
    title: 'זכוכית לבנה',
    name: 'White Glass',
    icon: './cookie.svg'
  },
  {
    title: 'זכוכית חומה',
    name: 'Browen Glass',
    icon: './cookie.svg'
  },
  {
    title: 'בגדים',
    name: 'Clothes',
    icon: './cookie.svg'
  },
  {
    title: 'קרטון',
    name: 'Cardboard',
    icon: './cookie.svg'
  },
  {
    title: 'נעליים',
    name: 'Shoes',
    icon: './cookie.svg'
  }
]

const Material = ({icon, name, active}) => (
  <div className='material' style={{
    border: active ? '1px solid red' : ''
  }}>
    <div className='icon'>
      <img src={icon}/>
    </div>
    <div className='name'>
      {name}
    </div>
  </div>
)

function App() {

  const [identifiedMaterial, setIdentifiedMaterial] = useState()
  const [prob, setProb] = useState()

  // More API functions here:
  // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

  // the link to your model provided by Teachable Machine export panel
  const URL = "https://teachablemachine.withgoogle.com/models/H_hlj_0Pl/";

  let model, webcam, labelContainer, maxPredictions;

  useEffect(() => {
    init()
  }, [])

  // Load the image model and setup the webcam
  async function init() {
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
      //document.getElementById("webcam-container").removeChild(document.getElementById('loader'))
      document.getElementById("webcam-container").appendChild(webcam.canvas);
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
        return (currentObj.probability > maxObj.probability) ? currentObj : maxObj;
      });
      const identifiedMaterial = materials.find(material => material.name == objectWithMaxProbability.className)
      if (identifiedMaterial.name == materials[0].name) {
        setIdentifiedMaterial(null)
        setProb(null)
      } else {
        setIdentifiedMaterial(identifiedMaterial)
        setProb(objectWithMaxProbability.probability)
      }
  }

  return (
    <div className="app">
      <div className='top-bar'>
        <img className="logo" src="https://www.shavitim.com/shavitim-assets/logo.svg"/>
      </div>
      <div className='cover'/>
      <div className='welcome'>
        <div className='title'>
        פרוייקט גמר: ממחזר אשפה מבוסס בינה מלאכותית
        </div>
        <div className='desc'>
        התנסו במחזור אשפה אוטומטי. ממחזר זה מבוסס על מודל למידה עמוקה אשר אומן על בסיס אלפי תצלומים של אשפה ממויינת.
        </div>
      </div>
      <div id="webcam-container">
        <div className='ticket' style={{
          height: identifiedMaterial ? '65px' : '0px'
        }}>
          <div className='name'>
            <span>{identifiedMaterial?.title} </span> <span>{prob?.toFixed(2)}</span>
          </div>
          <div className='icon'>

          </div>
        </div>
        <div className='screen'/>
      </div>
    </div>
  );
}

export default App;
