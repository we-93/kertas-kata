/**
 * KERTAS KATA - WRITING STUDIO (MINIMALIST DISTRACTION-FREE) LOGIC
 * Controls rich text formatting, real-time word statistics, tags, preview, and curation submission
 */

let currentArticleId = null;

document.addEventListener('DOMContentLoaded', async () => {
  initToolbar();
  initCounters();
  initAutoSave();
  initTagsManager();
  initPreviewModal();
  initSubmitWorkflow();
  initCoverUploadMock();
  initAutoResizeTextareas();

  // Integrasi Backend API: Pastikan login & load naskah jika ada id di URL
  if (window.KK_API) {
    await window.KK_API.auth.ensureUserAuth('participant');
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');
    if (editId) {
      loadArticleFromApi(editId);
    }
  }
});

async function loadArticleFromApi(articleId) {
  try {
    const res = await window.KK_API.articles.getById(articleId);
    if (res && res.success && res.data) {
      const art = res.data;
      currentArticleId = art.id;
      if (document.getElementById('authorTitle')) document.getElementById('authorTitle').value = art.title;
      if (document.getElementById('authorLead')) document.getElementById('authorLead').value = art.lead || '';
      if (document.getElementById('authorBody')) document.getElementById('authorBody').innerHTML = art.content || '';
      if (document.getElementById('widgetCategorySelect') && art.category) {
        document.getElementById('widgetCategorySelect').value = art.category;
      }
      if (document.getElementById('coverThumbnail') && art.coverUrl) {
        document.getElementById('coverThumbnail').src = art.coverUrl;
      }
      // Update counters & resize
      const title = document.getElementById('authorTitle');
      if (title) title.dispatchEvent(new Event('input'));
      showToast(`Draf "${art.title}" berhasil dimuat dari database.`);
    }
  } catch (err) {
    console.warn('Gagal memuat naskah dari API:', err.message);
  }
}

/* ==========================================================
   1. AUTO RESIZE TITLE & LEAD TEXTAREAS
   ========================================================== */
function initAutoResizeTextareas() {
  const title = document.getElementById('authorTitle');
  const lead = document.getElementById('authorLead');

  const resize = (el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  [title, lead].forEach(el => {
    if (el) {
      el.addEventListener('input', () => resize(el));
      resize(el);
    }
  });
}

/* ==========================================================
   2. RICH TEXT TOOLBAR CONTROLS
   ========================================================== */
function initToolbar() {
  const toolBtns = document.querySelectorAll('.tool-action-btn[data-command]');
  const editorBody = document.getElementById('authorBody');

  toolBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const command = btn.getAttribute('data-command');
      const val = btn.getAttribute('data-value') || null;

      if (command === 'createLink') {
        const url = prompt('Masukkan URL tautan:', 'https://');
        if (url && url !== 'https://') {
          document.execCommand(command, false, url);
        }
      } else if (command === 'insertImage') {
        const imgUrl = prompt('Masukkan URL gambar untuk disisipkan:', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80');
        if (imgUrl) {
          document.execCommand('insertHTML', false, `
            <div class="media-box" contenteditable="false">
              <img src="${imgUrl}" alt="Gambar Naskah">
              <div class="media-caption">Dokumentasi naskah (Foto: Rahmat H.)</div>
            </div>
            <p><br></p>
          `);
        }
      } else if (command === 'removeFormat') {
        document.execCommand('removeFormat', false, null);
        document.execCommand('formatBlock', false, 'p');
      } else if (command === 'formatBlock') {
        document.execCommand(command, false, val);
      } else {
        document.execCommand(command, false, null);
      }

      if (editorBody) editorBody.focus();
      updateCounters();
      updateToolbarActiveStates();
    });
  });

  document.addEventListener('selectionchange', () => {
    updateToolbarActiveStates();
  });
}

