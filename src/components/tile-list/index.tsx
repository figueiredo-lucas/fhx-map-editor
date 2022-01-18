import React from 'react'
import { MapProps } from '../../shared/map-props'
import { ColorCount } from '../../shared/rgb'
import Tile from '../tile'
import './style.css'

const TileList = (props: MapProps & { expectedProp: string, colors: ColorCount[] } ) => {
  const renderTiles = () => {
    return props.map?.zone.map((z, idx) => <Tile key={idx} zone={z} expectedProp={props.expectedProp} colors={props.colors} width={props.map?.width || 1} />)
  }
  return (
    <div className="tile-list">
      {props.map && renderTiles()}
    </div>
  )
}

export default TileList
