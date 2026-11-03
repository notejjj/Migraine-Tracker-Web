'use strict';
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const LK='mc_lang',DK='mc_data';
let lang=localStorage.getItem(LK)||'en',charts=[];
const pad=n=>String(n).padStart(2,'0'),ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=()=>ymd(new Date()),uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};

/* ---------- i18n ---------- */
const T={
brand:['MigraineCare','ไมเกรนแคร์'],skip:['Skip to content','ข้ามไปยังเนื้อหา'],
dash:['Dashboard','แดชบอร์ด'],rec:['Record Symptoms','บันทึกอาการ'],stats:['Statistics','สถิติ'],asm:['Symptom Assessment','แบบประเมินอาการ'],sleep:['Sleep Tracking','บันทึกการนอน'],trig:['Trigger Tracking','บันทึกปัจจัยกระตุ้น'],edu:['Migraine Education','ความรู้เรื่องไมเกรน'],warn:['Early Warning Signs','อาการเตือนล่วงหน้า'],set:['Settings','ตั้งค่า'],
welcome:['Welcome back','ยินดีต้อนรับกลับมา'],welSub:['Your last 28 days at a glance. Taller bars mean stronger pain.','ภาพรวม 28 วันล่าสุดของคุณ แท่งสูงหมายถึงปวดมากขึ้น'],
total:['Total episodes','จำนวนครั้งที่ปวดทั้งหมด'],avg:['Average pain (1–10)','ความปวดเฉลี่ย (1–10)'],latest:['Latest migraine','ไมเกรนครั้งล่าสุด'],none:['No records yet','ยังไม่มีบันทึก'],
week:['This week','สัปดาห์นี้'],month:['This month','เดือนนี้'],prevWeek:['Last week','สัปดาห์ก่อน'],prevMonth:['Last month','เดือนก่อน'],episodes:['episodes','ครั้ง'],
recent:['Recent activity','กิจกรรมล่าสุด'],qRec:['Record symptoms','บันทึกอาการ'],qStats:['View statistics','ดูสถิติ'],
tMig:['Migraine','ไมเกรน'],tSleep:['Sleep','การนอน'],tTrig:['Factors','ปัจจัย'],
dt:['Date and time','วันและเวลา'],pain:['Pain intensity','ระดับความปวด'],loc:['Pain location','ตำแหน่งที่ปวด'],chr:['Pain characteristics','ลักษณะอาการปวด'],dur:['Duration (hours)','ระยะเวลา (ชั่วโมง)'],sym:['Associated symptoms','อาการร่วม'],med:['Medication taken (optional)','ยาที่ใช้ (ถ้ามี)'],notes:['Notes','บันทึกเพิ่มเติม'],
save:['Save','บันทึก'],update:['Update record','อัปเดตบันทึก'],cancel:['Cancel','ยกเลิก'],edit:['Edit','แก้ไข'],del:['Delete','ลบ'],history:['History','ประวัติ'],
saved:['Saved','บันทึกแล้ว'],updated:['Updated','อัปเดตแล้ว'],deleted:['Deleted','ลบแล้ว'],yes:['Yes, delete','ใช่ ลบเลย'],no:['Keep it','เก็บไว้'],confirmDel:['Delete this record? This cannot be undone.','ลบบันทึกนี้หรือไม่? ไม่สามารถกู้คืนได้'],
eDate:['Choose a date and time that is not in the future.','เลือกวันและเวลาที่ไม่ใช่อนาคต'],eDur:['Enter a duration between 0.1 and 168 hours.','ใส่ระยะเวลาระหว่าง 0.1 ถึง 168 ชั่วโมง'],eSleep:['Enter both bedtime and wake-up time.','ใส่เวลาเข้านอนและเวลาตื่น'],eTrig:['Pick at least one factor or write a custom one.','เลือกอย่างน้อยหนึ่งปัจจัยหรือพิมพ์เอง'],
emptyRec:['No migraines recorded yet. Add your first episode above.','ยังไม่มีบันทึกไมเกรน เพิ่มครั้งแรกได้ด้านบน'],emptyChart:['Not enough data yet. Add records to see this chart.','ข้อมูลยังไม่พอ เพิ่มบันทึกเพื่อดูกราฟนี้'],noChart:['Charts need an internet connection to load Chart.js.','กราฟต้องใช้อินเทอร์เน็ตเพื่อโหลด Chart.js'],
left:['Left side','ด้านซ้าย'],right:['Right side','ด้านขวา'],both:['Both sides','ทั้งสองข้าง'],forehead:['Forehead','หน้าผาก'],eyes:['Behind the eyes','หลังดวงตา'],temples:['Temples','ขมับ'],back:['Back of head','ท้ายทอย'],
throbbing:['Throbbing','ตุบ ๆ'],sharp:['Sharp','แปลบ'],pressure:['Pressure','แน่นหนัก'],stabbing:['Stabbing','เหมือนถูกแทง'],dull:['Dull ache','ปวดตื้อ'],
nausea:['Nausea','คลื่นไส้'],vomiting:['Vomiting','อาเจียน'],light:['Sensitive to light','ไวต่อแสง'],sound:['Sensitive to sound','ไวต่อเสียง'],dizzy:['Dizziness','เวียนศีรษะ'],aura:['Visual or sensory aura','ออร่าทางสายตาหรือการรับรู้'],
statsTitle:['Statistics','สถิติ'],cFreq:['Episodes per week','จำนวนครั้งต่อสัปดาห์'],cPain:['Pain intensity over time','ความปวดตามช่วงเวลา'],cCmp:['Weekly and monthly comparison','เปรียบเทียบรายสัปดาห์และรายเดือน'],cSleep:['Sleep hours vs. migraine pain (last 30 days)','ชั่วโมงนอนเทียบกับความปวด (30 วันล่าสุด)'],cSym:['Most recorded symptoms','อาการที่บันทึกบ่อย'],cTrig:['Most recorded factors','ปัจจัยที่บันทึกบ่อย'],
sleepH:['Sleep hours','ชั่วโมงนอน'],painL:['Highest pain','ความปวดสูงสุด'],cur:['Current','ปัจจุบัน'],prev:['Previous','ก่อนหน้า'],wk:['Week','สัปดาห์'],mo:['Month','เดือน'],
trigRel:['Factor links (observed, not proof of cause)','ความเชื่อมโยงของปัจจัย (เป็นเพียงข้อสังเกต ไม่ใช่หลักฐานของสาเหตุ)'],trigRelNote:['"With migraine" counts factor days followed by a recorded migraine on the same or next day. These are observed associations only, not proof of causation.','"มีไมเกรนตามมา" นับวันที่บันทึกปัจจัยแล้วมีไมเกรนในวันเดียวกันหรือวันถัดไป เป็นเพียงความสัมพันธ์ที่สังเกตได้ ไม่ใช่หลักฐานว่าเป็นสาเหตุ'],withMig:['with migraine','มีไมเกรนตาม'],
asmTitle:['Preliminary symptom assessment','แบบประเมินอาการเบื้องต้น'],asmIntro:['Answer for your most typical headache. This is an educational tool, not a medical diagnosis.','ตอบตามอาการปวดศีรษะที่พบบ่อยที่สุด เครื่องมือนี้ให้ความรู้ ไม่ใช่การวินิจฉัยโรค'],
q1:['How strong is the pain?','ความปวดรุนแรงแค่ไหน?'],q1a:['Mild','เล็กน้อย'],q1b:['Moderate','ปานกลาง'],q1c:['Severe','รุนแรง'],
q2:['How long does it usually last?','มักปวดนานแค่ไหน?'],q2a:['Under 4 hours','น้อยกว่า 4 ชั่วโมง'],q2b:['4 to 72 hours','4 ถึง 72 ชั่วโมง'],q2c:['More than 72 hours','มากกว่า 72 ชั่วโมง'],
q3:['Where is the pain?','ปวดตรงไหน?'],q3a:['One side of the head','ข้างเดียวของศีรษะ'],q3b:['Both sides or all over','สองข้างหรือทั่วศีรษะ'],
q4:['Do you feel nauseated or vomit?','คลื่นไส้หรืออาเจียนหรือไม่?'],yesL:['Yes','ใช่'],noL:['No','ไม่ใช่'],
q5:['Are light and sound bothersome?','แสงและเสียงรบกวนหรือไม่?'],q5a:['Both','ทั้งสองอย่าง'],q5b:['One or neither','อย่างใดอย่างหนึ่งหรือไม่เลย'],
q6:['Does routine activity (walking, stairs) make it worse?','การทำกิจกรรมปกติ (เดิน ขึ้นบันได) ทำให้ปวดมากขึ้นหรือไม่?'],
q7:['Do you notice visual disturbances or other warning symptoms before the headache?','มีการมองเห็นผิดปกติหรืออาการเตือนอื่นก่อนปวดหรือไม่?'],
q8:['Have you had any of these? (tick all that apply)','เคยมีอาการเหล่านี้หรือไม่? (เลือกได้หลายข้อ)'],
rf1:['Sudden, extremely severe headache','ปวดศีรษะรุนแรงมากอย่างฉับพลัน'],rf2:['Weakness or numbness','อ่อนแรงหรือชา'],rf3:['Confusion','สับสน'],rf4:['Difficulty speaking','พูดลำบาก'],rf5:['Fever with stiff neck','ไข้ร่วมกับคอแข็ง'],rf6:['Headache after a head injury','ปวดศีรษะหลังศีรษะได้รับบาดเจ็บ'],
seeResult:['See result','ดูผลลัพธ์'],retake:['Start again','เริ่มใหม่'],eAsm:['Please answer questions 1 to 7.','กรุณาตอบคำถามข้อ 1 ถึง 7'],
rHigh:['Your answers include several features commonly associated with migraine.','คำตอบของคุณมีหลายลักษณะที่พบได้บ่อยในไมเกรน'],rMid:['Your answers include some features commonly associated with migraine.','คำตอบของคุณมีบางลักษณะที่พบได้บ่อยในไมเกรน'],rLow:['Your answers include few features commonly associated with migraine. Other headache types are possible.','คำตอบของคุณมีลักษณะของไมเกรนน้อย อาจเป็นอาการปวดศีรษะชนิดอื่นได้'],
rAura:['You noted warning symptoms before the headache, which some people with migraine describe.','คุณมีอาการเตือนก่อนปวด ซึ่งผู้ป่วยไมเกรนบางคนอธิบายไว้'],
disc:['This is not a diagnosis. Only a healthcare professional can assess your headaches. Please book an appointment and bring your symptom records.','นี่ไม่ใช่การวินิจฉัย ต้องให้บุคลากรทางการแพทย์ประเมินเท่านั้น กรุณานัดพบแพทย์และนำบันทึกอาการไปด้วย'],
emerg:['Seek emergency care now. The warning signs you ticked can indicate a serious condition. Call your local emergency number or go to the nearest emergency department.','ควรไปห้องฉุกเฉินทันที อาการที่คุณเลือกอาจบ่งชี้ภาวะร้ายแรง โทรเบอร์ฉุกเฉินในพื้นที่ของคุณหรือไปโรงพยาบาลที่ใกล้ที่สุด'],
slTitle:['Sleep tracking','บันทึกการนอน'],bed:['Bedtime','เวลาเข้านอน'],wake:['Wake-up time','เวลาตื่น'],wdate:['Wake-up date','วันที่ตื่น'],qual:['Sleep quality (1–5)','คุณภาพการนอน (1–5)'],hrs:['h','ชม.'],
sAvg:['Average sleep','การนอนเฉลี่ย'],sQ:['Average quality','คุณภาพเฉลี่ย'],sBefore:['Avg. sleep before migraine days','การนอนเฉลี่ยก่อนวันที่ปวด'],sOther:['Avg. sleep before other days','การนอนเฉลี่ยก่อนวันอื่น'],emptySleep:['No sleep records yet.','ยังไม่มีบันทึกการนอน'],
trTitle:['Possible trigger tracking','บันทึกปัจจัยกระตุ้นที่อาจเป็นไปได้'],trIntro:['Record factors you personally notice. They show patterns, not proof of cause.','บันทึกสิ่งที่คุณสังเกตเห็น ช่วยดูรูปแบบ ไม่ใช่หลักฐานของสาเหตุ'],date:['Date','วันที่'],custom:['Other factor (custom)','ปัจจัยอื่น (พิมพ์เอง)'],emptyTrig:['No factors recorded yet.','ยังไม่มีบันทึกปัจจัย'],
stress:['Stress','ความเครียด'],lowsleep:['Lack of sleep','นอนไม่พอ'],caffeine:['Too much or too little caffeine','คาเฟอีนมากหรือน้อยเกินไป'],food:['Certain foods','อาหารบางชนิด'],dehyd:['Dehydration','ขาดน้ำ'],weather:['Weather change','อากาศเปลี่ยน'],screen:['Screen time','เวลาอยู่หน้าจอ'],activity:['Physical activity','การออกกำลังกาย'],mens:['Menstrual cycle','รอบเดือน'],
eduTitle:['Migraine education','ความรู้เรื่องไมเกรน'],srcT:['Sources and further reading','แหล่งอ้างอิงและอ่านเพิ่มเติม'],srcNote:['Content is a simplified summary for education. Open the sources for full, current guidance.','เนื้อหาเป็นการสรุปแบบย่อเพื่อการศึกษา โปรดเปิดแหล่งอ้างอิงเพื่อข้อมูลฉบับเต็มและล่าสุด'],
wTitle:['Early warning signs: prodrome and aura','อาการเตือนล่วงหน้า: โปรโดรมและออร่า'],wNote:['Not everyone has these symptoms. Some people have prodrome, some have aura, some have neither, and patterns can change over time.','ไม่ใช่ทุกคนที่มีอาการเหล่านี้ บางคนมีโปรโดรม บางคนมีออร่า บางคนไม่มีเลย และอาจเปลี่ยนไปได้ตามเวลา'],
ph1:['Prodrome','โปรโดรม'],ph1t:['Hours to days before','หลายชั่วโมงถึงหลายวันก่อน'],ph1d:['Mood changes, fatigue, food cravings, frequent yawning, neck stiffness.','อารมณ์เปลี่ยน อ่อนเพลีย อยากอาหารเฉพาะ หาวบ่อย คอตึง'],
ph2:['Aura','ออร่า'],ph2t:['Before or during, usually 5 to 60 minutes','ก่อนหรือระหว่างปวด มักนาน 5 ถึง 60 นาที'],ph2d:['Flashing lights, blind spots, tingling, difficulty speaking.','เห็นแสงวูบวาบ จุดบอด รู้สึกชา เสียวซ่า พูดลำบาก'],
ph3:['Headache','ระยะปวดศีรษะ'],ph3t:['Typically 4 to 72 hours','มักนาน 4 ถึง 72 ชั่วโมง'],ph3d:['Throbbing pain, nausea, sensitivity to light and sound.','ปวดตุบ ๆ คลื่นไส้ ไวต่อแสงและเสียง'],
ph4:['Postdrome','โพสต์โดรม'],ph4t:['After the pain eases','หลังอาการปวดทุเลา'],ph4d:['Feeling drained, tired or foggy.','รู้สึกหมดแรง เพลีย หรือมึนงง'],
wDiff:['Prodrome vs. aura','โปรโดรมต่างจากออร่าอย่างไร'],wDiffP:['Prodrome is a general early warning that can start hours or days before. Aura is a temporary neurological symptom, usually building over several minutes and fading within an hour. Sudden weakness or trouble speaking that is new to you needs urgent medical help.','โปรโดรมคืออาการเตือนทั่วไปที่เริ่มได้ก่อนหลายชั่วโมงถึงหลายวัน ส่วนออร่าคืออาการทางระบบประสาทชั่วคราว มักค่อย ๆ เกิดภายในไม่กี่นาทีและหายภายในหนึ่งชั่วโมง หากอ่อนแรงหรือพูดลำบากฉับพลันและเป็นครั้งแรก ต้องรีบพบแพทย์'],
setT:['Settings','ตั้งค่า'],langL:['Language','ภาษา'],exJ:['Export JSON','ส่งออก JSON'],exC:['Export CSV','ส่งออก CSV'],rmDemo:['Remove sample data','ลบข้อมูลตัวอย่าง'],clrAll:['Clear all data','ล้างข้อมูลทั้งหมด'],demoNote:['Sample data is fictional and marked "sample".','ข้อมูลตัวอย่างเป็นข้อมูลสมมติและมีป้าย "ตัวอย่าง"'],sampleL:['sample','ตัวอย่าง'],confirmClr:['Delete ALL records on this device? This cannot be undone.','ลบบันทึกทั้งหมดในอุปกรณ์นี้หรือไม่? ไม่สามารถกู้คืนได้'],yesClr:['Yes, clear all','ใช่ ล้างทั้งหมด'],confirmDemo:['Remove all sample records?','ลบบันทึกตัวอย่างทั้งหมดหรือไม่?'],yesDemo:['Yes, remove','ใช่ ลบเลย'],
storeNote:['Data is stored only in this browser (LocalStorage).','ข้อมูลถูกเก็บในเบราว์เซอร์นี้เท่านั้น (LocalStorage)']};
const t=k=>(T[k]||[k,k])[lang==='th'?1:0];

