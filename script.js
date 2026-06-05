// =================================================================
// 1. NAVIGASI MOBILE & ANIMASI TEKS (Front-End yang Sudah Berjalan)
// =================================================================

// Navigasi Responsif / Mobile Menu Toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });
}

// Konfigurasi Efek Mengetik Bergerak (Typing Effect)
const textConfigs = [
    {
        elementId: 'textProdi',
        words: ['Sesuai dengan Prodi', 'Fakultas Teknik dan Perencanaan', 'Fakultas Digital, Desain dan Bisnis', 'Fakultas Vokasi']
    },
    {
        elementId: 'textLibrary',
        words: ['Perpustakaan ITSB', 'Literasi Masa Depan', 'Inovasi Digital', 'Layanan Unggul']
    }
];

function typeEffect(config) {
    const element = document.getElementById(config.elementId);
    if (!element) return;
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function run() {
        const currentWord = config.words[wordIndex];
        
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 150;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 1500; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % config.words.length;
            typeSpeed = 500;
        }

        setTimeout(run, typeSpeed);
    }
    run();
}

// =================================================================
// 2. INTEGRASI API BACK-END (Bagian Baru yang Menghubungkan ke Server)
// =================================================================

// Manajemen Pergantian Tab Kategori Pencarian
let activeTabCategory = 'katalog';

function switchSearchTab(event, category) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    activeTabCategory = category;
    
    const inputElement = document.getElementById('mainSearchInput');
    if (!inputElement) return;

    if (category === 'katalog') {
        inputElement.placeholder = "Ketik judul buku, subjek, atau nama penulis di sini...";
    } else if (category === 'artikel') {
        inputElement.placeholder = "Cari artikel, jurnal ilmiah, dan prosiding...";
    } else if (category === 'repository') {
        inputElement.placeholder = "Cari judul skripsi, tesis, atau tugas akhir mahasiswa...";
    }
}

// REVISI: Fungsi Cari Sekarang Mengambil Data Langsung dari Server Node.js
function executeSearch(event) {
    event.preventDefault();
    const queryValue = document.getElementById('mainSearchInput').value.trim();
    
    if (!queryValue) {
        alert("Mohon masukkan kata kunci pencarian koleksi!");
        return;
    }
    
    // Melakukan Request ke API Back-End yang telah kita buat di server.js
    fetch(`/api/search?q=${encodeURIComponent(queryValue)}&category=${activeTabCategory}`)
        .then(response => response.json())
        .then(data => {
            console.log("Hasil dari server:", data);
            alert(`Mendapat respon dari Back-End:\n${data.message}\nKategori: ${data.category}`);
            // Di sini Anda bisa mengembangkan lagi untuk menampilkan data ke dalam HTML
        })
        .catch(err => console.error("Gagal melakukan pencarian ke server:", err));
}

// REVISI: Mengambil Data Berita dari File JSON di Server saat Halaman Dimuat
function loadBeritaFromBackEnd() {
    const gridKontainer = document.querySelector('.news-grid');
    if (!gridKontainer) return; // Mencegah error jika elemen tidak ada di halaman

    fetch('/api/berita')
        .then(response => response.json())
        .then(data => {
            gridKontainer.innerHTML = ''; // Hapus data berita bawaan HTML yang statis
            
            // Susun kartu berita baru berdasarkan data dari database JSON server
            data.forEach(item => {
                gridKontainer.innerHTML += `
                    <article class="news-card">
                        <div class="news-thumbnail">
                            <img src="https://via.placeholder.com/400x250" alt="Cover Berita">
                            <span class="news-badge ${item.badgeClass}">${item.badge}</span>
                        </div>
                        <div class="news-content">
                            <div class="author-avatar"><i class="fa-solid fa-user"></i></div>
                            <h3 class="news-title">${item.title}</h3>
                            <p class="news-excerpt">${item.excerpt}</p>
                            <a href="#" class="read-more-btn">READ MORE »</a>
                        </div>
                        <div class="news-footer">
                            <span class="news-date">${item.date}</span>
                            <span class="news-time">${item.time}</span>
                        </div>
                    </article>
                `;
            });
        })
        .catch(err => console.error("Gagal mengambil data berita dari server:", err));
}

