import createError from 'http-errors';

import SignService from '../../services/SignService';

// TODO: remove files if any step fails
const addNewSign = async function addNewSignToDictionary(req, res, next) {
  try {
    // TODO: handle the filename when uploading .blend and .mp4 files
    const signFiles = Object.values(req.files)
      .map((file) => JSON.stringify([file[0].originalname, file[0].mimetype]));

    const isSameSign = signFiles.every((item, _i, array) => item === array[0]);

    if (!isSameSign) {
      return next(createError(422, 'files do not represent the same sign'));
    }

    const { name, createdAt } = await SignService.registerNewSign(
      req.files.android[0].originalname,
      req.body.version,
      req.body.region,
    );

    return res.status(200).json({ name, createdAt });
  } catch (addNewSignError) {
    // TODO: handle already exist error to return 'conflict' instead 'internal error'
    return next(addNewSignError);
  }
};

const listSigns = async function listDictionarySigns(_req, res, next) {
  try {
    let signList = await SignService.listRegisteredSigns();
    signList = signList.map((sign) => sign.name);

    return res.status(200).json(signList);
  } catch (listSignsError) {
    return next(listSignsError);
  }
};

const removeSign = async function removeSignFromDictionary(req, res, next) {
  try {
    const removedSign = await SignService.deleteSignRegister(req.body.sign);
    return null;
  } catch (removeSignError) {
    return next(removeSignError);
  }
};

export {
  addNewSign,
  listSigns,
  removeSign,
};