const EDU=[
['What is migraine?','ไมเกรนคืออะไร?',['Migraine is a common neurological condition that causes recurring headaches, often moderate to severe and often felt on one side of the head. Attacks can last hours to days.'],['ไมเกรนเป็นโรคทางระบบประสาทที่พบบ่อย ทำให้ปวดศีรษะซ้ำ ๆ มักปวดปานกลางถึงรุนแรง และมักปวดข้างเดียว อาการอาจนานหลายชั่วโมงถึงหลายวัน']],
['Common symptoms','อาการที่พบบ่อย',['Throbbing or pulsing pain, often one-sided','Nausea or vomiting','Sensitivity to light, sound or smells','Pain that worsens with routine activity','Dizziness or fatigue'],['ปวดตุบ ๆ มักปวดข้างเดียว','คลื่นไส้หรืออาเจียน','ไวต่อแสง เสียง หรือกลิ่น','ปวดมากขึ้นเมื่อทำกิจกรรมปกติ','เวียนศีรษะหรืออ่อนเพลีย']],
['Types of migraine','ชนิดของไมเกรน',['Migraine without aura: the most common type.','Migraine with aura: temporary visual, sensory or speech symptoms occur with or before the headache.','Chronic migraine: headaches on 15 or more days a month. Other forms exist, so ask a clinician.'],['ไมเกรนไม่มีออร่า: พบได้บ่อยที่สุด','ไมเกรนมีออร่า: มีอาการทางสายตา การรับรู้ หรือการพูดชั่วคราว ก่อนหรือพร้อมกับปวด','ไมเกรนเรื้อรัง: ปวดศีรษะตั้งแต่ 15 วันขึ้นไปต่อเดือน ยังมีชนิดอื่นอีก ควรปรึกษาแพทย์']],
['Possible triggers','ปัจจัยกระตุ้นที่อาจเป็นไปได้',['Stress and emotional changes','Irregular or too little sleep','Skipped meals or dehydration','Certain foods and drinks, caffeine changes, alcohol','Weather changes, bright lights, screens','Hormonal changes','Triggers differ between people, and a diary helps you find your own pattern.'],['ความเครียดและอารมณ์เปลี่ยนแปลง','นอนไม่สม่ำเสมอหรือนอนน้อย','ข้ามมื้ออาหารหรือขาดน้ำ','อาหารและเครื่องดื่มบางชนิด คาเฟอีนที่เปลี่ยนไป แอลกอฮอล์','อากาศเปลี่ยน แสงจ้า หน้าจอ','การเปลี่ยนแปลงของฮอร์โมน','ปัจจัยต่างกันในแต่ละคน การจดบันทึกช่วยให้เห็นรูปแบบของคุณเอง']],
['Managing migraine','การดูแลตนเอง',['Keep a symptom diary and share it with your clinician','Keep regular sleep, meals and fluids','Find ways to manage stress','At the first sign, rest in a quiet, dark room','Ask a clinician about suitable medicines, and avoid overusing painkillers, which can cause more headaches'],['จดบันทึกอาการและแสดงให้แพทย์ดู','นอน กิน และดื่มน้ำให้สม่ำเสมอ','หาวิธีจัดการความเครียด','เมื่อเริ่มมีอาการ พักในห้องที่เงียบและมืด','ปรึกษาแพทย์เรื่องยาที่เหมาะสม และไม่ใช้ยาแก้ปวดบ่อยเกินไป เพราะอาจทำให้ปวดศีรษะมากขึ้น']],
['When to seek medical attention','เมื่อไรควรพบแพทย์',['Emergency: sudden severe headache, weakness, numbness, confusion, difficulty speaking, vision loss, seizure, fever with stiff neck, or headache after a head injury.','See a doctor soon if headaches are new, changing, frequent, or disrupt daily life.'],['ฉุกเฉิน: ปวดศีรษะรุนแรงฉับพลัน อ่อนแรง ชา สับสน พูดลำบาก ตาพร่ามัว ชัก ไข้ร่วมกับคอแข็ง หรือปวดหลังศีรษะกระทบกระแทก','ควรพบแพทย์เร็วหากปวดศีรษะแบบใหม่ เปลี่ยนไป ปวดบ่อย หรือรบกวนชีวิตประจำวัน']]];
const SRC=[
['WHO – Headache disorders','https://www.who.int/news-room/fact-sheets/detail/headache-disorders'],
['NHS – Migraine','https://www.nhs.uk/conditions/migraine/'],
['Mayo Clinic – Migraine','https://www.mayoclinic.org/diseases-conditions/migraine-headache/symptoms-causes/syc-20360201'],
['NINDS (NIH) – Migraine','https://www.ninds.nih.gov/health-information/disorders/migraine'],
['MedlinePlus – Migraine','https://medlineplus.gov/migraine.html']];

