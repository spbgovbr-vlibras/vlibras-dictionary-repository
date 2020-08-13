import path from 'path';
import createError from 'http-errors';

import SignService from '../../services/SignService';
import FileService from '../../services/FileService';

// TODO: remove files if any step fails
const addNewSign = async function addNewSignToDictionary(req, res, next) {
  try {
    if (Object.keys(req.files).length === 1) {
      const signExtension = path.extname(req.files.wikilibras[0].originalname);
      const signName = path.basename(req.files.wikilibras[0].originalname, signExtension);

      const { name, createdAt } = await SignService.registerNewSignSource(
        signName,
        req.body.version,
        signExtension,
        req.body.region,
      );
      // TODO: remove sign registers if file publish fails
      await FileService.publishSignFile(
        req.files.wikilibras[0].path,
        req.body.version,
        req.files.wikilibras[0].fieldname,
        req.body.region,
      );

      return res.status(201).json({ name, createdAt });
    }

    const signName = path.basename(
      Object.values(req.files)[0][0].originalname,
      path.extname(Object.values(req.files)[0][0].originalname),
    );

    const { name, createdAt } = await SignService.registerNewSignBundle(
      signName,
      req.body.version,
      req.body.region,
    );

    if (Object.prototype.hasOwnProperty.call(req.files, 'wikilibras')) {
      await SignService.registerNewSignSource(
        signName,
        req.body.version,
        path.extname(req.files.wikilibras[0].originalname),
        req.body.region,
      );
    }

    // TODO: remove sign registers if file publish fails
    await Promise.all(Object.values(req.files).map(async (file) => {
      await FileService.publishSignFile(
        file[0].path,
        req.body.version,
        file[0].fieldname,
        req.body.region,
      );
    }));

    return res.status(201).json({ name, createdAt });
  } catch (addNewSignError) {
    // TODO: handle already exist error to return 'conflict' instead 'internal error'
    return next(addNewSignError);
  }
};

const getSign = async function getSignFromDictionary(req, res, next) {
  try {
    const sign = await SignService.getRegisteredSign(
      req.params.sign,
      req.params.version,
      req.params.platform,
      req.params.region,
    );

    if (sign === null) {
      return next(createError(404, 'sign not found in dictionary registry'));
    }

    const signFile = await FileService.retriveSignFile(
      req.params.sign,
      req.params.version,
      req.params.platform,
      req.params.region,
    );

    if (signFile === null) {
      return next(createError(404, 'sign file not found in dictionary storage'));
    }

    return res.status(200).sendFile(signFile);
  } catch (getSignError) {
    return next(getSignError);
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
    const removedCount = await SignService.deleteSignRegister(req.params.sign);

    if (removedCount === 0) {
      return next(createError(404, 'sign already deleted or does not exist'));
    }

    return res.status(200).json({ name: req.params.sign, deletedAt: new Date() });
  } catch (removeSignError) {
    return next(removeSignError);
  }
};

export {
  addNewSign,
  getSign,
  listSigns,
  removeSign,
};
