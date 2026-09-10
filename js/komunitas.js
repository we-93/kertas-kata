/**
 * KERTAS KATA - Komunitas & Forum Diskusi Logic
 * PRD v1.0 (Fitur KM-01 s/d KM-07) & Wireframe 4
 * Handles thread feeds, tab/category filtering, create thread modal with member invitations,
 * thread detail modal with threaded comments, like interactions, and author follow toggles.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Sample Forum Threads Dataset ---
  const threadsData = [
    {
      id: 'th-1',
      type: 'public',
      typeLabel: '🌐 PUBLIK',
      category: 'bedah_karya',
      categoryLabel: 'Bedah Karya',
      title: '[Bedah Naskah] Mohon Masukan Alur Logika Cerpen "Gemintang di Tepian Cisadane"',
      author: 'Anisa Fitriani',
      authorAvatar: 'AF',
      authorColor: '#831843',
      authorRole: 'Penulis Cerpen',
      timeAgo: '1 jam yang lalu',
      content: `Halo rekan-rekan penulis KERTAS KATA! Saya sedang mematangkan naskah cerpen yang berlatar di tepi Sungai Cisadane. Di Bab 2, perpindahan sudut pandang tokoh dari orang pertama ke orang ketiga serba tahu rasanya agak mendadak. 

Kira-kira transisi kalimat seperti apa yang paling natural agar pembaca tidak bingung? Mohon kritik dan saran konstruktif dari teman-teman kurator dan rekan penulis sekalian!`,
      excerpt: 'Halo rekan-rekan penulis KERTAS KATA! Saya sedang mematangkan naskah cerpen yang berlatar di tepi Sungai Cisadane. Di Bab 2, perpindahan sudut pandang tokoh...',
      likesCount: 28,
      isLiked: false,
      isMyThread: false,
      participants: ['RH', 'SM', 'BS'],
      replies: [
        {
          id: 'rep-1',
          author: 'Dr. Rahmat Hidayat',
          authorAvatar: 'RH',
          authorColor: '#1e3a8a',
          timeAgo: '45 menit yang lalu',
          text: 'Saran saya, gunakan jeda scene pemisah (tiga tanda bintang atau spasi kosong ganda) ditambah deskripsi lingkungan sensoris untuk menandai pergeseran sudut pandang secara halus.'
        },
        {
          id: 'rep-2',
          author: 'Sarah Melati',
          authorAvatar: 'SM',
          authorColor: '#4338ca',
          timeAgo: '20 menit yang lalu',
          text: 'Setuju dengan Mas Rahmat. Transisi suasana alam atau perubahan suara air sering kali menjadi jembatan naratif paling estetis dalam fiksi sastra.'
        }
      ]
    },
    {
      id: 'th-2',
      type: 'public',
      typeLabel: '🌐 PUBLIK',
      category: 'puebi',
      categoryLabel: 'PUEBI & Tata Bahasa',
      title: 'Diskusi Kaidah: Penggunaan Kata Sambung "Sehingga" dan "Sedangkan" di Awal Kalimat',
      author: 'Budi Santoso, M.Pd',
      authorAvatar: 'BS',
      authorColor: '#0f766e',
      authorRole: 'Kurator PUEBI',
      timeAgo: '3 jam yang lalu',
      content: `Sering kali dalam proses kurasi naskah, kami menemukan penggunaan konjungsi intrakalimat seperti "sehingga", "sedangkan", dan "karena" yang diletakkan di awal kalimat tunggal. 

Secara kaidah PUEBI rapi, kata-kata tersebut adalah penghubung dalam satu kalimat majemuk bertingkat. Mari kita diskusikan alternatif transisi antarkalimat yang tetap enak dibaca tanpa melanggar struktur gramatikal formal.`,
      excerpt: 'Sering kali dalam proses kurasi naskah, kami menemukan penggunaan konjungsi intrakalimat seperti "sehingga" dan "sedangkan" yang diletakkan di awal kalimat tunggal...',
      likesCount: 45,
      isLiked: true,
      isMyThread: false,
      participants: ['SN', 'AF'],
      replies: [
        {
          id: 'rep-3',
          author: 'Suryadi Ningrat',
          authorAvatar: 'SN',
          authorColor: '#475569',
          timeAgo: '2 jam yang lalu',
          text: 'Topik yang sangat mendasar namun krusial Pak Budi. Sebaiknya diganti dengan konjungsi antarkalimat seperti "Oleh karena itu" atau "Sementara itu".'
        }
      ]
    },
    {
      id: 'th-3',
      type: 'private',
      typeLabel: '🔒 PRIVATE',
      category: 'antologi',
      categoryLabel: 'Kolaborasi Antologi',
      title: '[Kolaborasi Tertutup] Tim Kerja Naskah Bunga Rampai Pantura 2026',
      author: 'Dr. Rahmat Hidayat',
      authorAvatar: 'RH',
      authorColor: '#1e3a8a',
      authorRole: 'Inisiator Proyek',
      timeAgo: '5 jam yang lalu',
      content: `Selamat datang rekan-rekan terpilih di ruang kolaborasi tertutup KERTAS KATA. Di thread private ini kita akan menyelaraskan pembagian bab: Mas Suryadi memegang bagian catatan historis, Mbak Sarah pada esai kebudayaan maritim, dan saya pada pengantar ekosistem literasi. 

Silakan laporkan outline bab masing-masing di bawah ini sebelum tanggal 15 September untuk diserahkan ke tim kurator cetak.`,
      excerpt: 'Selamat datang rekan-rekan terpilih di ruang kolaborasi tertutup KERTAS KATA. Di thread private ini kita akan menyelaraskan pembagian bab bunga rampai...',
      likesCount: 19,
      isLiked: true,
      isMyThread: true,
      participants: ['SN', 'SM', 'RH'],
      replies: [
        {
          id: 'rep-4',
          author: 'Suryadi Ningrat',
          authorAvatar: 'SN',
          authorColor: '#475569',
          timeAgo: '4 jam yang lalu',
          text: 'Draf outline bab sejarah sudah rampung 80%, besok sore akan saya lampirkan poin-poin babnya di sini.'
        }
      ]
    },
    {
      id: 'th-4',
      type: 'public',
      typeLabel: '🌐 PUBLIK',
      category: 'opini',
      categoryLabel: 'Riset & Opini',
      title: 'Menemukan Sumber Data Sekunder yang Kredibel untuk Menulis Esai Opini Publik',
      author: 'Sarah Melati, M.I.Kom',
      authorAvatar: 'SM',
      authorColor: '#4338ca',
      authorRole: 'Pegiat Jurnalistik',
      timeAgo: 'Kemarin',
      content: `Bagi rekan-rekan yang ingin mengirimkan tulisan bertema opini kebijakan publik atau sosial kemasyarakatan, data empiris sangat menentukan bobot tulisan. 

Ada beberapa portal statistik terbuka resmi yang menyediakan data komprehensif. Menautkan data statistik resmi dalam esai opini akan membuat argumen kita jauh lebih berbobot dan terpercaya di mata kurator redaksi.`,
      excerpt: 'Bagi rekan-rekan yang ingin mengirimkan tulisan bertema opini kebijakan publik atau sosial kemasyarakatan, data empiris sangat menentukan bobot tulisan...',
      likesCount: 36,
      isLiked: false,
      isMyThread: false,
      participants: ['BS', 'RH'],
      replies: []
    },
    {
      id: 'th-5',
      type: 'private',
      typeLabel: '🔒 PRIVATE',
      category: 'bedah_karya',
      categoryLabel: 'Bedah Karya',
      title: '[Review Terbatas] Konsultasi Draf Bab 1 Buku Panduan Literasi Menulis Pelajar',
      author: 'Budi Santoso, M.Pd',
      authorAvatar: 'BS',
      authorColor: '#0f766e',
      authorRole: 'Pendidik Literasi',
      timeAgo: '2 hari yang lalu',
      content: `Undangan konsultasi terbatas untuk Mas Rahmat dan Mbak Sarah. Berikut kami lampirkan draf pembuka bab metode membiasakan menulis bagi pelajar sekolah menengah. 

Apakah metafora yang digunakan sudah ramah dipahami oleh pembaca pemula tanpa terasa menggurui? Mohon ulasan kritisnya.`,
      excerpt: 'Undangan konsultasi terbatas untuk Mas Rahmat dan Mbak Sarah. Berikut kami lampirkan draf pembuka bab metode membiasakan menulis bagi pelajar pemula...',
      likesCount: 14,
      isLiked: false,
      isMyThread: false,
      participants: ['RH', 'SM'],
      replies: [
        {
          id: 'rep-5',
          author: 'Dr. Rahmat Hidayat',
          authorAvatar: 'RH',
          authorColor: '#1e3a8a',
          timeAgo: '1 hari yang lalu',
          text: 'Metafora pohon aksara di halaman 3 sangat komunikatif Pak Budi. Sedikit catatan pada istilah pedagogik asing agar dilengkapi padanan kata bahasa Indonesianya.'
        }
      ]
    },
    {
      id: 'th-6',
      type: 'public',
      typeLabel: '🌐 PUBLIK',
      category: 'elearning',
      categoryLabel: 'Seputar E-Learning',
      title: 'Tips Memaksimalkan Pemahaman Modul 5: Kurasi dan Verifikasi Orisinalitas',
      author: 'Suryadi Ningrat',
      authorAvatar: 'SN',
      authorColor: '#475569',
      authorRole: 'Penulis Sejarah',
      timeAgo: '3 hari yang lalu',
      content: `Banyak anggota yang menanyakan kiat menghadapi kuis dan tugas akhir di Modul 5 E-Learning. 

Kuncinya terletak pada kecermatan kita membedakan antara penyuntingan substansi gagasan versus perapian mekanik tata bahasa PUEBI. Jangan lupa perhatikan standar parafrase agar terbebas dari indikasi kesamaan teks.`,
      excerpt: 'Banyak anggota yang menanyakan kiat menghadapi kuis dan tugas akhir di Modul 5 E-Learning. Kuncinya terletak pada kecermatan membedakan penyuntingan...',
      likesCount: 52,
      isLiked: false,
      isMyThread: false,
      participants: ['AF', 'BS', 'SM'],
      replies: [
        {
          id: 'rep-6',
          author: 'Anisa Fitriani',
          authorAvatar: 'AF',
          authorColor: '#831843',
          timeAgo: '2 hari yang lalu',
          text: 'Terima kasih banyak atas pencerahannya Pak Suryadi! Penjelasan tentang parafrase ide sangat membantu pengerjaan draf artikel saya.'
        }
      ]
    }
  ];

  // --- State Variables ---
  let activeTabFilter = 'all'; // 'all' | 'public' | 'private' | 'my'
  let activeCategoryFilter = 'all';
  let activeSearchQuery = '';
  let currentActiveThread = null;
  const invitedMembersSet = new Set(['Sarah Melati', 'Budi Santoso']);

  // --- DOM Elements ---
  const threadsFeedList = document.getElementById('threadsFeedList');
  const filterPills = document.querySelectorAll('.kom-filter-pill');
  const categorySelect = document.getElementById('categoryFilterSelect');
  const searchInput = document.getElementById('komSearchInput');
  const komToast = document.getElementById('komToast');
  const toastMessage = document.getElementById('toastMessage');

  // Stats Counters DOM
  const statTotalThreads = document.getElementById('statTotalThreads');
  const statPublicThreads = document.getElementById('statPublicThreads');
  const statPrivateThreads = document.getElementById('statPrivateThreads');
  const myThreadsCountPill = document.getElementById('myThreadsCountPill');

  // Modal 1: Create Thread DOM
  const btnOpenCreateThread = document.getElementById('btnOpenCreateThread');
  const createThreadModal = document.getElementById('createThreadModal');
  const createThreadModalClose = document.getElementById('createThreadModalClose');
  const btnCancelCreateThread = document.getElementById('btnCancelCreateThread');
  const btnSubmitCreateThread = document.getElementById('btnSubmitCreateThread');
  const threadTitleInput = document.getElementById('threadTitleInput');
  const threadCategorySelect = document.getElementById('threadCategorySelect');
  const threadContentTextarea = document.getElementById('threadContentTextarea');
  const radioTypeCards = document.querySelectorAll('.radio-type-card');
  const inviteMembersWrap = document.getElementById('inviteMembersWrap');
  const inviteChips = document.querySelectorAll('.invite-chip');

  // Modal 2: Thread Detail DOM
  const threadDetailModal = document.getElementById('threadDetailModal');
  const threadDetailModalClose = document.getElementById('threadDetailModalClose');
  const detailBadgeType = document.getElementById('detailBadgeType');
  const detailBadgeCategory = document.getElementById('detailBadgeCategory');
  const detailAuthorAvatar = document.getElementById('detailAuthorAvatar');
  const detailAuthorName = document.getElementById('detailAuthorName');
  const detailPostTime = document.getElementById('detailPostTime');
  const detailThreadTitle = document.getElementById('detailThreadTitle');
  const detailContentText = document.getElementById('detailContentText');
  const detailRepliesCount = document.getElementById('detailRepliesCount');
  const detailRepliesList = document.getElementById('detailRepliesList');
  const replyInputText = document.getElementById('replyInputText');
  const btnSubmitReply = document.getElementById('btnSubmitReply');
  const btnLikeInsideModal = document.getElementById('btnLikeInsideModal');
  const modalLikesCount = document.getElementById('modalLikesCount');

  // --- Functions ---

  // Toast Utility
  function showToast(msg, duration = 3000) {
    if (!komToast) return;
    toastMessage.textContent = msg;
    komToast.classList.add('active');
    setTimeout(() => {
      komToast.classList.remove('active');
    }, duration);
  }

  // Update Stats Counters
  function updateStatsCounters() {
    const total = threadsData.length;
    const publicCount = threadsData.filter(t => t.type === 'public').length;
    const privateCount = threadsData.filter(t => t.type === 'private').length;
    const myCount = threadsData.filter(t => t.isMyThread).length;

    if (statTotalThreads) statTotalThreads.textContent = total;
    if (statPublicThreads) statPublicThreads.textContent = publicCount;
    if (statPrivateThreads) statPrivateThreads.textContent = privateCount;
    if (myThreadsCountPill) myThreadsCountPill.textContent = myCount;
  }

  // Render Thread Cards
  function renderThreads() {
    if (!threadsFeedList) return;

    const filtered = threadsData.filter(item => {
      // Tab filter
      if (activeTabFilter === 'public' && item.type !== 'public') return false;
      if (activeTabFilter === 'private' && item.type !== 'private') return false;
      if (activeTabFilter === 'my' && !item.isMyThread) return false;

      // Category filter
      if (activeCategoryFilter !== 'all' && item.category !== activeCategoryFilter) return false;

      // Search query
      if (activeSearchQuery.trim() !== '') {
        const query = activeSearchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchAuthor = item.author.toLowerCase().includes(query);
        const matchContent = item.content.toLowerCase().includes(query);
        if (!matchTitle && !matchAuthor && !matchContent) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      threadsFeedList.innerHTML = `
        <div style="text-align: center; padding: 4rem 1.5rem; background: #ffffff; border-radius: 18px; border: 1px dashed var(--border-medium);">
          <div style="font-size: 2.75rem; margin-bottom: 0.75rem;">💬</div>
          <h3 style="font-size: 1.125rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Tidak Ditemukan Diskusi</h3>
          <p style="font-size: 0.875rem; color: var(--text-muted); max-width: 420px; margin: 0 auto 1.5rem;">
            Tidak ada topik diskusi yang sesuai dengan filter atau kata kunci pencarian Anda. Silakan mulai diskusi baru!
          </p>
          <button class="btn-create-thread-hero" onclick="document.getElementById('btnOpenCreateThread').click();" style="display: inline-flex; width: auto; margin: 0 auto;">
            + Mulai Diskusi Baru
          </button>
        </div>
      `;
      return;
    }

    threadsFeedList.innerHTML = filtered.map(thread => {
      const isPub = thread.type === 'public';
      const badgeClass = isPub ? 'public' : 'private';
      const likeClass = thread.isLiked ? 'liked' : '';
      const likeFill = thread.isLiked ? 'currentColor' : 'none';

      const stackedHtml = thread.participants.map((p, idx) => {
        const bgColors = ['#1e3a8a', '#059669', '#d97706', '#831843', '#4f46e5'];
        const color = bgColors[idx % bgColors.length];
        return `<div class="avatar-stack-item" style="background: ${color};">${p}</div>`;
      }).join('');

      return `
        <article class="thread-card" data-thread-id="${thread.id}">
          <div class="thread-header-row">
            <div class="thread-author-wrap">
              <div class="thread-author-avatar" style="background: ${thread.authorColor};">
                ${thread.authorAvatar}
              </div>
              <div class="thread-author-meta">
                <span class="thread-author-name">${thread.author}</span>
                <span class="thread-post-time">${thread.authorRole} • ${thread.timeAgo}</span>
              </div>
            </div>
            <div class="thread-badges-wrap">
              <span class="badge-thread-category">${thread.categoryLabel}</span>
              <span class="badge-thread-type ${badgeClass}">${thread.typeLabel}</span>
            </div>
          </div>

          <h2 class="thread-title">${thread.title}</h2>
          <p class="thread-excerpt">${thread.excerpt}</p>

          <div class="thread-card-footer">
            <div class="thread-participants-wrap">
              <div class="stacked-avatars">${stackedHtml}</div>
              <span style="font-size: 0.75rem; color: #64748b; font-weight: 500;">
                ${thread.participants.length} Penulis Berpartisipasi
              </span>
            </div>

            <div class="thread-meta-actions">
              <button class="btn-thread-stat ${likeClass}" data-action="like" data-thread-id="${thread.id}" aria-label="Apresiasi Thread">
                <svg width="17" height="17" fill="${likeFill}" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span class="likes-count-val">${thread.likesCount}</span>
              </button>

              <button class="btn-thread-stat" data-action="open" data-thread-id="${thread.id}" aria-label="Komentar Thread">
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>${thread.replies.length} Balasan</span>
              </button>

              <button class="btn-open-thread" data-action="open" data-thread-id="${thread.id}">
                <span>Buka Diskusi</span>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    attachThreadCardEvents();
  }

  // Attach card click & action events
  function attachThreadCardEvents() {
    document.querySelectorAll('.thread-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking like button, don't open modal
        if (e.target.closest('[data-action="like"]')) return;
        const threadId = card.getAttribute('data-thread-id');
        const thread = threadsData.find(t => t.id === threadId);
        if (thread) openThreadDetailModal(thread);
      });
    });

    // Like buttons
    document.querySelectorAll('.btn-thread-stat[data-action="like"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const threadId = btn.getAttribute('data-thread-id');
        const thread = threadsData.find(t => t.id === threadId);
        if (thread) {
          thread.isLiked = !thread.isLiked;
          thread.likesCount += thread.isLiked ? 1 : -1;
          showToast(thread.isLiked 
            ? `Apresiasi diberikan untuk "${thread.title.substring(0, 35)}..."` 
            : `Apresiasi ditarik kembali.`
          );
          renderThreads();
        }
      });
    });
  }

  // Tab Filtering
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTabFilter = pill.getAttribute('data-filter');
      renderThreads();
    });
  });

  // Category Filtering
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      activeCategoryFilter = e.target.value;
      renderThreads();
    });
  }

  // Search Input Filtering
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value;
      renderThreads();
    });
  }

  // Follow/Unfollow Author Buttons
  document.querySelectorAll('.btn-follow-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const isFollowing = btn.classList.contains('following');
      const authorName = btn.getAttribute('data-author');
      if (isFollowing) {
        btn.classList.remove('following');
        btn.textContent = '+ Ikuti';
        showToast(`Berhenti mengikuti ${authorName}.`);
      } else {
        btn.classList.add('following');
        btn.textContent = '✓ Mengikuti';
        showToast(`Anda sekarang mengikuti ${authorName}. Notifikasi karya baru aktif.`);
      }
    });
  });

  // Trending Topic Badges Click
  document.querySelectorAll('.trending-topic-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const cat = tag.getAttribute('data-category');
      if (cat && categorySelect) {
        categorySelect.value = cat;
        activeCategoryFilter = cat;
        renderThreads();
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }
    });
  });

  // --- MODAL 1: BUAT DISKUSI BARU (KM-03 & KM-04) ---
  let selectedThreadType = 'public';

  if (btnOpenCreateThread) {
    btnOpenCreateThread.addEventListener('click', () => {
      if (createThreadModal) createThreadModal.classList.add('active');
    });
  }

  function closeCreateModal() {
    if (createThreadModal) createThreadModal.classList.remove('active');
  }

  if (createThreadModalClose) createThreadModalClose.addEventListener('click', closeCreateModal);
  if (btnCancelCreateThread) btnCancelCreateThread.addEventListener('click', closeCreateModal);

  // Radio selection (Publik vs Private)
  radioTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      radioTypeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedThreadType = card.getAttribute('data-type');

      if (inviteMembersWrap) {
        inviteMembersWrap.style.display = (selectedThreadType === 'private') ? 'block' : 'none';
      }
    });
  });

  // Member invitation chips
  inviteChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const member = chip.getAttribute('data-member');
      if (invitedMembersSet.has(member)) {
        invitedMembersSet.delete(member);
        chip.classList.remove('selected');
      } else {
        invitedMembersSet.add(member);
        chip.classList.add('selected');
      }
    });
  });

  // Submit New Thread
  if (btnSubmitCreateThread) {
    btnSubmitCreateThread.addEventListener('click', () => {
      const title = threadTitleInput ? threadTitleInput.value.trim() : '';
      const category = threadCategorySelect ? threadCategorySelect.value : 'bedah_karya';
      const content = threadContentTextarea ? threadContentTextarea.value.trim() : '';

      if (!title || !content) {
        showToast('Harap lengkapi judul dan konten diskusi!');
        return;
      }

      if (selectedThreadType === 'private' && invitedMembersSet.size < 2) {
        showToast('Untuk forum private, silakan pilih minimal 2 anggota undangan!');
        return;
      }

      // Map category label
      const categoryLabels = {
        'bedah_karya': 'Bedah Karya',
        'puebi': 'PUEBI & Tata Bahasa',
        'opini': 'Riset & Opini',
        'antologi': 'Kolaborasi Antologi',
        'elearning': 'Seputar E-Learning',
        'cerpen': 'Cerpen & Puisi'
      };

      const newThread = {
        id: `th-${Date.now()}`,
        type: selectedThreadType,
        typeLabel: selectedThreadType === 'public' ? '🌐 PUBLIK' : '🔒 PRIVATE',
        category: category,
        categoryLabel: categoryLabels[category] || 'Diskusi Umum',
        title: title,
        author: 'Rahmat Hidayat',
        authorAvatar: 'RH',
        authorColor: '#1e3a8a',
        authorRole: 'Penulis Terdaftar',
        timeAgo: 'Baru saja',
        content: content,
        excerpt: content.length > 140 ? content.substring(0, 140) + '...' : content,
        likesCount: 1,
        isLiked: true,
        isMyThread: true,
        participants: ['RH'],
        replies: []
      };

      // Add to front of dataset
      threadsData.unshift(newThread);
      updateStatsCounters();

      // Reset form
      if (threadTitleInput) threadTitleInput.value = '';
      if (threadContentTextarea) threadContentTextarea.value = '';
      closeCreateModal();

      showToast(`Diskusi baru "${title.substring(0, 30)}..." berhasil dipublikasikan!`);
      renderThreads();
    });
  }

  // --- MODAL 2: DETAIL DISKUSI & BALASAN (KM-05) ---
  function openThreadDetailModal(thread) {
    currentActiveThread = thread;

    if (detailBadgeType) {
      detailBadgeType.className = `badge-thread-type ${thread.type}`;
      detailBadgeType.textContent = thread.typeLabel;
    }
    if (detailBadgeCategory) detailBadgeCategory.textContent = thread.categoryLabel;
    if (detailAuthorAvatar) {
      detailAuthorAvatar.style.background = thread.authorColor;
      detailAuthorAvatar.textContent = thread.authorAvatar;
    }
    if (detailAuthorName) detailAuthorName.textContent = thread.author;
    if (detailPostTime) detailPostTime.textContent = `${thread.authorRole} • ${thread.timeAgo}`;
    if (detailThreadTitle) detailThreadTitle.textContent = thread.title;
    if (detailContentText) detailContentText.textContent = thread.content;

    updateModalLikes();
    renderModalReplies();

    if (threadDetailModal) threadDetailModal.classList.add('active');
  }

  function closeThreadDetailModal() {
    if (threadDetailModal) threadDetailModal.classList.remove('active');
  }

  if (threadDetailModalClose) threadDetailModalClose.addEventListener('click', closeThreadDetailModal);

  function updateModalLikes() {
    if (!currentActiveThread) return;
    if (modalLikesCount) modalLikesCount.textContent = currentActiveThread.likesCount;
    if (btnLikeInsideModal) {
      if (currentActiveThread.isLiked) {
        btnLikeInsideModal.classList.add('liked');
        btnLikeInsideModal.querySelector('svg').setAttribute('fill', 'currentColor');
      } else {
        btnLikeInsideModal.classList.remove('liked');
        btnLikeInsideModal.querySelector('svg').setAttribute('fill', 'none');
      }
    }
  }

  if (btnLikeInsideModal) {
    btnLikeInsideModal.addEventListener('click', () => {
      if (!currentActiveThread) return;
      currentActiveThread.isLiked = !currentActiveThread.isLiked;
      currentActiveThread.likesCount += currentActiveThread.isLiked ? 1 : -1;
      updateModalLikes();
      renderThreads();
      showToast(currentActiveThread.isLiked ? 'Apresiasi diberikan!' : 'Apresiasi ditarik.');
    });
  }

  function renderModalReplies() {
    if (!currentActiveThread || !detailRepliesList) return;
    if (detailRepliesCount) detailRepliesCount.textContent = currentActiveThread.replies.length;

    if (currentActiveThread.replies.length === 0) {
      detailRepliesList.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: #94a3b8; font-size: 0.875rem;">
          Belum ada tanggapan untuk diskusi ini. Jadilah yang pertama memberikan pandangan konstruktif!
        </div>
      `;
      return;
    }

    detailRepliesList.innerHTML = currentActiveThread.replies.map(rep => {
      return `
        <div class="reply-item-card">
          <div class="reply-item-header">
            <div class="reply-author-info">
              <div class="reply-author-avatar" style="background: ${rep.authorColor || '#1e3a8a'};">
                ${rep.authorAvatar}
              </div>
              <span style="font-size: 0.8125rem; font-weight: 700; color: var(--text-main);">${rep.author}</span>
            </div>
            <span style="font-size: 0.75rem; color: #94a3b8;">${rep.timeAgo}</span>
          </div>
          <div class="reply-text">${rep.text}</div>
        </div>
      `;
    }).join('');
  }

  // Submit Reply inside Modal
  if (btnSubmitReply && replyInputText) {
    btnSubmitReply.addEventListener('click', () => {
      const text = replyInputText.value.trim();
      if (!text) {
        showToast('Ketik tanggapan Anda terlebih dahulu!');
        return;
      }
      if (!currentActiveThread) return;

      const newReply = {
        id: `rep-${Date.now()}`,
        author: 'Rahmat Hidayat',
        authorAvatar: 'RH',
        authorColor: '#1e3a8a',
        timeAgo: 'Baru saja',
        text: text
      };

      currentActiveThread.replies.push(newReply);
      if (!currentActiveThread.participants.includes('RH')) {
        currentActiveThread.participants.push('RH');
      }

      replyInputText.value = '';
      renderModalReplies();
      renderThreads();
      showToast('Tanggapan berhasil dikirim!');
    });
  }

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === createThreadModal) closeCreateModal();
    if (e.target === threadDetailModal) closeThreadDetailModal();
  });

  // Mobile Menu Sidebar Toggle
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const sidebar = document.getElementById('sidebarLeft');
  const backdrop = document.getElementById('mobileBackdrop');

  if (menuToggleBtn && sidebar && backdrop) {
    menuToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('show');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('show');
    });
  }

  // Initial render
  updateStatsCounters();
  renderThreads();
});