const LOC=['left','right','both','forehead','eyes','temples','back'],CHR=['throbbing','sharp','pressure','stabbing','dull'],SYM=['nausea','vomiting','light','sound','dizzy','aura'],TRG=['stress','lowsleep','caffeine','food','dehyd','weather','screen','activity','mens'];

/* ---------- data ---------- */
let D=load();
function load(){try{const d=JSON.parse(localStorage.getItem(DK));if(d&&d.m)return d}catch(e){}const d={m:[],s:[],r:[]};localStorage.setItem(DK,JSON.stringify(d));return d}
function save(){try{localStorage.setItem(DK,JSON.stringify(D))}catch(e){toast('Storage error')}}
function seed(){
  const m=[],s=[],r=[],now=new Date();
  [[2,6,'right',['throbbing'],8],[6,4,'left',['throbbing'],6],[11,5,'both',['pressure'],5],[16,7,'right',['throbbing','sharp'],8],[22,3,'forehead',['pressure'],4],[27,6,'left',['throbbing'],7],[33,5,'right',['throbbing'],6]].forEach(([ago,dur,loc,chr,pain],i)=>{
    m.push({id:'d'+i,dt:ymd(addDays(now,-ago))+'T09:00',pain,loc:[loc],chr,dur,sym:pain>5?['nausea','light']:['sound'],med:'',notes:'',demo:1})});
  for(let i=1;i<=30;i++){const hrs=[5.5,6,7,7.5,6.5,8][(i*7)%6];s.push({id:'s'+i,date:ymd(addDays(now,-i)),bed:'23:30',wake:'06:30',hrs,q:1+(i*3)%5,notes:'',demo:1})}
  [[3,['stress','lowsleep']],[7,['caffeine']],[12,['stress']],[17,['weather','screen']],[23,['lowsleep']]].forEach(([ago,f],i)=>r.push({id:'t'+i,date:ymd(addDays(now,-ago)),f,custom:'',notes:'',demo:1}));
  return{m,s,r};
}
const byDate=(a,b)=>(b.dt||b.date).localeCompare(a.dt||a.date);

