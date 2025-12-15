/**
 * feature_tongue_twister.js (v3: レベル選択対応版)
 * 早口言葉をレベル別 (Lv1〜Lv4) にカテゴリ分けして追加します。
 * 「🔥 Challenge」ボタンでLv1を開始し、その後プルダウンで難易度変更が可能です。
 */

(function() {
    const STORAGE_KEY = 'lr_twister_enabled';
    
    // レベル別データセット
    const TWISTER_LEVELS = {
        "Twister Lv1 (Basic)": [
            "Truly rural",
            "Real rock wall",
            "Bluebird, blackbird",
            "Rolling red wagons",
            "Little red riding hood",
            "Lots of little lemons",
            "Literally literary",
            "Long wrong road",
            "Friendly fleas, fireflies",
            "Greek grapes",
            "Red blood, green blood",
            "Knapsack straps",
            "Willie's really weary",
            "Six slippery snails"
        ],
        "Twister Lv2 (Sentence)": [
            "Eleven benevolent elephants",
            "Larry sent the latter a letter later",
            "Look at the little red lorry",
            "A lump of red leather, a red leather lump",
            "Reading alone allows you to really relax",
            "Right around the road",
            "Light the night light tonight",
            "Leave the relief loop alone",
            "The road load is low",
            "Really leery Larry",
            "A right light is bright",
            "Roll the red rug",
            "Lead the rear fleet",
            "Fly free, little bird",
            "Grow glowing green grass",
            "Play properly, please",
            "Clear the cluttered closet",
            "Blue blood, black blood",
            "I saw a kitten eating chicken in the kitchen",
            "Four fine fresh fish for you",
            "Wayne went to Wales to watch walruses",
            "He threw three free throws",
            "So this is the sushi chef",
            "Zebras zig and zebras zag",
            "Nine nice night nurses nursing nicely",
            "Give papa a cup of proper coffee"
        ],
        "Twister Lv3 (Hard)": [
            "A loyal warrior will rarely worry why we rule",
            "Lesser leather never weathered wetter weather better",
            "Red leather, yellow leather",
            "Which witch switched the Swiss wristwatches?",
            "If a dog chews shoes, whose shoes does he choose?",
            "Rory's lawn rake rarely rakes really right",
            "A rural ruler rules a rural role",
            "Larry's rally lorry rolled rapidly",
            "Real rear wheels are rare",
            "Yellow lilies, yellow lilies",
            "Green glass globes glow greenly",
            "Crowds of clouds drifted over the crowd",
            "Laura reared a rare red rabbit",
            "Lucky little ladybirds",
            "Running rabbits ran rapidly",
            "Lilly likes light lilac lollipops",
            "Fresh fried fish, fish fresh fried",
            "A skunk sat on a stump and thunk the stump stunk",
            "Through three cheese trees three free fleas flew",
            "Denise sees the fleece, Denise sees the fleas",
            "I wish to wash my Irish wristwatch"
        ],
        "Twister Lv4 (Nightmare)": [
            "Jerry's jelly berries taste really rare",
            "The thirty-three thieves thought that they thrilled the throne throughout Thursday",
            "Roberta ran rings around the Roman ruins",
            "Lovely lemon liniment",
            "Flash message",
            "Strange strategic statistics",
            "Round the rugged rock the ragged rascal ran",
            "Yellow butter, purple jelly, red jam, black bread",
            "Rory the warrior and Roger the worrier were reared wrongly in a rural brewery",
            "Are you copper bottoming 'em, my man? No, I'm aluminiuming 'em, mum",
            "Can you imagine an imaginary menagerie manager imagining managing an imaginary menagerie?",
            "Rival river runners rode rubber rafts rapidly",
            "A loyal lad lowered a yellow load on a lorry",
            "Lily ladles little Letty's lentil soup",
            "Literally literary libraries are rarely real",
            "The crow flew over the river with a lump of raw liver",
            "Brisk brave brigadiers brandished broad bright blades",
            "On a lazy laser raiser lies a laser ray eraser",
            "Six slick swans swam swiftly southwards",
            "Gobbling gorgoyles gobbled gobbling goblins",
            "Fred fed Ted bread, and Ted fed Fred bread",
            "Pad kid poured curd pulled cod",
            "The seething sea ceaseth and thus the seething sea sufficeth us",
            "If you must cross a course cross cow across a crowded cow crossing",
            "Send toast to ten tense stout saints' ten tall tents",
            "A tutor who tooted the flute tried to tutor two tooters to toot",
            "Mr. See owned a saw and Mr. Soar owned a seesaw",
            "I slit the sheet, the sheet I slit, and on the slitted sheet I sit",
            "To sit in solemn silence in a dull, dark dock",
            "Six sick hicks nick six slick bricks with picks and sticks"
        ],
        "Twister Lv5 (World Famous)": [
            "Peter Piper picked a peck of pickled peppers",
            "She sells seashells by the seashore",
            "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
            "Betty Botter bought some butter but she said the butter's bitter",
            "Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair, Fuzzy Wuzzy wasn't fuzzy, was he?",
            "I scream, you scream, we all scream for ice cream",
            "Red lorry, yellow lorry",
            "Unique New York",
            "Toy boat, toy boat, toy boat",
            "Rubber baby buggy bumpers",
            "The sixth sick sheik's sixth sheep's sick",
            "A big black bug bit a big black bear",
            "Can you can a can as a canner can can a can?",
            "Susie works in a shoeshine shop. Where she shines she sits, and where she sits she shines",
            "Any noise annoys an oyster but a noisy noise annoys an oyster more",
            "All I want is a proper cup of coffee, made in a proper copper coffee pot",
            "A sailor went to sea to see what he could see",
            "If two witches would watch two watches, which witch would watch which watch?",
            "One-one was a race horse. Two-two was one too. One-one won one race. Two-two won one too"
        ]
    };

    window.addEventListener('load', () => {
        const style = document.createElement('style');
        style.innerHTML = `
            body.twister-mode .word-display { font-size: 1.3rem !important; line-height: 1.3; min-height: 4em; display:flex; align-items:center; justify-content:center; }
            body.twister-mode .sub-text { display: none !important; }
            body.twister-mode .phoneme-container { display: none !important; }
            body.twister-mode .diagram-box { display: none !important; }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            injectSettingsToggle();
            // 起動時に有効なら即座にカテゴリを追加
            const isEnabled = typeof window.getFeatureDefault === 'function'
                ? window.getFeatureDefault(STORAGE_KEY)
                : (localStorage.getItem(STORAGE_KEY) === 'true');
            if (isEnabled) {
                registerTwisterCategories();
            }
            applyState();
            hookNextQuestion();
        }, 800);
    });

    // 1. カテゴリ登録処理 (重要)
    function registerTwisterCategories() {
        if (!window.db) window.db = {};
        
        Object.keys(TWISTER_LEVELS).forEach(levelName => {
            const list = TWISTER_LEVELS[levelName].map(text => {
                return { l: { w: text, b: [] }, r: { w: text, b: [] } };
            });
            window.db[levelName] = list;
        });

        // プルダウン更新
        if (typeof populateCategorySelect === 'function') populateCategorySelect();
    }

    // 2. カテゴリ削除処理 (オフにした時)
    function removeTwisterCategories() {
        if (!window.db) return;
        Object.keys(TWISTER_LEVELS).forEach(levelName => {
            delete window.db[levelName];
        });
        if (typeof populateCategorySelect === 'function') populateCategorySelect();
    }

    // 3. 設定画面UI
    function injectSettingsToggle() {
        const settingsBody = document.querySelector('#settings-modal .modal-content div[style*="overflow"]');
        if (!settingsBody || document.getElementById('setting-twister-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'setting-twister-wrapper';
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
        checkbox.id = 'toggle-twister-feature';
        checkbox.style.marginRight = '10px';
        
        checkbox.checked = typeof window.getFeatureDefault === 'function'
            ? window.getFeatureDefault(STORAGE_KEY)
            : (localStorage.getItem(STORAGE_KEY) === 'true');

        checkbox.onchange = function() {
            localStorage.setItem(STORAGE_KEY, checkbox.checked);
            if (checkbox.checked) {
                registerTwisterCategories();
            } else {
                removeTwisterCategories();
            }
            applyState();
        };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode("🔥 早口言葉チャレンジを有効にする"));
        wrapper.appendChild(label);

        const desc = document.createElement('p');
        desc.style.fontSize = '0.8rem';
        desc.style.margin = '5px 0 0 25px';
        desc.style.opacity = '0.7';
        desc.innerText = "難易度別の早口言葉カテゴリ(Lv1-Lv4)を追加します。";
        wrapper.appendChild(desc);

        const blitzSetting = document.getElementById('setting-blitz-wrapper');
        if(blitzSetting) {
            blitzSetting.parentNode.insertBefore(wrapper, blitzSetting.nextSibling);
        } else {
            settingsBody.appendChild(wrapper);
        }
    }

    // 4. チャレンジボタン制御
    function applyState() {
        const isEnabled = typeof window.getFeatureDefault === 'function'
            ? window.getFeatureDefault(STORAGE_KEY)
            : (localStorage.getItem(STORAGE_KEY) === 'true');
        const subHeader = document.querySelector('.sub-header');
        if (!subHeader) return;

        let btn = document.getElementById('twister-btn');

        if (isEnabled) {
            if (!btn) {
                btn = document.createElement('button');
                btn.id = 'twister-btn';
                btn.innerText = '🔥 Challenge';
                btn.style.marginLeft = '10px';
                btn.style.padding = '5px 10px';
                btn.style.borderRadius = '15px';
                btn.style.border = '1px solid #ef4444';
                btn.style.background = '#fee2e2';
                btn.style.color = '#b91c1c';
                btn.style.fontWeight = 'bold';
                btn.style.cursor = 'pointer';
                btn.style.fontSize = '0.8rem';
                
                btn.onclick = startTwisterMode;
                subHeader.appendChild(btn);
            }
            btn.style.display = 'inline-block';
        } else {
            if (btn) btn.style.display = 'none';
        }
    }

    function startTwisterMode() {
        // デフォルトで Lv1 を選択して開始
        const defaultLevel = "Twister Lv1 (Basic)";
        
        if (!window.db[defaultLevel]) {
            registerTwisterCategories(); // 念のため再登録
        }

        const select = document.getElementById('category-select');
        if (select) {
            select.value = defaultLevel;
            if (typeof changeCategory === 'function') changeCategory();
        }

        if (typeof setMode === 'function') setMode('speaking');

        alert("🔥 早口言葉チャレンジ開始!\nカテゴリ選択プルダウンから難易度(Lv1-Lv4)を変更できます。");
    }

    function hookNextQuestion() {
        const originalNext = window.nextQuestion;
        
        window.nextQuestion = function() {
            if(originalNext) originalNext();
            
            // 現在のカテゴリ名に 'Twister' が含まれているかで判定
            const isTwister = (window.currentCategory && window.currentCategory.includes('Twister'));
            
            if (isTwister) {
                document.body.classList.add('twister-mode');
                const sub = document.querySelector('.sub-text');
                if(sub) sub.style.display = 'none';
            } else {
                document.body.classList.remove('twister-mode');
                const sub = document.querySelector('.sub-text');
                if(sub) sub.style.display = 'block';
            }
        };
    }
})();