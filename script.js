// ====== KONFIGURASI ======
// PENTING: pakai path relatif (tanpa "/" di depan), karena situs ini
// di-hosting di subfolder (contoh: namakamu.github.io/website-mbg/)
const URL_DATA = 'menu.json';

const NAMA_HARI = ['Minggu','Senin','Selasa','Rabu','Kamis',"Jum'at",'Sabtu'];
const NAMA_BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function tanggalHariIni(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatTanggalIndonesia(d){
  return `${NAMA_HARI[d.getDay()]}, ${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

async function ambilData(){
  const res = await fetch(URL_DATA, { cache: 'no-store' });
  if (!res.ok) throw new Error('menu.json tidak ditemukan (status ' + res.status + ')');
  return res.json();
}

function tampilkanFoto(pathFoto){
  const img = document.getElementById('foto-menu');
  const placeholder = document.getElementById('foto-placeholder');
  if (!pathFoto){
    img.hidden = true;
    placeholder.hidden = false;
    return;
  }
  img.onload = () => { img.hidden = false; placeholder.hidden = true; };
  img.onerror = () => { img.hidden = true; placeholder.hidden = false; };
  img.src = pathFoto;
}

function tampilkanIsiOmpreng(daftar){
  const ul = document.getElementById('list-isiOmpreng');
  ul.innerHTML = '';
  (daftar || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
  if (!daftar || daftar.length === 0){
    ul.innerHTML = '<li>Belum ada data isi ompreng untuk hari ini.</li>';
  }
}

function tampilkanGizi(gizi){
  const isiKolom = (ul, daftar) => {
    ul.innerHTML = '';
    (daftar || []).forEach(g => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${g.label}</span><span class="nilai">${g.value}</span>`;
      ul.appendChild(li);
    });
    if (!daftar || daftar.length === 0){
      ul.innerHTML = '<li><span>Belum ada data</span></li>';
    }
  };
  isiKolom(document.getElementById('list-gizi-kecil'), gizi && gizi.porsiKecil);
  isiKolom(document.getElementById('list-gizi-besar'), gizi && gizi.porsiBesar);
}

function tampilkanPenerimaManfaat(angka){
  const el = document.getElementById('angka-penerima');
  el.textContent = (typeof angka === 'number')
    ? angka.toLocaleString('id-ID')
    : '–';
}

function tampilkanPeringatan(teks){
  const el = document.getElementById('teks-peringatan');
  el.textContent = teks && teks.trim().length > 0
    ? teks
    : 'Tidak ada peringatan khusus untuk menu hari ini.';
}

function tampilkanMingguIni(menuMingguan, kunciHariIni, tanggalAktif){
  const ul = document.getElementById('week-list');
  ul.innerHTML = '';
  const entries = Object.entries(menuMingguan || {})
    .filter(([tanggal]) => tanggal <= kunciHariIni)
    .sort(([a],[b]) => a.localeCompare(b));

  if (entries.length === 0){
    ul.innerHTML = '<li style="cursor:default;"><span class="ringkasan">Belum ada menu yang diunggah minggu ini.</span></li>';
    return;
  }
  entries.forEach(([tanggal, data]) => {
    const li = document.createElement('li');
    if (tanggal === kunciHariIni) li.classList.add('hari-ini');
    if (tanggal === tanggalAktif) li.classList.add('aktif');
    const ringkasan = (data.isiOmpreng || []).slice(0, 3).join(', ') || 'Belum ada data';
    li.innerHTML = `<span class="hari">${(data.hari || '').slice(0,3)}</span><span class="ringkasan">${ringkasan}</span>`;
    li.addEventListener('click', () => pilihTanggal(tanggal));
    ul.appendChild(li);
  });
}

// ====== STATE & NAVIGASI ANTAR HARI ======
let dataGlobal = null;
let kunciHariIniGlobal = '';

function pilihTanggal(tanggal){
  renderUntukTanggal(tanggal);
}

function renderUntukTanggal(tanggal){
  if (!dataGlobal) return;
  const entry = (dataGlobal.menu || {})[tanggal];
  const tombolKembali = document.getElementById('kembali-hari-ini');

  if (!entry){
    tampilkanIsiOmpreng([]);
    tampilkanGizi(null);
    tampilkanPenerimaManfaat(null);
    tampilkanPeringatan('');
    tampilkanFoto(null);
    document.getElementById('foto-placeholder').querySelector('span').textContent =
      'Menu untuk tanggal ini belum diunggah';
  } else {
    document.getElementById('foto-placeholder').querySelector('span').textContent =
      'Foto menu belum diunggah';
    document.getElementById('hari-tanggal').textContent =
      formatTanggalIndonesia(new Date(tanggal + 'T00:00:00'));
    tampilkanFoto(entry.foto);
    tampilkanIsiOmpreng(entry.isiOmpreng);
    tampilkanGizi(entry.gizi);
    tampilkanPenerimaManfaat(entry.penerimaManfaat);
    tampilkanPeringatan(entry.peringatan);
  }

  tombolKembali.hidden = (tanggal === kunciHariIniGlobal);
  tampilkanMingguIni(dataGlobal.menu, kunciHariIniGlobal, tanggal);
}

function pasangTab(){
  const tombolTombol = document.querySelectorAll('.tabs__btn');
  tombolTombol.forEach(btn => {
    btn.addEventListener('click', () => {
      tombolTombol.forEach(b => b.setAttribute('aria-selected', 'false'));
      btn.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.panel').forEach(p => p.hidden = true);
      document.getElementById('panel-' + btn.dataset.tab).hidden = false;
    });
  });
}

async function init(){
  pasangTab();

  kunciHariIniGlobal = tanggalHariIni();
  document.getElementById('hari-tanggal').textContent = formatTanggalIndonesia(new Date());

  document.getElementById('kembali-hari-ini').addEventListener('click', () => {
    renderUntukTanggal(kunciHariIniGlobal);
  });

  try{
    const data = await ambilData();
    dataGlobal = data;

    document.getElementById('nama-sppg').textContent = data.dapur || 'SPPG';
    document.getElementById('footer-dapur').textContent = 'Disiapkan di dapur — ' + (data.dapur || '-');

    renderUntukTanggal(kunciHariIniGlobal);

  }catch(err){
    console.error(err);
    document.getElementById('nama-sppg').textContent = 'Gagal memuat menu';
    document.getElementById('hari-tanggal').textContent = 'Cek menu.json / koneksi internet';
  }
}

init();