/* ---------- ui helpers ---------- */
function toast(msg){const e=$('#toast');e.textContent=msg;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2200)}
function ask(msg,yes,onYes){$('#dlgMsg').textContent=msg;$('#dlgNo').textContent=t('no');$('#dlgYes').textContent=yes||t('yes');$('#dlgYes').onclick=()=>{$('#dlg').close();onYes()};$('#dlgNo').onclick=()=>$('#dlg').close();$('#dlg').showModal()}
const chips=(name,list,sel=[])=>`<div class="chips">${list.map(k=>`<label class="chip"><input type="checkbox" name="${name}" value="${k}" ${sel.includes(k)?'checked':''}><span>${t(k)}</span></label>`).join('')}</div>`;
const checked=(f,n)=>$$(`input[name=${n}]:checked`,f).map(i=>i.value);
const tags=a=>a.map(k=>`<span class="tag">${esc(T[k]?t(k):k)}</span>`).join('');
const fmtDt=s=>new Date(s).toLocaleString(lang==='th'?'th-TH':'en-GB',{dateStyle:'medium',timeStyle:s.includes('T')?'short':undefined});
const sampleTag=r=>r.demo?`<span class="tag" style="background:var(--blue)">${t('sampleL')}</span>`:'';
function hours(b,w){const x=b.split(':'),y=w.split(':'),d=((+y[0]*60+ +y[1])-(+x[0]*60+ +x[1])+1440)%1440;return Math.round(d/6)/10}
function drawChart(id,cfg){const c=$('#'+id);if(!c)return;if(typeof Chart==='undefined'){c.parentNode.innerHTML=`<p class="empty">${t('noChart')}</p>`;return}
  cfg.options=Object.assign({responsive:true,maintainAspectRatio:false},cfg.options);charts.push(new Chart(c,cfg))}