// Jalankan semua fungsi inisialisasi begitu dokumen siap
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan efek mengetik
    textConfigs.forEach(config => typeEffect(config));
    
    // Jalankan penarikan data berita dari Back-End
    loadBeritaFromBackEnd();
});

// =================================================================
// 3. ANIMASI BERHITUNG ANGKA (COUNTER UP EFFECT) - DATA PERPUSTAKAAN
// =================================================================

function startCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 100; // Semakin kecil angkanya, perpindahan berhitungnya akan semakin cepat

    counters.forEach(counter => {
        const updateCount = () => {
            // Mengambil angka target asli dari atribut data-target
            const target = +counter.getAttribute('data-target');
            // Mengambil nilai angka saat ini di layar
            const count = +counter.innerText.replace('.', ''); // Hapus format titik sementara jika ada

            // Menentukan ritme penambahan angka per frame beralih
            const increment = Math.ceil(target / speed);

            // Jika hitungan belum mencapai target
            if (count < target) {
                const nextValue = count + increment;
                
                // Cegah angka melampaui target maksimal akibat pembulatan Math.ceil
                if (nextValue >= target) {
                    counter.innerText = formatNumberWithDot(target);
                } else {
                    counter.innerText = formatNumberWithDot(nextValue);
                    setTimeout(updateCount, 25); // Jalankan ulang fungsi setiap 25 milidetik
                }
            } else {
                counter.innerText = formatNumberWithDot(target);
            }
        };

        updateCount();
    });
}

// Fungsi pembantu untuk memberikan separator titik (.) pada ribuan (cth: 5127 menjadi 5.127)
function formatNumberWithDot(number) {
    return number.toString().replace(/\B(?=(\d3)+(?!\d))/g, ".");
}

// Menggunakan Intersection Observer agar animasi baru mulai saat section muncul di layar user
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-section');
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Jika section stats sudah terlihat di viewport minimum 20%
                if (entry.isIntersecting) {
                    startCounterAnimation();
                    observer.unobserve(entry.target); // Matikan observer agar animasi hanya berjalan 1 kali saja
                }
            });
        }, { threshold: 0.2 });

        observer.observe(statsSection);
    }
});

// =================================================================
// 4. REVISI EFEK MENYALA FOOTER - OTOMATIS HILANG SENDIRI (REVISI)
// =================================================================

// Variabel global untuk menyimpan memori timer agar tidak terjadi bentrokan saat diklik cepat
let footerGlowTimer = null;

function activateFooterItem(element) {
    // 1. Cari seluruh elemen interaktif di area footer secara global
    const allFooterItems = document.querySelectorAll('.modern-footer .clickable-info-item, .modern-footer .faculty-item');
    
    // 2. Bersihkan status menyala lama dan highlight bawaan dengan segera
    allFooterItems.forEach(item => {
        item.classList.remove('glow-active');
        item.classList.remove('item-highlighted');
    });
    
    // 3. Bersihkan timer sebelumnya jika user mengklik item lain sebelum batas waktu habis
    if (footerGlowTimer) {
        clearTimeout(footerGlowTimer);
    }
    
    // 4. Nyalakan efek glowing dan pop-up pada item yang baru saja diklik
    element.classList.add('glow-active');
    
    // 5. FITUR REVISI: Efek menyala akan hilang sendiri secara otomatis setelah 2 detik (2000 milidetik)
    footerGlowTimer = setTimeout(() => {
        element.classList.remove('glow-active');
        console.log("Efek glow otomatis diredupkan kembali.");
    }, 1000); // Anda bisa mengubah angka 2000 (2 detik) sesuai selera keheningan visual Anda
}

