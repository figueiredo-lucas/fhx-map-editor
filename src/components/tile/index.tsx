import React from 'react';
import { Field } from '../../shared/field';
import { ColorCount } from '../../shared/rgb';
import { convertRGBFloatToDec, getRGBKey } from '../../shared/utils';
import './style.css';

interface TileProps {
  zone: Field,
  expectedProp: string,
  colors: ColorCount[],
  width: number
}

const Tile = (props: TileProps) => {
  // @ts-ignore
  const rgb = convertRGBFloatToDec(props.zone[props.expectedProp]);
  let i = props.colors?.findIndex(c => c.uniqueKey === getRGBKey(rgb));
  const foundRGB = i >= 0 ? props.colors[i] : rgb;
  return (
    <div className="tile" style={{background: `rgb(${foundRGB.r},${foundRGB.g},${foundRGB.b})`, flexBasis: `calc(100% / ${props.width} - ${props.width / 2}px)`}}>
      <div className="dummy-tile"></div>
      <div className="tile-info">
        <span style={{color: `rgb(${255 - foundRGB.r},${255 - foundRGB.g},${255 - foundRGB.b})`}}>
          {props.zone.name.split('\0')[0]}
        </span>
      </div>
    </div>
  )
}

export default Tile;