const emptyIf=(id,has)=>has?'':($('#'+id).parentNode.innerHTML=`<p class="empty">${t('emptyChart')}</p>`,true);

/* ---------- views ---------- */
const VIEWS={dash,rec:record,stats,asm:assess,sleep:sleepV,trig:trigV,edu:eduV,warn:warnV,set:settings};
const ORDER=['dash','rec','stats','asm','sleep','trig','edu','warn','set'];

function route(){
  const id=VIEWS[location.hash.slice(1)]?location.hash.slice(1):'dash';
  charts.forEach(c=>c.destroy());charts=[];
  $('#nav').innerHTML=ORDER.map(k=>`<a href="#${k}" ${k===id?'aria-current="page"':''}>${t(k)}</a>`).join('');
  $('#nav').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');
  $('#lang').textContent=lang==='en'?'TH':'EN';document.documentElement.lang=lang;document.title=t('brand')+' · '+t(id);
  $$('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
  const v=$('#view');v.innerHTML='';VIEWS[id](v);v.classList.remove('view-in');void v.offsetWidth;v.classList.add('view-in');
}

function dash(v){
  const M=[...D.m].sort(byDate),n=new Date(),wk=weekStart(n),mo=ymd(n).slice(0,7);
  const avg=M.length?(M.reduce((a,b)=>a+b.pain,0)/M.length).toFixed(1):'–';
  const days=[...Array(28)].map((_,i)=>{const d=ymd(addDays(n,i-27));const p=Math.max(0,...D.m.filter(x=>x.dt.startsWith(d)).map(x=>x.pain));return[d,p]});
  const act=[...D.m.map(x=>({d:x.dt,l:`${t('tMig')}: ${x.pain}/10`})),...D.s.map(x=>({d:x.date,l:`${t('tSleep')}: ${x.hrs} ${t('hrs')}`})),...D.r.map(x=>({d:x.date,l:`${t('tTrig')}: ${x.f.map(k=>T[k]?t(k):k).concat(x.custom?[x.custom]:[]).join(', ')}`}))].sort((a,b)=>b.d.localeCompare(a.d)).slice(0,6);
  v.innerHTML=`<div class="hero"><h1>${t('welcome')}</h1><p>${t('welSub')}</p>
   <div class="ribbon" role="img" aria-label="${t('welSub')}">${days.map(([d,p])=>`<i ${p?'data-l':''} style="height:${p?p*10:6}%" title="${d}${p?': '+p+'/10':''}"></i>`).join('')}</div></div>
   <div class="grid"><div class="card stat"><b>${M.length}</b><span>${t('total')}</span></div><div class="card stat"><b>${avg}</b><span>${t('avg')}</span></div>
   <div class="card stat"><b style="font-size:1.2rem">${M[0]?fmtDt(M[0].dt):t('none')}</b><span>${t('latest')}${M[0]?` · ${M[0].pain}/10`:''}</span></div></div>
   <div class="grid"><div class="card stat"><b>${D.m.filter(x=>x.dt.slice(0,10)>=wk).length}</b><span>${t('week')} (${t('episodes')})</span></div><div class="card stat"><b>${D.m.filter(x=>x.dt.startsWith(mo)).length}</b><span>${t('month')} (${t('episodes')})</span></div></div>
   <div class="row" style="margin-bottom:20px"><a class="btn" href="#rec">${t('qRec')}</a><a class="btn ghost" href="#stats">${t('qStats')}</a></div>
   <div class="card"><h2>${t('recent')}</h2><div class="list">${act.length?act.map(a=>`<div><span>${esc(a.l)}</span><small>${fmtDt(a.d)}</small></div>`).join(''):`<p class="empty">${t('none')}</p>`}</div></div>`;
}
function weekStart(d){const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return ymd(x)}

function record(v,editId){
  const e=D.m.find(x=>x.id===editId)||{dt:ymd(new Date())+'T'+pad(new Date().getHours())+':'+pad(new Date().getMinutes()),pain:5,loc:[],chr:[],dur:2,sym:[],med:'',notes:''};
  v.innerHTML=`<h1>${t('rec')}</h1><form class="card" id="f" novalidate>
   <div class="two"><div><label class="f" for="dt">${t('dt')}</label><input type="datetime-local" id="dt" value="${e.dt}"></div>
   <div><label class="f" for="dur">${t('dur')}</label><input type="number" id="dur" step="0.1" min="0.1" max="168" value="${e.dur}"></div></div>
   <label class="f" for="pain">${t('pain')}: <output id="po">${e.pain}</output>/10</label><input type="range" id="pain" min="1" max="10" value="${e.pain}">
   <label class="f">${t('loc')}</label>${chips('loc',LOC,e.loc)}<label class="f">${t('chr')}</label>${chips('chr',CHR,e.chr)}<label class="f">${t('sym')}</label>${chips('sym',SYM,e.sym)}
   <label class="f" for="med">${t('med')}</label><input id="med" value="${esc(e.med)}"><label class="f" for="nt">${t('notes')}</label><textarea id="nt" rows="3">${esc(e.notes)}</textarea>
   <p class="err" id="er" role="alert"></p><div class="row"><button class="btn">${editId?t('update'):t('save')}</button>${editId?`<button type="button" class="btn ghost" id="cn">${t('cancel')}</button>`:''}</div></form>
   <div class="card"><h2>${t('history')}</h2><div class="list">${D.m.length?[...D.m].sort(byDate).map(x=>`<div><span><b>${x.pain}/10</b> · ${fmtDt(x.dt)} · ${x.dur} ${t('hrs')} ${sampleTag(x)}<small>${tags([...x.loc,...x.chr,...x.sym])}${esc(x.med)}${x.notes?' · '+esc(x.notes):''}</small></span><span class="row"><button class="btn ghost sm" data-e="${x.id}">${t('edit')}</button><button class="btn danger sm" data-d="${x.id}">${t('del')}</button></span></div>`).join(''):`<p class="empty">${t('emptyRec')}</p>`}</div></div>`;
  $('#pain').oninput=ev=>$('#po').textContent=ev.target.value;
  if($('#cn'))$('#cn').onclick=()=>{v.innerHTML='';record(v)};
  $('#f').onsubmit=ev=>{ev.preventDefault();const dt=$('#dt').value,dur=parseFloat($('#dur').value);
    if(!dt||new Date(dt)>new Date()){return $('#er').textContent=t('eDate')}
    if(!(dur>=0.1&&dur<=168))return $('#er').textContent=t('eDur');
    const r={id:editId||uid(),dt,pain:+$('#pain').value,loc:checked(ev.target,'loc'),chr:checked(ev.target,'chr'),dur,sym:checked(ev.target,'sym'),med:$('#med').value.trim(),notes:$('#nt').value.trim()};
    if(editId)D.m=D.m.map(x=>x.id===editId?r:x);else D.m.push(r);save();toast(t(editId?'updated':'saved'));v.innerHTML='';record(v)};
  listActions(v,'m',id=>{v.innerHTML='';record(v,id);scrollTo(0,0)},()=>{v.innerHTML='';record(v)});
}
function listActions(v,key,onEdit,refresh){
  $$('[data-e]',v).forEach(b=>b.onclick=()=>onEdit(b.dataset.e));
  $$('[data-d]',v).forEach(b=>b.onclick=()=>ask(t('confirmDel'),t('yes'),()=>{D[key]=D[key].filter(x=>x.id!==b.dataset.d);save();toast(t('deleted'));refresh()}));
}

function stats(v){
  v.innerHTML=`<h1>${t('stats')}</h1>${[['cFreq','c1'],['cPain','c2'],['cCmp','c3'],['cSleep','c4'],['cSym','c5'],['cTrig','c6']].map(([k,id])=>`<div class="card"><h2>${t(k)}</h2><div class="chart"><canvas id="${id}" role="img" aria-label="${t(k)}"></canvas></div></div>`).join('')}<div class="card"><h2>${t('trigRel')}</h2>${relTable()}<div class="note">${t('trigRelNote')}</div></div>`;
  const M=[...D.m].sort((a,b)=>a.dt.localeCompare(b.dt)),n=new Date();
  const wks=[...Array(8)].map((_,i)=>weekStart(addDays(n,(i-7)*7)));
  if(!emptyIf('c1',M.length))drawChart('c1',{type:'bar',data:{labels:wks,datasets:[{label:t('episodes'),data:wks.map(w=>M.filter(x=>weekStart(x.dt)===w).length),backgroundColor:'#c9bdf0',borderRadius:8}]},options:{scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});
  if(!emptyIf('c2',M.length))drawChart('c2',{type:'line',data:{labels:M.map(x=>x.dt.slice(0,10)),datasets:[{label:t('pain'),data:M.map(x=>x.pain),borderColor:'#6b57b8',backgroundColor:'#fbdbe7',tension:.3,fill:true}]},options:{scales:{y:{min:0,max:10}}}});
  const cnt=(f,t0)=>M.filter(x=>f(x.dt)).length,tw=weekStart(n),lw=weekStart(addDays(n,-7)),tm=ymd(n).slice(0,7),lm=ymd(new Date(n.getFullYear(),n.getMonth()-1,1)).slice(0,7);
  if(!emptyIf('c3',M.length))drawChart('c3',{type:'bar',data:{labels:[t('wk'),t('mo')],datasets:[{label:t('cur'),data:[cnt(d=>weekStart(d)===tw),cnt(d=>d.startsWith(tm))],backgroundColor:'#6b57b8',borderRadius:8},{label:t('prev'),data:[cnt(d=>weekStart(d)===lw),cnt(d=>d.startsWith(lm))],backgroundColor:'#fbdbe7',borderRadius:8}]},options:{scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});
  const ds=[...Array(30)].map((_,i)=>ymd(addDays(n,i-29)));
  if(!emptyIf('c4',D.s.length||M.length))drawChart('c4',{data:{labels:ds,datasets:[{type:'bar',label:t('sleepH'),data:ds.map(d=>(D.s.find(s=>s.date===d)||{}).hrs??null),backgroundColor:'#d3e8f8',yAxisID:'y'},{type:'line',label:t('painL'),data:ds.map(d=>{const p=M.filter(x=>x.dt.startsWith(d)).map(x=>x.pain);return p.length?Math.max(...p):null}),borderColor:'#c0425e',pointRadius:5,spanGaps:false,showLine:false,yAxisID:'y1'}]},options:{scales:{y:{beginAtZero:true,title:{display:true,text:t('sleepH')}},y1:{position:'right',min:0,max:10,grid:{drawOnChartArea:false},title:{display:true,text:t('painL')}}}}});
  const tally=(arr,ks)=>ks.map(k=>[k,arr.filter(k2=>k2===k).length]).filter(x=>x[1]).sort((a,b)=>b[1]-a[1]);
  const sy=tally(M.flatMap(x=>x.sym),SYM);
  if(!emptyIf('c5',sy.length))drawChart('c5',{type:'bar',data:{labels:sy.map(x=>t(x[0])),datasets:[{data:sy.map(x=>x[1]),backgroundColor:'#fbdbe7',borderRadius:8}]},options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,ticks:{precision:0}}}}});
  const allF=D.r.flatMap(x=>x.f.concat(x.custom?[x.custom.toLowerCase()]:[])),keys=[...new Set(allF)],tr=keys.map(k=>[k,allF.filter(z=>z===k).length]).sort((a,b)=>b[1]-a[1]);
  if(!emptyIf('c6',tr.length))drawChart('c6',{type:'bar',data:{labels:tr.map(x=>T[x[0]]?t(x[0]):x[0]),datasets:[{data:tr.map(x=>x[1]),backgroundColor:'#c9bdf0',borderRadius:8}]},options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,ticks:{precision:0}}}}});
}
function relTable(){
  const map={};D.r.forEach(r=>r.f.concat(r.custom?[r.custom]:[]).forEach(k=>{const hit=D.m.some(m=>{const d=m.dt.slice(0,10);return d===r.date||d===ymd(addDays(r.date+'T00:00',1))});(map[k]=map[k]||[0,0])[0]++;if(hit)map[k][1]++}));
  const rows=Object.entries(map).sort((a,b)=>b[1][0]-a[1][0]);
  return rows.length?`<div class="list">${rows.map(([k,[n,h]])=>`<div><span>${esc(T[k]?t(k):k)}</span><span>${h}/${n} ${t('withMig')}</span></div>`).join('')}</div>`:`<p class="empty">${t('emptyChart')}</p>`;
}

