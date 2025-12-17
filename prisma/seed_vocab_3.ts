import { PrismaClient, Level, PartOfSpeech } from "@prisma/client";

const prisma = new PrismaClient();

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

// Helper to create vocab item
const v = (
  word: string,
  phonBr: string,
  phonNAm: string,
  meaning: string,
  vietnameseMeaning: string,
  partOfSpeech: PartOfSpeech,
  exampleSentence: string,
  exampleTranslation: string,
  synonyms: string[] = [],
  antonyms: string[] = [],
  collocations: string[] = []
) => ({
  word,
  phonBr,
  phonNAm,
  meaning,
  vietnameseMeaning,
  partOfSpeech,
  exampleSentence,
  exampleTranslation,
  synonyms,
  antonyms,
  collocations,
});

// ============================================
// TOPIC GROUP 3: HEALTH
// ============================================

const healthVocab = {
  "Body Parts": {
    A1: [
      v("head", "/hed/", "/hed/", "top part of body", "đầu", "noun", "My head hurts.", "Đầu tôi đau.", [], [], ["shake head"]),
      v("eye", "/aɪ/", "/aɪ/", "organ for seeing", "mắt", "noun", "Close your eyes.", "Nhắm mắt lại.", [], [], ["open eyes"]),
      v("hand", "/hænd/", "/hænd/", "end of arm", "bàn tay", "noun", "Wash your hands.", "Rửa tay đi.", [], [], ["shake hands"]),
      v("leg", "/leɡ/", "/leɡ/", "limb for walking", "kết chân", "noun", "I broke my leg.", "Tôi bị gãy chân.", [], [], ["long legs"]),
      v("face", "/feɪs/", "/feɪs/", "front of head", "khuôn mặt", "noun", "Wash your face.", "Rửa mặt đi.", [], [], ["beautiful face"]),
      v("mouth", "/maʊθ/", "/maʊθ/", "part for eating", "miệng", "noun", "Open your mouth.", "Há miệng ra.", [], [], ["shut mouth"]),
      v("foot", "/fʊt/", "/fʊt/", "bottom of leg", "bàn chân", "noun", "My foot is sore.", "Chân tôi đau.", [], [], ["on foot"]),
      v("arm", "/ɑːm/", "/ɑːrm/", "upper limb", "cánh tay", "noun", "Raise your arm.", "Giơ tay lên.", [], [], ["strong arm"]),
      v("ear", "/ɪər/", "/ɪr/", "organ for hearing", "tai", "noun", "I have two ears.", "Tôi có hai cái tai.", [], [], ["listen ear"]),
      v("hair", "/heər/", "/her/", "stuff on head", "tóc", "noun", "Brush your hair.", "Chải tóc đi.", [], [], ["long hair"]),
    ],
    B1: [
      v("stomach", "/ˈstʌmək/", "/ˈstʌmək/", "organ for food", "dạ dày/bụng", "noun", "My stomach aches.", "Bụng tôi đau.", ["belly"], [], ["stomach ache"]),
      v("muscle", "/ˈmʌsl/", "/ˈmʌsl/", "tissue for movement", "cơ bắp", "noun", "Build muscle.", "Xây dựng cơ bắp.", [], [], ["strong muscle"]),
      v("bone", "/bəʊn/", "/boʊn/", "hard part of body", "xương", "noun", "Broken bone.", "Gãy xương.", [], [], ["bone structure"]),
      v("brain", "/breɪn/", "/breɪn/", "organ for thinking", "não", "noun", "Use your brain.", "Dùng não đi.", [], [], ["brain power"]),
      v("heart", "/hɑːt/", "/hɑːrt/", "organ pumping blood", "tim", "noun", "My heart beats fast.", "Tim tôi đập nhanh.", [], [], ["heart attack"]),
      v("skin", "/skɪn/", "/skɪn/", "outer covering", "da", "noun", "Protect your skin.", "Bảo vệ da bạn.", [], [], ["skin care"]),
      v("throat", "/θrəʊt/", "/θroʊt/", "passage in neck", "cổ họng", "noun", "Sore throat.", "Đau họng.", [], [], ["throat infection"]),
      v("tongue", "/tʌŋ/", "/tʌŋ/", "organ for taste", "lưỡi", "noun", "Bite your tongue.", "Cắn phải lưỡi.", [], [], ["sharp tongue"]),
      v("blood", "/blʌd/", "/blʌd/", "red liquid in body", "máu", "noun", "Donate blood.", "Hiến máu.", [], [], ["blood pressure"]),
      v("lung", "/lʌŋ/", "/lʌŋ/", "organ for breathing", "phổi", "noun", "Lungs help us breathe.", "Phổi giúp ta thở.", [], [], ["lung cancer"]),
    ],
    C1: [
      v("anatomy", "/əˈnætəmi/", "/əˈnætəmi/", "structure of body", "giải phẫu học", "noun", "Study anatomy.", "Học giải phẫu.", [], [], ["human anatomy"]),
      v("skeleton", "/ˈskelɪtn/", "/ˈskelɪtn/", "all bones", "bộ xương", "noun", "The human skeleton.", "Bộ xương người.", [], [], ["skeleton key"]),
      v("vein", "/veɪn/", "/veɪn/", "tube for blood to heart", "tĩnh mạch", "noun", "Veins carry blood.", "Tĩnh mạch dẫn máu.", ["artery"], [], ["blue vein"]),
      v("artery", "/ˈɑːtəri/", "/ˈɑːrtəri/", "tube for blood from heart", "động mạch", "noun", "Blocked artery.", "Tắc động mạch.", ["vein"], [], ["coronary artery"]),
      v("spine", "/spaɪn/", "/spaɪn/", "backbone", "cột sống", "noun", "Injure your spine.", "Chấn thương cột sống.", ["backbone"], [], ["curved spine"]),
      v("organ", "/ˈɔːɡən/", "/ˈɔːrɡən/", "part with specific function", "cơ quan", "noun", "Vital organs.", "Cơ quan nội tạng quan trọng.", [], [], ["organ donor"]),
      v("tissue", "/ˈtɪʃuː/", "/ˈtɪʃuː/", "group of cells", "mô", "noun", "Muscle tissue.", "Mô cơ.", [], [], ["scar tissue"]),
      v("gland", "/ɡlænd/", "/ɡlænd/", "organ usually secreting", "tuyến", "noun", "Swollen glands.", "Sưng tuyến.", [], [], ["sweat gland"]),
      v("joint", "/dʒɔɪnt/", "/dʒɔɪnt/", "where bones meet", "khớp", "noun", "Aching joints.", "Đau khớp.", [], [], ["knee joint"]),
      v("nerve", "/nɜːv/", "/nɜːrv/", "fibre carrying messages", "dây thần kinh", "noun", "Nerve damage.", "Tổn thương thần kinh.", [], [], ["pinch nerve"]),
    ],
  },
  "Medical Care": {
    A1: [
      v("doctor", "/ˈdɒktər/", "/ˈdɑːktər/", "person treating sick", "bác sĩ", "noun", "See a doctor.", "Đi khám bác sĩ.", ["physician"], [], ["family doctor"]),
      v("hospital", "/ˈhɒspɪtl/", "/ˈhɑːspɪtl/", "place for sick people", "bệnh viện", "noun", "Go to the hospital.", "Đến bệnh viện.", [], [], ["local hospital"]),
      v("sick", "/sɪk/", "/sɪk/", "not healthy", "ốm", "adjective", "I feel sick.", "Tôi thấy mệt.", ["ill"], ["healthy"], ["get sick"]),
      v("medicine", "/ˈmedsn/", "/ˈmedsn/", "drug to cure", "thuốc", "noun", "Take medicine.", "Uống thuốc.", ["drug"], [], ["cough medicine"]),
      v("help", "/help/", "/help/", "aid", "giúp đỡ", "verb", "Help me!", "Giúp tôi với!", ["assist"], [], ["ask for help"]),
      v("pain", "/peɪn/", "/peɪn/", "hurt feeling", "cơn đau", "noun", "I have pain here.", "Tôi đau ở đây.", ["ache"], [], ["chest pain"]),
      v("nurse", "/nɜːs/", "/nɜːrs/", "hospital worker", "y tá", "noun", "Ask the nurse.", "Hỏi y tá.", [], [], ["hospital nurse"]),
      v("ill", "/ɪl/", "/ɪl/", "not well", "bệnh", "adjective", "He is very ill.", "Anh ấy bệnh nặng.", ["sick"], ["well"], ["fall ill"]),
      v("cold", "/kəʊld/", "/koʊld/", "common illness", "cảm lạnh", "noun", "Catch a cold.", "Bị cảm lạnh.", [], [], ["bad cold"]),
      v("hurt", "/hɜːt/", "/hɜːrt/", "cause pain", "đau/làm đau", "verb", "It hurts.", "Nó đau.", ["pain"], [], ["get hurt"]),
    ],
    B1: [
      v("appointment", "/əˈpɔɪntmənt/", "/əˈpɔɪntmənt/", "time to meet doctor", "cuộc hẹn", "noun", "Make an appointment.", "Đặt lịch hẹn.", ["meeting"], [], ["doctor appointment"]),
      v("prescription", "/prɪˈskrɪpʃn/", "/prɪˈskrɪpʃn/", "paper for medicine", "đơn thuốc", "noun", "Get a prescription.", "Lấy đơn thuốc.", [], [], ["fill prescription"]),
      v("symptom", "/ˈsɪmptəm/", "/ˈsɪmptəm/", "sign of illness", "triệu chứng", "noun", "Flu symptoms.", "Triệu chứng cúm.", ["sign"], [], ["common symptom"]),
      v("treatment", "/ˈtriːtmənt/", "/ˈtriːtmənt/", "cure process", "điều trị", "noun", "Successful treatment.", "Điều trị thành công.", ["cure"], [], ["medical treatment"]),
      v("injury", "/ˈɪndʒəri/", "/ˈɪndʒəri/", "harm to body", "chấn thương", "noun", "Serious injury.", "Chấn thương nghiêm trọng.", ["wound"], [], ["head injury"]),
      v("patient", "/ˈpeɪʃnt/", "/ˈpeɪʃnt/", "person seeing doctor", "bệnh nhân", "noun", "The patient is waiting.", "Bệnh nhân đang đợi.", [], ["doctor"], ["hospital patient"]),
      v("examine", "/ɪɡˈzæmɪn/", "/ɪɡˈzæmɪn/", "check body", "khám", "verb", "Examine the patient.", "Khám cho bệnh nhân.", ["check"], [], ["medical examine"]),
      v("cure", "/kjʊər/", "/kjʊr/", "make well", "chữa khỏi", "verb", "Cure the disease.", "Chữa khỏi bệnh.", ["heal"], [], ["find cure"]),
      v("virus", "/ˈvaɪrəs/", "/ˈvaɪrəs/", "germ causing illness", "vi-rút", "noun", "Computer virus.", "Vi-rút máy tính (nghĩa khác).", [], [], ["deadly virus"]),
      v("bandage", "/ˈbændɪdʒ/", "/ˈbændɪdʒ/", "cloth for wound", "băng gạc", "noun", "Put on a bandage.", "Băng lại.", ["dressing"], [], ["apply bandage"]),
    ],
    C2: [
      v("diagnosis", "/ˌdaɪəɡˈnəʊsɪs/", "/ˌdaɪəɡˈnoʊsɪs/", "identification of illness", "chẩn đoán", "noun", "Make a diagnosis.", "Đưa ra chẩn đoán.", [], [], ["early diagnosis"]),
      v("prognosis", "/prɒɡˈnəʊsɪs/", "/prɑːɡˈnoʊsɪs/", "prediction of outcome", "tiên lượng", "noun", "The prognosis is good.", "Tiên lượng tốt.", [], [], ["medical prognosis"]),
      v("anesthesia", "/ˌænəsˈθiːziə/", "/ˌænəsˈθiːziə/", "loss of feeling", "gây mê", "noun", "Under anesthesia.", "Đang được gây mê.", [], [], ["local anesthesia"]),
      v("resuscitate", "/rɪˈsʌsɪteɪt/", "/rɪˈsʌsɪteɪt/", "bring back to life", "hồi sức", "verb", "Resuscitate the victim.", "Hồi sức cho nạn nhân.", ["revive"], [], ["attempt resuscitate"]),
      v("amputation", "/ˌæmpjuˈteɪʃn/", "/ˌæmpjuˈteɪʃn/", "cutting off limb", "sự cắt cụt", "noun", "Leg amputation.", "Cắt cụt chân.", [], [], ["surgical amputation"]),
      v("chronic", "/ˈkrɒnɪk/", "/ˈkrɑːnɪk/", "long lasting", "mãn tính", "adjective", "Chronic pain.", "Đau mãn tính.", ["acute"], [], ["chronic disease"]),
      v("malignant", "/məˈlɪɡnənt/", "/məˈlɪɡnənt/", "harmful/cancerous", "ác tính", "adjective", "Malignant tumor.", "Khối u ác tính.", ["benign"], [], ["highly malignant"]),
      v("benign", "/bɪˈnaɪn/", "/bɪˈnaɪn/", "harmless", "lành tính", "adjective", "Benign growth.", "Khối u lành tính.", ["malignant"], [], ["benign tumor"]),
      v("outpatient", "/ˈaʊtpeɪʃnt/", "/ˈaʊtpeɪʃnt/", "patient not staying overnight", "bệnh nhân ngoại trú", "noun", "Outpatient clinic.", "Phòng khám ngoại trú.", ["inpatient"], [], ["treat as outpatient"]),
      v("palliative", "/ˈpæliətɪv/", "/ˈpæliətɪv/", "relieving pain without curing", "giảm nhẹ", "adjective", "Palliative care.", "Chăm sóc giảm nhẹ.", [], [], ["palliative treatment"]),
    ],
  },
  "Fitness": {
    A1: [
      v("run", "/rʌn/", "/rʌn/", "move fast on feet", "chạy", "verb", "Run fast.", "Chạy nhanh.", ["jog"], ["walk"], ["run away"]),
      v("walk", "/wɔːk/", "/wɔːk/", "move on feet", "đi bộ", "verb", "Walk to school.", "Đi bộ đến trường.", ["stroll"], ["run"], ["go for walk"]),
      v("swim", "/swɪm/", "/swɪm/", "move in water", "bơi", "verb", "I can swim.", "Tôi biết bơi.", [], [], ["swim pool"]),
      v("exercise", "/ˈeksəsaɪz/", "/ˈeksərsaɪz/", "physical activity", "tập thể dục", "noun", "Do exercise daily.", "Tập thể dục hàng ngày.", ["workout"], [], ["morning exercise"]),
      v("sport", "/spɔːt/", "/spɔːrt/", "game requiring skill", "thể thao", "noun", "Play sport.", "Chơi thể thao.", [], [], ["team sport"]),
      v("play", "/pleɪ/", "/pleɪ/", "do a sport", "chơi", "verb", "Play football.", "Chơi bóng đá.", [], [], ["play game"]),
      v("gym", "/dʒɪm/", "/dʒɪm/", "place for exercise", "phòng tập", "noun", "Go to the gym.", "Đi tập gym.", [], [], ["join gym"]),
      v("tired", "/ˈtaɪəd/", "/ˈtaɪərd/", "needing rest", "mệt", "adjective", "I am tired.", "Tôi mệt.", ["exhausted"], ["energetic"], ["feel tired"]),
      v("strong", "/strɒŋ/", "/strɔːŋ/", "having power", "khỏe", "adjective", "He is strong.", "Anh ấy khỏe.", ["weak"], ["weak"], ["strong man"]),
      v("healthy", "/ˈhelθi/", "/ˈhelθi/", "in good health", "khỏe mạnh", "adjective", "Eat healthy food.", "Ăn đồ ăn lành mạnh.", ["fit"], ["sick"], ["stay healthy"]),
    ],
    B2: [
      v("workout", "/ˈwɜːkaʊt/", "/ˈwɜːrkaʊt/", "session of exercise", "buổi tập", "noun", "Intense workout.", "Buổi tập cường độ cao.", ["session"], [], ["gym workout"]),
      v("stamina", "/ˈstæmɪnə/", "/ˈstæmɪnə/", "ability to sustain effort", "sức bền", "noun", "Build stamina.", "Xây dựng sức bền.", ["endurance"], [], ["impove stamina"]),
      v("flexibility", "/ˌfleksəˈbɪləti/", "/ˌfleksəˈbɪləti/", "ability to bend", "độ dẻo dai", "noun", "Yoga improves flexibility.", "Yoga cải thiện độ dẻo dai.", [], [], ["muscular flexibility"]),
      v("aerobic", "/eəˈrəʊbɪk/", "/eˈroʊbɪk/", "using oxygen", "hiếu khí/aerobic", "adjective", "Aerobic exercise.", "Bài tập hiếu khí.", ["cardio"], [], ["aerobic fitness"]),
      v("marathon", "/ˈmærəθən/", "/ˈmærəθən/", "long race", "cuộc đua marathon", "noun", "Run a marathon.", "Chạy marathon.", [], [], ["London marathon"]),
      v("obesity", "/əʊˈbiːsəti/", "/oʊˈbiːsəti/", "being very fat", "béo phì", "noun", "Fight obesity.", "Chống béo phì.", ["fatness"], [], ["childhood obesity"]),
      v("nutrition", "/njuˈtrɪʃn/", "/nuˈtrɪʃn/", "study of food", "dinh dưỡng", "noun", "Good nutrition is key.", "Dinh dưỡng tốt là chìa khóa.", [], [], ["sports nutrition"]),
      v("dehydration", "/ˌdiːhaɪˈdreɪʃn/", "/ˌdiːhaɪˈdreɪʃn/", "lack of water", "mất nước", "noun", "Avoid dehydration.", "Tránh mất nước.", [], [], ["severe dehydration"]),
      v("physique", "/fɪˈziːk/", "/fɪˈziːk/", "shape of body", "vóc dáng", "noun", "Muscular physique.", "Vóc dáng cơ bắp.", ["build"], [], ["good physique"]),
      v("training", "/ˈtreɪnɪŋ/", "/ˈtreɪnɪŋ/", "practice for sport", "tập luyện/đào tạo", "noun", "Start training.", "Bắt đầu tập luyện.", [], [], ["weight training"]),
    ],
    C1: [
      v("regiment", "/ˈredʒɪmənt/", "/ˈredʒɪmənt/", "strict plan", "chế độ (tập luyện)", "noun", "Strict training regiment.", "Chế độ tập luyện nghiêm ngặt.", ["routine"], [], ["daily regiment"]),
      v("agility", "/əˈdʒɪləti/", "/əˈdʒɪləti/", "ability to move quickly", "sự nhanh nhẹn", "noun", "Test agility.", "Kiểm tra sự nhanh nhẹn.", ["speed"], [], ["mental agility"]),
      v("sedentary", "/ˈsedntri/", "/ˈsednteri/", "sitting a lot", "ít vận động", "adjective", "Sedentary lifestyle.", "Lối sống ít vận động.", ["inactive"], ["active"], ["sedentary job"]),
      v("vigorous", "/ˈvɪɡərəs/", "/ˈvɪɡərəs/", "energetic", "mạnh mẽ", "adjective", "Vigorous exercise.", "Tập thể dục mạnh.", ["energetic"], ["weak"], ["vigorous activity"]),
      v("metabolism", "/məˈtæbəlɪzəm/", "/məˈtæbəlɪzəm/", "body chemical process", "sự trao đổi chất", "noun", "Fast metabolism.", "Trao đổi chất nhanh.", [], [], ["boost metabolism"]),
      v("endurance", "/ɪnˈdjʊərəns/", "/ɪnˈdʊrəns/", "ability to last", "sức chịu đựng", "noun", "Test of endurance.", "Bài kiểm tra sức chịu đựng.", ["stamina"], [], ["physical endurance"]),
      v("cardiovascular", "/ˌkɑːdiəʊˈvæskjələ(r)/", "/ˌkɑːrdioʊˈvæskjələr/", "heart and blood vessels", "tim mạch", "adjective", "Cardiovascular health.", "Sức khỏe tim mạch.", [], [], ["cardiovascular system"]),
      v("rehabilitate", "/ˌriːhəˈbɪlɪteɪt/", "/ˌriːhəˈbɪlɪteɪt/", "return to health", "phục hồi chức năng", "verb", "Rehabilitate after injury.", "Phục hồi sau chấn thương.", ["recover"], [], ["rehabilitate muscle"]),
      v("anaerobic", "/ˌænəˈrəʊbɪk/", "/ˌænəˈroʊbɪk/", "without oxygen", "kỵ khí", "adjective", "Anaerobic exercise.", "Bài tập kỵ khí.", [], [], ["anaerobic capacity"]),
      v("calisthenics", "/ˌkælɪsˈθenɪks/", "/ˌkælɪsˈθenɪks/", "bodyweight exercises", "thể dục dụng cụ", "noun", "Do calisthenics.", "Tập thể dục dụng cụ.", [], [], ["morning calisthenics"]),
    ],
  },
  "Mental Health": {
    A2: [
      v("sad", "/sæd/", "/sæd/", "unhappy", "buồn", "adjective", "Don't be sad.", "Đừng buồn.", ["unhappy"], ["happy"], ["feel sad"]),
      v("happy", "/ˈhæpi/", "/ˈhæpi/", "feeling good", "vui vẻ", "adjective", "I am happy.", "Tôi vui.", ["glad"], ["sad"], ["very happy"]),
      v("angry", "/ˈæŋɡri/", "/ˈæŋɡri/", "mad", "tức giận", "adjective", "He is angry.", "Anh ấy tức giận.", ["mad"], ["calm"], ["get angry"]),
      v("stress", "/stres/", "/stres/", "pressure", "căng thẳng", "noun", "Too much stress.", "Quá nhiều căng thẳng.", ["worry"], ["relax"], ["under stress"]),
      v("relax", "/rɪˈlæks/", "/rɪˈlæks/", "rest", "thư giãn", "verb", "Time to relax.", "Đến lúc thư giãn.", ["rest"], ["work"], ["relax mind"]),
      v("scared", "/skeəd/", "/skerd/", "afraid", "sợ hãi", "adjective", "I am scared.", "Tôi sợ.", ["afraid"], ["brave"], ["scared of"]),
      v("feel", "/fiːl/", "/fiːl/", "have emotion", "cảm thấy", "verb", "How do you feel?", "Bạn cảm thấy thế nào?", ["sense"], [], ["feel good"]),
      v("mind", "/maɪnd/", "/maɪnd/", "part that thinks", "tâm trí", "noun", "It is in my mind.", "Nó ở trong tâm trí tôi.", ["brain"], [], ["open mind"]),
      v("worry", "/ˈwʌri/", "/ˈwɜːri/", "feel anxious", "lo lắng", "verb", "Don't worry.", "Đừng lo lắng.", ["fret"], [], ["worry about"]),
      v("tired", "/ˈtaɪəd/", "/ˈtaɪərd/", "needing sleep", "mệt mỏi", "adjective", "Mentally tired.", "Mệt mỏi tinh thần.", ["weary"], [], ["dead tired"]),
    ],
    B2: [
      v("anxiety", "/æŋˈzaɪəti/", "/æŋˈzaɪəti/", "nervousness", "sự lo âu", "noun", "Suffer from anxiety.", "Bị lo âu.", ["worry"], ["calm"], ["high anxiety"]),
      v("depression", "/dɪˈpreʃn/", "/dɪˈpreʃn/", "extreme sadness", "trầm cảm", "noun", "Treat depression.", "Điều trị trầm cảm.", ["sadness"], [], ["severe depression"]),
      v("therapy", "/ˈθerəpi/", "/ˈθerəpi/", "treatment for mind", "trị liệu", "noun", "Go to therapy.", "Đi trị liệu.", ["counseling"], [], ["group therapy"]),
      v("conscious", "/ˈkɒnʃəs/", "/ˈkɑːnʃəs/", "awake/aware", "tỉnh táo/có ý thức", "adjective", "I am conscious of it.", "Tôi ý thức được điều đó.", ["aware"], [], ["self conscious"]),
      v("psychology", "/saɪˈkɒlədʒi/", "/saɪˈkɑːlədʒi/", "study of mind", "tâm lý học", "noun", "Study psychology.", "Học tâm lý học.", [], [], ["child psychology"]),
      v("suicide", "/ˈsuːɪsaɪd/", "/ˈsuːɪsaɪd/", "killing oneself", "tự tử", "noun", "Commit suicide.", "Tự tử.", [], [], ["suicide prevention"]),
      v("addiction", "/əˈdɪkʃn/", "/əˈdɪkʃn/", "need for harmful thing", "nghiện", "noun", "Drug addiction.", "Nghiện ma túy.", ["dependence"], [], ["fight addiction"]),
      v("trauma", "/ˈtrɔːmə/", "/ˈtraʊmə/", "shocking experience", "chấn thương tâm lý", "noun", "Childhood trauma.", "Chấn thương tâm lý thời thơ ấu.", ["shock"], [], ["emotional trauma"]),
      v("well-being", "/ˌwel ˈbiːɪŋ/", "/ˌwel ˈbiːɪŋ/", "happiness and health", "hạnh phúc/sức khỏe", "noun", "Mental well-being.", "Sức khỏe tinh thần.", ["welfare"], [], ["promote well-being"]),
      v("counseling", "/ˈkaʊnsəlɪŋ/", "/ˈkaʊnsəlɪŋ/", "advice or therapy", "tư vấn", "noun", "Marriage counseling.", "Tư vấn hôn nhân.", ["advice"], [], ["counseling session"]),
    ],
    C1: [
      v("subconscious", "/ˌsʌbˈkɒnʃəs/", "/ˌsʌbˈkɑːnʃəs/", "unconscious mind", "tiềm thức", "noun", "In my subconscious.", "Trong tiềm thức tôi.", [], [], ["subconscious mind"]),
      v("cognitive", "/ˈkɒɡnətɪv/", "/ˈkɑːɡnətɪv/", "relating to thinking", "nhận thức", "adjective", "Cognitive skills.", "Kỹ năng nhận thức.", [], [], ["cognitive therapy"]),
      v("psychiatrist", "/saɪˈkaɪətrɪst/", "/saɪˈkaɪətrɪst/", "doctor for mind", "bác sĩ tâm thần", "noun", "See a psychiatrist.", "Khám bác sĩ tâm thần.", ["shrink"], [], ["consult psychiatrist"]),
      v("therapeutic", "/ˌθerəˈpjuːtɪk/", "/ˌθerəˈpjuːtɪk/", "healing", "có tính chữa lành", "adjective", "Therapeutic effect.", "Hiệu quả chữa lành.", ["healing"], [], ["therapeutic massage"]),
      v("neurosis", "/njʊˈrəʊsɪs/", "/nʊˈroʊsɪs/", "mental illness", "chứng loạn thần kinh", "noun", "Suffer from neurosis.", "Bị loạn thần kinh.", [], [], ["anxiety neurosis"]),
      v("sanity", "/ˈsænəti/", "/ˈsænəti/", "mental health", "sự tỉnh táo", "noun", "Keep my sanity.", "Giữ sự tỉnh táo.", [], ["insanity"], ["lose sanity"]),
      v("phobia", "/ˈfəʊbiə/", "/ˈfoʊbiə/", "extreme fear", "nỗi ám ảnh/sợ hãi", "noun", "He has a phobia of spiders.", "Anh ấy bị ám ảnh nhện.", ["fear"], [], ["social phobia"]),
      v("hallucination", "/həˌluːsɪˈneɪʃn/", "/həˌluːsɪˈneɪʃn/", "seeing things not there", "ảo giác", "noun", "Visual hallucination.", "Ảo giác thị giác.", ["illusion"], [], ["have hallucination"]),
      v("delusion", "/dɪˈluːʒn/", "/dɪˈluːʒn/", "false belief", "ảo tưởng", "noun", "Delusions of grandeur.", "Ảo tưởng sức mạnh.", ["illusion"], [], ["suffer delusion"]),
      v("introspection", "/ˌɪntrəˈspekʃn/", "/ˌɪntrəˈspekʃn/", "looking inside oneself", "nội tâm/tự xem xét", "noun", "Deep introspection.", "Sự tự xem xét sâu sắc.", ["self-analysis"], [], ["moment of introspection"]),
    ],
  },
};

