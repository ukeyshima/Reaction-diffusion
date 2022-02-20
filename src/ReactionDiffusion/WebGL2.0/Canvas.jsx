import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import WebGL2 from '/src/Assets/WebGL2';
import state from '/src/stateManager';
import { useRecoilValue } from 'recoil';

import initialFragmentShader from './initialFragmentShader.glsl';
import mainFragmentShader from './mainFragmentShader.glsl';
import renderingFragmentShader from './renderingFragmentShader.glsl';
import defaulVertexShader from './defaultVertexShader.glsl';

const useStyles = makeStyles({
  canvas: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
  },
});

export default function Canvas() {
  const classes = useStyles();
  const canvasRef = useRef();
  const stateData = useRecoilValue(state);

  const planeVertexPosition = [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0];
  const planeVertexindex = [0, 2, 1, 1, 2, 3];

  const initialUniList = ['resolution'];
  const initialAttList = [{ array: planeVertexPosition, location: 'position', stride: 3 }];

  const mainUniList = ['texture', 'da', 'db', 'f', 'k'];
  const mainAttList = [{ array: planeVertexPosition, location: 'position', stride: 3 }];

  const renderingUniList = ['texture'];
  const renderingAttList = [{ array: planeVertexPosition, location: 'position', stride: 3 }];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const webgl2 = new WebGL2(canvas, [
      {
        name: 'initialProgram',
        vsText: defaulVertexShader,
        fsText: initialFragmentShader,
        uniList: initialUniList,
        attList: initialAttList,
      },
      {
        name: 'mainProgram',
        vsText: defaulVertexShader,
        fsText: mainFragmentShader,
        uniList: mainUniList,
        attList: mainAttList,
      },
      {
        name: 'renderingProgram',
        vsText: defaulVertexShader,
        fsText: renderingFragmentShader,
        uniList: renderingUniList,
        attList: renderingAttList,
      },
    ]);

    const initialVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.initialProgram.attLocations).map((key) => webgl2.webglPrograms.initialProgram.attLocations[key]),
      [],
      planeVertexindex
    );

    const mainVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.mainProgram.attLocations).map((key) => webgl2.webglPrograms.mainProgram.attLocations[key]),
      [],
      planeVertexindex
    );

    const renderingVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.renderingProgram.attLocations).map((key) => webgl2.webglPrograms.renderingProgram.attLocations[key]),
      [],
      planeVertexindex
    );

    let frameBuffer1 = webgl2.createFrameBuffer(canvas.width, canvas.height);
    let frameBuffer2 = webgl2.createFrameBuffer(canvas.width, canvas.height);

    webgl2.gl.useProgram(webgl2.webglPrograms.initialProgram.program);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, frameBuffer2.f);
    webgl2.gl.bindVertexArray(initialVAO);
    webgl2.gl.uniform2fv(webgl2.webglPrograms.initialProgram.uniLocations.resolution, [canvas.width, canvas.height]);
    webgl2.gl.drawElements(webgl2.gl.TRIANGLES, planeVertexindex.length, webgl2.gl.UNSIGNED_SHORT, 0);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);

    let animationID;
    const loop = () => {
      webgl2.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      webgl2.gl.clear(webgl2.gl.COLOR_BUFFER_BIT);

      webgl2.gl.useProgram(webgl2.webglPrograms.mainProgram.program);
      webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, frameBuffer1.f);
      webgl2.gl.bindVertexArray(mainVAO);
      webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
      webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, frameBuffer2.t);
      webgl2.gl.uniform1i(webgl2.webglPrograms.mainProgram.uniLocations.texture, 0);
      webgl2.gl.uniform1f(webgl2.webglPrograms.mainProgram.uniLocations.da, stateData.da);
      webgl2.gl.uniform1f(webgl2.webglPrograms.mainProgram.uniLocations.db, stateData.db);
      webgl2.gl.uniform1f(webgl2.webglPrograms.mainProgram.uniLocations.f, stateData.f);
      webgl2.gl.uniform1f(webgl2.webglPrograms.mainProgram.uniLocations.k, stateData.k);
      webgl2.gl.drawElements(webgl2.gl.TRIANGLES, planeVertexindex.length, webgl2.gl.UNSIGNED_SHORT, 0);
      webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);

      webgl2.gl.useProgram(webgl2.webglPrograms.renderingProgram.program);
      webgl2.gl.bindVertexArray(renderingVAO);
      webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
      webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, frameBuffer1.t);
      webgl2.gl.uniform1i(webgl2.webglPrograms.renderingProgram.uniLocations.texture, 0);
      webgl2.gl.drawElements(webgl2.gl.TRIANGLES, planeVertexindex.length, webgl2.gl.UNSIGNED_SHORT, 0);

      webgl2.gl.flush();

      const temp = frameBuffer1;
      frameBuffer1 = frameBuffer2;
      frameBuffer2 = temp;

      animationID = requestAnimationFrame(loop);
    };
    loop();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      webgl2.gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationID);
      window.removeEventListener('resize', handleResize);
    };
  }, [stateData]);

  return <canvas className={clsx(classes.canvas)} ref={canvasRef}></canvas>;
}
