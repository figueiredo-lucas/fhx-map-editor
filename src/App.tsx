import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/sidebar';
import TileList from './components/tile-list';
import { BWH } from './shared/bwh';
import { ColorsByProp } from './shared/field';
import { ColorCount } from './shared/rgb';

function App() {

  const [map, setMap] = useState<BWH>();
  const [expectedProp, setExpectedProp] = useState<string>('day_fog');
  const [colors, setColors] = useState<ColorCount[]>([]);
  const [colorsByProp, setColorsByProp] = useState<ColorsByProp>({} as ColorsByProp);

  return (
    <div className="App">
      <Sidebar
        setMap={setMap} map={map}
        expectedProp={expectedProp} setExpectedProp={setExpectedProp}
        colors={colors} setColors={setColors}
        colorsByProp={colorsByProp} setColorsByProp={setColorsByProp} />
      <TileList setMap={setMap} map={map} expectedProp={expectedProp} colors={colors} />
    </div>
  );
}

export default App;
