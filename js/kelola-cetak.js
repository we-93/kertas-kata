/**
 * KERTAS KATA - Kelola Cetak & ISBN (Self-Publishing & ISBN Registry) Logic
 * Handles real-time search, multi-criteria filtering, 5-stage publishing workflow,
 * Perpusnas ISBN input, courier tracking updates, and anthology projects.
 */

(function () {
  'use strict';

  // 1. Dataset 10 Permohonan Cetak Buku Mandiri & Antologi Komunitas
  // Mematuhi instruksi khusus:
  // - Tanpa kata "Guru" -> diganti "Anggota"
  // - Tanpa nama sekolah -> diganti nama kecamatan atau organisasi asal
  // - Tanpa kata "Disdik" -> diganti "Komunitas"
  // - Tanpa kata "Peserta" -> diganti "Anggota"
  const printOrdersData = [
    {
      id: 'CTK-2026-0042',
      date: '06 Sep 2026',
      bookTitle: 'Strategi Pembelajaran Portofolio Digital di Era Kecerdasan Buatan',
      author: 'Rahmat Hidayat, S.Pd.',
      authorOrg: 'Komunitas Literasi Curug',
      kecamatan: 'Curug',
      serviceType: 'mandiri',
      serviceLabel: 'Cetak Mandiri Ber-ISBN',
      copies: 20,
      format: 'A5 (14.8 x 21 cm)',
      paperType: 'Bookpaper 72gr Premium',
      coverType: 'Softcover Doff Emboss',
      totalPrice: 'Rp 960.000',
      isPaid: true,
      isbnNumber: '978-623-01-2042-8',
      resiNumber: 'JNE-CGK-984210952',
      workflowStep: 4, // 1: Verifikasi, 2: ISBN, 3: Cetak, 4: Ekspedisi, 5: Selesai
      workflowStatus: 'kirim',
      workflowLabel: 'Sedang Dikirim',
      courier: 'JNE Regular'
    },
    {
      id: 'CTK-2026-0055',
      date: '05 Sep 2026',
      bookTitle: 'Jejak Etnografi Komunitas Tionghoa Benteng di Tepian Sungai Cisadane',
      author: 'Siti Aminah, M.Pd.',
      authorOrg: 'Forum Literasi Teluknaga',
      kecamatan: 'Teluknaga',
      serviceType: 'mandiri',
      serviceLabel: 'Cetak Mandiri Ber-ISBN',
      copies: 15,
      format: 'B5 (17.6 x 25 cm)',
      paperType: 'Bookpaper 72gr',
      coverType: 'Hardcover Lux Gold Foil',
      totalPrice: 'Rp 1.125.000',
      isPaid: true,
      isbnNumber: '978-623-01-2055-1',
      resiNumber: 'Menunggu Pengambilan Kurir',
      workflowStep: 3,
      workflowStatus: 'cetak',
      workflowLabel: 'Proses Percetakan',
      courier: 'SiCepat Cargo'
    },
    {
      id: 'CTK-2026-0068',
      date: '04 Sep 2026',
      bookTitle: 'Antologi Bunga Rampai: Merajut Asa di Ujung Barat Tangerang (35 Karya Terpilih)',
      author: 'Dewan Kurasi & 35 Anggota',
      authorOrg: 'Komunitas Literasi Tigaraksa',
      kecamatan: 'Tigaraksa',
      serviceType: 'antologi',
      serviceLabel: 'Buku Antologi Bersama',
      copies: 100,
      format: 'A5 (14.8 x 21 cm)',
      paperType: 'Bookpaper 72gr Premium',
      coverType: 'Softcover Doff Spot UV',
      totalPrice: 'Rp 4.800.000',
      isPaid: true,
      isbnNumber: '978-623-01-2068-9',
      resiNumber: 'Distribusi Kantor Komunitas',
      workflowStep: 5,
      workflowStatus: 'selesai',
      workflowLabel: 'Selesai & Didistribusikan',
      courier: 'Layanan Mandiri Komunitas'
    },
    {
      id: 'CTK-2026-0074',
      date: '03 Sep 2026',
      bookTitle: 'Panduan Modul Belajar Berbasis Konservasi Hutan Mangrove Pesisir',
      author: 'Dewi Sartika, S.Pd.SD',
      authorOrg: 'Komunitas Literasi Mauk',
      kecamatan: 'Mauk',
      serviceType: 'mandiri',
      serviceLabel: 'Cetak Mandiri Ber-ISBN',
      copies: 10,
      format: 'A5 (14.8 x 21 cm)',
      paperType: 'HVS 80gr Putih',
      coverType: 'Softcover Glossy',
      totalPrice: 'Rp 520.000',
      isPaid: true,
      isbnNumber: 'Proses Registrasi Perpusnas',
      resiNumber: 'Belum Tersedia',
      workflowStep: 2,
      workflowStatus: 'isbn',
      workflowLabel: 'Pengurusan ISBN Perpusnas',
      courier: 'J&T Express'
    },
    {
      id: 'CTK-2026-0081',
      date: '02 Sep 2026',
      bookTitle: 'Literasi Koding Visual untuk Generasi Muda Kawasan Pesisir',
      author: 'Ahmad Fauzi, S.Pd.I',
      authorOrg: 'Pegiat Pustaka Kronjo',
      kecamatan: 'Kronjo',
      serviceType: 'mandiri',
      serviceLabel: 'Cetak Mandiri Ber-ISBN',
      copies: 15,
      format: 'A5 (14.8 x 21 cm)',
      paperType: 'Bookpaper 72gr',
      coverType: 'Softcover Doff',
      totalPrice: 'Rp 750.000',
      isPaid: true,
      isbnNumber: 'Menunggu Verifikasi Naskah',
      resiNumber: 'Belum Tersedia',
      workflowStep: 1,
      workflowStatus: 'verifikasi',
      workflowLabel: 'Verifikasi Berkas Naskah',
      courier: 'JNE Regular'
    },
    {
      id: 'CTK-2026-0089',
      date: '01 Sep 2026',
      bookTitle: 'Antologi Cerpen Sastra: Lentera Pesisir Kronjo dan Kumpulan Kisah Pantura',
      author: 'Nurul Fajriah, S.S.',
      authorOrg: 'Forum Literasi Sukamulya',
      kecamatan: 'Sukamulya',
      serviceType: 'mandiri',
      serviceLabel: 'Cetak Mandiri Ber-ISBN',
      copies: 25,
      format: 'A5 (14.8 x 21 cm)',
      paperType: 'Bookpaper 72gr Premium',
      coverType: 'Softcover Doff Emboss',
      totalPrice: 'Rp 1.250.000',
      isPaid: true,
      isbnNumber: '978-623-01-2089-4',
      resiNumber: 'JNE-CGK-87291044',
      workflowStep: 4,
      workflowStatus: 'kirim',
      workflowLabel: 'Sedang Dikirim',
      courier: 'JNE Yes'
    },
    {
      id: 'CTK-2026-0094',
      date: '30 Agu 2026',
      bookTitle: 'Buku Pegangan Anggota: Sains Populer dan Eksperimen Sederhana Generasi Z',
      author: 'Budi Santoso, M.Pd.',
      authorOrg: 'Komunitas Penulis Tigaraksa',
      kecamatan: 'Tigaraksa',
      serviceType: 'mandiri',
      serviceLabel: 'Cetak Mandiri Ber-ISBN',
      copies: 50,
      format: 'B5 (17.6 x 25 cm)',
      paperType: 'Bookpaper 72gr',
      coverType: 'Hardcover Lux Doff',
      totalPrice: 'Rp 3.450.000',
      isPaid: true,
      isbnNumber: '978-623-01-2094-8',
      resiNumber: 'SELESAI-TNG-0094',
      workflowStep: 5,
      workflowStatus: 'selesai',
      workflowLabel: 'Selesai & Didistribusikan',
      courier: 'Ambil di Kantor Komunitas'
    },
    {
      id: 'CTK-2026-0102',
      date: '28 Agu 2026',
      bookTitle: 'Kumpulan Puisi: Merawat Sunyi di Bawah Langit Tangerang Barat',
      author: 'Maya Anggraeni, S.Pd.',
      authorOrg: 'Komunitas Sastra Cisauk',
      kecamatan: 'Cisauk',
      serviceType: 'mandiri',
      serviceLabel: 'Cetak Mandiri Ber-ISBN',
      copies: 20,
      format: 'A5 (14.8 x 21 cm)',
      paperType: 'Bookpaper 72gr Premium',
      coverType: 'Softcover Doff Spot UV',
      totalPrice: 'Rp 980.000',
      isPaid: true,
      isbnNumber: '978-623-01-2102-0',
      resiNumber: 'Proses Finishing Binding',
      workflowStep: 3,
      workflowStatus: 'cetak',
      workflowLabel: 'Proses Percetakan',
      courier: 'SiCepat Regular'
    },
    {
      id: 'CTK-2026-0115',
      date: '27 Agu 2026',
      bookTitle: 'Revitalisasi Koperasi Pelajar: Penguatan Literasi Finansial Berkelanjutan',
      author: 'Hendra Gunawan, S.E.',
      authorOrg: 'Pegiat Literasi Cikupa',
      kecamatan: 'Cikupa',
      serviceType: 'proofread',
      serviceLabel: 'Tata Letak & ISBN Saja',
      copies: 10,
      format: 'A5 (14.8 x 21 cm)',
      paperType: 'HVS 80gr',
      coverType: 'Softcover Standard',
      totalPrice: 'Rp 450.000',
      isPaid: true,
      isbnNumber: '978-623-01-2115-3',
      resiNumber: 'SELESAI-TNG-0115',
      workflowStep: 5,
      workflowStatus: 'selesai',
      workflowLabel: 'Selesai & Didistribusikan',
      courier: 'Ekspedisi Lokal'
    },
    {
      id: 'CTK-2026-0128',
      date: '25 Agu 2026',
      bookTitle: 'Antologi Praktik Baik Literasi Komunitas Kabupaten Tangerang 2026 (Jilid 2)',
      author: 'Tim Kurasi Komunitas',
      authorOrg: 'Komunitas Literasi Tigaraksa',
      kecamatan: 'Tigaraksa',
      serviceType: 'antologi',
      serviceLabel: 'Buku Antologi Bersama',
      copies: 50,
      format: 'A5 (14.8 x 21 cm)',
      paperType: 'Bookpaper 72gr Premium',
      coverType: 'Softcover Doff',
      totalPrice: 'Rp 2.500.000',
      isPaid: false, // Menunggu konfirmasi anggaran
      isbnNumber: 'Verifikasi Draft Final',
      resiNumber: 'Belum Tersedia',
      workflowStep: 1,
      workflowStatus: 'verifikasi',
      workflowLabel: 'Verifikasi Berkas Naskah',
      courier: 'Mitra Percetakan Komunitas'
    }
  ];

  let currentOrders = [...printOrdersData];
  let activeSelectedOrder = null;

  // 2. Render Print Table
  function renderPrintTable(data) {
    const tbody = document.getElementById('printTableBody');
    const totalCountEl = document.getElementById('totalPrintCount');
    if (totalCountEl) totalCountEl.textContent = `${data.length} Permohonan Ditampilkan`;
    if (!tbody) return;

    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;">🖨️</div>
            <div style="font-weight:700; font-size:1rem; color:var(--text-main);">Tidak Ada Antrean Cetak yang Sesuai</div>
            <div style="font-size:0.8125rem;">Coba sesuaikan kata kunci pencarian atau reset filter layanan.</div>
          </td>
        </tr>
      `;
      return;
    }

    data.forEach(item => {
      const tr = document.createElement('tr');

      let workflowBadge = `<span class="badge-workflow verifikasi">● 1. Verifikasi Berkas</span>`;
      if (item.workflowStep === 2) workflowBadge = `<span class="badge-workflow isbn">● 2. Proses ISBN</span>`;
      if (item.workflowStep === 3) workflowBadge = `<span class="badge-workflow cetak">● 3. Percetakan</span>`;
      if (item.workflowStep === 4) workflowBadge = `<span class="badge-workflow kirim">● 4. Sedang Dikirim</span>`;
      if (item.workflowStep === 5) workflowBadge = `<span class="badge-workflow selesai">✓ 5. Selesai</span>`;

      tr.innerHTML = `
        <td style="width: 40px; text-align: center;">
          <input type="checkbox" class="print-select-cb" data-id="${item.id}" aria-label="Pilih permohonan ${item.id}">
        </td>
        <td>
          <div style="font-weight: 700; font-size: 0.8125rem; color: var(--text-main); font-family: monospace;">${item.id}</div>
          <div style="font-size: 0.6875rem; color: var(--text-muted);">${item.date}</div>
          <span class="badge-service-type ${item.serviceType}" style="margin-top:0.35rem;">${item.serviceLabel}</span>
        </td>
        <td>
          <div class="book-title-cell">
            <div class="book-main-title">${item.bookTitle}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              <strong>${item.author}</strong> &bull; ${item.authorOrg}
            </div>
            <span class="isbn-pill">ISBN: ${item.isbnNumber}</span>
          </div>
        </td>
        <td>
          <div class="spec-badge-box">
            <span class="spec-item">📚 <strong>${item.copies}</strong> Eksemplar</span>
            <span class="spec-item">📐 ${item.format}</span>
            <span class="spec-item">📄 ${item.paperType}</span>
            <span class="spec-item">🎨 ${item.coverType}</span>
          </div>
        </td>
        <td>
          <div style="font-weight: 800; font-size: 0.875rem; color: var(--text-main);">${item.totalPrice}</div>
          ${item.isPaid 
            ? '<span class="pay-status-paid">✓ Lunas (Bebas Pungli)</span>' 
            : '<span class="pay-status-pending">⏳ Menunggu Pembayaran</span>'}
        </td>
        <td>
          ${workflowBadge}
          <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 0.35rem; font-family: monospace;">
            Resi: ${item.resiNumber}
          </div>
        </td>
        <td style="text-align: right;">
          <div style="display:flex; gap:0.35rem; justify-content:flex-end;">
            <button type="button" class="btn-print-action primary" onclick="window.openWorkflowModal('${item.id}')" title="Kelola Tahapan Workflow">
              🔍 Detail &amp; Alur
            </button>
            <button type="button" class="btn-print-action" onclick="window.printRegistrationProof('${item.id}')" title="Unduh Bukti Permohonan">
              🖨️
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  // 3. Multi-Criteria Filter Logic
  function applyPrintFilters() {
    const searchVal = (document.getElementById('printSearchInput')?.value || '').toLowerCase().trim();
    const serviceVal = document.getElementById('filterServiceType')?.value || 'all';
    const statusVal = document.getElementById('filterWorkflowStatus')?.value || 'all';
    const sortVal = document.getElementById('sortPrintSelect')?.value || 'latest';

    currentOrders = printOrdersData.filter(item => {
      // Service type filter
      if (serviceVal !== 'all' && item.serviceType !== serviceVal) {
        return false;
      }

      // Workflow status filter
      if (statusVal !== 'all' && item.workflowStatus !== statusVal) {
        return false;
      }

      // Search keyword filter (title, author, authorOrg, id, isbnNumber, resiNumber)
      if (searchVal) {
        const matchTitle = item.bookTitle.toLowerCase().includes(searchVal);
        const matchAuthor = item.author.toLowerCase().includes(searchVal);
        const matchOrg = item.authorOrg.toLowerCase().includes(searchVal);
        const matchId = item.id.toLowerCase().includes(searchVal);
        const matchIsbn = item.isbnNumber.toLowerCase().includes(searchVal);
        const matchResi = item.resiNumber.toLowerCase().includes(searchVal);

        if (!matchTitle && !matchAuthor && !matchOrg && !matchId && !matchIsbn && !matchResi) {
          return false;
        }
      }

      return true;
    });

    // Sort order
    if (sortVal === 'copies') {
      currentOrders.sort((a, b) => b.copies - a.copies);
    } else if (sortVal === 'step') {
      currentOrders.sort((a, b) => a.workflowStep - b.workflowStep);
    } // default: latest order

    renderPrintTable(currentOrders);
  }

  // 4. Modal Detail Workflow Penerbitan
  window.openWorkflowModal = function (orderId) {
    const order = printOrdersData.find(o => o.id === orderId);
    if (!order) return;

    activeSelectedOrder = order;
    const modal = document.getElementById('printWorkflowModal');
    if (!modal) return;

    document.getElementById('wfOrderId').textContent = order.id;
    document.getElementById('wfBookTitle').textContent = order.bookTitle;
    document.getElementById('wfAuthor').textContent = `${order.author} (${order.authorOrg})`;
    document.getElementById('wfSpecs').textContent = `${order.copies} Eksemplar • ${order.format} • ${order.paperType} • ${order.coverType}`;
    document.getElementById('wfPrice').textContent = `${order.totalPrice} (${order.isPaid ? 'Lunas' : 'Belum Lunas'})`;

    // Input values
    document.getElementById('inputWorkflowStep').value = order.workflowStep;
    document.getElementById('inputIsbnNumber').value = order.isbnNumber.startsWith('978') ? order.isbnNumber : '';
    document.getElementById('inputResiNumber').value = order.resiNumber.includes('-') ? order.resiNumber : '';
    document.getElementById('inputCourierSelect').value = order.courier || 'JNE Regular';

    // Stepper visual nodes
    for (let s = 1; s <= 5; s++) {
      const node = document.getElementById(`stepNode${s}`);
      if (node) {
        node.className = 'step-node';
        if (s < order.workflowStep) {
          node.classList.add('completed');
        } else if (s === order.workflowStep) {
          node.classList.add('active');
        }
      }
    }

    modal.classList.add('show');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // 5. Simpan Pembaruan Alur Workflow
  window.saveWorkflowUpdate = function (e) {
    e.preventDefault();
    if (!activeSelectedOrder) return;

    const newStep = parseInt(document.getElementById('inputWorkflowStep').value, 10);
    const newIsbn = document.getElementById('inputIsbnNumber').value.trim();
    const newResi = document.getElementById('inputResiNumber').value.trim();
    const newCourier = document.getElementById('inputCourierSelect').value;

    activeSelectedOrder.workflowStep = newStep;
    if (newIsbn) activeSelectedOrder.isbnNumber = newIsbn;
    if (newResi) activeSelectedOrder.resiNumber = newResi;
    activeSelectedOrder.courier = newCourier;

    const statusMap = {
      1: { status: 'verifikasi', label: 'Verifikasi Berkas Naskah' },
      2: { status: 'isbn', label: 'Pengurusan ISBN Perpusnas' },
      3: { status: 'cetak', label: 'Proses Percetakan' },
      4: { status: 'kirim', label: 'Sedang Dikirim' },
      5: { status: 'selesai', label: 'Selesai & Didistribusikan' }
    };

    activeSelectedOrder.workflowStatus = statusMap[newStep].status;
    activeSelectedOrder.workflowLabel = statusMap[newStep].label;

    closeModal('printWorkflowModal');
    showToast(`✅ Tahapan alur permohonan ${activeSelectedOrder.id} berhasil diperbarui ke Tahap ${newStep}: ${statusMap[newStep].label}!`);
    applyPrintFilters();
  };

  // 6. Modal Inisiasi Antologi Baru
  window.openNewAnthologyModal = function () {
    const modal = document.getElementById('newAnthologyModal');
    if (modal) modal.classList.add('active');
  };

  window.submitNewAnthology = function (e) {
    e.preventDefault();
    const title = document.getElementById('anthologyTitleInput').value.trim();
    const quota = document.getElementById('anthologyQuotaInput').value;
    const deadline = document.getElementById('anthologyDeadlineInput').value;
    const curator = document.getElementById('anthologyCuratorInput').value.trim();

    if (!title) {
      showToast('⚠️ Harap isi judul antologi bunga rampai.');
      return;
    }

    const newAnthology = {
      id: `CTK-2026-${Date.now().toString().slice(-4)}`,
      date: 'Hari Ini',
      bookTitle: `Antologi Bunga Rampai: ${title} (${quota} Karya Terpilih)`,
      author: `Kurator: ${curator} & Dewan Kurasi`,
      authorOrg: 'Komunitas Literasi Kab. Tangerang',
      kecamatan: 'Tigaraksa',
      serviceType: 'antologi',
      serviceLabel: 'Buku Antologi Bersama',
      copies: parseInt(quota, 10) * 2,
      format: 'A5 (14.8 x 21 cm)',
      paperType: 'Bookpaper 72gr Premium',
      coverType: 'Softcover Doff Spot UV',
      totalPrice: 'Alokasi Komunitas',
      isPaid: true,
      isbnNumber: 'Pengajuan Kolektif',
      resiNumber: `Deadline: ${deadline}`,
      workflowStep: 1,
      workflowStatus: 'verifikasi',
      workflowLabel: 'Verifikasi Berkas Naskah',
      courier: 'Kantor Layanan Komunitas'
    };

    printOrdersData.unshift(newAnthology);
    closeModal('newAnthologyModal');
    e.target.reset();
    showToast(`📖 Proyek Antologi "${title.substring(0, 30)}..." resmi dibuka untuk anggota!`);
    applyPrintFilters();
  };

  // 7. Cetak Bukti Registrasi
  window.printRegistrationProof = function (orderId) {
    const order = printOrdersData.find(o => o.id === orderId);
    if (!order) return;
    showToast(`🖨️ Mengunduh lembar bukti permohonan cetak & ISBN resmi untuk order: ${order.id}...`);
  };

  // 8. Helper Modal Closer
  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // 9. Toast Notifications
  function showToast(message) {
    let toast = document.getElementById('globalAdminToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalAdminToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #1e293b;
        color: #ffffff;
        padding: 0.85rem 1.35rem;
        border-radius: 12px;
        font-size: 0.8125rem;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        opacity: 0;
        transform: translateY(15px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
    }, 3200);
  }

  // 10. Event Listeners Initialization
  document.addEventListener('DOMContentLoaded', () => {
    applyPrintFilters();

    const searchInput = document.getElementById('printSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', applyPrintFilters);
    }

    const serviceSelect = document.getElementById('filterServiceType');
    if (serviceSelect) {
      serviceSelect.addEventListener('change', applyPrintFilters);
    }

    const statusSelect = document.getElementById('filterWorkflowStatus');
    if (statusSelect) {
      statusSelect.addEventListener('change', applyPrintFilters);
    }

    const sortSelect = document.getElementById('sortPrintSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', applyPrintFilters);
    }

    const resetBtn = document.getElementById('btnResetPrintFilter');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (serviceSelect) serviceSelect.value = 'all';
        if (statusSelect) statusSelect.value = 'all';
        if (sortSelect) sortSelect.value = 'latest';
        applyPrintFilters();
        showToast('🔄 Filter cetak & ISBN berhasil disetel ulang.');
      });
    }

    const workflowForm = document.getElementById('printWorkflowForm');
    if (workflowForm) {
      workflowForm.addEventListener('submit', window.saveWorkflowUpdate);
    }

    const anthologyForm = document.getElementById('newAnthologyForm');
    if (anthologyForm) {
      anthologyForm.addEventListener('submit', window.submitNewAnthology);
    }

    const selectAllCb = document.getElementById('selectAllPrintsCb');
    if (selectAllCb) {
      selectAllCb.addEventListener('change', (e) => {
        const checked = e.target.checked;
        document.querySelectorAll('.print-select-cb').forEach(cb => {
          cb.checked = checked;
        });
      });
    }

    const exportBtn = document.getElementById('btnExportPrintReport');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        showToast('📥 Mengunduh rekap transaksi permohonan cetak & ISBN (Format CSV)...');
      });
    }

    // Init Mobile Drawer
    initMobileDrawer();
  });

  // Mobile Drawer Navigation Toggle
  function initMobileDrawer() {
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const sidebarLeft = document.getElementById('sidebarLeft');

    if (menuToggleBtn && sidebarLeft) {
      menuToggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        sidebarLeft.classList.toggle('open');
      });

      document.addEventListener('click', function (e) {
        if (sidebarLeft.classList.contains('open')) {
          if (!sidebarLeft.contains(e.target) && !menuToggleBtn.contains(e.target)) {
            sidebarLeft.classList.remove('open');
          }
        }
      });
    }
  }

  // Keyboard accessibility: ESC closes open modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.inline-review-modal-overlay.show, .inline-review-modal-overlay.active').forEach(m => {
        m.classList.remove('show');
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });

})();