// =================================================================
// 5. REVISI FITUR SISTEM AKSESIBILITAS (8 AUTOMATED MODES)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    const accessBtn = document.getElementById('accessBtn');
    const accessPanel = document.getElementById('accessPanel');
    const closeAccessBtn = document.getElementById('closeAccessBtn');

    if (accessBtn && accessPanel) {
        accessBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accessPanel.classList.toggle('open');
        });
    }

    if (closeAccessBtn && accessPanel) {
        closeAccessBtn.addEventListener('click', () => {
            accessPanel.classList.remove('open');
        });
    }
});

// Fungsi Utama untuk Menangani 8 Fitur Aksesibilitas secara Dinamis
function handleAccess(mode) {
    // Cari kartu tombol yang memicu fungsi ini
    const clickedCard = event.currentTarget;
    
    // Pasang / lepas class penanda aktif pada kartu tombol di panel
    clickedCard.classList.toggle('active-feature');

    // Hubungkan tipe mode ke class manipulasi body di CSS
    switch (mode) {
        case 'text-large':
            document.body.classList.remove('access-text-small');
            document.body.classList.toggle('access-text-large');
            // Reset kartu pendampingnya agar tidak bentrok
            removeActiveState(1); 
            break;
        case 'text-small':
            document.body.classList.remove('access-text-large');
            document.body.classList.toggle('access-text-small');
            removeActiveState(0);
            break;
        case 'grayscale':
            document.body.classList.toggle('access-grayscale');
            break;
        case 'high-contrast':
            document.body.classList.remove('access-low-contrast');
            document.body.classList.toggle('access-high-contrast');
            removeActiveState(4);
            break;
        case 'low-contrast':
            document.body.classList.remove('access-high-contrast');
            document.body.classList.toggle('access-low-contrast');
            removeActiveState(3);
            break;
        case 'light-bg':
            document.body.classList.toggle('access-light-bg');
            break;
        case 'underline-links':
            document.body.classList.toggle('access-underline-links');
            break;
        case 'readable-font':
            document.body.classList.toggle('access-readable-font');
            break;
    }
}

// Fungsi pembantu untuk mematikan status tombol yang saling bertolak belakang (cth: teks besar vs kecil)
function removeActiveState(indexGrid) {
    const cards = document.querySelectorAll('.access-option-card');
    if(cards[indexGrid] && !document.body.className.includes(cards[indexGrid].getAttribute('onclick'))) {
        cards[indexGrid].classList.remove('active-feature');
    }
}

// Fungsi Pengembalian Setelan Dasar (Reset Button)
function resetAccessibility() {
    // Hapus seluruh class aksesibilitas dari body
    document.body.classList.remove(
        'access-text-large', 'access-text-small', 'access-grayscale', 
        'access-high-contrast', 'access-low-contrast', 'access-light-bg', 
        'access-underline-links', 'access-readable-font'
    );
    
    // Matikan semua tanda lampu aktif pada kartu menu di dalam panel
    const cards = document.querySelectorAll('.access-option-card');
    cards.forEach(card => card.classList.remove('active-feature'));
}

// =================================================================
// 7. OTOMATISASI SLIDESHOW BACKGROUND HERO SECTION
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlideIndex = 0;
    const slideIntervalTime = 5000; // Waktu jeda pergantian gambar (5000 milidetik = 5 detik)

    // Jalankan fungsi transisi jika elemen slide ditemukan di halaman
    if (slides.length > 1) {
        setInterval(() => {
            // 1. Hapus class 'active' dari gambar slide yang saat ini muncul
            slides[currentSlideIndex].classList.remove('active');
            
            // 2. Hitung index slide berikutnya secara berputar (loop)
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            
            // 3. Tambahkan class 'active' pada gambar slide yang baru
            slides[currentSlideIndex].classList.add('active');
        }, slideIntervalTime);
    }
});