function updateToolbarActiveStates() {
  const commands = ['bold', 'italic', 'underline', 'strikeThrough'];
  commands.forEach(cmd => {
    const btn = document.querySelector(`.tool-action-btn[data-command="${cmd}"]`);
    if (btn) {
      if (document.queryCommandState(cmd)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
}

/* ==========================================================
   3. WORD & READ TIME COUNTERS
   ========================================================== */
function initCounters() {
  const title = document.getElementById('authorTitle');
  const lead = document.getElementById('authorLead');
  const body = document.getElementById('authorBody');

  const update = () => updateCounters();

  if (title) title.addEventListener('input', update);
  if (lead) lead.addEventListener('input', update);
  if (body) body.addEventListener('input', update);

  updateCounters();
}

function updateCounters() {
  const title = document.getElementById('authorTitle');
  const lead = document.getElementById('authorLead');
  const body = document.getElementById('authorBody');

  const text = ((title ? title.value : '') + ' ' + (lead ? lead.value : '') + ' ' + (body ? body.innerText : '')).trim();
  const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
  const readMins = Math.max(1, Math.ceil(words / 200));

  const totalWordsEl = document.getElementById('statTotalKata');
  const readTimeEl = document.getElementById('statEstimasiBaca');

  if (totalWordsEl) totalWordsEl.textContent = words.toLocaleString('id-ID');
  if (readTimeEl) readTimeEl.textContent = `~${readMins} mnt`;

  const checklistWord = document.getElementById('checkMinWords');
  if (checklistWord) {
    if (words >= 500) {
      checklistWord.classList.add('valid');
      checklistWord.querySelector('.check-label').textContent = `Target kata terpenuhi (${words}/500 kata)`;
    } else {
      checklistWord.classList.remove('valid');
      checklistWord.querySelector('.check-label').textContent = `Panjang naskah (${words}/500 kata min.)`;
    }
  }
}

/* ==========================================================
   4. AUTO-SAVE LOGIC
   ========================================================== */
let autoSaveTimeout = null;

function initAutoSave() {
  const badge = document.getElementById('autoSavePill');

  const triggerSave = async () => {
    const title = document.getElementById('authorTitle')?.value?.trim() || '';
    const lead = document.getElementById('authorLead')?.value?.trim() || '';
    const content = document.getElementById('authorBody')?.innerHTML || '';
    const category = document.getElementById('widgetCategorySelect')?.value || 'Refleksi Pedagogik';
    const coverUrl = document.getElementById('coverThumbnail')?.src || null;
    const tags = Array.from(document.querySelectorAll('#tagPillsList .widget-tag-pill span:first-child')).map(s => s.textContent.replace('#', ''));

    if (window.KK_API && title) {
      try {
        const res = await window.KK_API.articles.save({
          id: currentArticleId,
          title,
          lead,
          content,
          category,
          coverUrl,
          tags,
        });
        if (res && res.success && res.data?.id) {
          currentArticleId = res.data.id;
        }
      } catch (err) {
        console.warn('Autosave API notice:', err.message);
      }
    }

    if (badge) {
      badge.classList.remove('saving');
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      badge.innerHTML = `
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        <span>Draf tersimpan di database (${timeStr} WIB)</span>
      `;
    }
  };

  const notifyTyping = () => {
    if (badge) {
      badge.classList.add('saving');
      badge.innerHTML = `
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>Menyimpan draf...</span>
      `;
    }
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(triggerSave, 2000);
  };

  const title = document.getElementById('authorTitle');
  const lead = document.getElementById('authorLead');
  const body = document.getElementById('authorBody');

  [title, lead, body].forEach(el => {
    if (el) el.addEventListener('input', notifyTyping);
  });

  // Periodic Auto-save
  setInterval(triggerSave, 30000);
}

/* ==========================================================
   5. TAGS MANAGER
   ========================================================== */
function initTagsManager() {
  const input = document.getElementById('widgetTagInput');
  const container = document.getElementById('tagPillsList');
  if (!input || !container) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.value.trim().replace(/^#/, '');
      if (val) {
        addTag(val);
        input.value = '';
      }
    }
  });

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('widget-tag-pill-remove')) {
      e.target.closest('.widget-tag-pill').remove();
    }
  });
}

function addTag(tagName) {
  const container = document.getElementById('tagPillsList');
  const existingTags = container.querySelectorAll('.widget-tag-pill');
  if (existingTags.length >= 6) {
    showToast('⚠️ Maksimal 5-6 tag per naskah.');
    return;
  }

  const pill = document.createElement('span');
  pill.className = 'widget-tag-pill';
  pill.innerHTML = `
    <span>#${tagName}</span>
    <span class="widget-tag-pill-remove" title="Hapus tag">&times;</span>
  `;
  container.appendChild(pill);
}

/* ==========================================================
   6. COVER IMAGE UPLOAD MOCK
   ========================================================== */
