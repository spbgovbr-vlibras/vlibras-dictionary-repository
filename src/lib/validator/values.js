import constants from '../constants';

export default {
  versions: Object.values(constants.VERSIONS),
  platforms: Object.values(constants.PLATFORMS),
  regions: Object.values(constants.REGIONS),
  mimes: { bin: 'application/octet-stream', video: 'video/mp4' },
  extensions: { blend: '.blend', video: '.mp4' },
};