/**
 * feature_strict_phoneme_mode.js
 * 🎯 音素精密スコアモード
 * - AIに発音記号(音素)ごとの厳密な評価と具体的な練習方法を出させるモード
 * - API使用量パネルの「上」にトグルを表示
 */

(function () {
    const STORAGE_KEY = 'lr_strict_phoneme_mode_enabled';

    function isEnabled() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) return saved === 'true';
        // デフォルト値（loader.js 側の LR_FEATURE_DEFAULTS にも登録済み）
        return typeof window.getFeatureDefault === 'function'
            ? window.getFeatureDefault(STORAGE_KEY)
            : false;
    }

    function setEnabled(flag) {
        localStorage.setItem(STORAGE_KEY, !!flag);
        window.phonemeStrictMode = !!flag;
    }

    // 初期状態をグローバルに反映
    window.phonemeStrictMode = isEnabled();

    function attachToggle() {
        // API使用量コンテナのすぐ上にトグルを置く
        const usageDisplay = document.getElementById('api-usage-display');
        const historyContainer = document.querySelector('.history-container');
        const parent = usageDisplay ? usageDisplay.parentElement : (historyContainer ? historyContainer.parentElement : null);
        if (!parent) {
            // まだDOMができていない場合は後で再試行
            setTimeout(attachToggle, 800);
            return;
        }

        if (document.getElementById('strict-phoneme-toggle')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'strict-phoneme-toggle';
        wrapper.style.cssText = `
            margin-top: 12px;
            margin-bottom: 8px;
            padding: 8px 10px;
            border-radius: 8px;
            background: rgba(37,99,235,0.06);
            border: 1px solid rgba(37,99,235,0.25);
            font-size: 0.8rem;
            display: flex;
            flex-direction: column;
            gap: 4px;
        `;

        const label = document.createElement('label');
        label.style.cssText = 'display:flex; align-items:center; cursor:pointer; gap:6px;';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isEnabled();
        checkbox.onchange = function () {
            setEnabled(checkbox.checked);
        };

        const title = document.createElement('span');
        title.style.cssText = 'font-weight:bold; color:var(--text);';
        title.textContent = '🎯 音素精密スコアモード';

        label.appendChild(checkbox);
        label.appendChild(title);

        const desc = document.createElement('div');
        desc.style.cssText = 'font-size:0.75rem; color:var(--text); opacity:0.85; margin-left:22px;';
        desc.textContent = '音素ごとの厳密な点数評価と、より具体的で実践的な練習方法ガイドを表示します（AIトークン使用量はやや増加）。';

        wrapper.appendChild(label);
        wrapper.appendChild(desc);

        if (usageDisplay) {
            parent.insertBefore(wrapper, usageDisplay);
        } else if (historyContainer) {
            parent.insertBefore(wrapper, historyContainer.nextSibling);
        } else {
            parent.appendChild(wrapper);
        }
    }

    window.addEventListener('load', () => {
        setTimeout(attachToggle, 1000);
    });
})();


