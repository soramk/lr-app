/**
 * feature_pronunciation_notes.js
 * 発音ノート機能
 * 各単語にメモを追加できる機能
 */

(function() {
    const STORAGE_KEY = 'lr_pronunciation_notes_enabled';
    const NOTES_DATA_KEY = 'lr_pronunciation_notes_data';

    let notesData = {};

    function loadNotesData() {
        try {
            const saved = localStorage.getItem(NOTES_DATA_KEY);
            if (saved) {
                notesData = JSON.parse(saved);
            }
        } catch(e) {
            console.error("Failed to load notes data:", e);
        }
    }

    function saveNotesData() {
        try {
            localStorage.setItem(NOTES_DATA_KEY, JSON.stringify(notesData));
        } catch(e) {
            console.error("Failed to save notes data:", e);
        }
    }

    function isEnabled() {
        return typeof window.getFeatureDefault === 'function'
            ? window.getFeatureDefault(STORAGE_KEY)
            : (localStorage.getItem(STORAGE_KEY) === 'true');
    }

    function getNoteKey(word, category) {
        return `${category}:${word}`;
    }

    function generateId() {
        return 'n_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    }

    function formatTimestamp() {
        try {
            return new Date().toLocaleString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch(e) {
            return new Date().toISOString();
        }
    }

    // 内部データを常に配列形式に正規化
    // ノート1件の形式: { id, type: 'user' | 'ai', text, ts }
    function getNoteList(word, category) {
        const key = getNoteKey(word, category);
        const raw = notesData[key];
        if (!raw) return [];

        if (Array.isArray(raw)) {
            return raw.map(entry => {
                if (!entry.id) entry.id = generateId();
                return entry;
            });
        }

        const list = [];

        if (typeof raw === 'string') {
            // 旧形式: 文字列
            list.push({
                id: generateId(),
                type: 'user',
                text: raw,
                ts: formatTimestamp()
            });
        } else if (typeof raw === 'object') {
            // 旧形式: { userNote, aiAdvice }
            if (raw.userNote) {
                list.push({
                    id: generateId(),
                    type: 'user',
                    text: raw.userNote,
                    ts: formatTimestamp()
                });
            }
            if (raw.aiAdvice) {
                list.push({
                    id: generateId(),
                    type: 'ai',
                    text: raw.aiAdvice,
                    ts: formatTimestamp()
                });
            }
        }

        notesData[key] = list;
        return list;
    }

    // テキストエリア用にユーザーメモのみ結合して返す
    function getNote(word, category) {
        const list = getNoteList(word, category);
        const userTexts = list
            .filter(entry => entry.type === 'user')
            .map(entry => entry.text);
        return userTexts.join('\n\n');
    }

    function saveNote(word, category, note) {
        const key = getNoteKey(word, category);
        const currentList = getNoteList(word, category);

        if (note.trim()) {
            const userEntry = {
                id: generateId(),
                type: 'user',
                text: note.trim(),
                ts: formatTimestamp()
            };
            const others = currentList.filter(entry => entry.type !== 'user');
            notesData[key] = [...others, userEntry];
        } else {
            const others = currentList.filter(entry => entry.type !== 'user');
            if (others.length > 0) {
                notesData[key] = others;
            } else {
                delete notesData[key];
            }
        }
        saveNotesData();
    }

    // AIアドバイスを自動追記（履歴として残す）
    function appendAIAdvice(word, category, advice) {
        if (!isEnabled() || !advice || !advice.trim()) return;

        const key = getNoteKey(word, category);
        const currentList = getNoteList(word, category);

        const aiEntry = {
            id: generateId(),
            type: 'ai',
            text: advice.trim(),
            ts: formatTimestamp()
        };

        notesData[key] = [...currentList, aiEntry];
        saveNotesData();
        updateNoteDisplay();
    }

    // 現在の単語キーを取得
    function getCurrentKey() {
        if (!(window.targetObj && window.targetObj.w && window.currentCategory)) return null;
        return getNoteKey(window.targetObj.w, window.currentCategory);
    }

    function openNotesWindow() {
        if (!isEnabled()) return;
        const key = getCurrentKey();
        if (!key) return;

        const word = window.targetObj.w;
        const category = window.currentCategory;
        const list = getNoteList(word, category);

        let overlay = document.getElementById('pronunciation-notes-modal');
        if (overlay) overlay.remove();

        overlay = document.createElement('div');
        overlay.id = 'pronunciation-notes-modal';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: var(--bg);
            color: var(--text);
            padding: 16px;
            border-radius: 10px;
            width: min(480px, 90vw);
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        `;

        const title = document.createElement('div');
        title.style.cssText = 'font-weight:bold; margin-bottom:8px;';
        title.textContent = `発音ノート一覧: ${word} (${category})`;

        const listContainer = document.createElement('div');
        listContainer.style.cssText = 'flex:1; overflow:auto; border:1px solid rgba(128,128,128,0.3); border-radius:6px; padding:8px; margin-bottom:8px; background: rgba(0,0,0,0.02);';

        if (list.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = 'メモはまだありません。';
            empty.style.opacity = '0.7';
            listContainer.appendChild(empty);
        } else {
            list
                .sort((a, b) => (a.ts || '').localeCompare(b.ts || ''))
                .forEach(entry => {
                    const row = document.createElement('div');
                    row.style.cssText = 'display:flex; align-items:flex-start; gap:6px; margin-bottom:6px;';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.dataset.noteId = entry.id;
                    checkbox.style.marginTop = '4px';

                    const body = document.createElement('div');
                    const label = entry.type === 'ai' ? '💡 AI' : '✏️ メモ';
                    const ts = entry.ts ? ` (${entry.ts})` : '';
                    body.innerHTML = `<div style="font-size:0.8rem; opacity:0.8;">${label}${ts}</div><div style="font-size:0.9rem;">${entry.text.replace(/\n/g, '<br>')}</div>`;

                    row.appendChild(checkbox);
                    row.appendChild(body);
                    listContainer.appendChild(row);
                });
        }

        const buttonRow = document.createElement('div');
        buttonRow.style.cssText = 'display:flex; justify-content:flex-end; gap:8px; margin-top:4px;';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑 選択したメモを削除';
        deleteBtn.className = 'btn-small';
        deleteBtn.onclick = function() {
            const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]:checked');
            if (checkboxes.length === 0) {
                alert('削除するメモを選択してください。');
                return;
            }
            const idsToDelete = Array.from(checkboxes).map(cb => cb.dataset.noteId);
            const currentList = getNoteList(word, category);
            const remaining = currentList.filter(entry => !idsToDelete.includes(entry.id));
            if (remaining.length > 0) {
                notesData[key] = remaining;
            } else {
                delete notesData[key];
            }
            saveNotesData();
            updateNoteDisplay();
            overlay.remove();
        };

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '閉じる';
        closeBtn.className = 'btn-small';
        closeBtn.onclick = function() {
            overlay.remove();
        };

        buttonRow.appendChild(deleteBtn);
        buttonRow.appendChild(closeBtn);

        modal.appendChild(title);
        modal.appendChild(listContainer);
        modal.appendChild(buttonRow);

        overlay.appendChild(modal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        document.body.appendChild(overlay);
    }

    // ノート表示エリアを追加
    function injectNoteArea() {
        if (!isEnabled()) return;

        const feedbackArea = document.getElementById('feedback-area');
        if (!feedbackArea || document.getElementById('pronunciation-note-area')) return;

        const noteArea = document.createElement('div');
        noteArea.id = 'pronunciation-note-area';
        noteArea.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 8px;
            border-left: 3px solid var(--primary);
        `;

        const noteDisplay = document.createElement('div');
        noteDisplay.id = 'pronunciation-note-display';
        noteDisplay.style.cssText = `
            font-size: 0.9rem;
            color: var(--text);
            margin-bottom: 8px;
            min-height: 20px;
        `;

        const noteInput = document.createElement('textarea');
        noteInput.id = 'pronunciation-note-input';
        noteInput.placeholder = 'この単語についてのメモを入力...';
        noteInput.style.cssText = `
            width: 100%;
            min-height: 60px;
            padding: 8px;
            border-radius: 6px;
            border: 1px solid rgba(128,128,128,0.3);
            background: var(--bg);
            color: var(--text);
            font-size: 0.9rem;
            resize: vertical;
            display: none;
        `;

        const noteButtons = document.createElement('div');
        noteButtons.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;';

        const editBtn = document.createElement('button');
        editBtn.innerText = '📝 メモを編集';
        editBtn.className = 'btn-small';
        editBtn.onclick = function() {
            noteDisplay.style.display = 'none';
            noteInput.style.display = 'block';
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
        };

        const saveBtn = document.createElement('button');
        saveBtn.innerText = '💾 保存';
        saveBtn.className = 'btn-small';
        saveBtn.style.display = 'none';
        saveBtn.onclick = function() {
            if (window.targetObj && window.targetObj.w && window.currentCategory) {
                saveNote(window.targetObj.w, window.currentCategory, noteInput.value);
                updateNoteDisplay();
                noteInput.style.display = 'none';
                noteDisplay.style.display = 'block';
                editBtn.style.display = 'inline-block';
                saveBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
            }
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'キャンセル';
        cancelBtn.className = 'btn-small';
        cancelBtn.style.display = 'none';
        cancelBtn.onclick = function() {
            noteInput.style.display = 'none';
            noteDisplay.style.display = 'block';
            editBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
            updateNoteDisplay();
        };

        noteButtons.appendChild(editBtn);
        noteButtons.appendChild(saveBtn);
        noteButtons.appendChild(cancelBtn);

        // メモを別ウィンドウ（モーダル）で表示
        const windowBtn = document.createElement('button');
        windowBtn.innerText = '🔍 メモを別ウィンドウで表示';
        windowBtn.className = 'btn-small';
        windowBtn.onclick = function() {
            openNotesWindow();
        };
        noteButtons.appendChild(windowBtn);

        noteArea.appendChild(noteDisplay);
        noteArea.appendChild(noteInput);
        noteArea.appendChild(noteButtons);

        feedbackArea.parentNode.insertBefore(noteArea, feedbackArea.nextSibling);

        // 単語が変わった時にノートを更新
        const originalNextQuestion = window.nextQuestion;
        if (originalNextQuestion) {
            window.nextQuestion = function() {
                originalNextQuestion();
                setTimeout(updateNoteDisplay, 100);
            };
        }

        updateNoteDisplay();
    }

    function updateNoteDisplay() {
        if (!isEnabled()) return;

        const noteDisplay = document.getElementById('pronunciation-note-display');
        const noteInput = document.getElementById('pronunciation-note-input');
        if (!noteDisplay || !noteInput) return;

        if (window.targetObj && window.targetObj.w && window.currentCategory) {
            const word = window.targetObj.w;
            const category = window.currentCategory;
            const list = getNoteList(word, category);
            const userText = getNote(word, category);

            if (list.length > 0) {
                let html = '<strong>📝 メモ履歴:</strong><br>';
                list
                    .sort((a, b) => (a.ts || '').localeCompare(b.ts || ''))
                    .forEach(entry => {
                        const label = entry.type === 'ai' ? '💡 AIアドバイス' : 'ユーザーメモ';
                        const ts = entry.ts ? ` (${entry.ts})` : '';
                        html += `<div style="margin-top:4px;"><span style="font-weight:bold;">${label}${ts}:</span> ${entry.text.replace(/\n/g, '<br>')}</div>`;
                    });
                noteDisplay.innerHTML = html;
                noteInput.value = userText;
            } else {
                noteDisplay.innerHTML = '';
                noteInput.value = '';
            }
        } else {
            noteDisplay.innerHTML = '';
            noteInput.value = '';
        }
    }

    // 既存のロジックをフックしてAIアドバイスを自動追記
    function hookResultHandling() {
        const originalHandleResult = window.handleResult;
        if (originalHandleResult) {
            window.handleResult = function(result) {
                originalHandleResult(result);
                
                if (!result || !window.targetObj || !window.targetObj.w || !window.currentCategory) return;

                // 通常モード: 不正解のときだけメモを残す
                // 音声精密スコアモード: 正解・不正解どちらでも詳細アドバイスをメモに残す
                const strictMode = !!window.phonemeStrictMode;
                if (!strictMode && result.isCorrect) return;

                const lines = [];
                
                if (result.advice) {
                    lines.push(result.advice);
                }
                
                if (Array.isArray(result.phonemeScores) && result.phonemeScores.length) {
                    lines.push('【音素ごとの評価】');
                    result.phonemeScores.forEach(p => {
                        if (!p || !p.symbol) return;
                        const s = (typeof p.score === 'number') ? p.score : '-';
                        const issue = p.issue || '';
                        lines.push(`・${p.symbol}: ${s}点${issue ? ` - ${issue}` : ''}`);
                    });
                }
                
                if (Array.isArray(result.practiceTips) && result.practiceTips.length) {
                    lines.push('【具体的な練習方法】');
                    result.practiceTips.forEach(tip => {
                        if (!tip) return;
                        lines.push(`・${tip}`);
                    });
                }
                
                const combinedAdvice = lines.join('\n').trim();
                if (combinedAdvice) {
                    appendAIAdvice(window.targetObj.w, window.currentCategory, combinedAdvice);
                }
            };
        }
    }

    // 設定画面にトグルを追加
    function injectSettingsToggle() {
        const settingsBody = document.querySelector('#settings-modal .modal-content div[style*="overflow"]');
        if (!settingsBody || document.getElementById('setting-notes-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'setting-notes-wrapper';
        wrapper.style.marginBottom = '15px';
        wrapper.style.padding = '10px';
        wrapper.style.background = 'rgba(128,128,128,0.05)';
        wrapper.style.borderRadius = '8px';

        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.cursor = 'pointer';
        label.style.fontWeight = 'bold';
        label.style.fontSize = '0.9rem';
        label.style.color = 'var(--text)';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'toggle-notes';
        checkbox.style.marginRight = '10px';
        checkbox.checked = isEnabled();

        checkbox.onchange = function() {
            localStorage.setItem(STORAGE_KEY, checkbox.checked);
            if (checkbox.checked) {
                setTimeout(injectNoteArea, 500);
            } else {
                const noteArea = document.getElementById('pronunciation-note-area');
                if (noteArea) noteArea.remove();
            }
        };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode("📝 発音ノート機能を有効にする"));
        wrapper.appendChild(label);

        const desc = document.createElement('p');
        desc.style.fontSize = '0.8rem';
        desc.style.margin = '5px 0 0 25px';
        desc.style.opacity = '0.7';
        desc.innerText = "各単語にメモを追加して、自分なりの発音のコツを記録できます。";
        wrapper.appendChild(desc);

        const reminderSection = document.getElementById('setting-reminder-wrapper');
        if (reminderSection) {
            reminderSection.parentNode.insertBefore(wrapper, reminderSection.nextSibling);
        } else {
            settingsBody.appendChild(wrapper);
        }
    }

    window.addEventListener('load', () => {
        loadNotesData();
        hookResultHandling();
        setTimeout(() => {
            injectSettingsToggle();
            if (isEnabled()) {
                setTimeout(injectNoteArea, 1500);
            }
        }, 1000);
    });
})();

