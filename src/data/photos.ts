import type { ImageSource } from 'expo-image';
import type { PhotoKey } from './types';

export const photos: Record<PhotoKey, ImageSource> = {
  parliament: require('../../assets/photos/parliament.jpg'),
  bigben: require('../../assets/photos/bigben.jpg'),
  daad: require('../../assets/photos/daad.jpg'),
  opera: require('../../assets/photos/opera.jpg'),
  eiffel: require('../../assets/photos/eiffel.jpg'),
  campus: require('../../assets/photos/campus.jpg'),
  canada: require('../../assets/photos/canada.jpg'),
  japan: require('../../assets/photos/japan.jpg'),
  canal: require('../../assets/photos/canal.jpg'),
};

export const aminaPhoto = require('../../assets/profile/amina.png');
export const logoCap = require('../../assets/brand/logo-cap.png');
export const skyline = require('../../assets/brand/skyline.png');
