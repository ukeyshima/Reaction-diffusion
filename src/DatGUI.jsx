import React from 'react';
import '../node_modules/react-dat-gui/dist/index.css';
import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui';
import { useRecoilState } from 'recoil';
import state from './stateManager';

export default function DatGUI() {
  const [data, setData] = useRecoilState(state);

  return (
    <DatGui
      data={data}
      onUpdate={(newData) =>
        setData(() => {
          return { ...data, ...newData };
        })
      }>
      <DatNumber path='da' label='da' min={0.0} max={1.0} step={0.01} />
      <DatNumber path='db' label='db' min={0.0} max={1.0} step={0.01} />
      <DatNumber path='f' label='f' min={0.0} max={1.0} step={0.01} />
      <DatNumber path='k' label='k' min={0.0} max={1.0} step={0.01} />
    </DatGui>
  );
}
