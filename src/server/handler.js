const predictClassification = require('../services/inference');
const crypto = require('crypto');
const fireStore = require('../services/storeData');
const { data } = require('@tensorflow/tfjs-node');
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
  
  const {   label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "createdAt": createdAt
  }

  await fireStore.storeData(id, data);
  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data
  })
  response.code(201);
  return response;
}

async function getAllPredict() {
  try {
    const allPredict = await fireStore.getAllData();

    const data = allPredict.map(predict => ({
      id: predict.id,
      history: {
          result: predict.result,
          createdAt: predict.createdAt,
          suggestion: predict.suggestion,
          id: predict.id,
      },
    }));

    return {
      status: 'success',
      data
    }
  } catch (error) {
    return error.message;
  }

}
 
module.exports = {
  postPredictHandler, 
  getAllPredict
}