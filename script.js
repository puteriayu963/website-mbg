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

function tampilkanGizi(daftar){
  const ul = document.getElementById('list-gizi');
  ul.innerHTML = '';
  (daftar || []).forEach(g => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="angka">${g.value}</span><span class="label">${g.label}</span>`;
    ul.appendChild(li);
  });
  if (!daftar || daftar.length === 0){
    ul.innerHTML = '<li><span class="label">Data gizi belum tersedia.</span></li>';
  }
}

function tampilkanPeringatan(teks){
  const el = document.getElementById('teks-peringatan');
  el.textContent = teks && teks.trim().length > 0
    ? teks
    : 'Tidak ada peringatan khusus untuk menu hari ini.';
}

function tampilkanMingguIni(menuMingguan, kunciHariIni){
  const ul = document.getElementById('week-list');
  ul.innerHTML = '';
  const entries = Object.entries(menuMingguan || {}).sort(([a],[b]) => a.localeCompare(b));
  entries.forEach(([tanggal, data]) => {
    const li = document.createElement('li');
    if (tanggal === kunciHariIni) li.classList.add('hari-ini');
    const ringkasan = (data.isiOmpreng || []).slice(0, 3).join(', ') || 'Belum ada data';
    li.innerHTML = `<span class="hari">${(data.hari || '').slice(0,3)}</span><span class="ringkasan">${ringkasan}</span>`;
    ul.appendChild(li);
  });
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

  const kunciHariIni = tanggalHariIni();
  document.getElementById('hari-tanggal').textContent = formatTanggalIndonesia(new Date());

  try{
    const data = await ambilData();
    const menuHariIni = (data.menu || {})[kunciHariIni];

    document.getElementById('dapur-info').textContent = data.dapur || '';
    document.getElementById('footer-dapur').textContent = 'Disiapkan di dapur — ' + (data.dapur || '-');

    if (!menuHariIni){
      document.getElementById('foto-placeholder').querySelector('span').textContent =
        'Menu untuk hari ini belum diunggah';
      tampilkanIsiOmpreng([]);
      tampilkanGizi([]);
      tampilkanPeringatan('');
      tampilkanMingguIni(data.menu, kunciHariIni);
      return;
    }

    tampilkanFoto(menuHariIni.foto);
    tampilkanIsiOmpreng(menuHariIni.isiOmpreng);
    tampilkanGizi(menuHariIni.gizi);
    tampilkanPeringatan(menuHariIni.peringatan);
    tampilkanMingguIni(data.menu, kunciHariIni);

  }catch(err){
    console.error(err);
    document.getElementById('hari-tanggal').textContent = 'Gagal memuat menu';
    document.getElementById('dapur-info').textContent = 'Cek menu.json / koneksi internet';
  }
}

init();
