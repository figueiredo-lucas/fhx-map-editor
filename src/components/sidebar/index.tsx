import React, { useEffect } from 'react';
import { MapProps } from '../../shared/map-props';
import { SketchPicker } from 'react-color';
import FileUpload from '../file-upload';
import './style.css';
import { ColorCount, RGB } from '../../shared/rgb';
import { convertRGBDecToFloat, convertRGBFloatToDec, getColorsFromZones, getRGBKey, rgbToHex } from '../../shared/utils';
import { FileParser } from '../../services/fileparser';
import { ColorsByProp, Field } from '../../shared/field';

interface SidebarProps extends MapProps {
  expectedProp: string,
  setExpectedProp: (expectedProp: string) => void
  colors: ColorCount[],
  setColors: (colors: ColorCount[]) => void
  colorsByProp: ColorsByProp,
  setColorsByProp: (colorsByProp: ColorsByProp) => void
}

const Sidebar = (props: SidebarProps) => {

  useEffect(() => {
    const colors = getColorsFromZones(props.map, props.expectedProp);
    props.setColors(colors);
    // resets all the colors to default values
    props.setColorsByProp({[props.expectedProp]: colors} as any)

  }, [props.map]);

  const showMapInfo = () => {
    if (props.map) {
      return <span className="map-info">The map has {props.map.zone.length} zones.</span>
    }
    return null;
  }

  const possibleSkyStates = [
    { name: 'Day fog', key: 'day_fog' },
    { name: 'Night fog', key: 'night_fog' },
    { name: 'Original heaven', key: 'original_heaven' },
    { name: 'Day heaven', key: 'day_heaven' },
    { name: 'Night heaven', key: 'night_heaven' }
  ];

  const onSkyStatesChange = (key: string) => () => {
    props.setExpectedProp(key);
    const colors = getColorsFromZones(props.map, key)
    props.setColors(colors);
    if (!props.colorsByProp.hasOwnProperty(key)) {
      props.setColorsByProp({...props.colorsByProp, [key]: colors})
    }
  }

  const renderSkyStatesRadio = (state: {name: string, key: string}) => {
    return <div key={state.key} className="sky-state-radio">
      <input type="radio" id={state.key} value={state.key} name="expectedProp" checked={props.expectedProp === state.key} onChange={onSkyStatesChange(state.key)}/>
      <label htmlFor={state.key}>{state.name}</label>
    </div>
  }

  const download = () => {
    if (props.map) {
      const dlBwh = {...props.map};
      dlBwh.zone.forEach(z => {
        findColorAndUpdateZone('day_fog', z);
        findColorAndUpdateZone('night_fog', z);
        findColorAndUpdateZone('original_heaven', z);
        findColorAndUpdateZone('day_heaven', z);
        findColorAndUpdateZone('night_heaven', z);
      })
      var blob = new Blob([new FileParser().generate(dlBwh)], {type: "application/bwh"});
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = props.map.filename;
      link.click();
    }
  }

  const findColorAndUpdateZone = (fieldName: keyof ColorsByProp, zone: Field) => {
    if (props.colorsByProp.hasOwnProperty(fieldName)) {
      const rgb: RGB = zone[fieldName];
      const key = getRGBKey(convertRGBFloatToDec(rgb));
      const foundColor = props.colorsByProp[fieldName].find(c => c.uniqueKey === key);
      if (foundColor) {
        console.log('Original RGB', rgb);
        zone[fieldName] = convertRGBDecToFloat(foundColor);
        console.log('New RGB', zone[fieldName]);
      }
    }
  }

  const onChangeColor = (color: ColorCount, idx: number) => {
    const newColors = props.colors;
    newColors.splice(idx, 1, color);
    props.setColors([...newColors]);
    props.setColorsByProp({...props.colorsByProp, [props.expectedProp]: newColors})
  }

  const presets = getColorsFromZones(props.map, props.expectedProp);
  return (
    <div className="sidebar">
      <FileUpload setMap={props.setMap} />
      {showMapInfo()}
      <div className="sky-radio-wrapper">
        {props.map && possibleSkyStates.map(renderSkyStatesRadio)}
      </div>
      <div className="picker-list">
        {props.colors.map((c, idx) => {

          return (
            <>
              <span className="picker-info">Changing this color affects {c.count} tiles.</span>
              <SketchPicker
              key={c.uniqueKey}
              disableAlpha={true}
              color={props.colors[idx]}
              onChangeComplete={(color) => onChangeColor({...c, ...color.rgb}, idx)}
              presetColors={presets.map(rgbToHex)} />
            </>)
        })}
      </div>
      {props.map && <div className="generate-file-wrapper">
        <button onClick={download}>Generate new file</button>
      </div>}
    </div>
  )
}

export default Sidebar;
