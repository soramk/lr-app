/**
 * feature_sentence_mode.js (v2: レベル選択対応版)
 * L/Rを含む「短文（センテンス）」をレベル別に練習するシャドーイングモードを追加するプラグイン。
 * 設定画面でオン/オフが可能。
 */

(function() {
    const STORAGE_KEY = 'lr_sentence_enabled';
    
    // レベル別センテンスデータセット
    const SENTENCE_LEVELS = {
        "Sentence Lv1 (Basic)": [
            "Please turn on the light.",
            "I really love red roses.",
            "The river flows under the bridge.",
            "Let's eat lunch at the restaurant.",
            "Is this the right road?",
            "Look at the lovely little rabbit.",
            "The rain fell on the green grass.",
            "Please read the rule book.",
            "I will arrive late tomorrow.",
            "Believe in yourself.",
            "The blue balloon flew away.",
            "Hello, my name is Larry.",
            "Are you ready to play?",
            "The glass is full of fresh milk.",
            "It's a long way to run.",
            "I really like this place.",
            "The library is on the left.",
            "Let me help you with that.",
            "The weather is really nice today.",
            "I'll call you later.",
            "The red car is very fast.",
            "Please close the door.",
            "I love to read books.",
            "The train leaves at three.",
            "Let's go to the park.",
            "I really appreciate your help.",
            "The light is too bright.",
            "Please wait for me.",
            "I'll be right back.",
            "The room is very large.",
            "I like to eat rice.",
            "Please run very fast.",
            "It has been a long time.",
            "I saw a red car.",
            "Look at the blue sky.",
            "Let's play with the ball.",
            "Please read it aloud.",
            "Write your name here.",
            "Raise your left hand.",
            "Raise your right hand.",
            "This is a low price.",
            "We row the boat.",
            "Birds fly high.",
            "I will fry an egg.",
            "Use a glass cup.",
            "The grass is green.",
            "It is a cloudy day.",
            "I hear the crowd noise.",
            "It is late at night.",
            "Please rate the movie.",
            "Did you lock the door?",
            "I like that rock band.",
            "She has long hair.",
            "That is the wrong way.",
            "Turn on the light box.",
            "Choose the right box.",
            "Please load the truck.",
            "Check the road map.",
            "You can lead the way.",
            "Please read to me.",
            "He is alive and well.",
            "When will you arrive?",
            "My belly is full.",
            "I like berry jam.",
            "The pilot is ready.",
            "I saw a pirate ship.",
            "Please collect the trash.",
            "That is the correct answer.",
            "She has glamour.",
            "Study your grammar.",
            "Colors clash sometimes.",
            "Don't crash the car.",
            "Read the flyer.",
            "Use the deep fryer.",
            "Stay in lane one.",
            "Watch the rain fall.",
            "Make a list.",
            "Check your wrist watch.",
            "They found the loot.",
            "I like root beer.",
            "The clown is funny.",
            "The king wears a crown.",
            "Don't blink your eyes.",
            "We are on the brink.",
            "Turn on the lamp.",
            "Walk up the ramp.",
            "They had to flee.",
            "I have free time.",
            "The blade is sharp.",
            "She has a braid.",
            "My liver is healthy.",
            "The river is deep.",
            "Open your locker.",
            "Sit in the rocker.",
            "Keep a low profile.",
            "Row the boat gently.",
            "Walk the plank.",
            "It was a prank.",
            "Don't be in gloom.",
            "Groom the dog.",
            "Where is my lipstick?",
            "Don't rip the paper.",
            "Clamp it down.",
            "I have a cramp.",
            "The plant has blight.",
            "The sun is bright.",
            "Wear a cloak.",
            "Hear the frog croak.",
            "Don't lag behind.",
            "Play with the rag doll.",
            "Pet the lap dog.",
            "I like rap music.",
            "I lent him money.",
            "Pay the rent.",
            "Open the lid.",
            "Get rid of it.",
            "Touch your ear lobe.",
            "Wear a bath robe.",
            "He has a lust for life.",
            "The metal will rust.",
            "Put on a splint.",
            "Run a sprint.",
            "I lack the time.",
            "Put it on the rack.",
            "The mountains loom.",
            "Clean your room.",
            "Find a clue.",
            "Join the crew.",
            "See the flock of birds.",
            "Wear a nice frock.",
            "Plow the field.",
            "Stand on the prow.",
            "Play the flute.",
            "Eat some fruit.",
            "The flame is hot.",
            "Frame the picture.",
            "Walk in the glade.",
            "Get a good grade.",
            "Use the glue.",
            "The tree grew tall.",
            "She made me blush.",
            "Brush your teeth.",
            "The cut will bleed.",
            "What breed is it?",
            "Flowers will bloom.",
            "Sweep with a broom.",
            "The food is bland.",
            "It is brand new.",
            "Sing the blues.",
            "I have a bruise.",
            "Find a clam.",
            "Cram for the test.",
            "Use ply wood.",
            "Pry it open.",
            "Swim in the lake.",
            "Rake the leaves.",
            "An eye lash.",
            "I have a rash.",
            "A cute lamb.",
            "The ram ran.",
            "Lest we forget.",
            "Take a rest.",
            "Lick the spoon.",
            "Rick is my friend.",
            "Check for lice.",
            "Eat a bowl of rice.",
            "Study the law.",
            "Cook the raw meat.",
            "Lay it down.",
            "A ray of sun.",
            "Fix the leak.",
            "It smells like reek.",
            "Leap over it.",
            "Reap the rewards.",
            "Sign the lease.",
            "Eat a Reese cup.",
            "Cook with leek.",
            "Don't lose hope.",
            "It was a ruse.",
            "A chain link.",
            "Skate on the rink.",
            "He is a lobber.",
            "Stop the robber.",
            "Don't leer at her.",
            "Go to the rear.",
            "Lend a hand.",
            "Rend the cloth.",
            "The grass is lush.",
            "Avoid the rush.",
            "File the report.",
            "Light a fire.",
            "Make a deal.",
            "Hello dear friend.",
            "He is alive.",
            "Arrive on time.",
            "Call me later.",
            "Eat the apple core.",
            "Scale the wall.",
            "Don't scare me.",
            "The bread is stale.",
            "Don't stare.",
            "A big whale.",
            "Wear a coat.",
            "My belly hurts.",
            "A sweet berry.",
            "Ask the teller.",
            "A night of terror.",
            "Join the legion.",
            "In this region.",
            "A big lion.",
            "His name is Ryan.",
            "Splay your fingers.",
            "Spray the water.",
            "Use the pliers.",
            "Check the priors.",
            "A swollen gland.",
            "A grand party.",
            "Go to class.",
            "Don't be crass.",
            "Plod along.",
            "Prod him.",
            "Clutch the wheel.",
            "Use a crutch.",
            "Flesh and blood.",
            "Fresh fruit.",
            "Flank the enemy.",
            "Be frank with me.",
            "The miller works.",
            "Look in the mirror."
        ],
        "Sentence Lv2 (Intermediate)": [
            "Please turn on the light on the right.",
            "I really love red roses in the garden.",
            "The river flows under the bridge slowly.",
            "Let's eat lunch at the restaurant nearby.",
            "Is this the right road to the lake?",
            "Look at the lovely little rabbit running.",
            "The rain fell on the green grass gently.",
            "Please read the rule book carefully.",
            "I will arrive late tomorrow morning.",
            "Believe in yourself and your dreams always.",
            "The blue balloon flew away in the wind.",
            "Hello, my name is Larry from London.",
            "Are you ready to play the game now?",
            "The glass is full of fresh milk today.",
            "It's a long way to run every day.",
            "I really like this place very much.",
            "The library is on the left side of the street.",
            "Let me help you with that heavy box.",
            "The weather is really nice today, isn't it?",
            "I'll call you later this evening.",
            "The red car is very fast and reliable.",
            "Please close the door when you leave.",
            "I love to read books in the library.",
            "The train leaves at three o'clock sharp.",
            "Let's go to the park this afternoon.",
            "I really appreciate your help with this project.",
            "The light is too bright for my eyes.",
            "Please wait for me at the entrance.",
            "I'll be right back in a few minutes.",
            "The room is very large and comfortable.",
            "She really likes to learn new languages.",
            "The teacher will explain the lesson clearly.",
            "I'll bring the book to the library tomorrow.",
            "The flight will arrive late in the evening.",
            "Please remember to lock the door carefully.",
            "I really want to travel around the world.",
            "The restaurant serves really delicious food.",
            "Let's plan a trip to the lake next week.",
            "I'll write a letter to my friend later.",
            "The weather forecast says it will rain tomorrow.",
            "The flight was delayed due to heavy rain.",
            "Please collect all the correct answers for the test.",
            "I need to replace the light bulb in the hallway.",
            "The crowd cheered loudly for the brave player.",
            "She wore a lovely blue dress to the party tonight.",
            "He tried to climb the tall tree in the park.",
            "The glass was filled with fresh cold water.",
            "I really want to learn how to play the guitar.",
            "The road to the village is long and winding.",
            "Please write your name on the right side of the paper.",
            "The little girl loves to play with her dolls.",
            "I saw a bright light in the sky last night.",
            "The train arrived at the station right on time.",
            "He is a very loyal friend to everyone he knows.",
            "Please correct the mistakes in your report.",
            "The river flows quickly after the heavy rain.",
            "I like to eat fresh fruit for breakfast every day.",
            "The blue bird flew over the green field.",
            "Please lock the door before you go to sleep.",
            "The rock band played a very loud song.",
            "She has long brown hair and blue eyes.",
            "I took the wrong turn and got lost in the city.",
            "The pilot landed the plane safely on the runway.",
            "The pirate ship sailed across the deep blue sea.",
            "Please collect your belongings before leaving the room.",
            "The grammar in this sentence is not correct.",
            "The colors of your shirt clash with your pants.",
            "Please don't crash the car into the wall.",
            "Read the flyer to find out more about the event.",
            "Use the deep fryer to cook the french fries.",
            "Stay in the left lane to turn at the corner.",
            "Watch the rain fall from the window of your room.",
            "Make a list of things you need to buy today.",
            "Check your wrist watch to see what time it is.",
            "The thieves hid the loot in a secret place.",
            "I like to drink root beer with my pizza.",
            "The clown made everyone laugh at the circus.",
            "The king wears a golden crown on his head.",
            "Don't blink or you might miss the magic trick.",
            "We are on the brink of a major discovery.",
            "Turn on the lamp so we can see better.",
            "Walk up the ramp to enter the building.",
            "The refugees had to flee from their homes.",
            "I have some free time this afternoon to help you.",
            "The blade of the knife is very sharp and dangerous.",
            "She braided her hair into a long ponytail.",
            "My liver is healthy because I don't drink alcohol.",
            "The river is too deep to cross on foot.",
            "Open your locker and take out your books.",
            "Sit in the rocker and relax for a while.",
            "Keep a low profile and don't attract attention.",
            "Row the boat gently down the stream.",
            "The pirates made him walk the plank.",
            "It was just a harmless prank, don't be mad.",
            "Don't be in such gloom, cheer up a little.",
            "You need to groom the dog regularly.",
            "Where did I put my red lipstick?",
            "Be careful not to rip the important paper.",
            "Clamp the wood down before you cut it.",
            "I have a painful cramp in my leg.",
            "The farmer's crops suffered from blight.",
            "The sun is very bright today, wear sunglasses.",
            "The wizard wore a long black cloak.",
            "I heard a frog croak in the pond.",
            "Don't lag behind the rest of the group.",
            "The child played with a ragged doll.",
            "The lap dog sat quietly on her knees.",
            "I like listening to old school rap music.",
            "I lent him some money for lunch.",
            "I have to pay the rent at the end of the month.",
            "Open the lid of the jar for me.",
            "We need to get rid of this old furniture.",
            "She wore earrings on her ear lobes.",
            "He wore a comfortable bath robe at the spa.",
            "He has a great lust for life and adventure.",
            "The old metal gate began to rust.",
            "The doctor put a splint on his broken finger.",
            "He ran a sprint to catch the bus.",
            "I lack the time to finish this project.",
            "Put the books back on the shelf rack.",
            "Dark clouds loom over the mountains.",
            "Please clean your room before dinner.",
            "The detective found a clue at the scene.",
            "He joined the crew of the ship.",
            "A flock of birds flew south for the winter.",
            "She wore a beautiful floral frock.",
            "The farmer used a plow in the field.",
            "He stood on the prow of the ship.",
            "She learned to play the flute in school.",
            "It is important to eat fresh fruit.",
            "The flame of the candle flickered in the wind.",
            "Please frame this picture for me.",
            "We had a picnic in a sunny glade.",
            "He got a good grade on his math test.",
            "Use the glue to stick the paper together.",
            "The tree grew tall over many years.",
            "His compliment made her blush red.",
            "Don't forget to brush your teeth.",
            "The wound started to bleed a little.",
            "What breed of dog is that?",
            "The flowers will bloom in the spring.",
            "Use a broom to sweep the floor.",
            "The soup tasted very bland without salt.",
            "He bought a brand new car yesterday.",
            "He played the blues on his guitar.",
            "I have a bruise on my arm from the fall.",
            "We found a clam shell on the beach.",
            "I have to cram for the exam tonight.",
            "We used plywood to build the shed.",
            "He tried to pry the box open.",
            "We went for a swim in the lake.",
            "Please rake the leaves in the yard.",
            "She has a long eyelash in her eye.",
            "He has a rash on his skin.",
            "The little lamb followed its mother.",
            "The ram ran into the fence.",
            "We must work hard lest we fail.",
            "Take a rest after your long walk.",
            "The dog licked the spoon clean.",
            "Rick is my best friend from school.",
            "The nurse checked the children for lice.",
            "I ate a bowl of rice for lunch.",
            "He wants to study law at university.",
            "Don't eat raw meat, it's dangerous.",
            "Please lay the book on the table.",
            "A ray of sunlight came through the window.",
            "There is a leak in the water pipe.",
            "The garbage began to reek in the heat.",
            "He can leap over the fence easily.",
            "You will reap what you sow.",
            "We signed a lease for the apartment.",
            "I ate a peanut butter cup.",
            "She cooked a soup with leek and potato.",
            "I don't want to lose the game.",
            "It was a clever ruse to trick them.",
            "A chain is only as strong as its weakest link.",
            "We went skating on the ice rink.",
            "He is a lobber in tennis.",
            "The police caught the bank robber.",
            "Don't leer at people, it's rude.",
            "The garden is at the rear of the house.",
            "Can you lend me a hand with this?",
            "He rent his clothes in grief.",
            "The forest was lush and green.",
            "Avoid the rush hour traffic if you can.",
            "Please file this report in the cabinet.",
            "Don't play with fire, it's dangerous.",
            "Let's make a deal.",
            "She is a very dear friend of mine.",
            "He is lucky to be alive.",
            "We will arrive on time for the meeting.",
            "I will call my mom later.",
            "He ate the apple core and all.",
            "He tried to scale the high wall.",
            "Don't scare me like that!",
            "The bread has gone stale.",
            "It's rude to stare at people.",
            "We saw a big whale in the ocean.",
            "You should wear a coat outside.",
            "My belly hurts from eating too much.",
            "This berry is very sweet and juicy.",
            "Ask the bank teller for help.",
            "The movie was full of terror.",
            "He joined the foreign legion.",
            "This region is known for its wine.",
            "The lion is the king of the jungle.",
            "His name is Ryan and he is nice.",
            "Don't splay your fingers like that.",
            "Spray the plants with water.",
            "Use the pliers to fix the wire.",
            "He has no prior criminal record.",
            "His glands were swollen from the flu.",
            "They threw a grand party for him.",
            "Go to your class on time.",
            "Don't be crass, be polite.",
            "We had to plod through the mud.",
            "Don't prod him with that stick.",
            "She clutched her bag tightly.",
            "He walks with a crutch.",
            "We are only flesh and blood.",
            "I need some fresh air.",
            "The army flanked the enemy.",
            "To be frank, I don't like it.",
            "The miller grinds the wheat.",
            "Look at yourself in the mirror."
        ],
        "Sentence Lv3 (Advanced)": [
            "Please turn on the light on the right side of the room.",
            "I really love red roses in the garden behind my house.",
            "The river flows under the bridge slowly and peacefully.",
            "Let's eat lunch at the restaurant nearby the library.",
            "Is this the right road to the lake that you mentioned?",
            "Look at the lovely little rabbit running across the field.",
            "The rain fell on the green grass gently this morning.",
            "Please read the rule book carefully before you start playing.",
            "I will arrive late tomorrow morning because of the traffic.",
            "Believe in yourself and your dreams always, no matter what happens.",
            "The blue balloon flew away in the wind and disappeared from sight.",
            "Hello, my name is Larry from London, and I'm really excited to be here.",
            "Are you ready to play the game now, or would you like to wait?",
            "The glass is full of fresh milk that I bought from the store today.",
            "It's a long way to run every day, but it's really good for your health.",
            "I really like this place very much because it's quiet and peaceful.",
            "The library is on the left side of the street, right next to the park.",
            "Let me help you with that heavy box before you drop it on the floor.",
            "The weather is really nice today, isn't it? Perfect for a walk in the park.",
            "I'll call you later this evening to discuss the details of our plan.",
            "The red car is very fast and reliable, which makes it perfect for long trips.",
            "Please close the door when you leave so that the cat doesn't run outside.",
            "I love to read books in the library because it's quiet and comfortable there.",
            "The train leaves at three o'clock sharp, so please make sure you arrive on time.",
            "Let's go to the park this afternoon to enjoy the beautiful weather together.",
            "I really appreciate your help with this project because it was really challenging.",
            "The light is too bright for my eyes, so could you please turn it down a little?",
            "Please wait for me at the entrance of the building until I finish my work.",
            "I'll be right back in a few minutes, so please don't leave without me.",
            "The room is very large and comfortable, which makes it perfect for our meeting.",
            "She really likes to learn new languages because it helps her understand different cultures.",
            "The teacher will explain the lesson clearly so that everyone can understand it easily.",
            "I'll bring the book to the library tomorrow morning before my first class starts.",
            "The flight will arrive late in the evening, so we'll need to arrange transportation.",
            "Please remember to lock the door carefully when you leave the house for security.",
            "I really want to travel around the world to experience different cultures and languages.",
            "The restaurant serves really delicious food that is prepared fresh every single day.",
            "Let's plan a trip to the lake next week when the weather is supposed to be nice.",
            "I'll write a letter to my friend later today to tell her about my recent travels.",
            "The weather forecast says it will rain tomorrow, so we should bring our umbrellas.",
            "The lawyer reviewed the legal documents very carefully before signing.",
            "The royal family greeted the loyal crowd from the palace balcony.",
            "It is rarely possible to predict the weather accurately in this region.",
            "The brave firefighter rescued the family from the burning building.",
            "Please clarify the correct direction to the nearest public library.",
            "The professor delivered a brilliant lecture on English literature.",
            "Relatively few people realize the real relevance of this new regulation.",
            "The preliminary results of the election were released late last night.",
            "Literally millions of dollars were lost due to the clerical error.",
            "The rural areas of the country are really beautiful in the spring.",
            "She collects rare coins from all around the world.",
            "The glass blower created a beautiful blue vase.",
            "The heavy rain caused the river to overflow its banks.",
            "He realized that he had left his luggage at the railway station.",
            "The political leader rallied his supporters for the upcoming election.",
            "The little girl rolled the red ball across the floor.",
            "Please remember to return the library books before the due date.",
            "The road construction caused a long delay for the morning commuters.",
            "He struggled to learn the correct pronunciation of the foreign words.",
            "The wildlife photographer captured a rare image of a snow leopard.",
            "The relentless rain ruined our plans for a picnic in the park.",
            "She wore a pearl necklace that belonged to her great-grandmother.",
            "The roller coaster ride was really thrilling and scary.",
            "He is a reliable employee who always arrives on time.",
            "The lyrics of the song were really meaningful and touching.",
            "The ruler measured the length of the line precisely.",
            "The lawyer's closing argument was really persuasive.",
            "The real estate agent showed us a lovely house near the lake.",
            "The librarian helped the student find the reference materials.",
            "The reckless driver ran the red light and caused an accident.",
            "The floral arrangement on the table looked really lovely.",
            "He felt a great relief when he realized he passed the exam.",
            "The plural form of 'child' is 'children', not 'childs'.",
            "The burglar broke into the jewelry store and stole the rings.",
            "The wrestler grappled with his opponent in the ring.",
            "The traveler explored the remote villages in the mountains.",
            "The glare from the sun made it difficult to see the road.",
            "The clarinet player performed a beautiful solo during the concert.",
            "The blurry photo made it hard to recognize the people in it.",
            "The flurry of snow made driving conditions really dangerous.",
            "The glory of the sunrise over the mountains was breathtaking.",
            "The calorie count of this meal is relatively low.",
            "The gallery displayed a collection of rare paintings.",
            "The salary increase was a welcome surprise for the employees.",
            "The celery sticks were served with a delicious dip.",
            "The malaria vaccine is a major breakthrough in medicine.",
            "The hilarious comedy movie made everyone laugh out loud.",
            "The malaria outbreak was contained by the health officials.",
            "The vocabulary list for the exam is really long.",
            "The artillery fire could be heard from miles away.",
            "The auxiliary engine was used when the main one failed.",
            "The capillary vessels are the smallest blood vessels in the body.",
            "The corollary to this theorem is also very important.",
            "The distillery produces high-quality whiskey.",
            "The ancillary staff supports the main operations of the hospital.",
            "The rural landscape is changing rapidly due to development.",
            "The lorry transport is vital for the local economy.",
            "Cruel treatment of animals is illegal in this country.",
            "The library catalog is now available online for everyone.",
            "Really good friends are hard to find in this busy world.",
            "The lyrical poetry of the Romantic era is very expressive.",
            "The parallel bars are used in gymnastics competitions.",
            "The preliminary hearing is set for next Monday morning.",
            "The relatively small size makes it portable and convenient.",
            "The clerical staff handles the paperwork efficiently.",
            "A liberal arts education provides a broad knowledge base.",
            "Coral bleaching is a serious environmental problem.",
            "The floral arrangement won a prize at the flower show.",
            "The blurry image was enhanced digitally to show details.",
            "The corollary implies that the opposite is also true."
        ],
        "Sentence Lv4 (Expert)": [
            "Please turn on the light on the right side of the room so that we can see clearly.",
            "I really love red roses in the garden behind my house because they remind me of my grandmother.",
            "The river flows under the bridge slowly and peacefully, creating a really beautiful and relaxing atmosphere.",
            "Let's eat lunch at the restaurant nearby the library after we finish reading our books this morning.",
            "Is this the right road to the lake that you mentioned earlier, or should we take a different route?",
            "Look at the lovely little rabbit running across the field, and notice how gracefully it moves through the grass.",
            "The rain fell on the green grass gently this morning, leaving everything fresh and clean for the rest of the day.",
            "Please read the rule book carefully before you start playing the game, so that you understand all the instructions.",
            "I will arrive late tomorrow morning because of the traffic, but I'll make sure to call you as soon as I leave.",
            "Believe in yourself and your dreams always, no matter what happens, because that's the only way to achieve your goals.",
            "The blue balloon flew away in the wind and disappeared from sight, leaving the child really disappointed and sad.",
            "Hello, my name is Larry from London, and I'm really excited to be here today to learn about your culture and language.",
            "Are you ready to play the game now, or would you like to wait a little longer until everyone else arrives?",
            "The glass is full of fresh milk that I bought from the store today, and it's really delicious and nutritious for breakfast.",
            "It's a long way to run every day, but it's really good for your health and helps you stay in shape throughout the year.",
            "I really like this place very much because it's quiet and peaceful, which makes it perfect for reading and relaxing.",
            "The library is on the left side of the street, right next to the park, so it's really easy to find when you're walking.",
            "Let me help you with that heavy box before you drop it on the floor, because I don't want you to hurt yourself.",
            "The weather is really nice today, isn't it? Perfect for a walk in the park or a picnic with friends and family.",
            "I'll call you later this evening to discuss the details of our plan, so please make sure your phone is turned on.",
            "The red car is very fast and reliable, which makes it perfect for long trips across the country during the holidays.",
            "Please close the door when you leave so that the cat doesn't run outside, because we don't want to lose her again.",
            "I love to read books in the library because it's quiet and comfortable there, and I can really focus on my studies.",
            "The train leaves at three o'clock sharp, so please make sure you arrive on time, or you'll have to wait for the next one.",
            "Let's go to the park this afternoon to enjoy the beautiful weather together, and maybe we can have a picnic there too.",
            "I really appreciate your help with this project because it was really challenging, and I couldn't have done it without you.",
            "The light is too bright for my eyes, so could you please turn it down a little, or I'll have to wear my sunglasses inside.",
            "Please wait for me at the entrance of the building until I finish my work, and then we can go to the restaurant together.",
            "I'll be right back in a few minutes, so please don't leave without me, because I really want to talk to you about something important.",
            "The room is very large and comfortable, which makes it perfect for our meeting, and everyone should be able to hear clearly.",
            "She really likes to learn new languages because it helps her understand different cultures and communicate with people from around the world.",
            "The teacher will explain the lesson clearly so that everyone can understand it easily, and then we'll have time to practice together.",
            "I'll bring the book to the library tomorrow morning before my first class starts, so that you can read it during your free time.",
            "The flight will arrive late in the evening, so we'll need to arrange transportation from the airport to the hotel in advance.",
            "Please remember to lock the door carefully when you leave the house for security, because we've had some problems in the neighborhood recently.",
            "I really want to travel around the world to experience different cultures and languages, and learn about how people live in other countries.",
            "The restaurant serves really delicious food that is prepared fresh every single day, using only the finest ingredients from local farms and markets.",
            "Let's plan a trip to the lake next week when the weather is supposed to be nice, and we can spend the whole day swimming and relaxing there.",
            "I'll write a letter to my friend later today to tell her about my recent travels, and ask her if she'd like to join me on my next adventure.",
            "The weather forecast says it will rain tomorrow, so we should bring our umbrellas and raincoats, or we'll get really wet during our walk.",
            "The rural jury rarely rules correctly in purely pluralistic trials, often causing controversy among the local legal community.",
            "Literally millions of dollars were lost due to a clerical error in the rural bank, forcing the regulators to launch a full investigation.",
            "The cruel ruler ruled the rural region with little reliance on the law, leading to a rebellion that lasted for several years.",
            "A preliminary literature review revealed relatively little relevant research, suggesting that this topic has been largely overlooked by scholars.",
            "The royal family regularly rallies loyal followers for the rural rebellion, hoping to regain control of the northern provinces.",
            "Larry's rally car really roared around the rear of the rural race track, kicking up a cloud of dust that obscured the view.",
            "The blurry flurry of snow obscured the driver's rear-view mirror completely, making it impossible to see the approaching lorry.",
            "Parallel lines rarely meet, representing a linear reality in Euclidean geometry that differs significantly from the curved space of relativity.",
            "The liberal leader reluctantly relinquished his role in the labor relations board after realizing that his policies were no longer relevant.",
            "Truly, the pluralistic society struggles with cultural polarization and moral relativity, requiring strong leadership to bridge the growing divide.",
            "The reckless wrestler grappled with the referee, resulting in a really rare ruling that disqualified him from the royal rumble.",
            "Please clarify the relevant regulations regarding rural real estate, as the current rules are rarely reliable for legal reference.",
            "The lyrical lyrics of the love song lingered in her memory, recalling a long-lost romance that flourished in a floral garden.",
            "A flurry of letters from loyal followers flooded the library, requesting the release of the rare literary collection immediately.",
            "The clumsy clerk cleared the cluttered table clumsily, accidentally spilling a glass of clear liquid on the legal ledger.",
            "Relatively few people realize the real relevance of this new regulation, which literally rewrites the rules for rural laborers.",
            "The brilliant lawyer resolved the legal problem relatively quickly, relying on a loophole in the pluralistic legal system.",
            "A large crowd gathered around the royal palace to celebrate the ruler's return, waving flags and cheering loudly for their leader.",
            "The glorious sunrise reflected on the calm river water, creating a surreal landscape that looked like a watercolor painting.",
            "He rarely relaxes, preferring to work late regularly to ensure that every little detail is perfectly clear and correct.",
            "The elderly colonel ruled the rural colony with a cruel and brutal iron will, leaving little room for rebellion.",
            "Truly, the plural of 'locus' is 'loci', a grammatical rule rarely realized or applied correctly by laypeople.",
            "The blurry blue lines on the road made the lane markings really hard to rely on during the torrential rain.",
            "Larry's little lorry rolled rapidly down the long, winding rural lane, carrying a load of freshly picked lemons.",
            "The royal library recently released a list of relatively rare literary works that have been lost for centuries.",
            "Please clarify clearly whether the clause applies to legal liability or moral responsibility in this particular case.",
            "The fragile glass flask fell on the floor, shattering into a flurry of glittering fragments that scattered everywhere.",
            "A brilliant light flared in the gloom, revealing the grim reality of the battlefield to the weary soldiers.",
            "She reluctantly relinquished the lovely heirloom to the rightful legal owner after a long and bitter lawsuit.",
            "The reckless driver literally lost control, crashing loudly into the large concrete pillar near the railway bridge."
        ]
    };

    window.addEventListener('load', () => {
        // UI調整用スタイル
        const style = document.createElement('style');
        style.innerHTML = `
            body.sentence-mode .word-display { 
                font-size: 1.4rem !important; 
                line-height: 1.4; 
                min-height: 3.5em; 
                display:flex; 
                align-items:center; 
                justify-content:center;
                padding: 0 10px;
            }
            body.sentence-mode .sub-text { display: none !important; }
            body.sentence-mode .phoneme-container { display: none !important; }
            body.sentence-mode .diagram-box { display: none !important; }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            injectSettingsToggle();
            // 起動時に有効なら即座にカテゴリを追加
            const isEnabled = typeof window.getFeatureDefault === 'function'
                ? window.getFeatureDefault(STORAGE_KEY)
                : (localStorage.getItem(STORAGE_KEY) === 'true');
            if (isEnabled) {
                registerSentenceCategories();
            }
            applyState();
            hookNextQuestion();
        }, 800);
    });

    // 1. カテゴリ登録処理 (重要)
    function registerSentenceCategories() {
        if (!window.db) window.db = {};
        
        Object.keys(SENTENCE_LEVELS).forEach(levelName => {
            const list = SENTENCE_LEVELS[levelName].map(text => {
                return { l: { w: text, b: [] }, r: { w: text, b: [] } };
            });
            window.db[levelName] = list;
        });

        // プルダウン更新
        if (typeof populateCategorySelect === 'function') populateCategorySelect();
    }

    // 2. カテゴリ削除処理 (オフにした時)
    function removeSentenceCategories() {
        if (!window.db) return;
        Object.keys(SENTENCE_LEVELS).forEach(levelName => {
            delete window.db[levelName];
        });
        if (typeof populateCategorySelect === 'function') populateCategorySelect();
    }

    // 1. 設定画面
    function injectSettingsToggle() {
        const settingsBody = document.querySelector('#settings-modal .modal-content div[style*="overflow"]');
        if (!settingsBody || document.getElementById('setting-sentence-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'setting-sentence-wrapper';
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
        checkbox.id = 'toggle-sentence-feature';
        checkbox.style.marginRight = '10px';
        
        checkbox.checked = typeof window.getFeatureDefault === 'function'
            ? window.getFeatureDefault(STORAGE_KEY)
            : (localStorage.getItem(STORAGE_KEY) === 'true');

        checkbox.onchange = function() {
            localStorage.setItem(STORAGE_KEY, checkbox.checked);
            if (checkbox.checked) {
                registerSentenceCategories();
            } else {
                removeSentenceCategories();
            }
            applyState();
        };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode("🗣️ センテンス (短文) モードを有効にする"));
        wrapper.appendChild(label);

        const desc = document.createElement('p');
        desc.style.fontSize = '0.8rem';
        desc.style.margin = '5px 0 0 25px';
        desc.style.opacity = '0.7';
        desc.innerText = "単語だけでなく、実践的な短い文章でL/Rの発音を練習します。レベル別(Lv1-Lv4)にカテゴリ分けされています。";
        wrapper.appendChild(desc);

        // 挿入位置: Twister設定の前
        const twisterSetting = document.getElementById('setting-twister-wrapper');
        if(twisterSetting) {
            twisterSetting.parentNode.insertBefore(wrapper, twisterSetting);
        } else {
            settingsBody.appendChild(wrapper);
        }
    }

    // 2. ボタン表示
    function applyState() {
        const isEnabled = typeof window.getFeatureDefault === 'function'
            ? window.getFeatureDefault(STORAGE_KEY)
            : (localStorage.getItem(STORAGE_KEY) === 'true');
        const subHeader = document.querySelector('.sub-header');
        if (!subHeader) return;

        let btn = document.getElementById('sentence-btn');

        if (isEnabled) {
            if (!btn) {
                btn = document.createElement('button');
                btn.id = 'sentence-btn';
                btn.innerText = '🗣️ Sentences';
                btn.style.marginLeft = '10px';
                btn.style.padding = '5px 10px';
                btn.style.borderRadius = '15px';
                btn.style.border = '1px solid #3b82f6';
                btn.style.background = '#dbeafe';
                btn.style.color = '#1d4ed8';
                btn.style.fontWeight = 'bold';
                btn.style.cursor = 'pointer';
                btn.style.fontSize = '0.8rem';
                
                btn.onclick = startSentenceMode;
                
                // Twisterボタンがあればその前、なければ最後に追加
                const twisterBtn = document.getElementById('twister-btn');
                if(twisterBtn) {
                    subHeader.insertBefore(btn, twisterBtn);
                } else {
                    subHeader.appendChild(btn);
                }
            }
            btn.style.display = 'inline-block';
        } else {
            if (btn) btn.style.display = 'none';
        }
    }

    // --- ロジック ---

    function startSentenceMode() {
        registerSentenceCategories();
        
        const select = document.getElementById('category-select');
        if (select) {
            // デフォルトでLv1を選択
            select.value = 'Sentence Lv1 (Basic)';
            if (typeof changeCategory === 'function') changeCategory();
        }

        if (typeof setMode === 'function') setMode('speaking');

        alert("🗣️ センテンスモード開始!\n文章を声に出して読んでみましょう。\n(モデル音声を聞いてシャドーイングするのが効果的です)\nカテゴリ選択プルダウンから難易度(Lv1-Lv4)を変更できます。");
    }

    function hookNextQuestion() {
        const originalNext = window.nextQuestion;
        
        window.nextQuestion = function() {
            if(originalNext) originalNext();
            
            const isSentence = window.currentCategory && window.currentCategory.startsWith('Sentence Lv');
            
            if (isSentence) {
                document.body.classList.add('sentence-mode');
                const sub = document.querySelector('.sub-text');
                if(sub) sub.style.display = 'none';
            } else {
                document.body.classList.remove('sentence-mode');
                // Twisterモードでもない場合のみ表示
                if (!document.body.classList.contains('twister-mode')) {
                    const sub = document.querySelector('.sub-text');
                    if(sub) sub.style.display = 'block';
                }
            }
        };
    }
})();