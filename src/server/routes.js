const handlers = require('../server/handler');
 
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: handlers.postPredictHandler,
    options: {
      payload: {
        maxBytes: 1 * 1024 * 1024,
        parse: true,
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: handlers.getAllPredict,
  }
]
 
module.exports = routes;