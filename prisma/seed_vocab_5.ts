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
// TOPIC GROUP 5: NATURE
// ============================================

const natureVocab = {
  "Animals": {
    A1: [
      v("dog", "/dɒɡ/", "/dɔːɡ/", "pet animal", "con chó", "noun", "I have a dog.", "Tôi có một con chó.", ["puppy"], [], ["pet dog"]),
      v("cat", "/kæt/", "/kæt/", "small pet feline", "con mèo", "noun", "The cat is sleeping.", "Con mèo đang ngủ.", ["kitten"], [], ["black cat"]),
      v("bird", "/bɜːd/", "/bɜːrd/", "animal that flies", "con chim", "noun", "Look at the bird.", "Nhìn con chim kìa.", [], [], ["flying bird"]),
      v("fish", "/fɪʃ/", "/fɪʃ/", "animal in water", "con cá", "noun", "Fish swim in water.", "Cá bơi trong nước.", [], [], ["gold fish"]),
      v("cow", "/kaʊ/", "/kaʊ/", "farm animal for milk", "con bò", "noun", "The cow eats grass.", "Con bò ăn cỏ.", ["cattle"], [], ["milk cow"]),
      v("horse", "/hɔːs/", "/hɔːrs/", "animal for riding", "con ngựa", "noun", "Ride a horse.", "Cưỡi ngựa.", [], [], ["race horse"]),
      v("lion", "/ˈlaɪən/", "/ˈlaɪən/", "big wild cat", "sư tử", "noun", "The lion is king.", "Sư tử là vua.", [], [], ["lion roar"]),
      v("mouse", "/maʊs/", "/maʊs/", "small rodent", "con chuột", "noun", "A mouse is small.", "Con chuột thì nhỏ.", [], [], ["field mouse"]),
      v("pig", "/pɪɡ/", "/pɪɡ/", "pink farm animal", "con lợn", "noun", "Pigs are pink.", "Lợn màu hồng.", ["swine"], [], ["fat pig"]),
      v("animal", "/ˈænɪml/", "/ˈænɪml/", "living creature", "động vật", "noun", "I love animals.", "Tôi yêu động vật.", ["creature"], [], ["wild animal"]),
    ],
    B1: [
      v("wildlife", "/ˈwaɪldlaɪf/", "/ˈwaɪldlaɪf/", "animals in nature", "động vật hoang dã", "noun", "Protect wildlife.", "Bảo vệ động vật hoang dã.", [], [], ["wildlife park"]),
      v("insect", "/ˈɪnsekt/", "/ˈɪnsekt/", "small bug", "bảo tồn", "noun", "Insects have six legs.", "Côn trùng có sáu chân.", ["bug"], [], ["flying insect"]),
      v("dolphin", "/ˈdɒlfɪn/", "/ˈdɑːlfɪn/", "smart sea mammal", "cá heo", "noun", "Dolphins are smart.", "Cá heo rất thông minh.", [], [], ["swim with dolphins"]),
      v("mammal", "/ˈmæml/", "/ˈmæml/", "animal nursing young", "động vật có vú", "noun", "Humans are mammals.", "Con người là động vật có vú.", [], [], ["marine mammal"]),
      v("reptile", "/ˈreptaɪl/", "/ˈreptaɪl/", "cold-blooded animal", "bò sát", "noun", "Snakes are reptiles.", "Rắn là loài bò sát.", [], [], ["large reptile"]),
      v("feather", "/ˈfeðər/", "/ˈfeðər/", "covering of bird", "lông vũ", "noun", "Birds have feathers.", "Chim có lông vũ.", [], [], ["white feather"]),
      v("wing", "/wɪŋ/", "/wɪŋ/", "part for flying", "cánh", "noun", "The bird hurt its wing.", "Con chim bị đau cánh.", [], [], ["bird wing"]),
      v("nest", "/nest/", "/nest/", "bird's home", "tổ", "noun", "Eggs in the nest.", "Trứng ở trong tổ.", [], [], ["build nest"]),
      v("hunt", "/hʌnt/", "/hʌnt/", "chase to kill", "săn bắt", "verb", "Lions hunt zebras.", "Sư tử săn ngựa vằn.", ["prey on"], [], ["go hunting"]),
      v("bark", "/bɑːk/", "/bɑːrk/", "sound of dog", "sủa", "verb", "The dog barked loudly.", "Con chó sủa to.", [], [], ["dog bark"]),
    ],
    C1: [
      v("predator", "/ˈpredətər/", "/ˈpredətər/", "animal hunting others", "thú săn mồi", "noun", "Apex predator.", "Thú săn mồi đầu bảng.", ["hunter"], ["prey"], ["natural predator"]),
      v("prey", "/preɪ/", "/preɪ/", "animal being hunted", "con mồi", "noun", "Birds of prey.", "Chim săn mồi.", ["victim"], ["predator"], ["stalk prey"]),
      v("migration", "/maɪˈɡreɪʃn/", "/maɪˈɡreɪʃn/", "seasonal movement", "sự di cư", "noun", "Bird migration.", "Sự di cư của chim.", [], [], ["annual migration"]),
      v("habitat", "/ˈhæbɪtæt/", "/ˈhæbɪtæt/", "natural home", "môi trường sống", "noun", "Loss of habitat.", "Mất môi trường sống.", ["environment"], [], ["natural habitat"]),
      v("endangered", "/ɪnˈdeɪndʒəd/", "/ɪnˈdeɪndʒərd/", "at risk of extinction", "có nguy cơ tuyệt chủng", "adjective", "Endangered species.", "Loài có nguy cơ tuyệt chủng.", ["threatened"], [], ["critically endangered"]),
      v("vertebrate", "/ˈvɜːtɪbrət/", "/ˈvɜːrtɪbrət/", "animal with backbone", "động vật có xương sống", "noun", "Class of vertebrates.", "Lớp động vật có xương sống.", [], ["invertebrate"], ["vertebrate animal"]),
      v("carnivore", "/ˈkɑːnɪvɔːr/", "/ˈkɑːrnɪvɔːr/", "meat eater", "động vật ăn thịt", "noun", "Cats are carnivores.", "Mèo là động vật ăn thịt.", [], ["herbivore"], ["strict carnivore"]),
      v("herbivore", "/ˈhɜːbɪvɔːr/", "/ˈhɜːrbɪvɔːr/", "plant eater", "động vật ăn cỏ", "noun", "Cows are herbivores.", "Bò là động vật ăn cỏ.", [], ["carnivore"], ["large herbivore"]),
      v("fauna", "/ˈfɔːnə/", "/ˈfɔːnə/", "animals of a region", "hệ động vật", "noun", "Flora and fauna.", "Hệ thực vật và động vật.", [], [], ["local fauna"]),
      v("camouflaged", "/ˈkæməflɑːʒd/", "/ˈkæməflɑːʒd/", "hidden by blending in", "ngụy trang", "adjective", "Well camouflaged.", "Ngụy trang kỹ.", ["hidden"], ["visible"], ["camouflaged animal"]),
    ],
  },
  "Plants": {
    A2: [
      v("tree", "/triː/", "/triː/", "tall plant", "cây", "noun", "Climb a tree.", "Leo cây.", [], [], ["apple tree"]),
      v("flower", "/ˈflaʊər/", "/ˈflaʊər/", "colorful part of plant", "bông hoa", "noun", "Beautiful flower.", "Bông hoa đẹp.", ["bloom"], [], ["fresh flower"]),
      v("grass", "/ɡrɑːs/", "/ɡræs/", "green ground plant", "cỏ", "noun", "Green grass.", "Cỏ xanh.", [], [], ["cut grass"]),
      v("rose", "/rəʊz/", "/roʊz/", "type of flower", "hoa hồng", "noun", "Red rose.", "Hoa hồng đỏ.", [], [], ["red rose"]),
      v("leaf", "/liːf/", "/liːf/", "green part on branch", "lá", "noun", "Green leaf.", "Lá xanh.", [], [], ["fall leaf"]),
      v("grow", "/ɡrəʊ/", "/ɡroʊ/", "get bigger/live", "lớn lên/mọc", "verb", "Plants grow.", "Cây cối phát triển.", [], [], ["grow fast"]),
      v("forest", "/ˈfɒrɪst/", "/ˈfɔːrɪst/", "place with many trees", "rừng", "noun", "Walk in the forest.", "Đi dạo trong rừng.", ["woods"], [], ["rain forest"]),
      v("plant", "/plɑːnt/", "/plænt/", "living thing in earth", "thực vật/cây", "noun", "Water the plant.", "Tưới cây.", [], [], ["house plant"]),
      v("garden", "/ˈɡɑːdn/", "/ˈɡɑːrdn/", "place for plants", "khu vườn", "noun", "My garden has flowers.", "Vườn tôi có hoa.", [], [], ["flower garden"]),
      v("seed", "/siːd/", "/siːd/", "small part starting plant", "hạt giống", "noun", "Plant a seed.", "Gieo hạt.", [], [], ["sunflower seed"]),
    ],
    B2: [
      v("blossom", "/ˈblɒsəm/", "/ˈblɑːsəm/", "flower on tree", "hoa (cây ăn quả)", "noun", "Cherry blossom.", "Hoa anh đào.", ["flower"], [], ["in blossom"]),
      v("stem", "/stem/", "/stem/", "main stalk", "thân cây", "noun", "Cut the stem.", "Cắt thân cây.", ["stalk"], [], ["flower stem"]),
      v("root", "/ruːt/", "/ruːt/", "underground part", "rễ", "noun", "Deep roots.", "Rễ sâu.", [], [], ["tree root"]),
      v("branch", "/brɑːntʃ/", "/bræntʃ/", "arm of a tree", "cành cây", "noun", "Bird on a branch.", "Chim trên cành cây.", ["limb"], [], ["broken branch"]),
      v("agriculture", "/ˈæɡrɪkʌltʃər/", "/ˈæɡrɪkʌltʃər/", "farming", "nông nghiệp", "noun", "Sustainable agriculture.", "Nông nghiệp bền vững.", ["farming"], [], ["modern agriculture"]),
      v("crop", "/krɒp/", "/krɑːp/", "plants grown for food", "mùa vụ/cây trồng", "noun", "Harvest the crop.", "Thu hoạch mùa vụ.", ["harvest"], [], ["cash crop"]),
      v("soil", "/sɔɪl/", "/sɔɪl/", "earth for plants", "đất trồng", "noun", "Fertile soil.", "Đất màu mỡ.", ["earth"], [], ["rich soil"]),
      v("botanic", "/bəˈtænɪk/", "/bəˈtænɪk/", "relating to plants", "thuộc thực vật", "adjective", "Botanic garden.", "Vườn bách thảo.", ["botanical"], [], ["botanic study"]),
      v("vegetation", "/ˌvedʒəˈteɪʃn/", "/ˌvedʒəˈteɪʃn/", "plants in general", "thảm thực vật", "noun", "Dense vegetation.", "Thảm thực vật dày đặc.", ["flora"], [], ["local vegetation"]),
      v("bloom", "/bluːm/", "/bluːm/", "producing flowers", "nở hoa", "verb", "Roses bloom in summer.", "Hoa hồng nở vào mùa hè.", ["flower"], [], ["full bloom"]),
    ],
    C2: [
      v("photosynthesis", "/ˌfəʊtəʊˈsɪnθəsɪs/", "/ˌfoʊtoʊˈsɪnθəsɪs/", "process of making food from light", "quang hợp", "noun", "Photosynthesis requires light.", "Quang hợp cần ánh sáng.", [], [], ["process of photosynthesis"]),
      v("pollination", "/ˌpɒləˈneɪʃn/", "/ˌpɑːləˈneɪʃn/", "transfer of pollen", "thụ phấn", "noun", "Insect pollination.", "Thụ phấn nhờ côn trùng.", [], [], ["cross pollination"]),
      v("perennial", "/pəˈreniəl/", "/pəˈreniəl/", "lasting years", "lâu năm", "adjective", "Perennial plants.", "Cây lâu năm.", ["long-lasting"], ["annual"], ["hardy perennial"]),
      v("deciduous", "/dɪˈsɪdʒuəs/", "/dɪˈsɪdʒuəs/", "losing leaves", "rụng lá", "adjective", "Deciduous forest.", "Rừng rụng lá.", [], ["evergreen"], ["deciduous tree"]),
      v("evergreen", "/ˈevəɡriːn/", "/ˈevərɡriːn/", "keeping leaves", "thường xanh", "adjective", "Evergreen shrub.", "Bụi cây thường xanh.", [], ["deciduous"], ["evergreen forest"]),
      v("horticulture", "/ˈhɔːtɪkʌltʃər/", "/ˈhɔːrtɪkʌltʃər/", "garden cultivation", "nghề làm vườn", "noun", "Study horticulture.", "Học nghề làm vườn.", ["gardening"], [], ["horticulture expert"]),
      v("foliage", "/ˈfəʊliɪdʒ/", "/ˈfoʊliɪdʒ/", "leaves of a plant", "tán lá", "noun", "Green foliage.", "Tán lá xanh.", ["leaves"], [], ["dense foliage"]),
      v("indigenous", "/ɪnˈdɪdʒənəs/", "/ɪnˈdɪdʒənəs/", "native", "bản địa", "adjective", "Indigenous plants.", "Cây bản địa.", ["native"], ["exotic"], ["indigenous species"]),
      v("invasive", "/ɪnˈveɪsɪv/", "/ɪnˈveɪsɪv/", "spreading harmfully", "xâm lấn", "adjective", "Invasive weed.", "Cỏ dại xâm lấn.", [], [], ["invasive species"]),
      v("flora", "/ˈflɔːrə/", "/ˈflɔːrə/", "plants of a region", "hệ thực vật", "noun", "Alpine flora.", "Hệ thực vật núi cao.", [], ["fauna"], ["rich flora"]),
    ],
  },
  "Weather": {
    A1: [
      v("sun", "/sʌn/", "/sʌn/", "star warming earth", "mặt trời", "noun", "The sun is hot.", "Mặt trời rất nóng.", [], [], ["bright sun"]),
      v("rain", "/reɪn/", "/reɪn/", "water from sky", "mưa", "noun", "I like rain.", "Tôi thích mưa.", [], [], ["heavy rain"]),
      v("snow", "/snəʊ/", "/snoʊ/", "frozen rain", "tuyết", "noun", "White snow.", "Tuyết trắng.", [], [], ["heavy snow"]),
      v("wind", "/wɪnd/", "/wɪnd/", "moving air", "gió", "noun", "Strong wind.", "Gió mạnh.", [], [], ["cold wind"]),
      v("hot", "/hɒt/", "/hɑːt/", "high temperature", "nóng", "adjective", "It is hot today.", "Hôm nay trời nóng.", ["warm"], ["cold"], ["very hot"]),
      v("cold", "/kəʊld/", "/koʊld/", "low temperature", "lạnh", "adjective", "It is cold outside.", "Ngoài trời lạnh.", ["chilly"], ["hot"], ["freezing cold"]),
      v("cloud", "/klaʊd/", "/klaʊd/", "white shape in sky", "mây", "noun", "Look at the cloud.", "Nhìn đám mây kìa.", [], [], ["dark cloud"]),
      v("sky", "/skaɪ/", "/skaɪ/", "space above earth", "bầu trời", "noun", "Blue sky.", "Bầu trời xanh.", [], [], ["clear sky"]),
      v("weather", "/ˈweðər/", "/ˈweðər/", "state of atmosphere", "thời tiết", "noun", "Good weather.", "Thời tiết tốt.", [], [], ["bad weather"]),
      v("storm", "/stɔːm/", "/stɔːrm/", "bad weather", "bão", "noun", "Big storm.", "Cơn bão lớn.", [], [], ["storm coming"]),
    ],
    B1: [
      v("climate", "/ˈklaɪmət/", "/ˈklaɪmət/", "weather pattern", "khí hậu", "noun", "Tropical climate.", "Khí hậu nhiệt đới.", [], [], ["climate change"]),
      v("temperature", "/ˈtemprətʃər/", "/ˈtemprətʃər/", "measure of heat", "nhiệt độ", "noun", "High temperature.", "Nhiệt độ cao.", [], [], ["room temperature"]),
      v("lightning", "/ˈlaɪtnɪŋ/", "/ˈlaɪtnɪŋ/", "flash in sky", "sét", "noun", "Thunder and lightning.", "Sấm và sét.", [], [], ["strike of lightning"]),
      v("fog", "/fɒɡ/", "/fɒɡ/", "thick cloud low down", "sương mù", "noun", "Thick fog.", "Sương mù dày đặc.", ["mist"], [], ["dense fog"]),
      v("freeze", "/friːz/", "/friːz/", "turn to ice", "đóng băng", "verb", "Water freezes at 0.", "Nước đóng băng ở 0 độ.", [], ["melt"], ["freeze over"]),
      v("blow", "/bləʊ/", "/bloʊ/", "air moving", "thổi", "verb", "Wind blows.", "Gió thổi.", [], [], ["blow hard"]),
      v("forecast", "/ˈfɔːkɑːst/", "/ˈfɔːrkæst/", "weather prediction", "dự báo", "noun", "Check the forecast.", "Xem dự báo.", ["prediction"], [], ["weather forecast"]),
      v("flood", "/flʌd/", "/flʌd/", "too much water", "lũ lụt", "noun", "Severe flood.", "Lũ lụt nghiêm trọng.", [], [], ["flash flood"]),
      v("degree", "/dɪˈɡriː/", "/dɪˈɡriː/", "unit of temperature", "độ", "noun", "30 degrees.", "30 độ.", [], [], ["high degree"]),
      v("humid", "/ˈhjuːmɪd/", "/ˈhjuːmɪd/", "wet air", "ẩm ướt", "adjective", "Humid weather.", "Thời tiết ẩm ướt.", ["muggy"], ["dry"], ["hot and humid"]),
    ],
    C2: [
      v("meteorology", "/ˌmiːtiəˈrɒlədʒi/", "/ˌmiːtiəˈrɑːlədʒi/", "study of weather", "khí tượng học", "noun", "Expert in meteorology.", "Chuyên gia khí tượng.", [], [], ["meteorology department"]),
      v("precipitation", "/prɪˌsɪpɪˈteɪʃn/", "/prɪˌsɪpɪˈteɪʃn/", "rain or snow", "lượng mưa/tuyết", "noun", "High precipitation.", "Lượng mưa cao.", [], [], ["annual precipitation"]),
      v("torrential", "/təˈrenʃl/", "/təˈrenʃl/", "pouring rain", "xối xả", "adjective", "Torrential rain.", "Mưa xối xả.", [], [], ["torrential downpour"]),
      v("drought", "/draʊt/", "/draʊt/", "long dry period", "hạn hán", "noun", "Severe drought.", "Hạn hán nghiêm trọng.", [], [], ["cause drought"]),
      v("atmosphere", "/ˈætməsfɪər/", "/ˈætməsfɪr/", "gases around earth", "khí quyển", "noun", "Upper atmosphere.", "Tầng khí quyển trên.", [], [], ["earth atmosphere"]),
      v("cyclone", "/ˈsaɪkləʊn/", "/ˈsaɪkloʊn/", "violent storm", "lốc xoáy/bão", "noun", "Tropical cyclone.", "Bão nhiệt đới.", ["hurricane"], [], ["cyclone warning"]),
      v("tempestuous", "/temˈpestʃuəs/", "/temˈpestʃuəs/", "stormy", "giông bão/dữ dội", "adjective", "Tempestuous weather.", "Thời tiết giông bão.", ["stormy"], ["calm"], ["tempestuous sea"]),
      v("inclement", "/ɪnˈklemənt/", "/ɪnˈklemənt/", "unpleasant cold/wet", "khắc nghiệt", "adjective", "Inclement weather.", "Thời tiết khắc nghiệt.", ["bad"], ["fine"], ["due to inclement"]),
      v("barometer", "/bəˈrɒmɪtər/", "/bəˈrɑːmɪtər/", "pressure instrument", "áp kế", "noun", "Barometer falling.", "Áp kế giảm.", [], [], ["read barometer"]),
      v("monsoon", "/mɒnˈsuːn/", "/mɑːnˈsuːn/", "seasonal wind/rain", "gió mùa", "noun", "Monsoon season.", "Mùa gió mùa.", [], [], ["summer monsoon"]),
    ],
  },
  "Environment": {
    B1: [
      v("pollution", "/pəˈluːʃn/", "/pəˈluːʃn/", "dirtying environment", "sự ô nhiễm", "noun", "Air pollution.", "Ô nhiễm không khí.", ["contamination"], [], ["reduce pollution"]),
      v("recycle", "/ˌriːˈsaɪkl/", "/ˌriːˈsaɪkl/", "use again", "tái chế", "verb", "Recycle paper.", "Tái chế giấy.", [], [], ["recycle bin"]),
      v("trash", "/træʃ/", "/træʃ/", "garbage", "rác", "noun", "Pick up trash.", "Nhặt rác.", ["rubbish"], [], ["trash can"]),
      v("plastic", "/ˈplæstɪk/", "/ˈplæstɪk/", "synthetic material", "nhựa", "noun", "Plastic bottle.", "Chai nhựa.", [], [], ["recycle plastic"]),
      v("save", "/seɪv/", "/seɪv/", "protect/keep", "tiết kiệm/bảo vệ", "verb", "Save the planet.", "Bảo vệ hành tinh.", ["protect"], ["waste"], ["save energy"]),
      v("energy", "/ˈenədʒi/", "/ˈenərdʒi/", "power", "năng lượng", "noun", "Solar energy.", "Năng lượng mặt trời.", [], [], ["clean energy"]),
      v("global", "/ˈɡləʊbl/", "/ˈɡloʊbl/", "worldwide", "toàn cầu", "adjective", "Global warming.", "Sự nóng lên toàn cầu.", ["worldwide"], ["local"], ["global issue"]),
      v("disaster", "/dɪˈzɑːstər/", "/dɪˈzæstər/", "terrible event", "thảm họa", "noun", "Natural disaster.", "Thảm họa thiên nhiên.", ["catastrophe"], [], ["avoid disaster"]),
      v("protect", "/prəˈtekt/", "/prəˈtekt/", "keep safe", "bảo vệ", "verb", "Protect nature.", "Bảo vệ thiên nhiên.", ["guard"], ["harm"], ["protect from"]),
      v("environment", "/ɪnˈvaɪrənmənt/", "/ɪnˈvaɪrənmənt/", "surroundings", "môi trường", "noun", "Clean environment.", "Môi trường sạch.", [], [], ["protect environment"]),
    ],
    B2: [
      v("sustainable", "/səˈsteɪnəbl/", "/səˈsteɪnəbl/", "lasting long time", "bền vững", "adjective", "Sustainable development.", "Phát triển bền vững.", [], [], ["sustainable energy"]),
      v("conservation", "/ˌkɒnsəˈveɪʃn/", "/ˌkɑːnsərˈveɪʃn/", "saving resources", "sự bảo tồn", "noun", "Water conservation.", "Bảo tồn nước.", ["preservation"], [], ["wildlife conservation"]),
      v("renewable", "/rɪˈnjuːəbl/", "/rɪˈnuːəbl/", "can be replaced", "tái tạo", "adjective", "Renewable sources.", "Nguồn tái tạo.", [], ["non-renewable"], ["renewable energy"]),
      v("emission", "/iˈmɪʃn/", "/iˈmɪʃn/", "gas sent out", "khí thải", "noun", "Carbon emissions.", "Khí thải carbon.", [], [], ["reduce emission"]),
      v("ecosystem", "/ˈiːkəʊsɪstəm/", "/ˈiːkoʊsɪstəm/", "biological community", "hệ sinh thái", "noun", "Fragile ecosystem.", "Hệ sinh thái mong manh.", [], [], ["marine ecosystem"]),
      v("deforestation", "/ˌdiːfɒrɪˈsteɪʃn/", "/ˌdiːfɔːrɪˈsteɪʃn/", "cutting down forests", "nạn phá rừng", "noun", "Stop deforestation.", "Ngừng phá rừng.", [], [], ["cause deforestation"]),
      v("waste", "/weɪst/", "/weɪst/", "unwanted material", "rác thải/lãng phí", "noun", "Toxic waste.", "Chất thải độc hại.", ["garbage"], [], ["reduce waste"]),
      v("resource", "/rɪˈzɔːs/", "/ˈriːsɔːrs/", "useful material", "tài nguyên", "noun", "Natural resources.", "Tài nguyên thiên nhiên.", [], [], ["valuable resource"]),
      v("organic", "/ɔːˈɡænɪk/", "/ɔːrˈɡænɪk/", "natural/no chemicals", "hữu cơ", "adjective", "Organic food.", "Thực phẩm hữu cơ.", [], [], ["buy organic"]),
      v("solar", "/ˈsəʊlər/", "/ˈsoʊlər/", "from sun", "thuộc mặt trời", "adjective", "Solar panel.", "Tấm pin mặt trời.", [], [], ["solar power"]),
    ],
    C1: [
      v("biodiversity", "/ˌbaɪəʊdaɪˈvɜːsəti/", "/ˌbaɪoʊdaɪˈvɜːrsəti/", "variety of life", "đa dạng sinh học", "noun", "Loss of biodiversity.", "Mất đa dạng sinh học.", [], [], ["rich biodiversity"]),
      v("ecological", "/ˌiːkəˈlɒdʒɪkl/", "/ˌiːkəˈlɑːdʒɪkl/", "relating to ecology", "thuộc sinh thái", "adjective", "Ecological disaster.", "Thảm họa sinh thái.", [], [], ["ecological balance"]),
      v("contamination", "/kənˌtæmɪˈneɪʃn/", "/kənˌtæmɪˈneɪʃn/", "making dirty", "sự nhiễm bẩn", "noun", "Water contamination.", "Nhiễm bẩn nước.", ["pollution"], [], ["avoid contamination"]),
      v("catastrophe", "/kəˈtæstrəfi/", "/kəˈtæstrəfi/", "huge disaster", "thảm khốc", "noun", "Environmental catastrophe.", "Thảm họa môi trường.", ["disaster"], [], ["avert catastrophe"]),
      v("carbon footprint", "/ˈkɑːbən fʊtprɪnt/", "/ˈkɑːrbən fʊtprɪnt/", "impact on climate", "dấu chân carbon", "noun", "Reduce carbon footprint.", "Giảm dấu chân carbon.", [], [], ["calculate footprint"]),
      v("glacier", "/ˈɡlæsiər/", "/ˈɡleɪʃər/", "river of ice", "sông băng", "noun", "Melting glaciers.", "Sông băng tan chảy.", [], [], ["alpine glacier"]),
      v("extinction", "/ɪkˈstɪŋkʃn/", "/ɪkˈstɪŋkʃn/", "dying out", "sự tuyệt chủng", "noun", "Face extinction.", "Đối mặt tuyệt chủng.", [], [], ["mass extinction"]),
      v("biodegradable", "/ˌbaɪəʊdɪˈɡreɪdəbl/", "/ˌbaɪoʊdɪˈɡreɪdəbl/", "breaks down naturally", "phân hủy sinh học", "adjective", "Biodegradable packaging.", "Bao bì phân hủy sinh học.", [], [], ["fully biodegradable"]),
      v("preservation", "/ˌprezəˈveɪʃn/", "/ˌprezərˈveɪʃn/", "keeping safe", "sự gìn giữ", "noun", "Forest preservation.", "Gìn giữ rừng.", ["conservation"], ["destruction"], ["preservation order"]),
      v("ozone", "/ˈəʊzəʊn/", "/ˈoʊzoʊn/", "gas layer", "ô-zôn", "noun", "Ozone layer.", "Tầng ô-zôn.", [], [], ["ozone depletion"]),
    ],
  },
};

// Seed function
async function seedVocab() {
  console.log("🌱 Seeding Vocabulary Data - Nature...");

  // Get or create topic group
  const topicGroup = await prisma.topicGroup.upsert({
    where: { name_hubType: { name: "Nature", hubType: "vocab" } },
    update: {},
    create: {
      name: "Nature",
      order: 5,
      hubType: "vocab",
      subcategories: [
        "Animals",
        "Plants",
        "Weather",
        "Environment",
      ],
    },
  });

  // Helper to slugify
  const slugify = (text: string) => text.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");

  // Iterate over subcategories
  for (const [subcat, levelsData] of Object.entries(natureVocab)) {
     console.log(`Processing Subcategory: ${subcat}`);
     
     // Iterate over levels
     for (const [level, vocabItems] of Object.entries(levelsData)) {
       const currentLevel = level as Level;
       const items = vocabItems as ReturnType<typeof v>[];
       
       if (!items || items.length === 0) continue;

       const topicId = `nature-${slugify(subcat)}-${currentLevel.toLowerCase()}`;
       
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
           category: "Nature",
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

  console.log("✅ Nature seeded successfully!");
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
