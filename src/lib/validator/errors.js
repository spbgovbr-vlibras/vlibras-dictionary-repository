import values from './values';

export default {
  versionError: `field is not in valid versions [${values.versions}]`,
  regionError: `field is not in valid regions [${values.regions}]`,
  mimeError: `uploaded file is not in valid formats [${Object.values(values.mimes)}]`,
  fileError: 'field must contain a file',
};
