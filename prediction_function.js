async function loadModel() {
  const modelPath = 'http://127.0.0.1:8080/rama-2.json';
  const model = await tf.loadLayersModel(modelPath);
  console.log('Model berhasil dimuat:', model);
  return model;
}

// Panggil predictFromLocalStorage() saat halaman dimuat
document.addEventListener('DOMContentLoaded', predictFromLocalStorage);
async function predictFromLocalStorage() {
  
  loadNormalizationParams();

  const eps = parseFloat(localStorage.getItem("EPS"));
  const per = parseFloat(localStorage.getItem("PER"));
  const pbv = parseFloat(localStorage.getItem("PBV"));

  if (isNaN(eps) || isNaN(per) || isNaN(pbv)) {
    alert('Harap masukkan nilai numerik yang valid.');
    localStorage.removeItem("fairValue");
    return;
  }

  const normalizedInput = normalizeInput([eps, per, pbv]);

  const model = await loadModel();
  if (!model) {
    console.error("Model tidak berhasil dimuat");
    return;
  }

  const inputTensor = tf.tensor2d([normalizedInput], [1, 3]);
  const prediction = model.predict(inputTensor);
  const predictedPrice = denormalizeLabel(prediction.dataSync()[0]);

  console.log("Predicted Price (Harga Wajar):", predictedPrice);

  localStorage.setItem('fairValue', predictedPrice.toFixed(2));

  updateDecision();
}

async function predictPrice(model, normalizedInput) {
  const inputTensor = tf.tensor2d([normalizedInput], [1, 3]);
  const prediction = model.predict(inputTensor);
  const predictedPrice = denormalizeLabel(prediction.dataSync()[0]);
  return predictedPrice;
}

function normalizeInput(input) {
  const [eps, per, pbv] = input;
  const normalizedEps = (eps - inputMin.dataSync()[0]) / (inputMax.dataSync()[0] - inputMin.dataSync()[0]);
  const normalizedPer = (per - inputMin.dataSync()[1]) / (inputMax.dataSync()[1] - inputMin.dataSync()[1]);
  const normalizedPbv = (pbv - inputMin.dataSync()[2]) / (inputMax.dataSync()[2] - inputMin.dataSync()[2]);
  return [normalizedEps, normalizedPer, normalizedPbv];
}

function denormalizeLabel(label) {
  return label * (labelMax.dataSync()[0] - labelMin.dataSync()[0]) + labelMin.dataSync()[0];
}


// Simpan parameter ke localStorage
function saveNormalizationParams(inputMin, inputMax, labelMin, labelMax) {
  localStorage.setItem('inputMin', JSON.stringify(inputMin.arraySync()));
  localStorage.setItem('inputMax', JSON.stringify(inputMax.arraySync()));
  localStorage.setItem('labelMin', JSON.stringify(labelMin.arraySync()));
  localStorage.setItem('labelMax', JSON.stringify(labelMax.arraySync()));
}

function loadNormalizationParams() {
  const inputMinData = JSON.parse(localStorage.getItem('inputMin'));
  const inputMaxData = JSON.parse(localStorage.getItem('inputMax'));
  const labelMinData = JSON.parse(localStorage.getItem('labelMin'));
  const labelMaxData = JSON.parse(localStorage.getItem('labelMax'));

  // Validasi apakah data adalah array numerik
  if (!Array.isArray(inputMinData) || !Array.isArray(inputMaxData)) {
    throw new Error("inputMin atau inputMax bukan array numerik yang valid.");
  }
  if (typeof labelMinData !== "number" || typeof labelMaxData !== "number") {
    throw new Error("labelMin atau labelMax bukan angka.");
  }

  // Konversi ke tensor
  inputMin = tf.tensor(inputMinData);
  inputMax = tf.tensor(inputMaxData);
  labelMin = tf.scalar(labelMinData);
  labelMax = tf.scalar(labelMaxData);

}

// aktifkan ai dengan "http-server D:/AI_SAHAM --cors"