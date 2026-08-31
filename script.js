const HARI_PENDEK = { "Senin":"Sen","Selasa":"Sel","Rabu":"Rab","Kamis":"Kam","Jumat":"Jum","Sabtu":"Sab","Minggu":"Min" };
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const LABEL_GIZI = {
  energi_kkal: "Energi (kkal)",
  protein_g: "Protein (g)",
  lemak_g: "Lemak (g)",
  karbohidrat_g: "Karbohidrat (g)",
  serat_g: "Serat (g)"
};

let DATA = null;
let hariAktifIndex = 0;

async function muatData(){
  const res = await fetch('data/menu.json');
  DATA = await res.json();

  document.getElementById('nama-sppg').textContent = DATA.program.nama_sppg;
  document.getElementById('penyelenggara').textContent = DATA.program.penyelenggara;
  document.getElementById('footer-dapur').textContent = "Disiapkan di " + DATA.program.lokasi_dapur;

  renderPeringatan();
  renderWeekPicker();

  // pilih hari ini kalau ada di data, kalau tidak pilih index 0
  const todayIso = new Date().toISOString().slice(0,10);
  const idxHariIni = DATA.minggu.findIndex(m => m.tanggal === todayIso);
  hariAktifIndex = idxHariIni >= 0 ? idxHariIni : 0;

  renderHari(hariAktifIndex);
  setupTabs();
}

function renderPeringatan(){
  const ol = document.getElementById('daftar-peringatan');
  ol.innerHTML = '';
  DATA.peringatan.forEach((p, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="num">${i+1}</span><span><strong>${p.judul}</strong><span class="desc">${p.isi}</span></span>`;
    ol.appendChild(li);
  });
}

function renderHari(idx){
  const m = DATA.minggu[idx];
  const tgl = new Date(m.tanggal + 'T00:00:00');

  document.getElementById('hari-nama').textContent = m.hari;
  document.getElementById('tanggal-lengkap').textContent = `${tgl.getDate()} ${BULAN[tgl.getMonth()]} ${tgl.getFullYear()}`;
  document.getElementById('foto-menu').src = m.gambar;

  // isi ompreng
  const isiGrid = document.getElementById('isi-ompreng');
  isiGrid.innerHTML = '';
  const isiMap = [
    ["Karbohidrat", m.isi_ompreng.karbohidrat],
    ["Lauk Hewani", m.isi_ompreng.lauk_hewani],
    ["Lauk Nabati", m.isi_ompreng.lauk_nabati],
    ["Sayur", m.isi_ompreng.sayur],
    ["Buah", m.isi_ompreng.buah]
  ];
  isiMap.forEach(([label, value], i) => {
    const card = document.createElement('div');
    card.className = 'isi-card' + (i === isiMap.length - 1 && isiMap.length % 2 !== 0 ? ' span-2' : '');
    card.innerHTML = `<span class="label">${label}</span><span class="value">${value}</span>`;
    isiGrid.appendChild(card);
  });

  // tabel gizi
  const tbody = document.getElementById('tabel-gizi');
  tbody.innerHTML = '';
  Object.entries(m.gizi_per_porsi).forEach(([key, val]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${LABEL_GIZI[key] || key}</td><td class="highlight">${val.kecil}</td><td class="highlight">${val.besar}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById('jumlah-penerima').textContent = m.jumlah_penerima.toLocaleString('id-ID') + ' anak';

  highlightWeekPicker(idx);
}

function renderWeekPicker(){
  const wrap = document.getElementById('week-days');
  wrap.innerHTML = '';
  DATA.minggu.forEach((m, i) => {
    const tgl = new Date(m.tanggal + 'T00:00:00');
    const pill = document.createElement('div');
    pill.className = 'day-pill';
    pill.innerHTML = `<span class="pill-day">${HARI_PENDEK[m.hari] || m.hari}</span><span class="pill-date">${tgl.getDate()}</span>`;
    pill.addEventListener('click', () => {
      hariAktifIndex = i;
      renderHari(i);
    });
    wrap.appendChild(pill);
  });
}

function highlightWeekPicker(idx){
  document.querySelectorAll('.day-pill').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
}

function setupTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.panel).classList.add('active');
    });
  });
}

muatData();