// Seed function
async function seedVocab() {
  console.log("🌱 Seeding Vocabulary Data - Health...");

  // Get or create topic group
  const topicGroup = await prisma.topicGroup.upsert({
    where: { name_hubType: { name: "Health", hubType: "vocab" } },
    update: {},
    create: {
      name: "Health",
      order: 3,
      hubType: "vocab",
      subcategories: [
        "Body Parts",
        "Medical Care",
        "Fitness",
        "Mental Health",
      ],
    },
  });

  // Helper to slugify
  const slugify = (text: string) => text.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");

  // Iterate over subcategories
  for (const [subcat, levelsData] of Object.entries(healthVocab)) {
     console.log(`Processing Subcategory: ${subcat}`);
     
     // Iterate over levels
     for (const [level, vocabItems] of Object.entries(levelsData)) {
       const currentLevel = level as Level;
       const items = vocabItems as ReturnType<typeof v>[];
       
       if (!items || items.length === 0) continue;

       const topicId = `health-${slugify(subcat)}-${currentLevel.toLowerCase()}`;
       
       const topic = await prisma.topic.upsert({
         where: { id: topicId },
         update: { wordCount: items.length },
         create: {
           id: topicId,
           title: `${subcat} - ${currentLevel}`,
           subtitle: `Vocabulary about ${subcat.toLowerCase()}`,
           description: `Learn essential vocabulary about ${subcat.toLowerCase()} at ${currentLevel} level.`,
           level: currentLevel,
           wordCount: items.length,
           estimatedTime: Math.ceil(items.length * 2),
           category: "Health",
           subcategory: subcat,
           order: LEVELS.indexOf(currentLevel),
           topicGroupId: topicGroup.id,
         },
       });

        // Seed vocab items
        for (const vocab of items) {
          const vocabId = `${topic.id}-${vocab.word.toLowerCase().replace(/\s+/g, "-")}`;
          await prisma.vocabItem.upsert({
            where: { id: vocabId },
            update: vocab,
            create: {
              id: vocabId,
              topicId: topic.id,
              ...vocab,
            },
          });
        }
        console.log(`✅ Created: ${subcat} - ${currentLevel} (${items.length} words)`);
     }
  }

  console.log("✅ Health seeded successfully!");
}

async function main() {
  try {
    await seedVocab();
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