const AQ=[['q1',[['q1a',0],['q1b',1],['q1c',1]]],['q2',[['q2a',0],['q2b',1],['q2c',0]]],['q3',[['q3a',1],['q3b',0]]],['q4',[['yesL',1],['noL',0]]],['q5',[['q5a',1],['q5b',0]]],['q6',[['yesL',1],['noL',0]]],['q7',[['yesL',0],['noL',0]]]];
function assess(v){
  v.innerHTML=`<h1>${t('asmTitle')}</h1><p>${t('asmIntro')}</p><form class="card" id="f">${AQ.map(([q,o])=>`<div class="q"><b>${t(q)}</b><div class="chips">${o.map(([k,s])=>`<label class="chip"><input type="radio" name="${q}" value="${s}" data-k="${k}"><span>${t(k)}</span></label>`).join('')}</div></div>`).join('')}
   <div class="q"><b>${t('q8')}</b>${chips('rf',['rf1','rf2','rf3','rf4','rf5','rf6'])}</div><p class="err" id="er" role="alert"></p><button class="btn">${t('seeResult')}</button></form><div id="res"></div>`;
  $('#f').onsubmit=ev=>{ev.preventDefault();const f=ev.target;
    if(AQ.some(([q])=>!$(`input[name=${q}]:checked`,f)))return $('#er').textContent=t('eAsm');$('#er').textContent='';
    const sc=AQ.slice(0,6).reduce((a,[q])=>a+ +$(`input[name=${q}]:checked`,f).value,0),aura=$('input[name=q7]:checked',f).dataset.k==='yesL',red=checked(f,'rf').length;
    $('#res').innerHTML=`<div class="card">${red?`<div class="alert"><b>${t('emerg')}</b></div>`:''}<h2>${t(sc>=5?'rHigh':sc>=3?'rMid':'rLow')}</h2>${aura?`<p>${t('rAura')}</p>`:''}<div class="note">${t('disc')}</div><button class="btn ghost" onclick="route()">${t('retake')}</button></div>`;$('#res').scrollIntoView({behavior:'smooth'})};
}

