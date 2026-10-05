/* ---------------- writing (both sides roasted) ---------------- */
const POW_LINES=["Both armies drafted me this week. I'd like neither next week.","Which side are you? ...Never mind. Take this, leave the ox.","They took my ox. The other side took the ox's replacement: me.","The landlord fled. The tax collector somehow didn't.","Thank you! Please liberate a different village next time.","I was neutral. Both sides shot at me for it.","My son joined your army. My other son joined theirs. Dinners are tense.","I've been liberated 6 times. I'm exhausted.","Here. I was saving this for whoever won. You'll do.","Tell your general I'm still waiting for my 1946 pay. I'm a farmer."];
const DEFECT=["I SURRENDER! I CAME FOR THE FOOD","DEFECTING! WHERE DO I SIGN?","I SWITCH! SAME WAR, BETTER RICE?","MY OFFICER LEFT. SO DO I.","MY WHOLE UNIT IS COMING. WE VOTED."];
const CRIES={kmt:["DIE! CCP MTFK!","DIE! CCP MTFK!","DIE! CCP MTFK!","EAT LEAD, RED BANDITS!","FOR MY PAYCHECK!"],ccp:["DIE! KMT RUNNING DOGS!","DIE! KMT RUNNING DOGS!","FOR THE COLLECTIVE!","SMASH THE REACTIONARIES!"]};
const TAUNTS={kmt:["DIE, RED BANDIT!","GOLD YUAN FOR YOUR HEAD!","WE HAVE AMERICAN GUNS!","MY OFFICER IS RIGHT BEHIND ME! ...SOMEWHERE"],ccp:["RUN, RUNNING DOG!","YOUR MONEY IS TOILET PAPER!","JOIN US! WE HAVE MILLET!","SURRENDER! WE HAVE FORMS!"]};
const SLOGANS={ccp:["LAND REFORM!","DEFECT & EAT!","WE HAVE RICE","SURRENDER!"],kmt:["INFLATION OK","USA IS COMING","GOLD IS SAFE","BANDITS BAD!"]};
const WEAPONS={H:{name:'HEAVY MACHINE GUN',ammo:200},S:{name:'SHOTGUN',ammo:30},R:{name:'BAZOOKA (LEND-LEASE)',ammo:30},F:{name:'FLAMETHROWER',ammo:50}};
const WPN_OF={H:'hmg',S:'shotgun',R:'rocket',F:'flame'};
const TEXT={
 kmt:{who:'HQ',lives:'CONSCRIPTS',
  respawn:["NEW CONSCRIPT. STILL ROPED TO THE LAST ONE","NEXT CONSCRIPT! HE WAS BUYING NOODLES AN HOUR AGO","REPLACEMENT DELIVERED. INVOICE SENT TO HIS VILLAGE"],
  kills:["+PAY (NOW WORTH LESS)","SALARY EARNED: 1 EGG","COUSIN? MAYBE","NO REFUNDS","HE HAD A FARM. HE HAD.","PAYDAY! SPEND IT FAST"],
  noammo:"AMMO SOLD BY QUARTERMASTER",food:"BLACK MARKET RICE",officer:"SUITCASE: 3KG GOLD + 1 TICKET TO TAIWAN",
  over:["Your sacrifice will be remembered by a committee. The committee has relocated to Taiwan.","Next of kin notified. Pension paid in Gold Yuan. It bought a stamp."],
  posters:["戡亂","救國","還我","河山"],
  levels:[
   {start:"HQ: Hold this road at all costs. Reinforcements are on the way.",start2:"HQ: Correction. The reinforcements were sold. The money is safe in Shanghai.",drop:"HQ: American aid inbound! Contents: 400 cartons of cigarettes and one machine gun. Share neither.",truck:"HQ: Enemy loudspeaker truck! Do NOT listen. Half of 3rd Company already did.",mid:"HQ: Your pay has been adjusted for inflation. Please send us money.",boss:"HQ: Destroy that tank. It was ours last week. America's before that. Japan's before that.",win:"HQ will report this victory as a strategic withdrawal, just to be safe."},
   {start:"HQ: Advance through the paddies. Don't trample the crops. They've been sold to three buyers.",vehicle:"HQ: We requisitioned a donkey and strapped a cannon to it. The donkey did not consent. Neither did you.",mid:"HQ: Peasants keep calling you 'the other bandits'. Please smile more.",boss:"HQ: Armored train! First train on schedule since 1937. Destroy it anyway.",win:"HQ: Excellent. The train's cargo was our own payroll. It was worthless anyway."},
   {start:"HQ: Hold the mountain pass. Winter coats are on order. Estimated delivery: next winter.",mid:"HQ: Paratroopers incoming! Ours, theirs... at this altitude, who can tell?",boss:"HQ: Enemy bomber! Don't worry, we sold them the fuel. It's mostly water.",win:"HQ: Pass secured! We will now retreat through it in good order."},
   {start:"HQ: Defend Shanghai! The city is calm. Prices have only tripled since breakfast.",vehicle:"HQ: Take that tank. Its paperwork says 'ours'. Its crew said 'not anymore'.",truck:"HQ: Armored car ahead! Also a bank run. Shoot only one of them.",mid:"HQ: Remember, a sack of Gold Yuan stops bullets better than it buys rice.",boss:"HQ: The printing press is in enemy hands! Without it, how will we print money worth nothing?",win:"HQ: Shanghai held for an entire afternoon. A personal best."},
   {start:"HQ: Hold the river at all costs! Officers will supervise from the far bank. And then from further.",drop:"HQ: Airdrop! A bazooka and a strongly worded letter.",truck:"HQ: Gunboat! Its captain changed sides twice today. Check which flag he's flying.",mid:"HQ: Land ahead. Somebody's land. Paperwork pending.",boss:"HQ: Something enormous is coming ashore. Intelligence says it has a face. Nobody has approved the face.",win:"HQ: Well done. Please board the last boat. Bring the gold. Leave the receipts."}]},
 ccp:{who:'COMMISSAR',lives:'COMRADES',
  respawn:["NEXT COMRADE INHERITS YOUR RIFLE AND YOUR CRITICISM","NEW VOLUNTEER. VERY ENTHUSIASTIC, AS INSTRUCTED","COMRADE #4 TAKES THE RIFLE. #5-9 APPLAUD"],
  kills:["LIBERATED (FROM LIFE)","MERIT +1 (COLLECTIVIZED)","HIS RIFLE: AMERICAN. NOW: OURS","COUSIN? MAYBE","RE-EDUCATION SKIPPED","ONE LESS LANDLORD. HE WAS A COOK"],
  noammo:"AMMO RETURNED TO THE COLLECTIVE",food:"MILLET (SHARED WITH 12)",officer:"CLIPBOARD: YOUR NAME, UNDERLINED",
  over:["Your sacrifice will be remembered. The exact wording is under review.","Martyr certificate issued. Your family receives one (1) commemorative towel."],
  posters:["打倒","土改","解放","翻身"],
  levels:[
   {start:"COMMISSAR: Advance, comrade! We have one rifle per three men. You are man number three.",start2:"COMMISSAR: Pick up the rifle from man number one. He no longer needs it.",drop:"COMMISSAR: Captured enemy supplies! Thank the Americans. They are our best quartermaster.",truck:"COMMISSAR: Enemy propaganda truck! Their slogans are lies. Ours are just early.",mid:"COMMISSAR: Excellent work. Your self-criticism session is scheduled for Tuesday.",boss:"COMMISSAR: That tank changes owners more than a landlord's field. Make it ours.",win:"COMMISSAR: Glorious! Your heroism will be studied, revised and re-studied."},
   {start:"COMMISSAR: Cross the paddies, comrade. Every grain belongs to the people. The people are counting.",vehicle:"COMMISSAR: A liberated donkey! It has joined the revolution. It cannot file a complaint.",mid:"COMMISSAR: Villagers call us 'the other bandits'. Progress! Last year they had no word for us.",boss:"COMMISSAR: Enemy armored train! Capture it. We will need trains for the Five-Year Plan.",win:"COMMISSAR: Glorious! The train is ours. Tomorrow it carries grain. The day after, also grain."},
   {start:"COMMISSAR: Take the pass. Winter coats are being redistributed. You are not on the list.",mid:"COMMISSAR: Paratroopers! Relax, they're landing in the wrong place. So are we.",boss:"COMMISSAR: Enemy bomber! American-made. When it falls, we will study it for 30 years.",win:"COMMISSAR: The pass is liberated! The mountain will be renamed. Several times."},
   {start:"COMMISSAR: Liberate Shanghai! Capitalists, please remain calm. Your turn comes later.",vehicle:"COMMISSAR: Liberate that tank. Its previous owners have been invited to a meeting.",truck:"COMMISSAR: Armored car! Its crew is negotiating surrender. Speed up the negotiations.",mid:"COMMISSAR: Do not pick up the money. It is worthless. Also, it is evidence.",boss:"COMMISSAR: Seize the printing press! We'll print our own money. Ours will be different. Somehow.",win:"COMMISSAR: Shanghai is liberated! The nightclubs will become study halls. Dancing is now Studying."},
   {start:"COMMISSAR: Cross the river! One million troops, ten thousand boats. You got a door.",drop:"COMMISSAR: Supplies! A bazooka, liberated from a liberated warehouse.",truck:"COMMISSAR: Enemy gunboat! Its captain promises to defect right after you sink it.",mid:"COMMISSAR: The south bank! Wave to the locals. They are learning which flag to wave.",boss:"COMMISSAR: Something huge on the shore. It has a face. Do not look at the face. Approval pending.",win:"COMMISSAR: Victory! Now please report for your first campaign. There will be many."}]}
};
const BOSSNAME={truck:()=>'VOICE OF THE PEOPLE',tank:()=>'THE TANK OF MANY OWNERS',train:()=>'THE PUNCTUAL EXPRESS',bomber:()=>EN==='kmt'?'LEND-LEASE BOMBER':'CAPTURED BOMBER (MANUAL IN ENGLISH)',
 car:()=>'ARMORED CAR "PEACE TALKS"',press:()=>EN==='kmt'?'CENTRAL BANK PRESS':"THE PEOPLE'S PRINT WORKS",gunboat:()=>'GUNBOAT "LOYALTY" (FLAG REVERSIBLE)',mech:()=>'THE GREAT LEADER (FACE PENDING APPROVAL)'};
