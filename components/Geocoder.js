import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { useControl } from 'react-map-gl'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

const Geocoder = ({ setLocation }) => {
  const ctrl = new MapboxGeocoder({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_KEY,
    marker: false,
    collapsed: true,
  })
  useControl(() => ctrl)
  ctrl.onAdd('result', e => {
    const coords = e.result.geometry.coordinates
    setLocation({ lat: coords[1], longs: coords[0] })
  })
  return null
}

export default Geocoder