function sleepV(v,editId){
  const e=D.s.find(x=>x.id===editId)||{date:today(),bed:'23:00',wake:'07:00',q:3,notes:''};
  const S=[...D.s].sort(byDate),avgOf=a=>a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1):'–';
  const mdays=new Set(D.m.map(m=>m.dt.slice(0,10)));
  v.innerHTML=`<h1>${t('slTitle')}</h1><div class="grid"><div class="card stat"><b>${avgOf(S.map(x=>x.hrs))}</b><span>${t('sAvg')} (${t('hrs')})</span></div><div class="card stat"><b>${avgOf(S.map(x=>x.q))}</b><span>${t('sQ')}</span></div>
   <div class="card stat"><b>${avgOf(S.filter(x=>mdays.has(x.date)).map(x=>x.hrs))}</b><span>${t('sBefore')}</span></div><div class="card stat"><b>${avgOf(S.filter(x=>!mdays.has(x.date)).map(x=>x.hrs))}</b><span>${t('sOther')}</span></div></div>
   <form class="card" id="f"><div class="two"><div><label class="f" for="bd">${t('bed')}</label><input type="time" id="bd" value="${e.bed}"></div><div><label class="f" for="wk">${t('wake')}</label><input type="time" id="wk" value="${e.wake}"></div>
   <div><label class="f" for="dd">${t('wdate')}</label><input type="date" id="dd" value="${e.date}" max="${today()}"></div><div><label class="f" for="q">${t('qual')}: <output id="qo">${e.q}</output></label><input type="range" id="q" min="1" max="5" value="${e.q}"></div></div>
   <label class="f" for="nt">${t('notes')}</label><textarea id="nt" rows="2">${esc(e.notes)}</textarea><p class="err" id="er" role="alert"></p><div class="row"><button class="btn">${editId?t('update'):t('save')}</button>${editId?`<button type="button" class="btn ghost" id="cn">${t('cancel')}</button>`:''}</div></form>
   <div class="card"><h2>${t('history')}</h2><div class="list">${S.length?S.slice(0,40).map(x=>`<div><span><b>${x.hrs} ${t('hrs')}</b> · ${x.date} · ${x.q}/5 ${sampleTag(x)}<small>${x.bed}–${x.wake}${x.notes?' · '+esc(x.notes):''}</small></span><span class="row"><button class="btn ghost sm" data-e="${x.id}">${t('edit')}</button><button class="btn danger sm" data-d="${x.id}">${t('del')}</button></span></div>`).join(''):`<p class="empty">${t('emptySleep')}</p>`}</div></div>`;
  const re=id=>{v.innerHTML='';sleepV(v,id)};
  $('#q').oninput=ev=>$('#qo').textContent=ev.target.value;if($('#cn'))$('#cn').onclick=()=>re();
  $('#f').onsubmit=ev=>{ev.preventDefault();const b=$('#bd').value,w=$('#wk').value,d=$('#dd').value;if(!b||!w||!d)return $('#er').textContent=t('eSleep');
    const r={id:editId||uid(),date:d,bed:b,wake:w,hrs:hours(b,w),q:+$('#q').value,notes:$('#nt').value.trim()};
    if(editId)D.s=D.s.map(x=>x.id===editId?r:x);else D.s.push(r);save();toast(t(editId?'updated':'saved'));re()};
  listActions(v,'s',re,()=>re());
}