const PLATES=["US ARMY","IMPERIAL JAPAN","NATIONALIST ARMY","PEOPLE'S ARMY","A WARLORD","NOBODY, BRIEFLY"];

/* ---------------- missions ---------------- */
const LEVELS=[
 {name:'HOLD THE ROAD',sub:'THIS VILLAGE HAS CHANGED HANDS 4 TIMES THIS YEAR',theme:'village',track:'m1',
  plats:[{x:590,y:150,w:90},{x:900,y:142,w:70},{x:1300,y:148,w:96},{x:2050,y:144,w:80},{x:2410,y:150,w:110},{x:2690,y:140,w:70}],
  walls:[250,760,1180,1690,2230,2580,3150],pows:[520,1250,2250,2800],crates:[[1120,'S'],[2150,'R']],vehicles:[],
  arenas:[{x:1560,boss:'truck',msg:'truck'},{x:2980,boss:'tank',msg:'boss',final:1}],
  events:[[0,'start'],[170,'start2'],[1000,'drop','H'],[2100,'mid']],
  spawns:[[300,'rifle'],[360,'rifle'],[430,'runner'],[470,'surrender'],[560,'rifle'],[600,'grenadier'],[640,'rifle',150],[700,'runner'],[720,'runner'],[800,'rifle'],[860,'rifle','L'],[930,'rifle',142],[960,'grenadier'],[1050,'runner'],[1080,'officer'],[1150,'surrender'],[1200,'rifle'],[1240,'grenadier'],[1330,'rifle',148],[1360,'runner'],[1400,'rifle'],[1460,'runner'],[1500,'grenadier'],
   [1980,'rifle'],[2020,'runner'],[2080,'rifle',144],[2150,'grenadier'],[2200,'surrender'],[2260,'rifle'],[2300,'runner'],[2330,'runner'],[2380,'rifle','L'],[2440,'rifle',150],[2480,'grenadier'],[2560,'runner'],[2600,'officer'],[2640,'surrender'],[2720,'rifle',140],[2760,'grenadier'],[2820,'runner'],[2860,'runner'],[2900,'rifle']]},
 {name:'RICE PADDY RUN',sub:'EVERY GRAIN IS SPOKEN FOR. TWICE.',theme:'paddy',track:'m2',weather:'rain',
  shallow:[[520,800],[1320,1600],[2160,2440]],
  plats:[{x:900,y:154,w:64},{x:1720,y:150,w:80},{x:2540,y:152,w:70}],
  walls:[380,1100,1900,2700],pows:[450,1220,1950,2620],crates:[[1040,'H'],[2000,'F'],[2480,'S']],vehicles:[[240,'donkey']],
  arenas:[{x:2900,boss:'train',msg:'boss',final:1}],
  events:[[0,'start'],[120,'vehicle'],[1500,'mid']],
  spawns:[[330,'rifle'],[420,'rifle'],[480,'runner'],[600,'cavalry'],[700,'rifle'],[760,'mgnest'],[880,'grenadier'],[930,'rifle',154],[1000,'surrender'],[1080,'runner'],[1100,'runner'],[1180,'officer'],[1260,'mortar'],[1350,'cavalry'],[1420,'rifle'],[1480,'rifle','L'],[1560,'grenadier'],[1650,'mgnest'],[1740,'rifle',150],[1800,'runner'],[1840,'runner'],[1900,'cavalry'],[1980,'rifle'],[2050,'mortar'],[2120,'surrender'],[2200,'rifle'],[2260,'grenadier'],[2330,'cavalry'],[2400,'runner'],[2450,'officer'],[2560,'rifle',152],[2600,'mgnest'],[2700,'runner'],[2740,'rifle'],[2800,'cavalry'],[2850,'grenadier']]},
 {name:'THE FROZEN PASS',sub:'WINTER COATS: ORDERED. DELIVERY: SPRING.',theme:'snow',track:'m3',weather:'snow',
  ground:[[0,184],[380,184],[520,166],[820,166],[900,184],[1250,184],[1400,158],[1700,158],[1820,176],[2300,176],[2420,184],[4000,184]],
  plats:[{x:690,y:128,w:64},{x:1120,y:142,w:70},{x:1540,y:120,w:70},{x:2080,y:140,w:80},{x:2500,y:146,w:70},{x:2760,y:138,w:60}],
  walls:[300,1000,2200],pows:[600,1320,2020,2700],crates:[[950,'R'],[1880,'S'],[2460,'H']],vehicles:[[150,'donkey']],
  arenas:[{x:2900,boss:'bomber',msg:'boss',final:1}],
  events:[[0,'start'],[1180,'mid','paras'],[1900,'paras'],[2500,'paras']],
  spawns:[[330,'rifle'],[400,'runner'],[560,'mortar'],[620,'rifle'],[720,'sniper',128],[800,'grenadier'],[880,'runner'],[940,'rifle'],[1000,'surrender'],[1060,'mgnest'],[1150,'sniper',142],[1200,'officer'],[1280,'runner'],[1300,'runner'],[1420,'rifle'],[1480,'mortar'],[1570,'sniper',120],[1640,'grenadier'],[1700,'rifle'],[1760,'runner'],[1860,'mgnest'],[1950,'rifle','L'],[2000,'surrender'],[2100,'sniper',140],[2160,'rifle'],[2240,'cavalry'],[2300,'mortar'],[2380,'runner'],[2440,'officer'],[2520,'sniper',146],[2600,'rifle'],[2660,'grenadier'],[2780,'sniper',138],[2820,'runner'],[2860,'runner']]},
 {name:'SHANGHAI 1949',sub:'A LOAF OF BREAD NOW COSTS A WHEELBARROW',theme:'city',track:'m4',weather:'money',
  plats:[{x:500,y:140,w:70},{x:820,y:150,w:60},{x:1250,y:138,w:80},{x:2050,y:146,w:70},{x:2400,y:136,w:90},{x:2700,y:148,w:60}],
  walls:[280,980,1800,2300],pows:[700,1360,2200,2760],crates:[[620,'F'],[1900,'H'],[2520,'R']],vehicles:[[340,'tank']],
  arenas:[{x:1500,boss:'car',msg:'truck'},{x:2950,boss:'press',msg:'boss',final:1}],
  events:[[0,'start'],[200,'vehicle'],[1900,'mid']],
  spawns:[[300,'rifle'],[380,'officer'],[450,'runner'],[520,'rifle',140],[600,'grenadier'],[680,'rifle'],[760,'mgnest'],[840,'rifle',150],[900,'runner'],[940,'runner'],[1000,'surrender'],[1060,'officer'],[1120,'rifle'],[1180,'grenadier'],[1270,'rifle',138],[1330,'runner'],[1400,'rifle','L'],
   [1960,'rifle'],[2000,'officer'],[2070,'rifle',146],[2120,'runner'],[2160,'mgnest'],[2240,'surrender'],[2280,'grenadier'],[2340,'runner'],[2420,'rifle',136],[2460,'sniper',136],[2540,'officer'],[2600,'runner'],[2640,'rifle'],[2720,'rifle',148],[2780,'grenadier'],[2840,'runner'],[2880,'officer']]},
 {name:'CROSSING THE RIVER',sub:'THE RIVER IS A MILE WIDE. THE TALKS WERE WIDER.',theme:'river',track:'m5',
  deep:[[-200,1970]],auto:{speed:.5,to:1660},
  plats:[{x:2300,y:150,w:80},{x:2600,y:146,w:80}],
  walls:[2150,2480],pows:[2250,2700],crates:[[2400,'H']],vehicles:[],
  arenas:[{x:900,boss:'gunboat',msg:'truck'},{x:2900,boss:'mech',msg:'boss',final:1}],
  events:[[0,'start'],[300,'drop','S'],[1300,'drop','R'],[1400,'paras'],[1700,'mid']],
  spawns:[[300,'boat'],[480,'boat'],[620,'para'],[700,'boat'],[820,'para'],[1100,'boat'],[1220,'boat'],[1350,'para'],[1450,'boat'],[1560,'boat'],[1620,'para'],
   [2050,'rifle'],[2100,'runner'],[2180,'mgnest'],[2260,'rifle'],[2320,'rifle',150],[2380,'officer'],[2440,'cavalry'],[2500,'grenadier'],[2560,'surrender'],[2620,'rifle',146],[2680,'mortar'],[2740,'runner'],[2780,'runner'],[2840,'cavalry'],[2880,'rifle']]}
];

