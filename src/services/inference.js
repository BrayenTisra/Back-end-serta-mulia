const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/inputError');
 
async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
 
        const classes = ['Cancer', 'Non-cancer'];
 
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        
        const classResult = score[0] > 0.5 ? 0 : 1;
        
        const label = classes[classResult];
 
        let suggestion;
 
        if (label === 'Cancer') {
            suggestion = "Segera periksa ke dokter!"
        } else if (label === 'Non-cancer') {
            suggestion = "Penyakit kanker tidak terdeteksi."
        }
 
        return { label, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
}
 
module.exports = predictClassification;