function initCoverUploadMock() {
  const dropBox = document.getElementById('coverUploadBox');
  if (!dropBox) return;

  dropBox.addEventListener('click', () => {
    const url = prompt('Masukkan URL foto sampul (atau gunakan gambar default):', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80');
    if (url) {
      const img = document.getElementById('coverThumbnail');
      if (img) img.src = url;
      showToast('✓ Gambar sampul artikel diperbarui!');
    }
  });
}

/* ==========================================================
   7. PREVIEW MODAL
   ========================================================== */
function initPreviewModal() {
  const previewBtn = document.getElementById('btnMinimalPreview');
  const modal = document.getElementById('previewModal');
  const closeBtn = document.getElementById('closePreviewBtn');

  if (previewBtn && modal) {
    previewBtn.addEventListener('click', () => {
      populatePreview();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

function populatePreview() {
  const title = document.getElementById('authorTitle').value || 'Judul Naskah Belum Diisi';
  const lead = document.getElementById('authorLead').value || '';
  const category = document.getElementById('widgetCategorySelect').value || 'Refleksi Pedagogik';
  const bodyHtml = document.getElementById('authorBody').innerHTML;
  const coverSrc = document.getElementById('coverThumbnail').src;

  const tagPills = document.querySelectorAll('#tagPillsList .widget-tag-pill span:first-child');
  let tagsHtml = '';
  tagPills.forEach(tp => {
    tagsHtml += `<span class="widget-tag-pill">${tp.textContent}</span>`;
  });

  document.getElementById('modalPreviewCategory').textContent = category;
  document.getElementById('modalPreviewTitle').textContent = title;
  document.getElementById('modalPreviewCover').src = coverSrc;
  document.getElementById('modalPreviewContent').innerHTML = `
    ${lead ? `<p style="font-size: 1.125rem; font-weight: 500; color: #475569; font-style: italic; margin-bottom: 1.5rem; line-height: 1.7;">${lead}</p>` : ''}
    ${bodyHtml}
  `;
  document.getElementById('modalPreviewTags').innerHTML = tagsHtml;
}

/* ==========================================================
   8. SUBMISSION TO KURATOR WORKFLOW
   ========================================================== */
function initSubmitWorkflow() {
  const submitBtn = document.getElementById('btnMinimalSubmit');
  const confirmModal = document.getElementById('confirmSubmitModal');
  const cancelBtn = document.getElementById('cancelSubmitBtn');
  const confirmBtn = document.getElementById('finalConfirmSubmitBtn');

  if (submitBtn && confirmModal) {
    submitBtn.addEventListener('click', () => {
      const title = document.getElementById('authorTitle').value.trim();
      if (!title) {
        showToast('⚠️ Judul artikel belum diisi!');
        document.getElementById('authorTitle').focus();
        return;
      }
      confirmModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (cancelBtn && confirmModal) {
    cancelBtn.addEventListener('click', () => {
      confirmModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (confirmBtn && confirmModal) {
    confirmBtn.addEventListener('click', async () => {
      confirmModal.classList.remove('active');
      document.body.style.overflow = '';

      // Simpan draf terlebih dahulu untuk memastikan data terbaru di database
      const title = document.getElementById('authorTitle')?.value?.trim() || 'Naskah Baru';
      const lead = document.getElementById('authorLead')?.value?.trim() || '';
      const content = document.getElementById('authorBody')?.innerHTML || '';
      const category = document.getElementById('widgetCategorySelect')?.value || 'Refleksi Pedagogik';
      const coverUrl = document.getElementById('coverThumbnail')?.src || null;
      const tags = Array.from(document.querySelectorAll('#tagPillsList .widget-tag-pill span:first-child')).map(s => s.textContent.replace('#', ''));

      if (window.KK_API) {
        try {
          showToast('⏳ Menyimpan dan mengirim naskah ke meja kurator...');
          const saveRes = await window.KK_API.articles.save({
            id: currentArticleId,
            title,
            lead,
            content,
            category,
            coverUrl,
            tags,
          });

          const articleIdToSubmit = saveRes?.data?.id || currentArticleId;
          if (articleIdToSubmit) {
            await window.KK_API.articles.submitReview(articleIdToSubmit);
          }

          submitBtn.innerHTML = `
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Terkirim (In Review)</span>
          `;
          submitBtn.style.background = '#059669';

          showToast('🎉 Naskah berhasil masuk ke Meja Kurasi Admin! Mengalihkan ke Publikasi Saya...');
          setTimeout(() => {
            window.location.href = 'publikasi.html';
          }, 1500);
          return;
        } catch (err) {
          showToast(`⚠️ ${err.message || 'Gagal mengirim naskah.'}`);
          return;
        }
      }

      // Fallback
      submitBtn.innerHTML = `
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        <span>Terkirim (In Review)</span>
      `;
      submitBtn.style.background = '#059669';
      showToast('🎉 Naskah berhasil dikirim ke Meja Kurasi Admin!');
    });
  }
}

/* ==========================================================
   9. TOAST NOTIFICATION UTILITY
   ========================================================== */
function showToast(msg) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #ffffff;
      padding: 0.875rem 1.25rem;
      border-radius: 12px;
      font-size: 0.8125rem;
      font-weight: 500;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-left: 4px solid #2563eb;
      transform: translateY(30px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(30px)';
    toast.style.opacity = '0';
  }, 4000);
}