function trigV(v,editId){
  const e=D.r.find(x=>x.id===editId)||{date:today(),f:[],custom:'',notes:''};
  v.innerHTML=`<h1>${t('trTitle')}</h1><p>${t('trIntro')}</p><form class="card" id="f"><label class="f" for="dd">${t('date')}</label><input type="date" id="dd" value="${e.date}" max="${today()}" style="max-width:220px">
   <label class="f">${t('tTrig')}</label>${chips('f',TRG,e.f)}<label class="f" for="cu">${t('custom')}</label><input id="cu" value="${esc(e.custom)}"><label class="f" for="nt">${t('notes')}</label><textarea id="nt" rows="2">${esc(e.notes)}</textarea>
   <p class="err" id="er" role="alert"></p><div class="row"><button class="btn">${editId?t('update'):t('save')}</button>${editId?`<button type="button" class="btn ghost" id="cn">${t('cancel')}</button>`:''}</div></form>
   <div class="card"><h2>${t('trigRel')}</h2>${relTable()}<div class="note">${t('trigRelNote')}</div></div>
   <div class="card"><h2>${t('history')}</h2><div class="list">${D.r.length?[...D.r].sort(byDate).map(x=>`<div><span>${x.date} ${sampleTag(x)}<small>${tags(x.f)}${x.custom?`<span class="tag">${esc(x.custom)}</span>`:''}${x.notes?' '+esc(x.notes):''}</small></span><span class="row"><button class="btn ghost sm" data-e="${x.id}">${t('edit')}</button><button class="btn danger sm" data-d="${x.id}">${t('del')}</button></span></div>`).join(''):`<p class="empty">${t('emptyTrig')}</p>`}</div></div>`;
  const re=id=>{v.innerHTML='';trigV(v,id)};if($('#cn'))$('#cn').onclick=()=>re();
  $('#f').onsubmit=ev=>{ev.preventDefault();const f=checked(ev.target,'f'),c=$('#cu').value.trim();if(!f.length&&!c)return $('#er').textContent=t('eTrig');
    const r={id:editId||uid(),date:$('#dd').value||today(),f,custom:c,notes:$('#nt').value.trim()};
    if(editId)D.r=D.r.map(x=>x.id===editId?r:x);else D.r.push(r);save();toast(t(editId?'updated':'saved'));re()};
  listActions(v,'r',re,()=>re());
}

function eduV(v){
  const th=lang==='th';
  v.innerHTML=`<h1>${t('eduTitle')}</h1>${EDU.map((s,i)=>{const b=s[th?3:2];return `<details ${i===0?'open':''}><summary>${i+1}. ${s[th?1:0]}</summary>${b.length>1&&i!==2&&i!==5?`<ul>${b.map(x=>`<li>${x}</li>`).join('')}</ul>`:b.map(x=>`<p>${x}</p>`).join('')}</details>`}).join('')}
   <div class="card"><h2>${t('srcT')}</h2><ul>${SRC.map(([n,u])=>`<li><a href="${u}" target="_blank" rel="noopener noreferrer">${n}</a></li>`).join('')}</ul><div class="note">${t('srcNote')}</div></div>`;
}
function warnV(v){
  v.innerHTML=`<h1>${t('wTitle')}</h1><div class="note">${t('wNote')}</div><div class="tl">${[1,2,3,4].map(i=>`<div><h3>${t('ph'+i)}</h3><small>${t('ph'+i+'t')}</small><p>${t('ph'+i+'d')}</p></div>`).join('')}</div>
   <div class="card"><h2>${t('wDiff')}</h2><svg viewBox="0 0 320 70" width="100%" height="70" role="img" aria-label="Aura illustration"><path d="M5 50 L35 15 L65 50 L95 15 L125 50 L155 15 L185 50 L215 15 L245 50 L275 15 L315 50" fill="none" stroke="#6b57b8" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg><p>${t('wDiffP')}</p></div>`;
}

function settings(v){
  v.innerHTML=`<h1>${t('setT')}</h1><div class="card"><h2>${t('langL')}</h2><div class="row"><button class="btn ${lang==='en'?'':'ghost'}" data-l="en">English</button><button class="btn ${lang==='th'?'':'ghost'}" data-l="th">ไทย</button></div></div>
   <div class="card"><div class="row"><button class="btn ghost" id="ej">${t('exJ')}</button><button class="btn ghost" id="ec">${t('exC')}</button></div><p>${t('storeNote')}</p></div>
   <div class="card"><div class="row"><button class="btn ghost" id="rd">${t('rmDemo')}</button><button class="btn danger" id="ca">${t('clrAll')}</button></div><p>${t('demoNote')}</p></div>`;
  $$('[data-l]',v).forEach(b=>b.onclick=()=>setLang(b.dataset.l));
  $('#ej').onclick=()=>dl('migrainecare.json',JSON.stringify(D,null,2),'application/json');
  $('#ec').onclick=()=>{const q=s=>`"${String(s??'').replace(/"/g,'""')}"`;
    const rows=[['type','date','pain','duration_h','location','characteristics','symptoms','medication','bedtime','wake','sleep_h','sleep_quality','factors','notes'],
     ...D.m.map(x=>['migraine',x.dt,x.pain,x.dur,x.loc.join('|'),x.chr.join('|'),x.sym.join('|'),x.med,'','','','','',x.notes]),
     ...D.s.map(x=>['sleep',x.date,'','','','','','',x.bed,x.wake,x.hrs,x.q,'',x.notes]),
     ...D.r.map(x=>['trigger',x.date,'','','','','','','','','','',x.f.concat(x.custom?[x.custom]:[]).join('|'),x.notes])];
    dl('migrainecare.csv','\ufeff'+rows.map(r=>r.map(q).join(',')).join('\n'),'text/csv')};
  $('#rd').onclick=()=>ask(t('confirmDemo'),t('yesDemo'),()=>{['m','s','r'].forEach(k=>D[k]=D[k].filter(x=>!x.demo));save();toast(t('deleted'))});
  $('#ca').onclick=()=>ask(t('confirmClr'),t('yesClr'),()=>{D={m:[],s:[],r:[]};save();toast(t('deleted'))});
}
function dl(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function setLang(l){lang=l;try{localStorage.setItem(LK,l)}catch(e){}route()}

$('#lang').onclick=()=>setLang(lang==='en'?'th':'en');
$('#menu').onclick=()=>{const o=$('#nav').classList.toggle('open');$('#menu').setAttribute('aria-expanded',o)};
addEventListener('hashchange',()=>{route();scrollTo(0,0)});
route();
