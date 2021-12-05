import React from 'react';
import ReactDOM from 'react-dom';
import Canvas from './boids/WebGL2.0/Canvas';
import { RecoilRoot } from 'recoil';
import DatGUI from './DatGUI.jsx';
import Stats from 'react-fps-stats';

const App = () => {
  return (
    <RecoilRoot>
      <Canvas />
      <DatGUI />
      <Stats />
    </RecoilRoot>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
