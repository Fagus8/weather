import { Resort } from '../core/models/weather.model';

// საქართველოს კურორტები. სახელი, რეგიონი და აღწერა სამ ენაზეა.
// elevation - სიმაღლე ზღვის დონიდან მეტრებში
export const RESORTS: Resort[] = [
  // ---------- მთის კურორტები ----------
  {
    id: 'bakuriani',
    type: 'mountain',
    name: { ka: 'ბაკურიანი', en: 'Bakuriani', ru: 'Бакуриани' },
    region: { ka: 'სამცხე-ჯავახეთი', en: 'Samtskhe-Javakheti', ru: 'Самцхе-Джавахети' },
    lat: 41.7497,
    lon: 43.53,
    elevation: 1700,
    description: {
      ka: 'ბორჯომის ხეობაში მდებარე ძველი სამთო კურორტი, რომელიც ოჯახური დასვენებისთვის კარგია. ცნობილია ნაძვნარი ტყეებითა და რბილი ფერდობებით.',
      en: 'A classic mountain resort in the Borjomi valley, great for a family holiday. Known for its pine forests and gentle slopes.',
      ru: 'Старый горный курорт в Боржомском ущелье, отлично подходит для отдыха с семьёй. Славится хвойными лесами и пологими склонами.'
    }
  },
  {
    id: 'mestia',
    type: 'mountain',
    name: { ka: 'მესტია', en: 'Mestia', ru: 'Местиа' },
    region: { ka: 'სამეგრელო-ზემო სვანეთი', en: 'Samegrelo-Zemo Svaneti', ru: 'Самегрело-Земо Сванети' },
    lat: 43.045,
    lon: 42.7276,
    elevation: 1500,
    description: {
      ka: 'ზემო სვანეთის ცენტრი, ცნობილი შუა საუკუნეების სვანური კოშკებით. ზამთარში ახლოს ჰაწვალისა და თეთნულდის სათხილამურო ტრასები მუშაობს.',
      en: 'The heart of Upper Svaneti, famous for its medieval Svan towers. In winter, the Hatsvali and Tetnuldi ski slopes are close by.',
      ru: 'Центр Верхней Сванетии, известный средневековыми сванскими башнями. Зимой рядом работают горнолыжные трассы Хацвали и Тетнульди.'
    }
  },
  {
    id: 'goderdzi',
    type: 'mountain',
    name: { ka: 'გოდერძი', en: 'Goderdzi', ru: 'Годерзи' },
    region: { ka: 'აჭარა', en: 'Adjara', ru: 'Аджария' },
    lat: 41.6383,
    lon: 42.5236,
    elevation: 2025,
    description: {
      ka: 'ახალი სათხილამურო კურორტი აჭარის მთებში. ზამთარში აქ ბევრი თოვლი მოდის, ბათუმიდან კი რამდენიმე საათის სავალია.',
      en: 'A newer ski resort in the mountains of Adjara. It gets plenty of snow and is just a few hours\' drive from Batumi.',
      ru: 'Сравнительно новый горнолыжный курорт в горах Аджарии. Снега здесь много, а от Батуми всего несколько часов езды.'
    }
  },
  {
    id: 'gudauri',
    type: 'mountain',
    name: { ka: 'გუდაური', en: 'Gudauri', ru: 'Гудаури' },
    region: { ka: 'მცხეთა-მთიანეთი', en: 'Mtskheta-Mtianeti', ru: 'Мцхета-Мтианети' },
    lat: 42.4775,
    lon: 44.4797,
    elevation: 2196,
    description: {
      ka: 'საქართველოს ყველაზე პოპულარული სათხილამურო კურორტი კავკასიონის ქედზე. ზამთარში აქ სათხილამუროდ ჩამოდიან, ზაფხულში კი პარაპლანით საფრენად.',
      en: 'Georgia\'s most popular ski resort, high up in the Greater Caucasus. Skiers come in winter, paragliders in summer.',
      ru: 'Самый популярный горнолыжный курорт Грузии в горах Большого Кавказа. Зимой сюда едут кататься на лыжах, летом — летать на параплане.'
    }
  },
  {
    id: 'stepantsminda',
    type: 'mountain',
    name: { ka: 'სტეფანწმინდა (ყაზბეგი)', en: 'Stepantsminda (Kazbegi)', ru: 'Степанцминда (Казбеги)' },
    region: { ka: 'მცხეთა-მთიანეთი', en: 'Mtskheta-Mtianeti', ru: 'Мцхета-Мтианети' },
    lat: 42.6575,
    lon: 44.6439,
    elevation: 1740,
    description: {
      ka: 'პატარა დაბა მყინვარწვერის ძირში. აქედან იწყება ლაშქრობა გერგეტის სამების ეკლესიამდე.',
      en: 'A small town at the foot of Mount Kazbek and the starting point for the hike up to Gergeti Trinity Church.',
      ru: 'Небольшой посёлок у подножия Казбека. Отсюда начинается подъём к знаменитой церкви Святой Троицы в Гергети.'
    }
  },
  {
    id: 'bakhmaro',
    type: 'mountain',
    name: { ka: 'ბახმარო', en: 'Bakhmaro', ru: 'Бахмаро' },
    region: { ka: 'გურია', en: 'Guria', ru: 'Гурия' },
    lat: 41.8494,
    lon: 42.3236,
    elevation: 2000,
    description: {
      ka: 'ზაფხულის კურორტი გურიის მთებში. ცნობილია სუფთა ჰაერითა და ფერადი ხის კოტეჯებით.',
      en: 'A summer resort high in the mountains of Guria, known for its fresh air and colourful wooden cottages.',
      ru: 'Летний курорт в горах Гурии. Известен чистым воздухом и разноцветными деревянными домиками.'
    }
  },

  // ---------- ზღვის კურორტები ----------
  {
    id: 'batumi',
    type: 'sea',
    name: { ka: 'ბათუმი', en: 'Batumi', ru: 'Батуми' },
    region: { ka: 'აჭარა', en: 'Adjara', ru: 'Аджария' },
    lat: 41.6168,
    lon: 41.6367,
    elevation: 3,
    description: {
      ka: 'საქართველოს მთავარი საზღვაო ქალაქი თანამედროვე ბულვარით, ბოტანიკური ბაღითა და ღამის ცხოვრებით.',
      en: 'Georgia\'s main seaside city, with a modern boulevard, a botanical garden and lively nightlife.',
      ru: 'Главный морской город Грузии с современным бульваром, ботаническим садом и оживлённой ночной жизнью.'
    }
  },
  {
    id: 'kobuleti',
    type: 'sea',
    name: { ka: 'ქობულეთი', en: 'Kobuleti', ru: 'Кобулети' },
    region: { ka: 'აჭარა', en: 'Adjara', ru: 'Аджария' },
    lat: 41.8214,
    lon: 41.7792,
    elevation: 5,
    description: {
      ka: 'მშვიდი საკურორტო ქალაქი გრძელი კენჭოვანი სანაპიროთი. კარგია ოჯახთან ერთად დასასვენებლად.',
      en: 'A quiet resort town with a long pebble beach, popular with families.',
      ru: 'Спокойный курортный городок с длинным галечным пляжем, любимый семьями.'
    }
  },
  {
    id: 'ureki',
    type: 'sea',
    name: { ka: 'ურეკი', en: 'Ureki', ru: 'Уреки' },
    region: { ka: 'გურია', en: 'Guria', ru: 'Гурия' },
    lat: 41.995,
    lon: 41.7764,
    elevation: 3,
    description: {
      ka: 'ცნობილია შავი მაგნიტური ქვიშით, რომელსაც სამკურნალოდ მიიჩნევენ. ზღვა აქ თბილი და არაღრმაა.',
      en: 'Famous for its black magnetic sand, which is said to be good for your health. The sea here is warm and shallow.',
      ru: 'Знаменит чёрным магнитным песком, который считается целебным. Море здесь тёплое и неглубокое.'
    }
  },
  {
    id: 'gonio',
    type: 'sea',
    name: { ka: 'გონიო', en: 'Gonio', ru: 'Гонио' },
    region: { ka: 'აჭარა', en: 'Adjara', ru: 'Аджария' },
    lat: 41.5594,
    lon: 41.5728,
    elevation: 5,
    description: {
      ka: 'პატარა სოფელი ბათუმის სამხრეთით, ძველი რომაული ციხესიმაგრითა და სუფთა ზღვით.',
      en: 'A small village south of Batumi, with an ancient Roman fortress and clear water.',
      ru: 'Небольшое село к югу от Батуми с древней римской крепостью и чистым морем.'
    }
  },
  {
    id: 'anaklia',
    type: 'sea',
    name: { ka: 'ანაკლია', en: 'Anaklia', ru: 'Анаклия' },
    region: { ka: 'სამეგრელო-ზემო სვანეთი', en: 'Samegrelo-Zemo Svaneti', ru: 'Самегрело-Земо Сванети' },
    lat: 42.3936,
    lon: 41.5658,
    elevation: 2,
    description: {
      ka: 'კურორტი ენგურის შესართავთან, ცნობილი ქვიშიანი სანაპიროთი და გრძელი ხის ხიდით.',
      en: 'A resort at the mouth of the Enguri river, known for its sandy beach and long wooden bridge.',
      ru: 'Курорт в устье реки Ингури, известный песчаным пляжем и длинным деревянным мостом.'
    }
  },
  {
    id: 'sukhumi',
    type: 'sea',
    name: { ka: 'სოხუმი', en: 'Sukhumi', ru: 'Сухуми' },
    region: { ka: 'აფხაზეთი', en: 'Abkhazia', ru: 'Абхазия' },
    lat: 43.0033,
    lon: 41.0153,
    elevation: 5,
    description: {
      ka: 'აფხაზეთის დედაქალაქი შავი ზღვის სანაპიროზე, ცნობილი ბოტანიკური ბაღით, ევკალიპტებითა და ზღვისპირა ბულვარით.',
      en: 'The capital of Abkhazia on the Black Sea coast, known for its botanical garden, eucalyptus trees and seafront promenade.',
      ru: 'Столица Абхазии на берегу Чёрного моря, известная ботаническим садом, эвкалиптами и набережной.'
    }
  }
];
