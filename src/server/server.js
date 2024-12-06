require('dotenv').config();
 
const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/inputError');
 
(async () => {
    const server = Hapi.server({
        port: 3000,
        // host: '0.0.0.0',
        host: 'localhost',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });
 
    server.route(routes);
    
    const model = await loadModel();
    server.app.model = model;
 
    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi'
            })
            newResponse.code(400);
            return newResponse;
        }
 
        if (response.isBoom && response.output.statusCode === 413) {
            const newResponse = h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000'
            })
            newResponse.code(413);
            return newResponse;
        }
 
        return h.continue;
    });
 
    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();
