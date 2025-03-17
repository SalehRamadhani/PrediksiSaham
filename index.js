
// script untuk input data hanya angka
// Fungsi ini akan menerima hanya angka pada input
function hanyaAngka(evt) {
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  return charCode >= 48 && charCode <= 57;
}

// script untuk mata uang rupiah

function hanyaAngka(event) {
  return /[0-9,]/.test(event.key);
}

// script untuk penulisan angka yang benar
function formatNumber(value) {
  return parseFloat(value).toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2
  }).replace(/^IDR/, 'Rp');
}

function cleanFormattedNumber(value) {
  return value.replace(/[^\d,]/g, '').replace(',', '.');
}

//script unuk validasi
let processButton = document.getElementById('processButton');
let inputPBV = document.getElementById('inputPBV');
let inputPER = document.getElementById('inputPER');
let inputEPS = document.getElementById('inputEPS');

function onProcess() {
  localStorage.setItem("PBV", cleanFormattedNumber(inputPBV.value));
  localStorage.setItem("PER", cleanFormattedNumber(inputPER.value));
  localStorage.setItem("EPS", cleanFormattedNumber(inputEPS.value));
  updateDecision();
}

document.addEventListener('DOMContentLoaded', async () => {
  await predictFromLocalStorage();
  updateDecision();
});

// fungsi untuk logika kondisi pada id=keputusan
function updateDecision() {
  const hargaWajar = parseFloat(localStorage.getItem("fairValue") || "0");
  console.log("Fair Value di localStorage:", hargaWajar);

  document.getElementById('FV').innerHTML = 
    'Harga Wajar Saham / Fair Value : Rp' + hargaWajar.toFixed(2);
}