/* ---------------- story scenes (real dates & facts, dark captions) ---------------- */
const SCENES=[
 {pre:{date:'JUNE 1946',place:'CENTRAL CHINA',draw:'table',fact:"Japan has surrendered. An American envoy brokers a truce between the Nationalists and the Communists. By summer, full-scale civil war breaks out anyway.",joke:"Both sides agree on exactly one thing: the other side broke the truce first."},
  post:{date:'LATER THAT WEEK',place:'THE SAME VILLAGE',draw:'flags',fact:"Villages along the front change hands again and again. Families learn to keep both flags in the house.",joke:"The flag-maker is the only man in the province who is getting rich."}},
 {pre:{date:'1947',place:'NORTH CHINA COUNTRYSIDE',draw:'paddy',fact:"Land reform sweeps the villages. Both armies need millions of men and tons of grain. They recruit, not always politely, and requisition the harvest.",joke:"The farmer finally owns land. Then both armies come to borrow his sons."},
  post:{date:'THAT AUTUMN',place:'THE RAILWAY',draw:'wreck',fact:"Railways are cut and rebuilt so often that whole lines change owners several times a year.",joke:"The railway workers vote to switch to donkeys. The donkey abstains."}},
 {pre:{date:'SEPTEMBER 1948',place:'MANCHURIA',draw:'snow',fact:"The Liaoshen Campaign begins in the frozen northeast. In under two months, the Nationalists lose all of Manchuria and nearly half a million troops.",joke:"The winter coats arrive just in time for spring."},
  post:{date:'NOVEMBER 1948',place:'A MOUNTAIN CAMP',draw:'campfire',fact:"Captured American equipment changes sides by the trainload. Much of it arrives with manuals nobody can read.",joke:"The English manual becomes the warmest thing in Manchuria."}},
 {pre:{date:'AUGUST 1948',place:'SHANGHAI',draw:'bankrun',fact:"The government replaces the old currency with the new Gold Yuan at three million to one. Within a year it is nearly worthless. People shop with sacks of banknotes.",joke:"Economists call it hyperinflation. Shanghai calls it lunch."},
  post:{date:'MAY 1949',place:'SHANGHAI',draw:'sidewalk',fact:"Shanghai changes hands. The arriving soldiers famously sleep on the sidewalks rather than in people's homes.",joke:"The money also sleeps on the sidewalk. Nobody bothers to pick it up."}},
 {pre:{date:'APRIL 20, 1949',place:'THE YANGTZE RIVER',draw:'boats',fact:"Peace talks collapse. That night, hundreds of thousands of troops cross the Yangtze in wooden boats. Nanjing falls three days later.",joke:"Everyone remembers the crossing. Nobody remembers who rowed."},
  post:null}
];
const ENDING={
 date:'OCTOBER 1 · DECEMBER 1949',place:'BEIJING · TAIPEI',
 fact:"The People's Republic is proclaimed in Beijing on October 1. In December, the Nationalist government relocates to Taipei.",
 kmt:{draw:'island',joke:"You retreat to an island 'temporarily'. The word 'temporarily' is now 77 years old."},
 ccp:{draw:'parade',joke:"Victory! The war is over. The campaigns start Monday. Bring a pen for your self-criticism."},
 last:"For the next 75 years both sides agree on exactly one thing: there is only one China. They still can't agree on which one."
};
const CREDITS=["CIVIL SLUG 1946–1949","","STARRING","MILLIONS OF CONSCRIPTS (UNPAID)","ONE DONKEY (UNWILLING)","A TANK WITH SIX OWNERS","","NO VILLAGERS WERE CONSULTED","DURING THE MAKING OF THIS WAR","","THANK YOU FOR PLAYING"];
