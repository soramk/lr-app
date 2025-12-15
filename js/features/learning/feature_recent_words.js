/**
 * feature_recent_words.js
 * 最近練習した単語をリストから選べる機能
 * - 発音/聞き取りどちらの結果もログに記録
 * - 「その他」メニューからモーダルで一覧表示し、クリックでその単語にジャンプ
 */

(function () {
    const STORAGE_KEY = 'lr_recent_words_enabled';
    const DATA_KEY = 'lr_recent_words_data';
    const MAX_ITEMS = 50;

    let recentData = {
        items: [] // { word, category, lastAt, correct, wrong }
    };

    function isEnabled() {
        return (typeof window.getFeatureDefault === 'function')
            ? window.getFeatureDefault(STORAGE_KEY)
            : (localStorage.getItem(STORAGE_KEY) === 'true');
    }

    function loadData() {
        try {
            const raw = localStorage.getItem(DATA_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.items)) {
                    recentData = parsed;
                }
            }
        } catch (e) {
            console.error('Failed to load recent words data:', e);
        }
    }

    function saveData() {
        try {
            localStorage.setItem(DATA_KEY, JSON.stringify(recentData));
        } catch (e) {
            console.error('Failed to save recent words data:', e);
        }
    }

    function logRecentWord(isCorrect) {
        if (!isEnabled()) return;
        if (!(window.targetObj && window.targetObj.w && window.currentCategory)) return;

        const word = window.targetObj.w;
        const category = window.currentCategory;
        const now = Date.now();

        let item = recentData.items.find(it => it.word === word && it.category === category);
        if (!item) {
            item = { word, category, lastAt: now, correct: 0, wrong: 0 };
            recentData.items.push(item);
        }

        item.lastAt = now;
        if (isCorrect) item.correct++; else item.wrong++;

        // 最近のものが上に来るようにソート
        recentData.items.sort((a, b) => (b.lastAt || 0) - (a.lastAt || 0));
        if (recentData.items.length > MAX_ITEMS) {
            recentData.items = recentData.items.slice(0, MAX_ITEMS);
        }

        saveData();
    }

    function formatTime(ts) {
        if (!ts) return '';
        try {
            return new Date(ts).toLocaleString('ja-JP', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '';
        }
    }

    function ensureSpeakingMode() {
        if (window.currentMode !== 'speaking' && typeof setMode === 'function') {
            setMode('speaking');
        }
    }

    function jumpToWord(item) {
        if (!item) return;
        if (!window.db || !window.db[item.category]) {
            alert('このカテゴリーのデータが読み込まれていません。');
            return;
        }

        // カテゴリ選択を更新
        const sel = document.getElementById('category-select');
        if (sel) sel.value = item.category;
        if (typeof changeCategory === 'function') {
            changeCategory(); // db[currentCategory] を更新
        } else {
            window.currentCategory = item.category;
        }

        const list = window.db[item.category] || [];
        const pair = list.find(p => p.l?.w === item.word || p.r?.w === item.word);
        if (!pair) {
            alert('この単語は現在のデータに見つかりませんでした。');
            return;
        }

        window.currentPair = pair;
        window.isTargetL = (pair.l && pair.l.w === item.word);
        window.targetObj = window.isTargetL ? pair.l : pair.r;

        // UIリセット（簡易版）
        const fb = document.getElementById('feedback-area');
        if (fb) {
            fb.innerHTML = 'Ready';
            fb.className = 'feedback';
        }

        if (typeof updatePhonemesAndMouth === 'function') {
            updatePhonemesAndMouth(window.currentPair, window.isTargetL);
        }
        if (typeof updateWordDisplay === 'function') {
            updateWordDisplay();
        }

        ensureSpeakingMode();
    }

    // モーダル表示
    window.showRecentWordsModal = function () {
        if (!isEnabled()) {
            alert('最近練習した単語リスト機能が無効になっています。設定から有効にしてください。');
            return;
        }

        loadData();

        let overlay = document.getElementById('recent-words-modal');
        if (overlay) overlay.remove();

        overlay = document.createElement('div');
        overlay.id = 'recent-words-modal';
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
            width: min(520px, 95vw);
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            font-size: 0.85rem;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;';
        const title = document.createElement('h3');
        title.textContent = '🕒 最近練習した単語';
        title.style.cssText = 'margin:0; font-size:1rem;';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.className = 'btn-icon';
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(title);
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.style.cssText = 'flex:1; overflow:auto; border:1px solid rgba(128,128,128,0.3); border-radius:6px; padding:6px; background:rgba(0,0,0,0.02);';

        if (!recentData.items.length) {
            const empty = document.createElement('div');
            empty.textContent = 'まだ最近の練習履歴がありません。';
            empty.style.opacity = '0.7';
            body.appendChild(empty);
        } else {
            const table = document.createElement('table');
            table.style.cssText = 'width:100%; border-collapse:collapse;';

            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr style="text-align:left; border-bottom:1px solid rgba(128,128,128,0.3);">
                    <th style="padding:4px 6px;">単語</th>
                    <th style="padding:4px 6px;">カテゴリ</th>
                    <th style="padding:4px 6px; text-align:right;">正解/不正解</th>
                    <th style="padding:4px 6px;">最終練習</th>
                </tr>
            `;

            const tbody = document.createElement('tbody');

            recentData.items
                .slice() // defensive copy
                .sort((a, b) => (b.lastAt || 0) - (a.lastAt || 0))
                .forEach(item => {
                    const tr = document.createElement('tr');
                    tr.style.cssText = 'cursor:pointer;';
                    tr.onmouseover = function () { this.style.background = 'rgba(59,130,246,0.08)'; };
                    tr.onmouseout = function () { this.style.background = 'transparent'; };
                    tr.onclick = function () {
                        jumpToWord(item);
                        overlay.remove();
                    };

                    const total = (item.correct || 0) + (item.wrong || 0);
                    const ratio = total > 0 ? `${item.correct}/${total}` : '-';

                    tr.innerHTML = `
                        <td style="padding:4px 6px; font-weight:bold;">${item.word}</td>
                        <td style="padding:4px 6px;">${item.category}</td>
                        <td style="padding:4px 6px; text-align:right;">${ratio}</td>
                        <td style="padding:4px 6px; font-size:0.75rem; opacity:0.8;">${formatTime(item.lastAt)}</td>
                    `;

                    tbody.appendChild(tr);
                });

            table.appendChild(thead);
            table.appendChild(tbody);
            body.appendChild(table);
        }

        modal.appendChild(header);
        modal.appendChild(body);

        overlay.appendChild(modal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        document.body.appendChild(overlay);
    };

    // 設定画面にトグルを追加
    function injectSettingsToggle() {
        const settingsBody = document.querySelector('#settings-modal .modal-content div[style*="overflow"]');
        if (!settingsBody || document.getElementById('setting-recent-words-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'setting-recent-words-wrapper';
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
        checkbox.id = 'toggle-recent-words';
        checkbox.style.marginRight = '10px';
        checkbox.checked = isEnabled();

        checkbox.onchange = function () {
            localStorage.setItem(STORAGE_KEY, checkbox.checked);
            window.recentWordsEnabled = checkbox.checked;
        };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode('🕒 最近練習した単語リストを有効にする'));
        wrapper.appendChild(label);

        const desc = document.createElement('p');
        desc.style.fontSize = '0.8rem';
        desc.style.margin = '5px 0 0 25px';
        desc.style.opacity = '0.7';
        desc.innerText = '直近で練習した単語をリストから選んで、すぐに再練習できます。';
        wrapper.appendChild(desc);

        // 学習支援セクションの近くに差し込む（発音ノートの直後を優先）
        const notesSection = document.getElementById('setting-notes-wrapper');
        if (notesSection && notesSection.parentNode) {
            notesSection.parentNode.insertBefore(wrapper, notesSection.nextSibling);
        } else {
            settingsBody.appendChild(wrapper);
        }
    }

    // updateWordStats をフックして練習ログを記録
    function hookUpdateStats() {
        const originalUpdateStats = window.updateWordStats;
        window.updateWordStats = function (isCorrect) {
            if (originalUpdateStats) originalUpdateStats(isCorrect);
            logRecentWord(isCorrect);
        };
    }

    window.addEventListener('load', () => {
        loadData();
        hookUpdateStats();
        setTimeout(injectSettingsToggle, 1000);
    });
})();


