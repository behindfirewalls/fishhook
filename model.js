let model;

async function loadModel() {
  model = await tf.loadLayersModel('https://example.com/path/to/your/model.json');
}

function predictPhishing(features) {
  const tensor = tf.tensor2d([features]);
  const prediction = model.predict(tensor);
  return prediction.dataSync()[0];
}

loadModel();