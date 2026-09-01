import type { PartOfSpeech, Word, WordSet, WordSetItem } from '../entities/types'
import { getWords, getWordSets, getWordSetItems, replaceWords, replaceWordSets, replaceWordSetItems } from './db'

function uuid(): string {
  return crypto.randomUUID()
}

function nowIso(): string {
  return new Date().toISOString()
}

/**
 * Демонстрационные preset-наборы (is_preset = true). Реальные preset-данные
 * должны быть предоставлены отдельно (см. Master Spec 4.2) — этот набор
 * нужен только чтобы приложение и игры были с чем показывать "из коробки".
 */
type PresetEntry = [sk: string, ru: string, pos?: PartOfSpeech]

/** Тематическая категория для группировки наборов на экранах "Тренировка"/"Мои наборы". */
const SET_CATEGORIES: Record<string, string> = {
  'В ресторане': 'Еда',
  'Приемы пищи': 'Еда',
  'Готовка': 'Еда',
  'Вкус': 'Еда',
  'Гарниры и крупы': 'Еда',
  'Мясо и рыба': 'Еда',
  'Молочные продукты': 'Еда',
  'Фрукты': 'Еда',
  'Овощи': 'Еда',
  'Ягоды': 'Еда',
  'Десерты': 'Еда',
  'Напитки': 'Еда',
  'Выпечка': 'Еда',
  'Специи и приправы': 'Еда',
  'Готовые блюда': 'Еда',
  'Виды магазинов': 'Еда',

  'Дом снаружи': 'Дом и быт',
  'Дом внутри': 'Дом и быт',
  'Посуда': 'Дом и быт',
  'Утварь': 'Дом и быт',
  'Материалы и инструменты': 'Дом и быт',

  'Одежда': 'Одежда и части тела',
  'Аксессуары': 'Одежда и части тела',
  'Части тела: голова': 'Одежда и части тела',
  'Части тела: тело': 'Одежда и части тела',

  'Люди и семья': 'Люди и общество',
  'Работа и профессии': 'Люди и общество',
  'Вежливые слова и приветствия': 'Люди и общество',
  'Государство и политика': 'Люди и общество',
  'Страны и национальности': 'Люди и общество',
  'Документы и бюрократия': 'Люди и общество',
  'Эмоции и характер': 'Люди и общество',

  'Времена года': 'Время, природа и животные',
  'Дни и время суток': 'Время, природа и животные',
  'Единицы времени': 'Время, природа и животные',
  'Месяцы года': 'Время, природа и животные',
  'Дни недели': 'Время, природа и животные',
  'Наречия частоты': 'Время, природа и животные',
  'Природа и погода': 'Время, природа и животные',
  'Животные': 'Время, природа и животные',

  'Прилагательные': 'Язык и грамматика',
  'Цвета': 'Язык и грамматика',
  'Наречия: степень и образ действия': 'Язык и грамматика',
  'Направления и расположение': 'Язык и грамматика',
  'Местоимения и вопросы': 'Язык и грамматика',
  'Языки': 'Язык и грамматика',
  'Числа': 'Язык и грамматика',
  'Меры и величины': 'Язык и грамматика',

  'Учеба и школа': 'Учёба, работа и техника',
  'IT и техника': 'Учёба, работа и техника',
  'Финансы и деньги': 'Учёба, работа и техника',
  'Глаголы: работа и организация': 'Учёба, работа и техника',

  'Здания и места': 'Город и транспорт',
  'Транспорт': 'Город и транспорт',

  'Здоровье и болезни': 'Здоровье и спорт',
  'Спорт': 'Здоровье и спорт',

  'Хобби и досуг': 'Люди и общество',

  'Абстрактные понятия': 'Абстрактные понятия',
}

const PRESETS: Record<string, PresetEntry[]> = {
  'В ресторане': [
    ['jesť', 'есть', 'verb'], ['piť', 'пить', 'verb'], ['objednať', 'заказать', 'verb'],
    ['naliať', 'налить', 'verb'], ['priniesť', 'принести', 'verb'], ['odniesť', 'унести', 'verb'],
    ['rezervovať', 'бронировать', 'verb'], ['ochutnať', 'пробовать на вкус', 'verb'],
    ['platiť', 'платить', 'verb'], ['odporúčať', 'рекомендовать', 'verb'],
    ['tu alebo so sebou', 'здесь или с собой'],
    ['menu', 'меню'], ['porcia', 'порция'], ['prepitné', 'чаевые'],
  ],
  'Приемы пищи': [
    ['raňajky', 'завтрак', 'noun'], ['obed', 'обед', 'noun'], ['večera', 'ужин', 'noun'],
  ],
  'Готовка': [
    ['smažiť', 'жарить', 'verb'], ['variť', 'варить', 'verb'],
    ['piecť', 'печь', 'verb'], ['dusiť', 'тушить', 'verb'],
    ['mrazený', 'замороженный', 'adjective'], ['varený', 'вареный', 'adjective'],
    ['pečený', 'печеный', 'adjective'], ['vyprážaný', 'жареный', 'adjective'], ['surový', 'сырой', 'adjective'],
    ['krájať', 'резать', 'verb'], ['nakrájať', 'нарезать', 'verb'], ['miešať', 'мешать', 'verb'],
    ['pridať', 'добавить', 'verb'], ['upiecť', 'испечь', 'verb'],
  ],
  'Вкус': [
    ['sladký', 'сладкий', 'adjective'], ['slaný', 'соленый', 'adjective'],
    ['kyslý', 'кислый', 'adjective'], ['horký', 'горький', 'adjective'],
    ['ostrý', 'острый', 'adjective'], ['chutný', 'вкусный', 'adjective'], ['nechutný', 'невкусный', 'adjective'],
    ['chuť', 'вкус', 'noun'], ['vôňa', 'запах, аромат', 'noun'], ['chutiť', 'быть вкусным', 'verb'],
  ],
  'Гарниры и крупы': [
    ['chlieb', 'хлеб'], ['cestoviny', 'макароны'], ['zemiaky', 'картошка'], ['ryža', 'рис'],
    ['huba', 'гриб'], ['pohánka', 'гречка'], ['polievka', 'суп'], ['šošovica', 'чечевица'],
    ['ovsená kaša', 'овсянка'], ['batát', 'батат'], ['kaša', 'каша'], ['pyré', 'пюре'], ['rezance', 'лапша'],
  ],
  'Мясо и рыба': [
    ['mäso', 'мясо'], ['kuracie mäso', 'курица'], ['hovädzie mäso', 'говядина'], ['teľacie mäso', 'телятина'],
    ['bravčové mäso', 'свинина'], ['morčacie mäso', 'индейка'], ['baranie mäso', 'баранина'],
    ['šunka', 'ветчина'], ['bekon', 'бекон'], ['párky', 'сосиски'], ['klobása', 'колбаса'],
    ['ryba', 'рыба'], ['ustrica', 'устрица'], ['kreveta', 'креветка'],
  ],
  'Молочные продукты': [
    ['mlieko', 'молоко'], ['maslo', 'масло'], ['syr', 'сыр'], ['kyslá smotana', 'сметана'],
    ['jogurt', 'йогурт'], ['tvaroh', 'творог'], ['smotana', 'сливки'], ['bryndza', 'брынза'],
  ],
  'Фрукты': [
    ['ovocie', 'фрукты'],
    ['banán', 'банан'], ['jablko', 'яблоко'], ['pomaranč', 'апельсин'], ['broskyňa', 'персик'],
    ['hruška', 'груша'], ['mandarínka', 'мандарин'], ['citrón', 'лимон'], ['hrozno', 'виноград'],
    ['dyňa', 'арбуз'], ['melón', 'дыня'], ['marhuľa', 'абрикос'], ['slivka', 'слива'],
    ['kivi', 'киви'], ['grapefruit', 'грейпфрут'],
  ],
  'Овощи': [
    ['zemiak', 'картофель'], ['zelenina', 'овощи'],
    ['uhorka', 'огурец'], ['paradajka', 'помидор'], ['paprika', 'перец'], ['kôpor', 'укроп'],
    ['petržlen', 'петрушка'], ['mrkva', 'морковь'], ['cibuľa', 'лук'], ['cesnak', 'чеснок'],
    ['kapusta', 'капуста'], ['huby', 'грибы'], ['baklažán', 'баклажан'], ['cuketa', 'кабачок'],
    ['avokádo', 'авокадо'], ['zázvor', 'имбирь'], ['hrášok', 'горошек'],
    ['kukurica', 'кукуруза'], ['špenát', 'шпинат'], ['brokolica', 'брокколи'],
    ['karfiol', 'цветная капуста'], ['reďkovka', 'редис'], ['fazuľa', 'фасоль'],
  ],
  'Ягоды': [
    ['jahoda', 'клубника', 'noun'], ['malina', 'малина', 'noun'], ['černica', 'ежевика', 'noun'],
    ['čerešňa', 'черешня', 'noun'], ['višňa', 'вишня', 'noun'], ['čučoriedka', 'черника', 'noun'],
  ],
  'Десерты': [
    ['koláč', 'пирог, пирожное'], ['dezert', 'десерт'],
    ['sušienka', 'печенье'], ['džem', 'варенье'], ['cukrík', 'конфета'], ['med', 'мед'],
    ['zmrzlina', 'мороженое'], ['torta', 'торт'], ['čokoláda', 'шоколад'], ['orechy', 'орехи'],
    ['hrozienka', 'изюм'], ['šľahačka', 'взбитые сливки'], ['arašid', 'арахис'], ['semienko', 'семечко'],
  ],
  'Напитки': [
    ['voda', 'вода'], ['džús', 'сок'], ['čaj', 'чай'], ['káva', 'кофе'],
    ['víno', 'вино'], ['pivo', 'пиво'], ['minerálka', 'минеральная вода'],
    ['limonáda', 'лимонад'], ['cereálie', 'хлопья'],
  ],
  'Выпечка': [
    ['múka', 'мука'], ['droždie', 'дрожжи'], ['vajce', 'яйцо'], ['palacinka', 'блин'], ['rožok', 'булочка'],
    ['cesto', 'тесто'], ['kvások', 'закваска'], ['prášok do pečiva', 'разрыхлитель'],
    ['škrob', 'крахмал'], ['strúhanka', 'панировочные сухари'],
  ],
  'Специи и приправы': [
    ['cukor', 'сахар'], ['omáčka', 'соус'],
    ['korenie', 'приправа'], ['soľ', 'соль'], ['čierne korenie', 'черный перец'],
    ['horčica', 'горчица'], ['škorica', 'корица'], ['ocot', 'уксус'], ['chren', 'хрен'],
    ['sója', 'соя'], ['olivový olej', 'оливковое масло'], ['slnečnicový olej', 'подсолнечное масло'],
    ['olej', 'растительное масло'], ['kečup', 'кетчуп'], ['majonéza', 'майонез'],
    ['vanilka', 'ваниль'], ['kakao', 'какао'],
  ],
  'Виды магазинов': [
    ['pekáreň', 'пекарня'], ['cukráreň', 'кондитерская'], ['potraviny', 'продуктовый магазин'],
    ['trh', 'рынок'], ['obchod', 'магазин'], ['reštaurácia', 'ресторан'],
    ['kaviareň', 'кафе'], ['supermarket', 'супермаркет'],
  ],
  'Готовые блюда': [
    ['šalát', 'салат', 'noun'], ['rezeň', 'шницель', 'noun'], ['guláš', 'гуляш', 'noun'],
    ['knedľa', 'кнедлик', 'noun'], ['halušky', 'галушки', 'noun'], ['vývar', 'бульон', 'noun'],
    ['kapustnica', 'капустный суп', 'noun'], ['cesnačka', 'чесночный суп', 'noun'], ['sendvič', 'сэндвич', 'noun'],
    ['hamburger', 'гамбургер', 'noun'], ['toast', 'тост', 'noun'], ['predjedlo', 'закуска', 'noun'],
  ],
  'Транспорт': [
    ['auto', 'машина'], ['autobus', 'автобус'], ['vlak', 'поезд'], ['lietadlo', 'самолет'],
    ['bicykel', 'велосипед'], ['taxi', 'такси'], ['loď', 'корабль'], ['motorka', 'мотоцикл'],
    ['električka', 'трамвай'], ['stanica', 'станция'], ['trolejbus', 'троллейбус'],
    ['lístok', 'билет'], ['batožina', 'багаж'], ['kufor', 'чемодан'], ['pas', 'паспорт'],
    ['mapa', 'карта'], ['výlet', 'поездка, экскурсия'], ['doprava', 'транспорт'],
    ['premávka', 'дорожное движение'], ['smer', 'направление'], ['vchod', 'вход'],
    ['východ', 'выход, восток'], ['sever', 'север'], ['juh', 'юг'], ['západ', 'запад'],
    ['cestujúci', 'пассажир'], ['nástupište', 'платформа'], ['koľaj', 'рельс, путь'],
    ['meškanie', 'опоздание, задержка'], ['odchod', 'отправление'], ['príchod', 'прибытие'],
    ['spoj', 'рейс'], ['prestup', 'пересадка'], ['diaľnica', 'автомагистраль'],
    ['semafor', 'светофор'], ['parkovisko', 'парковка'], ['benzín', 'бензин'],
    ['nafta', 'дизельное топливо'], ['koleso', 'колесо'], ['motor', 'двигатель'],
    ['zápcha', 'пробка'], ['hranica', 'граница'], ['zahraničie', 'заграница'],
    ['turista', 'турист'], ['pamiatka', 'достопримечательность'], ['recepcia', 'ресепшен'],
    ['ubytovanie', 'проживание'], ['pobyt', 'пребывание'], ['výhľad', 'вид'],
    ['letenka', 'авиабилет'], ['odlet', 'вылет'], ['prílet', 'прилет'], ['terminál', 'терминал'],
    ['brána', 'ворота, выход на посадку'], ['sedadlo', 'сиденье'], ['ulička', 'проход'],
    ['trasa', 'маршрут'], ['vrchol', 'вершина'], ['chata', 'дача, горный домик'],
    ['stan', 'палатка'], ['kemp', 'кемпинг'], ['suvenír', 'сувенир'],
    ['chodec', 'пешеход'], ['cyklista', 'велосипедист'], ['motocyklista', 'мотоциклист'],
    ['cestovné', 'стоимость проезда'], ['miestenka', 'билет с местом'],
    ['tunel', 'туннель'], ['obchádzka', 'объезд'], ['prevodovka', 'коробка передач'],
    ['pedál', 'педаль'], ['smerovka', 'поворотник'], ['spätné zrkadlo', 'зеркало заднего вида'],
    ['bezpečnostný pás', 'ремень безопасности'], ['airbag', 'подушка безопасности'],
    ['colnica', 'таможня'], ['kontrola', 'контроль'], ['turistika', 'туризм, походы'],
    ['značka', 'знак, марка'], ['kompas', 'компас'],
    ['meškať', 'опаздывать', 'verb'], ['odletieť', 'улететь', 'verb'], ['priletieť', 'прилететь', 'verb'],
    ['nastúpiť', 'сесть в транспорт', 'verb'], ['vystúpiť', 'выйти из транспорта', 'verb'],
    ['prestúpiť', 'пересесть', 'verb'], ['ubytovať', 'разместить', 'verb'],
    ['prenocovať', 'переночевать', 'verb'], ['stornovať', 'отменять бронь', 'verb'],
    ['fotografovať', 'фотографировать', 'verb'], ['natáčať', 'снимать видео', 'verb'],
    ['vstúpiť', 'войти', 'verb'], ['opustiť', 'покинуть', 'verb'], ['obdivovať', 'восхищаться', 'verb'],
    ['objavovať', 'открывать', 'verb'], ['preskúmať', 'исследовать', 'verb'],
    ['jednolôžková izba', 'одноместный номер'], ['dvojlôžková izba', 'двухместный номер'],
    ['klimatizácia', 'кондиционер'],
  ],
  'Здания и места': [
    ['dom', 'дом'], ['chrám', 'храм'], ['obchod', 'магазин'], ['banka', 'банк'],
    ['zámok', 'замок'], ['kancelária', 'офис'], ['škola', 'школа'], ['trh', 'рынок'],
    ['divadlo', 'театр'], ['park', 'парк'], ['nemocnica', 'больница'], ['polícia', 'полиция'],
    ['pošta', 'почта'], ['obchodné centrum', 'торговый центр'], ['budova', 'здание'],
    ['mesto', 'город'], ['dedina', 'деревня'], ['ulica', 'улица'], ['námestie', 'площадь'],
    ['cesta', 'дорога, путь'], ['chodník', 'тротуар, тропа'], ['križovatka', 'перекресток'],
    ['most', 'мост'], ['zastávka', 'остановка'], ['letisko', 'аэропорт'], ['nádražie', 'вокзал'],
    ['hotel', 'отель'], ['lekáreň', 'аптека'], ['úrad', 'учреждение, ведомство'],
    ['kostol', 'церковь'], ['múzeum', 'музей'], ['kino', 'кинотеатр'], ['knižnica', 'библиотека'],
    ['bazén', 'бассейн'], ['ihrisko', 'площадка'], ['centrum', 'центр'], ['veža', 'башня'],
    ['hrad', 'замок, крепость'], ['palác', 'дворец'], ['fontána', 'фонтан'], ['socha', 'статуя'],
    ['galéria', 'галерея'], ['výstava', 'выставка'], ['predmestie', 'пригород'],
    ['sídlisko', 'жилой микрорайон'], ['štvrť', 'квартал, район'], ['obec', 'муниципалитет, село'],
    ['okres', 'район'], ['kraj', 'край, регион'], ['hlavné mesto', 'столица'],
  ],
  'Дом снаружи': [
    ['dom', 'дом'], ['byt', 'квартира'], ['poschodie', 'этаж'], ['strecha', 'крыша'],
    ['dvere', 'дверь'], ['okno', 'окно'], ['balkón', 'балкон'], ['garáž', 'гараж'],
    ['plot', 'забор'], ['kľúč', 'ключ'], ['izba', 'комната'], ['kuchyňa', 'кухня'],
    ['spálňa', 'спальня'], ['obývačka', 'гостиная'], ['chodba', 'коридор'],
    ['kúpeľňa', 'ванная'], ['záhrada', 'сад'], ['dvor', 'двор'],
    ['panelák', 'панельный дом'], ['novostavba', 'новостройка'], ['lodžia', 'лоджия'],
    ['zábradlie', 'перила'], ['bránka', 'калитка'], ['predsieň', 'прихожая'],
    ['komora, špajza', 'кладовая'], ['pracovňa', 'кабинет'],
    ['nájom', 'аренда'], ['nájomné', 'арендная плата'],
  ],
  'Дом внутри': [
    ['izba', 'комната'], ['stôl', 'стол'], ['stolička', 'стул'], ['posteľ', 'кровать'],
    ['gauč', 'диван'], ['pohovka', 'диван'], ['zrkadlo', 'зеркало'], ['chladnička', 'холодильник'],
    ['sporák', 'плита'], ['práčka', 'стиральная машинка'], ['skriňa', 'шкаф'],
    ['vaňa', 'ванна'], ['kuchyňa', 'кухня'], ['komoda', 'комод'], ['koberec', 'ковер'],
    ['schody', 'лестница'], ['nábytok', 'мебель'], ['podlaha', 'пол'],
    ['strop', 'потолок'], ['stena', 'стена'],
    ['polica', 'полка'], ['kreslo', 'кресло'], ['lampa', 'лампа'], ['svetlo', 'свет'],
    ['rúra', 'духовка'], ['televízor', 'телевизор'], ['počítač', 'компьютер'],
    ['internet', 'интернет'], ['elektrina', 'электричество'],
    ['plyn', 'газ'], ['kúrenie', 'отопление'], ['výťah', 'лифт'], ['pivnica', 'подвал'],
    ['skrinka', 'шкафчик'], ['vešiak', 'вешалка'], ['záclona', 'занавеска'], ['záves', 'штора'],
    ['žalúzie', 'жалюзи'], ['paplón, prikrývka', 'одеяло'],
    ['matrac', 'матрас'], ['zámka', 'замок'], ['alarm', 'сигнализация'], ['interkom', 'домофон'],
    ['elektromer', 'электросчетчик'],
    ['plynomer', 'газовый счетчик'], ['vodomer', 'счетчик воды'], ['kotol', 'котел'],
    ['bojler', 'бойлер'], ['kohútik', 'кран'],
    ['pleseň', 'плесень'], ['prach', 'пыль'], ['komín', 'дымоход'],
    ['mraznička', 'морозильник'], ['luster', 'люстра'],
  ],
  'Посуда': [
    ['lyžica', 'ложка'], ['vidlička', 'вилка'], ['nôž', 'нож'], ['tanier', 'тарелка'],
    ['hrniec', 'кастрюля'], ['panvica', 'сковорода'], ['kanvica', 'чайник'],
    ['mikrovlnka', 'микроволновка'], ['hrnček', 'кружка'], ['šálka', 'чашка'], ['fľaša', 'бутылка'],
    ['pohár', 'стакан'], ['obrus', 'скатерть'],
    ['drez', 'кухонная мойка'], ['digestor', 'вытяжка'], ['kávovar', 'кофемашина'],
    ['mixér', 'блендер'], ['pokrievka', 'крышка'], ['doska', 'доска'],
    ['otvárač', 'открывалка'], ['vývrtka', 'штопор'], ['servítka', 'салфетка'],
    ['riad', 'посуда'], ['príbor', 'столовые приборы'], ['varecha', 'деревянная ложка'],
    ['naberačka', 'половник'], ['sitko', 'ситечко'], ['strúhadlo', 'терка'],
    ['lyžička', 'чайная ложка'],
  ],
  'Утварь': [
    ['mobil', 'мобильный телефон'],
    ['deka', 'одеяло'], ['vankúš', 'подушка'], ['plachta', 'простынка'],
    ['obliečka na vankúš', 'наволочка'], ['umývadlo', 'раковина'], ['uterák', 'полотенце'],
    ['zásuvka', 'розетка'], ['mydlo', 'мыло'], ['kefa', 'щетка'], ['šampón', 'шампунь'],
    ['hrebeň', 'расческа'], ['fén', 'фен'], ['kozmetika', 'косметика'], ['parfum', 'духи'],
    ['krém', 'крем'], ['botník', 'обувница'], ['sušiak', 'сушилка'], ['zástera', 'фартук'],
    ['upratovanie', 'уборка'], ['čistenie', 'чистка'], ['umývanie', 'мытье'], ['pranie', 'стирка'],
    ['žehlenie', 'глажка'], ['sušenie', 'сушка'], ['vetranie', 'проветривание'],
    ['bioodpad', 'биоотходы'], ['škvrna, fľak', 'пятно'],
  ],
  'Материалы и инструменты': [
    ['bavlna', 'хлопок', 'noun'], ['hodváb', 'шелк', 'noun'], ['kov', 'металл', 'noun'],
    ['drevo', 'дерево, древесина', 'noun'], ['plast', 'пластик', 'noun'], ['sklo', 'стекло', 'noun'],
    ['kladivo', 'молоток', 'noun'], ['klinec', 'гвоздь', 'noun'], ['skrutka', 'винт', 'noun'],
    ['skrutkovač', 'отвертка', 'noun'], ['vŕtačka', 'дрель', 'noun'], ['rebrík', 'лестница (стремянка)', 'noun'],
    ['náradie', 'инструменты', 'noun'], ['dielňa', 'мастерская', 'noun'], ['remeslo', 'ремесло', 'noun'],
    ['majster', 'мастер', 'noun'], ['opravár, údržbár', 'ремонтник', 'noun'],
  ],
  'Прилагательные': [
    ['veľký', 'большой', 'adjective'], ['malý', 'маленький', 'adjective'],
    ['čistý', 'чистый', 'adjective'], ['špinavý', 'грязный', 'adjective'],
    ['nebezpečný', 'опасный', 'adjective'], ['bezpečný', 'безопасный', 'adjective'],
    ['drahý', 'дорогой', 'adjective'], ['lacný', 'дешевый', 'adjective'],
    ['rýchly', 'быстрый', 'adjective'], ['pomalý', 'медленный', 'adjective'],
    ['prvý', 'первый', 'numeral'], ['posledný', 'последний', 'adjective'],
    ['plný', 'полный', 'adjective'], ['prázdny', 'пустой', 'adjective'],
    ['sýty', 'сытый', 'adjective'], ['hladný', 'голодный', 'adjective'],
    ['dobre', 'хорошо', 'adverb'], ['zle', 'плохо', 'adverb'],
    ['dobrý', 'хороший', 'adjective'], ['zlý', 'плохой', 'adjective'],
    ['krásny', 'красивый, привлекательный', 'adjective'], ['škaredý', 'уродливый', 'adjective'],
    ['zdravý', 'здоровый', 'adjective'], ['chorý', 'больной', 'adjective'],
    ['horúci', 'горячий', 'adjective'], ['studený', 'холодный', 'adjective'],
    ['veselý', 'веселый', 'adjective'], ['smutný', 'грустный', 'adjective'],
    ['svetlý', 'светлый, яркий', 'adjective'], ['tmavý', 'темный', 'adjective'],
    ['dlhý', 'длинный', 'adjective'], ['krátky', 'короткий', 'adjective'],
    ['nový', 'новый', 'adjective'], ['starý', 'старый', 'adjective'],
    ['nasledujúci', 'следующий', 'adjective'], ['predchádzajúci', 'предыдущий', 'adjective'],
    ['hlučný', 'шумный', 'adjective'], ['tichý', 'тихий', 'adjective'],
    ['otvorený', 'открытый', 'adjective'], ['zatvorený', 'закрытый', 'adjective'],
    ['oddýchnutý', 'отдохнувший', 'adjective'], ['unavený', 'уставший', 'adjective'],
    ['bohatý', 'богатый', 'adjective'], ['chudobný', 'бедный', 'adjective'],
    ['jednoduchý', 'простой', 'adjective'], ['ťažký', 'трудный', 'adjective'],
    ['chudý', 'худой', 'adjective'], ['tučný', 'толстый (о человеке)', 'adjective'],
    ['múdry', 'умный', 'adjective'], ['hlúpy', 'глупый', 'adjective'],
    ['zvláštny', 'странный', 'adjective'], ['obyčajný', 'обычный', 'adjective'],
    ['silný', 'сильный', 'adjective'], ['slabý', 'слабый', 'adjective'],
    ['vysoký', 'высокий', 'adjective'], ['nízky', 'низкий', 'adjective'],
    ['tenký', 'тонкий', 'adjective'], ['hrubý', 'толстый (о предмете)', 'adjective'],
    ['užitočný', 'полезный', 'adjective'], ['zbytočný', 'бесполезный', 'adjective'],
    ['mokrý', 'мокрый', 'adjective'], ['suchý', 'сухой', 'adjective'],
    ['mladý', 'молодой', 'adjective'],
  ],
  'Цвета': [
    ['červený', 'красный', 'adjective'], ['ružový', 'розовый', 'adjective'],
    ['oranžový', 'оранжевый', 'adjective'], ['žltý', 'желтый', 'adjective'],
    ['zelený', 'зеленый', 'adjective'], ['modrý', 'синий', 'adjective'],
    ['fialový', 'фиолетовый', 'adjective'], ['biely', 'белый', 'adjective'],
    ['sivý', 'серый', 'adjective'], ['hnedý', 'коричневый', 'adjective'],
    ['čierny', 'черный', 'adjective'], ['bezfarebný', 'бесцветный', 'adjective'],
    ['mnohofarebný, pestrý', 'разноцветный', 'adjective'], ['priehľadný', 'прозрачный', 'adjective'],
    ['farba', 'цвет', 'noun'],
  ],
  'Одежда': [
    ['košeľa', 'рубашка', 'noun'], ['tričko', 'футболка', 'noun'],
    ['nohavice', 'брюки', 'noun'], ['šortky', 'шорты', 'noun'], ['kraťasy', 'шорты', 'noun'],
    ['ponožky', 'носки', 'noun'], ['topánky, obuv', 'ботинки, обувь', 'noun'],
    ['čižmy', 'сапоги', 'noun'], ['sukňa', 'юбка', 'noun'],
    ['šaty', 'платье', 'noun'], ['sako', 'пиджак', 'noun'],
    ['kabát, bunda', 'пальто, куртка', 'noun'], ['oblek', 'костюм', 'noun'],
    ['čiapka', 'шапка', 'noun'],
    ['oblečenie', 'одежда', 'noun'], ['džínsy', 'джинсы', 'noun'], ['sveter', 'свитер', 'noun'],
    ['veľkosť', 'размер', 'noun'], ['tenisky', 'кроссовки', 'noun'], ['sandále', 'сандалии', 'noun'],
    ['papuče', 'тапочки', 'noun'], ['podprsenka', 'бюстгальтер', 'noun'], ['spodky', 'трусы', 'noun'],
    ['pyžamo', 'пижама', 'noun'], ['župan', 'халат', 'noun'], ['legíny', 'легинсы', 'noun'],
    ['tepláky', 'спортивные штаны', 'noun'], ['mikina', 'толстовка', 'noun'], ['vesta', 'жилет', 'noun'],
    ['blúzka', 'блузка', 'noun'], ['plášť', 'плащ', 'noun'], ['pršiplášť', 'дождевик', 'noun'],
    ['gombík', 'пуговица', 'noun'], ['rukáv', 'рукав', 'noun'], ['golier', 'воротник', 'noun'],
    ['zips', 'молния', 'noun'], ['kapucňa', 'капюшон', 'noun'], ['opätok', 'каблук', 'noun'],
    ['podrážka', 'подошва', 'noun'], ['šnúrka', 'шнурок', 'noun'],
    ['nosiť', 'носить', 'verb'], ['kupovať', 'покупать', 'verb'],
    ['predávať', 'продавать', 'verb'], ['vyberať', 'выбирать', 'verb'],
    ['obliekať si', 'надевать', 'verb'], ['vyzliekať si', 'снимать', 'verb'],
  ],
  'Аксессуары': [
    ['okuliare', 'очки', 'noun'], ['kontaktné šošovky', 'линзы', 'noun'],
    ['kravata', 'галстук', 'noun'], ['motýlik', 'бабочка (галстук)', 'noun'],
    ['pás', 'ремень', 'noun'], ['opasok', 'ремень', 'noun'],
    ['náušnice', 'сережки', 'noun'], ['náušnica', 'серьга', 'noun'],
    ['dáždnik', 'зонт', 'noun'], ['rúž', 'помада', 'noun'],
    ['taška', 'сумка', 'noun'], ['kabelka', 'сумочка', 'noun'], ['batoh', 'рюкзак', 'noun'],
    ['peňaženka', 'кошелек', 'noun'], ['hodinky', 'часы', 'noun'],
    ['náhrdelník', 'ожерелье', 'noun'], ['retiazka', 'цепочка', 'noun'],
    ['rukavice', 'перчатки', 'noun'], ['šál', 'шарф', 'noun'],
    ['prsteň', 'кольцо', 'noun'],
  ],
  'Части тела: голова': [
    ['hlava', 'голова', 'noun'], ['tvár', 'лицо', 'noun'],
    ['vlasy', 'волосы', 'noun'], ['oko', 'глаз', 'noun'],
    ['nos', 'нос', 'noun'], ['ucho', 'ухо', 'noun'],
    ['ústa', 'рот', 'noun'], ['zuby', 'зубы', 'noun'],
    ['jazyk', 'язык', 'noun'], ['fúzy', 'усы', 'noun'],
    ['brada', 'борода', 'noun'], ['úsmev', 'улыбка', 'noun'],
  ],
  'Части тела: тело': [
    ['telo', 'тело', 'noun'], ['noha', 'нога', 'noun'],
    ['chodidlo', 'ступня', 'noun'], ['prst na nohe', 'палец ноги', 'noun'],
    ['ruka', 'рука', 'noun'], ['dlaň', 'ладонь', 'noun'],
    ['prst na ruke', 'палец руки', 'noun'], ['koža', 'кожа', 'noun'],
    ['krk', 'шея', 'noun'], ['váha', 'вес', 'noun'],
    ['výška', 'рост', 'noun'], ['krv', 'кровь', 'noun'],
    ['mozog', 'мозг', 'noun'], ['srdce', 'сердце', 'noun'],
    ['žalúdok', 'желудок', 'noun'],
    ['rameno', 'плечо', 'noun'], ['prst', 'палец', 'noun'], ['brucho', 'живот', 'noun'],
    ['chrbát', 'спина', 'noun'], ['koleno', 'колено', 'noun'], ['zub', 'зуб', 'noun'],
  ],
  'Времена года': [
    ['zima', 'зима', 'noun'], ['jar', 'весна', 'noun'],
    ['leto', 'лето', 'noun'], ['jeseň', 'осень', 'noun'],
  ],
  'Дни и время суток': [
    ['včera', 'вчера', 'adverb'], ['dnes', 'сегодня', 'adverb'],
    ['zajtra', 'завтра', 'adverb'], ['teraz', 'сейчас', 'adverb'],
    ['neskôr', 'позже', 'adverb'], ['potom', 'потом', 'adverb'],
    ['ráno', 'утром', 'adverb'], ['napoludnie', 'днем, в полдень', 'adverb'],
    ['večer', 'вечером', 'adverb'], ['v noci', 'ночью', 'adverb'],
    ['neskoro', 'поздно', 'adverb'], ['skoro', 'рано, скоро', 'adverb'],
    ['hneď', 'сразу', 'adverb'], ['predtým', 'до этого, раньше', 'adverb'],
    ['najprv', 'сначала', 'adverb'], ['nakoniec', 'наконец, в конце', 'adverb'],
  ],
  'Единицы времени': [
    ['sekunda', 'секунда', 'noun'], ['minúta', 'минута', 'noun'],
    ['hodina', 'час', 'noun'], ['deň', 'день', 'noun'],
    ['týždeň', 'неделя', 'noun'], ['mesiac', 'месяц', 'noun'],
    ['rok', 'год', 'noun'], ['storočie', 'век', 'noun'],
  ],
  'Месяцы года': [
    ['január', 'январь', 'noun'], ['február', 'февраль', 'noun'],
    ['marec', 'март', 'noun'], ['apríl', 'апрель', 'noun'],
    ['máj', 'май', 'noun'], ['jún', 'июнь', 'noun'],
    ['júl', 'июль', 'noun'], ['august', 'август', 'noun'],
    ['september', 'сентябрь', 'noun'], ['október', 'октябрь', 'noun'],
    ['november', 'ноябрь', 'noun'], ['december', 'декабрь', 'noun'],
  ],
  'Дни недели': [
    ['pondelok', 'понедельник', 'noun'], ['utorok', 'вторник', 'noun'],
    ['streda', 'среда', 'noun'], ['štvrtok', 'четверг', 'noun'],
    ['piatok', 'пятница', 'noun'], ['sobota', 'суббота', 'noun'],
    ['nedeľa', 'воскресенье', 'noun'],
  ],
  'Наречия частоты': [
    ['nikdy', 'никогда', 'adverb'], ['zriedka', 'редко', 'adverb'],
    ['niekedy', 'иногда', 'adverb'], ['zvyčajne, obyčajne', 'обычно', 'adverb'],
    ['často', 'часто', 'adverb'], ['vždy', 'всегда', 'adverb'],
    ['načas', 'вовремя', 'adverb'], ['skôr', 'раньше', 'adverb'], ['práve', 'как раз, именно', 'adverb'],
    ['zatiaľ', 'пока', 'adverb'], ['doteraz', 'до сих пор', 'adverb'], ['odvtedy', 'с тех пор', 'adverb'],
    ['čoskoro', 'скоро', 'adverb'], ['nedávno', 'недавно', 'adverb'], ['dávno', 'давно', 'adverb'],
    ['okamžite', 'немедленно', 'adverb'], ['postupne', 'постепенно', 'adverb'],
    ['opäť, znovu', 'снова', 'adverb'], ['raz', 'раз, однажды', 'adverb'],
    ['dvakrát', 'дважды', 'adverb'], ['trikrát', 'трижды', 'adverb'], ['prvýkrát', 'впервые', 'adverb'],
    ['naposledy', 'в последний раз', 'adverb'], ['pravidelne', 'регулярно', 'adverb'],
    ['denne', 'ежедневно', 'adverb'], ['týždenne', 'еженедельно', 'adverb'],
    ['mesačne', 'ежемесячно', 'adverb'], ['ročne', 'ежегодно', 'adverb'],
    ['stále, neustále', 'постоянно', 'adverb'], ['momentálne, aktuálne', 'в данный момент', 'adverb'],
  ],
  'Наречия: степень и образ действия': [
    ['veľmi', 'очень', 'adverb'], ['dosť', 'достаточно, довольно', 'adverb'], ['málo', 'мало', 'adverb'],
    ['veľa', 'много', 'adverb'], ['viac', 'больше', 'adverb'], ['menej', 'меньше', 'adverb'],
    ['trochu', 'немного', 'adverb'], ['iba, len', 'только', 'adverb'], ['tiež', 'также', 'adverb'],
    ['ešte', 'еще', 'adverb'], ['už', 'уже', 'adverb'],
    ['možno', 'возможно', 'adverb'], ['asi', 'наверное, примерно', 'adverb'],
    ['určite', 'определенно, точно', 'adverb'], ['naozaj', 'действительно', 'adverb'],
    ['rýchlo', 'быстро', 'adverb'], ['pomaly', 'медленно', 'adverb'], ['ľahko', 'легко', 'adverb'],
    ['ťažko', 'трудно', 'adverb'], ['presne', 'точно', 'adverb'], ['napríklad', 'например', 'adverb'],
    ['samozrejme', 'конечно', 'adverb'],
    ['hlasno', 'громко', 'adverb'], ['potichu', 'тихо', 'adverb'], ['jasne', 'ясно', 'adverb'],
    ['vážne', 'серьезно', 'adverb'], ['veselo', 'весело', 'adverb'], ['smutne', 'грустно', 'adverb'],
    ['pekne', 'красиво, хорошо', 'adverb'], ['osobne', 'лично', 'adverb'],
    ['písomne', 'письменно', 'adverb'], ['ústne', 'устно', 'adverb'], ['zadarmo', 'бесплатно', 'adverb'],
  ],
  'Направления и расположение': [
    ['tu', 'здесь, тут', 'adverb'], ['tam', 'там', 'adverb'], ['sem', 'сюда', 'adverb'],
    ['von', 'наружу', 'adverb'], ['dnu', 'внутрь', 'adverb'], ['hore', 'наверху, вверх', 'adverb'],
    ['dole', 'внизу, вниз', 'adverb'], ['vľavo', 'слева', 'adverb'], ['vpravo', 'справа', 'adverb'],
    ['rovno', 'прямо', 'adverb'], ['blízko', 'близко', 'adverb'], ['ďaleko', 'далеко', 'adverb'],
    ['spolu', 'вместе', 'adverb'], ['späť', 'назад', 'adverb'], ['ďalej', 'дальше', 'adverb'],
    ['preč', 'прочь', 'adverb'], ['niekam', 'куда-то', 'adverb'], ['nikam', 'никуда', 'adverb'],
    ['niekde', 'где-то', 'adverb'], ['nikde', 'нигде', 'adverb'], ['všade', 'везде', 'adverb'],
    ['vnútri', 'внутри', 'adverb'], ['vonku', 'снаружи', 'adverb'], ['vpredu', 'впереди', 'adverb'],
    ['vzadu', 'сзади', 'adverb'], ['vedľa', 'рядом', 'adverb'], ['oproti', 'напротив', 'adverb'],
    ['neďaleko', 'недалеко', 'adverb'], ['za rohom', 'за углом', 'adverb'], ['v strede', 'в середине', 'adverb'],
    ['vopred', 'заранее', 'adverb'], ['naraz', 'одновременно, вдруг', 'adverb'], ['zrazu', 'вдруг', 'adverb'],
    ['náhodou', 'случайно', 'adverb'], ['našťastie', 'к счастью', 'adverb'],
    ['bohužiaľ, žiaľ', 'к сожалению', 'adverb'],
  ],
  'Местоимения и вопросы': [
    ['ja', 'я', 'pronoun'], ['ty', 'ты', 'pronoun'], ['on', 'он', 'pronoun'], ['ona', 'она', 'pronoun'],
    ['ono', 'оно', 'pronoun'], ['my', 'мы', 'pronoun'], ['vy', 'вы', 'pronoun'], ['oni', 'они', 'pronoun'],
    ['môj', 'мой', 'pronoun'], ['tvoj', 'твой', 'pronoun'], ['jeho', 'его', 'pronoun'],
    ['jej', 'ее', 'pronoun'], ['náš', 'наш', 'pronoun'], ['váš', 'ваш', 'pronoun'],
    ['ich', 'их', 'pronoun'], ['svoj', 'свой', 'pronoun'],
    ['tento', 'этот', 'pronoun'], ['tamten', 'тот', 'pronoun'], ['taký', 'такой', 'pronoun'],
    ['aký', 'какой', 'pronoun'], ['ktorý', 'который', 'pronoun'], ['kto', 'кто', 'pronoun'],
    ['čo', 'что', 'pronoun'], ['čí', 'чей', 'pronoun'],
    ['niekto', 'кто-то', 'pronoun'], ['niečo', 'что-то', 'pronoun'], ['nikto', 'никто', 'pronoun'],
    ['nič', 'ничто', 'pronoun'], ['každý', 'каждый', 'pronoun'], ['všetko', 'все', 'pronoun'],
    ['všetci', 'все', 'pronoun'], ['iný', 'другой', 'pronoun'],
    ['kde', 'где', 'adverb'], ['kam', 'куда', 'adverb'], ['kedy', 'когда', 'adverb'],
    ['prečo', 'почему', 'adverb'], ['koľko', 'сколько', 'adverb'], ['odkiaľ', 'откуда', 'adverb'],
    ['niekoľko', 'несколько', 'pronoun'], ['mnoho', 'много', 'pronoun'],
    ['dostatok', 'достаточное количество', 'noun'], ['väčšina', 'большинство', 'noun'],
    ['menšina', 'меньшинство', 'noun'], ['obaja', 'оба', 'pronoun'], ['obidve', 'обе', 'pronoun'],
    ['nejaký', 'какой-то', 'pronoun'], ['niektorý', 'некоторый', 'pronoun'],
    ['žiadny', 'никакой', 'pronoun'], ['celý', 'целый, весь', 'pronoun'],
    ['ktokoľvek', 'кто угодно', 'pronoun'], ['čokoľvek', 'что угодно', 'pronoun'],
    ['kedykoľvek', 'когда угодно', 'adverb'], ['kdekoľvek', 'где угодно', 'adverb'],
    ['navždy', 'навсегда', 'adverb'],
  ],
  'Числа': [
    ['jeden', 'один', 'numeral'], ['dva', 'два', 'numeral'], ['tri', 'три', 'numeral'],
    ['štyri', 'четыре', 'numeral'], ['päť', 'пять', 'numeral'], ['šesť', 'шесть', 'numeral'],
    ['sedem', 'семь', 'numeral'], ['osem', 'восемь', 'numeral'], ['deväť', 'девять', 'numeral'],
    ['desať', 'десять', 'numeral'], ['jedenásť', 'одиннадцать', 'numeral'],
    ['dvanásť', 'двенадцать', 'numeral'], ['trinásť', 'тринадцать', 'numeral'],
    ['štrnásť', 'четырнадцать', 'numeral'], ['pätnásť', 'пятнадцать', 'numeral'],
    ['šestnásť', 'шестнадцать', 'numeral'], ['sedemnásť', 'семнадцать', 'numeral'],
    ['osemnásť', 'восемнадцать', 'numeral'], ['devätnásť', 'девятнадцать', 'numeral'],
    ['dvadsať', 'двадцать', 'numeral'], ['tridsať', 'тридцать', 'numeral'],
    ['štyridsať', 'сорок', 'numeral'], ['päťdesiat', 'пятьдесят', 'numeral'],
    ['sto', 'сто', 'numeral'], ['tisíc', 'тысяча', 'numeral'],
    ['prvý', 'первый', 'numeral'], ['druhý', 'второй', 'numeral'], ['tretí', 'третий', 'numeral'],
  ],
  'Люди и семья': [
    ['človek', 'человек', 'noun'], ['ľudia', 'люди', 'noun'], ['muž', 'мужчина', 'noun'],
    ['žena', 'женщина', 'noun'], ['chlapec', 'мальчик', 'noun'], ['dievča', 'девочка', 'noun'],
    ['dieťa', 'ребенок', 'noun'], ['rodina', 'семья', 'noun'], ['rodič', 'родитель', 'noun'],
    ['matka', 'мать', 'noun'], ['mama', 'мама', 'noun'], ['otec', 'отец', 'noun'],
    ['syn', 'сын', 'noun'], ['dcéra', 'дочь', 'noun'], ['brat', 'брат', 'noun'],
    ['sestra', 'сестра', 'noun'], ['starý otec', 'дедушка', 'noun'], ['stará mama', 'бабушка', 'noun'],
    ['manžel', 'муж', 'noun'], ['manželka', 'жена', 'noun'], ['priateľ', 'друг', 'noun'],
    ['priateľka', 'подруга', 'noun'], ['kamarát', 'приятель', 'noun'], ['sused', 'сосед', 'noun'],
    ['kolega', 'коллега', 'noun'], ['šéf', 'начальник', 'noun'], ['zákazník', 'клиент', 'noun'],
    ['hosť', 'гость', 'noun'], ['učiteľ', 'учитель', 'noun'], ['študent', 'студент', 'noun'],
    ['žiak', 'ученик', 'noun'], ['lekár', 'врач', 'noun'], ['policajt', 'полицейский', 'noun'],
    ['predavač', 'продавец', 'noun'], ['čašník', 'официант', 'noun'], ['kuchár', 'повар', 'noun'],
    ['vodič', 'водитель', 'noun'], ['meno', 'имя', 'noun'], ['priezvisko', 'фамилия', 'noun'],
    ['vek', 'возраст', 'noun'], ['adresa', 'адрес', 'noun'], ['telefón', 'телефон', 'noun'],
    ['číslo', 'номер', 'noun'], ['život', 'жизнь', 'noun'], ['láska', 'любовь', 'noun'],
    ['priateľstvo', 'дружба', 'noun'], ['svadba', 'свадьба', 'noun'], ['narodeniny', 'день рождения', 'noun'],
    ['pán', 'господин', 'noun'], ['pani', 'госпожа', 'noun'], ['slečna', 'девушка, госпожа', 'noun'],
    ['dospelý', 'взрослый', 'noun'], ['senior', 'пожилой человек', 'noun'], ['partner', 'партнер', 'noun'],
    ['návšteva', 'визит, гости', 'noun'], ['oslava', 'празднование', 'noun'], ['meniny', 'именины', 'noun'],
    ['pohreb', 'похороны', 'noun'],
    ['zoznámiť sa', 'познакомиться', 'verb'], ['predstaviť sa', 'представиться', 'verb'],
    ['privítať', 'поприветствовать', 'verb'], ['lúčiť sa, rozlúčiť sa', 'прощаться, попрощаться', 'verb'],
    ['gratulovať', 'поздравлять', 'verb'], ['želať', 'желать', 'verb'], ['darovať', 'дарить', 'verb'],
    ['odpustiť', 'простить', 'verb'], ['ospravedlniť sa', 'извиниться', 'verb'],
    ['adoptovať', 'усыновлять', 'verb'],
  ],
  'Вежливые слова и приветствия': [
    ['ahoj', 'привет, пока', 'interjection'], ['dovidenia', 'до свидания', 'interjection'],
    ['vitajte', 'добро пожаловать', 'interjection'], ['prosím', 'пожалуйста', 'interjection'],
    ['ďakujem', 'спасибо', 'interjection'], ['prepáč, pardon', 'извини, извините', 'interjection'],
    ['áno', 'да', 'interjection'], ['nie', 'нет, не', 'interjection'],
    ['zdvorilý', 'вежливый', 'adjective'], ['zdvorilosť', 'вежливость', 'noun'],
    ['pozvánka', 'приглашение', 'noun'], ['prosba', 'просьба', 'noun'],
    ['ospravedlnenie', 'извинение', 'noun'], ['poďakovanie', 'благодарность', 'noun'],
    ['pozvať', 'пригласить', 'verb'], ['odmietnuť, odmietať', 'отказать, отказывать', 'verb'],
    ['sľúbiť, sľubovať', 'пообещать, обещать', 'verb'], ['navrhnúť', 'предложить', 'verb'],
    ['radiť', 'советовать', 'verb'], ['poprosiť', 'попросить', 'verb'],
    ['oznámiť', 'сообщить', 'verb'], ['informovať', 'информировать', 'verb'],
    ['opísať', 'описать', 'verb'], ['porovnať, porovnávať', 'сравнить, сравнивать', 'verb'],
  ],
  'Работа и профессии': [
    ['práca', 'работа', 'noun'], ['zamestnanie', 'занятость', 'noun'], ['firma', 'фирма', 'noun'],
    ['spoločnosť', 'компания', 'noun'], ['stretnutie', 'встреча', 'noun'], ['porada', 'совещание', 'noun'],
    ['projekt', 'проект', 'noun'], ['plán', 'план', 'noun'], ['plat', 'зарплата', 'noun'],
    ['dovolenka', 'отпуск', 'noun'], ['zmluva', 'договор', 'noun'], ['doklad', 'документ', 'noun'],
    ['zamestnanec', 'сотрудник', 'noun'], ['zamestnávateľ', 'работодатель', 'noun'],
    ['pracovník', 'работник', 'noun'], ['riaditeľ', 'директор', 'noun'], ['manažér', 'менеджер', 'noun'],
    ['sekretárka', 'секретарь', 'noun'], ['povolanie', 'профессия', 'noun'], ['životopis', 'резюме', 'noun'],
    ['pohovor', 'собеседование', 'noun'], ['skúsenosť', 'опыт', 'noun'], ['výplata', 'зарплата', 'noun'],
    ['mzda', 'заработная плата', 'noun'], ['oddelenie', 'отдел', 'noun'], ['pracovisko', 'рабочее место', 'noun'],
    ['podnik', 'предприятие', 'noun'], ['podnikateľ', 'предприниматель', 'noun'],
    ['obchodník', 'бизнесмен', 'noun'], ['robotník', 'рабочий', 'noun'], ['mechanik', 'механик', 'noun'],
    ['elektrikár', 'электрик', 'noun'], ['inštalatér', 'сантехник', 'noun'], ['stavbár', 'строитель', 'noun'],
    ['programátor', 'программист', 'noun'], ['inžinier', 'инженер', 'noun'], ['architekt', 'архитектор', 'noun'],
    ['právnik', 'юрист', 'noun'], ['účtovník', 'бухгалтер', 'noun'], ['novinár', 'журналист', 'noun'],
    ['fotograf', 'фотограф', 'noun'], ['vojak', 'солдат', 'noun'], ['hasič', 'пожарный', 'noun'],
    ['zdravotník', 'медработник', 'noun'], ['farmaceut', 'фармацевт', 'noun'], ['profesor', 'профессор', 'noun'],
    ['vedec', 'ученый', 'noun'], ['umelec', 'деятель искусства', 'noun'], ['herec', 'актер', 'noun'],
    ['herečka', 'актриса', 'noun'], ['spevák', 'певец', 'noun'], ['speváčka', 'певица', 'noun'],
    ['hudobník', 'музыкант', 'noun'], ['športovec', 'спортсмен', 'noun'], ['tréner', 'тренер', 'noun'],
    ['pilot', 'пилот', 'noun'], ['sprievodca', 'гид', 'noun'],
    ['benefit', 'льгота, бонус', 'noun'], ['nadčas', 'сверхурочная работа', 'noun'],
    ['výpoveď', 'увольнение', 'noun'], ['odstupné', 'выходное пособие', 'noun'],
    ['kolektív', 'коллектив', 'noun'], ['spolupracovník', 'сотрудник, коллега', 'noun'],
    ['nadriadený', 'начальник', 'noun'], ['podriadený', 'подчиненный', 'noun'],
    ['skladník', 'кладовщик', 'noun'], ['upratovačka', 'уборщица', 'noun'],
    ['recepčná', 'администратор', 'noun'], ['opatrovateľ, opatrovateľka', 'сиделка, опекун', 'noun'],
    ['lekárnik', 'фармацевт', 'noun'], ['taxikár', 'таксист', 'noun'],
    ['automechanik', 'автомеханик', 'noun'], ['murár', 'каменщик', 'noun'], ['stolár', 'столяр', 'noun'],
    ['tesár', 'плотник', 'noun'], ['zámočník', 'слесарь', 'noun'], ['kaderníčka', 'парикмахер', 'noun'],
    ['kozmetička', 'косметолог', 'noun'], ['strážnik', 'охранник', 'noun'],
    ['záchranár', 'спасатель', 'noun'], ['vychovávateľ', 'воспитатель', 'noun'],
    ['školník', 'завхоз, школьный сторож', 'noun'], ['knihovník', 'библиотекарь', 'noun'],
    ['sudca', 'судья', 'noun'], ['advokát', 'адвокат', 'noun'], ['kameraman', 'оператор', 'noun'],
    ['grafik', 'графический дизайнер', 'noun'], ['dizajnér', 'дизайнер', 'noun'],
    ['ekonóm', 'экономист', 'noun'], ['personalista', 'специалист по кадрам', 'noun'],
    ['technik', 'техник', 'noun'], ['vývojár', 'разработчик', 'noun'],
    ['administrátor', 'администратор', 'noun'], ['analytik', 'аналитик', 'noun'],
    ['živnostník', 'индивидуальный предприниматель', 'noun'],
    ['prevádzka', 'заведение, эксплуатация', 'noun'], ['klient', 'клиент', 'noun'],
    ['predajca', 'продавец', 'noun'], ['kaderník', 'парикмахер', 'noun'],
  ],
  'Документы и бюрократия': [
    ['doklad totožnosti, občiansky preukaz', 'удостоверение личности', 'noun'],
    ['vodičský preukaz', 'водительские права', 'noun'], ['povolenie', 'разрешение', 'noun'],
    ['žiadosť', 'заявление', 'noun'], ['podpis', 'подпись', 'noun'], ['formulár', 'бланк', 'noun'],
    ['potvrdenie', 'подтверждение', 'noun'], ['úradník', 'чиновник', 'noun'], ['pečiatka', 'печать', 'noun'],
    ['platnosť', 'срок действия', 'noun'], ['platný', 'действительный', 'adjective'],
    ['neplatný', 'недействительный', 'adjective'], ['kópia', 'копия', 'noun'], ['originál', 'оригинал', 'noun'],
    ['lehota', 'срок', 'noun'], ['bydlisko', 'место жительства', 'noun'],
    ['trvalý', 'постоянный', 'adjective'], ['dočasný', 'временный', 'adjective'],
    ['pohlavie', 'пол', 'noun'], ['mužský', 'мужской', 'adjective'], ['ženský', 'женский', 'adjective'],
    ['rodinný stav', 'семейное положение', 'noun'], ['ženatý', 'женатый', 'adjective'],
    ['vydatá', 'замужняя', 'adjective'], ['slobodný', 'холостой, незамужняя', 'adjective'],
    ['rozvedený', 'разведенный', 'adjective'],
    ['vybaviť', 'оформить', 'verb'], ['požiadať', 'подать заявление', 'verb'],
    ['schváliť', 'одобрить', 'verb'], ['zamietnuť', 'отклонить', 'verb'], ['podpísať', 'подписать', 'verb'],
    ['vyplniť', 'заполнить', 'verb'], ['potvrdiť', 'подтвердить', 'verb'], ['zrušiť', 'отменить', 'verb'],
    ['dohodnúť sa', 'договориться', 'verb'], ['dohoda', 'договоренность', 'noun'],
    ['účasť', 'участие', 'noun'], ['zúčastniť sa', 'участвовать', 'verb'],
    ['prítomný', 'присутствующий', 'adjective'], ['neprítomný', 'отсутствующий', 'adjective'],
  ],
  'Природа и погода': [
    ['počasie', 'погода', 'noun'], ['slnko', 'солнце', 'noun'], ['dážď', 'дождь', 'noun'],
    ['sneh', 'снег', 'noun'], ['vietor', 'ветер', 'noun'], ['oblak', 'облако', 'noun'],
    ['búrka', 'гроза', 'noun'], ['hmla', 'туман', 'noun'], ['teplota', 'температура', 'noun'],
    ['teplo', 'тепло', 'noun'], ['chlad', 'холод', 'noun'], ['príroda', 'природа', 'noun'],
    ['zem', 'земля', 'noun'], ['svet', 'мир', 'noun'], ['krajina', 'страна', 'noun'],
    ['hora', 'гора', 'noun'], ['kopec', 'холм', 'noun'], ['les', 'лес', 'noun'],
    ['strom', 'дерево', 'noun'], ['kvet', 'цветок', 'noun'], ['tráva', 'трава', 'noun'],
    ['rieka', 'река', 'noun'], ['jazero', 'озеро', 'noun'], ['more', 'море', 'noun'],
    ['ostrov', 'остров', 'noun'], ['pláž', 'пляж', 'noun'], ['vzduch', 'воздух', 'noun'],
    ['oheň', 'огонь', 'noun'], ['kameň', 'камень', 'noun'], ['piesok', 'песок', 'noun'],
    ['pole', 'поле', 'noun'], ['lúka', 'луг', 'noun'], ['údolie', 'долина', 'noun'],
    ['jaskyňa', 'пещера', 'noun'], ['vodopád', 'водопад', 'noun'], ['prameň', 'источник', 'noun'],
    ['oceán', 'океан', 'noun'], ['pobrežie', 'побережье', 'noun'], ['vlna', 'волна', 'noun'],
    ['obloha', 'небо', 'noun'], ['hviezda', 'звезда', 'noun'], ['tieň', 'тень', 'noun'],
    ['ľad', 'лед', 'noun'], ['mráz', 'мороз', 'noun'], ['blesk', 'молния', 'noun'],
    ['hrom', 'гром', 'noun'], ['duha', 'радуга', 'noun'],
    ['mrak', 'туча', 'noun'], ['horúčava', 'жара', 'noun'],
    ['zamračený', 'облачный', 'adjective'], ['slnečný', 'солнечный', 'adjective'],
    ['daždivý', 'дождливый', 'adjective'], ['hmlistý', 'туманный', 'adjective'],
    ['mrazivý', 'морозный', 'adjective'], ['teplý', 'теплый', 'adjective'],
    ['vlhký', 'влажный', 'adjective'], ['oblačný, polooblačný', 'облачно, переменная облачность', 'adjective'],
    ['stupeň', 'градус, степень', 'noun'],
    ['predpovedať', 'прогнозировать', 'verb'], ['ochladzovať', 'охлаждать', 'verb'],
    ['otepľovať', 'согревать', 'verb'], ['mrznúť', 'мерзнуть', 'verb'], ['topiť', 'таять, плавить', 'verb'],
    ['fúkať', 'дуть', 'verb'], ['pršať', 'идти (о дожде)', 'verb'], ['snežiť', 'идти (о снеге)', 'verb'],
    ['svietiť', 'светить', 'verb'], ['hrmieť', 'греметь', 'verb'], ['blýskať', 'сверкать', 'verb'],
    ['rastlina', 'растение', 'noun'], ['krík', 'куст', 'noun'], ['koreň', 'корень', 'noun'],
    ['vetva', 'ветка', 'noun'], ['kmeň', 'ствол', 'noun'], ['úroda', 'урожай', 'noun'],
    ['záhradník', 'садовник', 'noun'],
    ['sadiť', 'сажать', 'verb'], ['polievať', 'поливать', 'verb'], ['kosiť', 'косить', 'verb'],
    ['pestovať', 'выращивать', 'verb'], ['zberať', 'собирать урожай', 'verb'],
    ['životné prostredie', 'окружающая среда', 'noun'], ['smeti', 'мусор', 'noun'],
    ['kontajner', 'контейнер', 'noun'], ['odpad', 'отходы', 'noun'],
    ['triediť', 'сортировать', 'verb'], ['recyklovať', 'перерабатывать', 'verb'],
    ['znečisťovať', 'загрязнять', 'verb'], ['obnoviteľný zdroj', 'возобновляемый источник', 'noun'],
    ['emisia', 'выброс', 'noun'], ['ovzdušie', 'воздух, атмосфера', 'noun'],
    ['sucho', 'засуха', 'noun'], ['povodeň', 'наводнение', 'noun'],
  ],
  'Языки': [
    ['slovenčina', 'словацкий язык', 'noun'], ['ruština', 'русский язык', 'noun'],
    ['angličtina', 'английский язык', 'noun'], ['čeština', 'чешский язык', 'noun'],
    ['nemčina', 'немецкий язык', 'noun'], ['francúzština', 'французский язык', 'noun'],
    ['taliančina', 'итальянский язык', 'noun'], ['španielčina', 'испанский язык', 'noun'],
    ['poľština', 'польский язык', 'noun'], ['maďarčina', 'венгерский язык', 'noun'],
    ['ukrajinčina', 'украинский язык', 'noun'], ['chorvátčina', 'хорватский язык', 'noun'],
    ['gréčtina', 'греческий язык', 'noun'],
    ['nárečie, dialekt', 'диалект', 'noun'], ['hláska', 'звук речи', 'noun'],
    ['písmeno', 'буква', 'noun'], ['abeceda', 'алфавит', 'noun'], ['samohláska', 'гласная', 'noun'],
    ['spoluhláska', 'согласная', 'noun'], ['slabika', 'слог', 'noun'], ['pravopis', 'орфография', 'noun'],
    ['interpunkcia', 'пунктуация', 'noun'], ['čiarka', 'запятая', 'noun'], ['bodka', 'точка', 'noun'],
    ['otáznik', 'вопросительный знак', 'noun'], ['výkričník', 'восклицательный знак', 'noun'],
    ['zátvorka', 'скобка', 'noun'], ['úvodzovky', 'кавычки', 'noun'], ['odsek', 'абзац', 'noun'],
    ['riadok', 'строка', 'noun'], ['plynulosť', 'беглость', 'noun'],
    ['tlmočenie', 'устный перевод', 'noun'], ['prekladač', 'переводчик (программа)', 'noun'],
    ['prekladať', 'переводить', 'verb'], ['tlmočiť', 'переводить устно', 'verb'],
    ['vysloviť, vyslovovať', 'произносить, произнести', 'verb'],
  ],
  'Учеба и школа': [
    ['univerzita', 'университет', 'noun'], ['trieda', 'класс', 'noun'], ['kurz', 'курс', 'noun'],
    ['lekcia', 'урок', 'noun'], ['úloha, zadanie', 'задание', 'noun'], ['skúška', 'экзамен', 'noun'],
    ['test', 'тест', 'noun'], ['otázka', 'вопрос', 'noun'], ['odpoveď', 'ответ', 'noun'],
    ['kniha', 'книга', 'noun'], ['učebnica', 'учебник', 'noun'], ['zošit', 'тетрадь', 'noun'],
    ['papier', 'бумага', 'noun'], ['pero', 'ручка', 'noun'], ['ceruzka', 'карандаш', 'noun'],
    ['slovník, slovníček', 'словарь, словарик', 'noun'], ['slovo', 'слово', 'noun'],
    ['veta', 'предложение', 'noun'], ['text', 'текст', 'noun'], ['gramatika', 'грамматика', 'noun'],
    ['výslovnosť', 'произношение', 'noun'], ['význam', 'значение', 'noun'], ['chyba', 'ошибка', 'noun'],
    ['príklad', 'пример', 'noun'], ['predmet', 'предмет', 'noun'], ['matematika', 'математика', 'noun'],
    ['dejepis', 'история', 'noun'], ['geografia', 'география', 'noun'], ['biológia', 'биология', 'noun'],
    ['chémia', 'химия', 'noun'], ['fyzika', 'физика', 'noun'], ['informatika', 'информатика', 'noun'],
    ['prestávka', 'перемена, перерыв', 'noun'], ['známka, hodnotenie', 'оценка', 'noun'],
    ['semester', 'семестр', 'noun'], ['prednáška', 'лекция', 'noun'], ['seminár', 'семинар', 'noun'],
    ['štúdium', 'учеба', 'noun'], ['vzdelanie, vzdelávanie', 'образование', 'noun'],
    ['učenie', 'обучение', 'noun'], ['preklad', 'перевод', 'noun'],
    ['učebňa', 'учебная аудитория', 'noun'], ['aula', 'актовый зал', 'noun'],
    ['študovňa', 'читальный зал', 'noun'], ['škôlka', 'детский сад', 'noun'],
    ['krieda', 'мел', 'noun'], ['fixka', 'маркер', 'noun'], ['pravítko', 'линейка', 'noun'],
    ['guma', 'ластик', 'noun'], ['nožnice', 'ножницы', 'noun'], ['lepidlo', 'клей', 'noun'],
    ['peračník', 'пенал', 'noun'], ['lavica', 'парта', 'noun'], ['kartička', 'карточка', 'noun'],
    ['samoštúdium', 'самостоятельное обучение', 'noun'], ['úspešnosť', 'успешность', 'noun'],
    ['skúšajúci', 'экзаменатор', 'noun'], ['maturita', 'выпускной экзамен', 'noun'],
    ['vysvedčenie', 'табель, свидетельство', 'noun'], ['prospech', 'успеваемость', 'noun'],
    ['dochádzka', 'посещаемость', 'noun'], ['absencia', 'отсутствие', 'noun'],
    ['internát', 'общежитие', 'noun'], ['štipendium', 'стипендия', 'noun'],
    ['školné', 'плата за обучение', 'noun'], ['prihláška', 'заявление на поступление', 'noun'],
    ['zápis', 'запись, регистрация', 'noun'], ['odbor', 'специальность', 'noun'],
    ['fakulta', 'факультет', 'noun'], ['katedra', 'кафедра', 'noun'], ['bakalár', 'бакалавр', 'noun'],
    ['magister', 'магистр', 'noun'], ['doktorand', 'аспирант', 'noun'],
    ['certifikát, osvedčenie', 'сертификат, свидетельство', 'noun'], ['diplom', 'диплом', 'noun'],
    ['učivo', 'учебный материал', 'noun'], ['poznámka', 'заметка', 'noun'], ['diktát', 'диктант', 'noun'],
    ['počúvanie', 'аудирование', 'noun'], ['čítanie', 'чтение', 'noun'], ['písanie', 'письмо', 'noun'],
    ['hovorenie', 'говорение', 'noun'], ['porozumenie', 'понимание', 'noun'],
    ['konverzácia', 'разговорная практика', 'noun'], ['debata', 'дебаты, беседа', 'noun'],
    ['argument', 'аргумент', 'noun'], ['vyjadrenie', 'выражение, заявление', 'noun'],
    ['námietka', 'возражение', 'noun'],
    ['preložiť', 'перевести', 'verb'], ['opakovať', 'повторять', 'verb'], ['zopakovať', 'повторить', 'verb'],
    ['naučiť sa', 'выучить', 'verb'], ['naučiť', 'научить', 'verb'], ['vzdelávať', 'обучать', 'verb'],
    ['maturovať', 'сдавать выпускной экзамен', 'verb'], ['promovať', 'выпускаться из университета', 'verb'],
    ['zapisovať', 'записывать', 'verb'], ['poznamenať', 'отметить', 'verb'],
    ['podčiarknuť', 'подчеркнуть', 'verb'], ['zakrúžkovať', 'обвести', 'verb'],
    ['vyučovať', 'преподавать', 'verb'], ['skúšať', 'экзаменовать, пробовать', 'verb'],
    ['precvičiť, precvičovať', 'тренировать, потренировать', 'verb'], ['prečítať', 'прочитать', 'verb'],
    ['komunikovať', 'общаться', 'verb'], ['debatovať', 'дискутировать', 'verb'],
    ['reagovať', 'реагировать', 'verb'], ['pochopiť', 'понять', 'verb'],
  ],
  'Здоровье и болезни': [
    ['zdravie', 'здоровье', 'noun'], ['choroba', 'болезнь', 'noun'], ['bolesť', 'боль', 'noun'],
    ['liek', 'лекарство', 'noun'], ['tabletka', 'таблетка', 'noun'], ['recept', 'рецепт', 'noun'],
    ['horúčka', 'жар, температура', 'noun'], ['kašeľ', 'кашель', 'noun'], ['nádcha', 'насморк', 'noun'],
    ['chrípka', 'грипп', 'noun'], ['úraz', 'травма', 'noun'], ['nehoda', 'авария, несчастный случай', 'noun'],
    ['pacient', 'пациент', 'noun'], ['ambulancia', 'амбулатория, кабинет врача', 'noun'],
    ['vyšetrenie', 'обследование', 'noun'], ['liečba', 'лечение', 'noun'], ['obväz', 'бинт', 'noun'],
    ['rana', 'рана', 'noun'], ['zlomenina', 'перелом', 'noun'], ['alergia', 'аллергия', 'noun'],
    ['hlad', 'голод', 'noun'], ['smäd', 'жажда', 'noun'], ['zubár', 'стоматолог', 'noun'],
    ['požiar', 'пожар', 'noun'], ['dym', 'дым', 'noun'], ['evakuácia', 'эвакуация', 'noun'],
    ['opuch', 'отек', 'noun'], ['modrina', 'синяк', 'noun'], ['popálenina', 'ожог', 'noun'],
    ['infekcia', 'инфекция', 'noun'], ['zápal', 'воспаление', 'noun'], ['vírus', 'вирус', 'noun'],
    ['baktéria', 'бактерия', 'noun'], ['príznak', 'симптом', 'noun'], ['diagnóza', 'диагноз', 'noun'],
    ['operácia', 'операция', 'noun'], ['chirurg', 'хирург', 'noun'], ['pohotovosť', 'неотложная помощь', 'noun'],
    ['ordinácia', 'кабинет врача', 'noun'], ['masť', 'мазь', 'noun'], ['sirup', 'сироп', 'noun'],
    ['vitamín', 'витамин', 'noun'],
    ['dýchať', 'дышать', 'verb'], ['kýchať', 'чихать', 'verb'], ['kašľať', 'кашлять', 'verb'],
    ['bolieť', 'болеть', 'verb'], ['liečiť', 'лечить', 'verb'], ['uzdraviť sa', 'выздороветь', 'verb'],
    ['odpočívať', 'отдыхать', 'verb'],
  ],
  'Спорт': [
    ['šport', 'спорт', 'noun'], ['futbal', 'футбол', 'noun'], ['hokej', 'хоккей', 'noun'],
    ['tenis', 'теннис', 'noun'], ['beh', 'бег', 'noun'], ['plávanie', 'плавание', 'noun'],
    ['cvičenie', 'упражнение', 'noun'], ['hra', 'игра', 'noun'], ['lopta', 'мяч', 'noun'],
    ['tím', 'команда', 'noun'], ['zápas', 'матч', 'noun'], ['súťaž', 'соревнование', 'noun'],
    ['víťaz', 'победитель', 'noun'], ['prehra', 'поражение', 'noun'], ['výhra', 'победа, выигрыш', 'noun'],
    ['gól', 'гол', 'noun'], ['štadión', 'стадион', 'noun'], ['lyže', 'лыжи', 'noun'],
    ['lyžovanie', 'катание на лыжах', 'noun'], ['korčule', 'коньки', 'noun'], ['tréning', 'тренировка', 'noun'],
    ['posilňovňa', 'тренажерный зал', 'noun'],
    ['puk', 'шайба', 'noun'], ['bránka', 'ворота', 'noun'], ['kôš', 'корзина, кольцо', 'noun'],
    ['raketa', 'ракетка', 'noun'], ['dres', 'спортивная форма', 'noun'], ['prilba', 'шлем', 'noun'],
    ['rozhodca', 'судья', 'noun'], ['píšťalka', 'свисток', 'noun'],
  ],
  'Хобби и досуг': [
    ['hudba', 'музыка', 'noun'], ['pieseň', 'песня', 'noun'], ['film', 'фильм', 'noun'],
    ['seriál', 'сериал', 'noun'], ['fotografia', 'фотография', 'noun'], ['obrázok', 'картинка', 'noun'],
    ['umenie', 'искусство', 'noun'], ['kultúra', 'культура', 'noun'], ['správa', 'сообщение, новость', 'noun'],
    ['noviny', 'газета', 'noun'], ['časopis', 'журнал', 'noun'], ['televízia', 'телевидение', 'noun'],
    ['rádio', 'радио', 'noun'], ['stránka', 'страница, сайт', 'noun'], ['list', 'письмо', 'noun'],
    ['balík', 'посылка', 'noun'], ['zábava', 'развлечение', 'noun'], ['koníček, záľuba', 'хобби, увлечение', 'noun'],
    ['koncert', 'концерт', 'noun'], ['predstavenie', 'представление', 'noun'], ['tanec', 'танец', 'noun'],
    ['gitara', 'гитара', 'noun'], ['klavír', 'пианино', 'noun'], ['husle', 'скрипка', 'noun'],
    ['šach', 'шахматы', 'noun'], ['piknik', 'пикник', 'noun'], ['dobrodružstvo', 'приключение', 'noun'],
    ['príbeh', 'история, рассказ', 'noun'],
    ['zbierať', 'собирать', 'verb'], ['fotiť', 'фотографировать', 'verb'],
  ],
  'Животные': [
    ['zviera', 'животное', 'noun'], ['pes', 'собака', 'noun'], ['mačka', 'кошка', 'noun'],
    ['vták', 'птица', 'noun'], ['kôň', 'лошадь', 'noun'], ['krava', 'корова', 'noun'],
    ['prasa', 'свинья', 'noun'], ['ovca', 'овца', 'noun'], ['koza', 'коза', 'noun'],
    ['medveď', 'медведь', 'noun'], ['vlk', 'волк', 'noun'], ['líška', 'лиса', 'noun'],
    ['zajac', 'заяц', 'noun'], ['jeleň', 'олень', 'noun'], ['myš', 'мышь', 'noun'],
    ['sliepka', 'курица (птица)', 'noun'], ['kohút', 'петух', 'noun'], ['kačica', 'утка', 'noun'],
    ['hus', 'гусь', 'noun'], ['včela', 'пчела', 'noun'], ['mucha', 'муха', 'noun'],
    ['komár', 'комар', 'noun'], ['motýľ', 'бабочка', 'noun'], ['pavúk', 'паук', 'noun'],
    ['had', 'змея', 'noun'], ['žaba', 'лягушка', 'noun'],
    ['cicavec', 'млекопитающее', 'noun'], ['hmyz', 'насекомое', 'noun'], ['králik', 'кролик', 'noun'],
    ['potkan', 'крыса', 'noun'], ['veverička', 'белка', 'noun'], ['ježko', 'еж', 'noun'],
    ['srna', 'косуля', 'noun'], ['diviak', 'кабан', 'noun'], ['opica', 'обезьяна', 'noun'],
    ['lev', 'лев', 'noun'], ['tiger', 'тигр', 'noun'], ['slon', 'слон', 'noun'], ['žirafa', 'жираф', 'noun'],
    ['jašterica', 'ящерица', 'noun'], ['korytnačka', 'черепаха', 'noun'], ['osa', 'оса', 'noun'],
    ['mravec', 'муравей', 'noun'], ['chrobák', 'жук', 'noun'], ['orol', 'орел', 'noun'],
    ['sova', 'сова', 'noun'], ['holub', 'голубь', 'noun'], ['vrabec', 'воробей', 'noun'],
    ['lastovička', 'ласточка', 'noun'], ['labuť', 'лебедь', 'noun'], ['čajka', 'чайка', 'noun'],
    ['papagáj', 'попугай', 'noun'], ['zoo', 'зоопарк', 'noun'], ['klietka', 'клетка', 'noun'],
    ['akvárium', 'аквариум', 'noun'], ['útulok', 'приют', 'noun'], ['veterinár', 'ветеринар', 'noun'],
    ['krmivo', 'корм', 'noun'], ['vodítko', 'поводок', 'noun'], ['obojok', 'ошейник', 'noun'],
    ['srsť', 'шерсть', 'noun'], ['chvost', 'хвост', 'noun'], ['labka', 'лапа', 'noun'],
    ['krídlo', 'крыло', 'noun'], ['zobák', 'клюв', 'noun'], ['perie', 'перья', 'noun'],
    ['roh', 'рог', 'noun'], ['kopyto', 'копыто', 'noun'], ['pazúr', 'коготь', 'noun'],
    ['hniezdo', 'гнездо', 'noun'], ['mláďa', 'детеныш', 'noun'],
    ['kŕmiť', 'кормить', 'verb'], ['hladkať', 'гладить', 'verb'], ['štekať', 'лаять', 'verb'],
    ['mňaukať', 'мяукать', 'verb'], ['lietať', 'летать', 'verb'], ['skákať', 'прыгать', 'verb'],
    ['liezť', 'ползти, лезть', 'verb'], ['hrýzť', 'кусать', 'verb'], ['štípať', 'жалить, щипать', 'verb'],
    ['loviť', 'охотиться', 'verb'], ['chovať', 'разводить, содержать', 'verb'],
  ],
  'Абстрактные понятия': [
    ['problém', 'проблема', 'noun'], ['riešenie', 'решение', 'noun'], ['dôvod', 'причина', 'noun'],
    ['výsledok', 'результат', 'noun'], ['spôsob', 'способ', 'noun'], ['príležitosť', 'возможность', 'noun'],
    ['schopnosť', 'способность', 'noun'], ['vedomosť, znalosť', 'знание', 'noun'],
    ['pozornosť', 'внимание', 'noun'], ['záujem', 'интерес', 'noun'], ['názor', 'мнение', 'noun'],
    ['myšlienka, nápad', 'мысль, идея', 'noun'], ['pravda', 'правда', 'noun'],
    ['skutočnosť', 'действительность, факт', 'noun'], ['situácia', 'ситуация', 'noun'],
    ['prípad', 'случай', 'noun'], ['vec', 'вещь, дело', 'noun'], ['časť', 'часть', 'noun'],
    ['miesto', 'место', 'noun'], ['oblasť', 'область', 'noun'], ['strana', 'сторона, страница', 'noun'],
    ['bod', 'точка, пункт', 'noun'], ['skupina', 'группа', 'noun'], ['druh, typ', 'вид, тип', 'noun'],
    ['forma', 'форма', 'noun'], ['úroveň', 'уровень', 'noun'], ['kvalita', 'качество', 'noun'],
    ['začiatok', 'начало', 'noun'], ['koniec', 'конец', 'noun'], ['stred', 'середина', 'noun'],
    ['okraj', 'край', 'noun'], ['poriadok', 'порядок', 'noun'], ['neporiadok', 'беспорядок', 'noun'],
    ['služba', 'услуга', 'noun'], ['možnosť', 'возможность', 'noun'], ['potreba', 'потребность', 'noun'],
    ['pomoc', 'помощь', 'noun'], ['zmena', 'изменение', 'noun'], ['výber, voľba', 'выбор', 'noun'],
    ['rozhodnutie', 'решение (выбор)', 'noun'], ['objednávka', 'заказ', 'noun'],
    ['rezervácia', 'бронирование', 'noun'], ['platba', 'платеж', 'noun'], ['predaj', 'продажа', 'noun'],
    ['kúpa', 'покупка', 'noun'], ['ponuka', 'предложение', 'noun'],
    ['spôsobnosť', 'пригодность, способность', 'noun'], ['zodpovednosť', 'ответственность', 'noun'],
    ['výhoda', 'преимущество', 'noun'], ['nevýhoda', 'недостаток', 'noun'],
    ['okolnosť', 'обстоятельство', 'noun'], ['priebeh', 'ход, течение', 'noun'], ['proces', 'процесс', 'noun'],
    ['štruktúra', 'структура', 'noun'], ['funkcia', 'функция', 'noun'], ['výkon', 'производительность', 'noun'],
    ['úsilie, snaha', 'усилие, старание', 'noun'], ['pokrok', 'прогресс', 'noun'], ['vývoj', 'развитие', 'noun'],
    ['rast', 'рост', 'noun'], ['pokles', 'снижение', 'noun'], ['vznik', 'возникновение', 'noun'],
    ['zánik', 'исчезновение', 'noun'], ['dôsledok, následok', 'следствие, последствие', 'noun'],
    ['súvislosť', 'связь', 'noun'], ['vplyv', 'влияние', 'noun'], ['účel', 'назначение', 'noun'],
    ['zmysel', 'смысл', 'noun'], ['hodnota', 'ценность', 'noun'], ['rozdiel', 'разница', 'noun'],
    ['podobnosť', 'сходство', 'noun'], ['vlastnosť', 'свойство, качество', 'noun'],
    ['pôvod', 'происхождение', 'noun'], ['obsah', 'содержание', 'noun'], ['rozsah', 'объем, диапазон', 'noun'],
    ['úžitok, prínos', 'польза, вклад', 'noun'], ['škoda', 'ущерб, жаль', 'noun'], ['strata', 'потеря', 'noun'],
    ['metóda', 'метод', 'noun'], ['hĺbka', 'глубина', 'noun'], ['doba', 'период, время', 'noun'],
    ['povrch', 'поверхность', 'noun'], ['tvar', 'форма', 'noun'], ['rozmer', 'размер', 'noun'],
    ['obal', 'упаковка', 'noun'], ['návod', 'инструкция', 'noun'], ['pokyn', 'указание', 'noun'],
    ['výstraha, varovanie', 'предупреждение', 'noun'], ['príkaz', 'приказ', 'noun'], ['zákaz', 'запрет', 'noun'],
    ['cieľ', 'цель', 'noun'], ['priorita', 'приоритет', 'noun'], ['úspech', 'успех', 'noun'],
    ['neúspech', 'неудача', 'noun'], ['požiadavka', 'требование', 'noun'], ['podmienka', 'условие', 'noun'],
    ['pravidlo', 'правило', 'noun'], ['výnimka', 'исключение', 'noun'], ['obmedzenie', 'ограничение', 'noun'],
    ['povinnosť', 'обязанность', 'noun'], ['právo', 'право', 'noun'], ['súhlas', 'согласие', 'noun'],
    ['nesúhlas', 'несогласие', 'noun'], ['návrh', 'предложение, проект', 'noun'],
    ['oznámenie', 'уведомление', 'noun'], ['rada', 'совет', 'noun'], ['príčina', 'причина', 'noun'],
    ['predstava', 'представление', 'noun'], ['sústredenie', 'сосредоточение', 'noun'],
    ['pamäť', 'память', 'noun'], ['talent', 'талант', 'noun'], ['zvyk', 'привычка', 'noun'],
    ['správanie', 'поведение', 'noun'],
    ['dosiahnuť', 'достичь', 'verb'], ['riešiť', 'решать', 'verb'], ['vyriešiť', 'решить', 'verb'],
    ['tvoriť, vytvoriť', 'создавать, создать', 'verb'], ['zvýšiť', 'увеличить', 'verb'],
    ['znížiť', 'уменьшить', 'verb'], ['zlepšiť', 'улучшить', 'verb'], ['zhoršiť', 'ухудшить', 'verb'],
    ['ovplyvniť', 'повлиять', 'verb'], ['súvisieť', 'быть связанным', 'verb'], ['závisieť', 'зависеть', 'verb'],
    ['obsahovať', 'содержать', 'verb'], ['hodnotiť', 'оценивать', 'verb'], ['skúmať', 'исследовать', 'verb'],
    ['pozorovať', 'наблюдать', 'verb'], ['zistiť', 'выяснить', 'verb'], ['predpokladať', 'предполагать', 'verb'],
    ['očakávať', 'ожидать', 'verb'], ['navrhovať', 'предлагать', 'verb'], ['rozhodnúť', 'решить (принять решение)', 'verb'],
  ],
  'Эмоции и характер': [
    ['pocit', 'чувство', 'noun'], ['nálada', 'настроение', 'noun'], ['emócia', 'эмоция', 'noun'],
    ['charakter, povaha', 'характер', 'noun'], ['osobnosť', 'личность', 'noun'], ['osoba', 'лицо, человек', 'noun'],
    ['radosť', 'радость', 'noun'], ['smútok', 'грусть', 'noun'], ['strach', 'страх', 'noun'],
    ['hnev', 'гнев', 'noun'], ['prekvapenie', 'удивление', 'noun'], ['nádej', 'надежда', 'noun'],
    ['úmysel', 'намерение', 'noun'], ['obava', 'опасение', 'noun'], ['nenávisť', 'ненависть', 'noun'],
    ['sympatia', 'симпатия', 'noun'], ['antipatia', 'антипатия', 'noun'], ['nuda', 'скука', 'noun'],
    ['nadšenie', 'восторг', 'noun'], ['sklamanie', 'разочарование', 'noun'],
    ['vzťah', 'отношение, связь', 'noun'], ['hádka', 'ссора', 'noun'], ['konflikt', 'конфликт', 'noun'],
    ['starostlivosť', 'забота', 'noun'], ['dôvera', 'доверие', 'noun'], ['rešpekt, úcta', 'уважение', 'noun'],
    ['priateľský', 'дружелюбный', 'adjective'], ['nepríjemný', 'неприятный', 'adjective'],
    ['nahnevaný', 'сердитый', 'adjective'], ['nervózny', 'нервный', 'adjective'],
    ['sympatický', 'симпатичный', 'adjective'], ['vtipný', 'смешной, остроумный', 'adjective'],
    ['vážny', 'серьезный', 'adjective'], ['aktívny', 'активный', 'adjective'],
    ['pasívny', 'пассивный', 'adjective'], ['štedrý', 'щедрый', 'adjective'], ['lakomý', 'жадный', 'adjective'],
    ['spoľahlivý', 'надежный', 'adjective'], ['nespoľahlivý', 'ненадежный', 'adjective'],
    ['ochotný', 'готовый помочь', 'adjective'], ['netrpezlivý', 'нетерпеливый', 'adjective'],
    ['nezodpovedný', 'безответственный', 'adjective'], ['osamelý', 'одинокий', 'adjective'],
    ['pochybovať', 'сомневаться', 'verb'], ['ľutovať', 'сожалеть', 'verb'], ['tešiť', 'радовать', 'verb'],
    ['hnevať', 'сердить', 'verb'], ['prekvapiť', 'удивить', 'verb'], ['sklamať', 'разочаровать', 'verb'],
    ['zaujímať', 'интересовать', 'verb'], ['nudiť', 'скучать', 'verb'], ['upokojiť', 'успокоить', 'verb'],
    ['dôverovať', 'доверять', 'verb'], ['báť sa', 'бояться', 'verb'], ['smiať sa', 'смеяться', 'verb'],
    ['plakať', 'плакать', 'verb'], ['milovať, ľúbiť', 'любить', 'verb'], ['páčiť sa', 'нравиться', 'verb'],
  ],
  'Меры и величины': [
    ['meter', 'метр', 'noun'], ['kilometer', 'километр', 'noun'], ['kilogram', 'килограмм', 'noun'],
    ['liter', 'литр', 'noun'], ['gram', 'грамм', 'noun'], ['percento', 'процент', 'noun'],
    ['dĺžka', 'длина', 'noun'], ['šírka', 'ширина', 'noun'], ['hmotnosť', 'масса, вес', 'noun'],
    ['rýchlosť', 'скорость', 'noun'], ['vzdialenosť', 'расстояние', 'noun'],
    ['množstvo', 'количество', 'noun'], ['počet', 'количество, число', 'noun'],
    ['polovica', 'половина', 'noun'], ['pár', 'пара', 'noun'], ['kus', 'кусок, штука', 'noun'],
  ],
  'Страны и национальности': [
    ['Slovensko', 'Словакия', 'noun'], ['slovenský', 'словацкий', 'adjective'],
    ['Bratislava', 'Братислава', 'noun'], ['Košice', 'Кошице', 'noun'],
    ['Európa', 'Европа', 'noun'], ['európsky', 'европейский', 'adjective'],
    ['Rusko', 'Россия', 'noun'], ['Amerika', 'Америка', 'noun'],
    ['Česko', 'Чехия', 'noun'], ['český', 'чешский', 'adjective'],
    ['Nemecko', 'Германия', 'noun'], ['nemecký', 'немецкий', 'adjective'],
    ['Francúzsko', 'Франция', 'noun'], ['francúzsky', 'французский', 'adjective'],
    ['Taliansko', 'Италия', 'noun'], ['taliansky', 'итальянский', 'adjective'],
    ['Španielsko', 'Испания', 'noun'], ['španielsky', 'испанский', 'adjective'],
    ['Poľsko', 'Польша', 'noun'], ['poľský', 'польский', 'adjective'],
    ['Maďarsko', 'Венгрия', 'noun'], ['maďarský', 'венгерский', 'adjective'],
    ['Ukrajina', 'Украина', 'noun'], ['ukrajinský', 'украинский', 'adjective'],
    ['Rakúsko', 'Австрия', 'noun'], ['rakúsky', 'австрийский', 'adjective'],
    ['Chorvátsko', 'Хорватия', 'noun'], ['chorvátsky', 'хорватский', 'adjective'],
    ['Grécko', 'Греция', 'noun'], ['grécky', 'греческий', 'adjective'],
    ['cudzinec, cudzinka', 'иностранец, иностранка', 'noun'], ['cudzí', 'чужой, иностранный', 'noun'],
    ['obyvateľ', 'житель', 'noun'], ['obyvateľstvo', 'население', 'noun'],
    ['turista', 'турист', 'noun'],
  ],
  'Государство и политика': [
    ['štát', 'государство', 'noun'], ['republika', 'республика', 'noun'],
    ['región, kraj', 'регион, край', 'noun'], ['občan', 'гражданин', 'noun'],
    ['občianstvo', 'гражданство', 'noun'], ['národ', 'народ, нация', 'noun'],
    ['národnosť', 'национальность', 'noun'], ['vlajka', 'флаг', 'noun'], ['mena', 'валюта', 'noun'],
    ['vláda', 'правительство', 'noun'], ['prezident', 'президент', 'noun'], ['minister', 'министр', 'noun'],
    ['starosta', 'мэр, староста', 'noun'], ['zákon', 'закон', 'noun'], ['voľby', 'выборы', 'noun'],
    ['hlas', 'голос', 'noun'], ['politika', 'политика', 'noun'], ['politický', 'политический', 'adjective'],
    ['spoločenský', 'общественный, социальный', 'adjective'], ['národný', 'национальный', 'adjective'],
    ['štátny', 'государственный', 'adjective'], ['regionálny', 'региональный', 'adjective'],
    ['mestský', 'городской', 'adjective'], ['vidiecky', 'сельский', 'adjective'],
    ['vidiek', 'сельская местность', 'noun'], ['susedný', 'соседний', 'adjective'],
    ['rodný', 'родной', 'adjective'],
    ['hlasovať, voliť', 'голосовать', 'verb'], ['kandidovať', 'баллотироваться', 'verb'],
    ['vládnuť', 'править', 'verb'], ['zastupovať', 'представлять', 'verb'],
  ],
  'IT и техника': [
    ['heslo', 'пароль', 'noun'], ['používateľ', 'пользователь', 'noun'], ['súbor', 'файл', 'noun'],
    ['priečinok', 'папка', 'noun'], ['obrazovka', 'экран', 'noun'], ['klávesnica', 'клавиатура', 'noun'],
    ['tlačiareň', 'принтер', 'noun'], ['tlačidlo', 'кнопка', 'noun'], ['aplikácia', 'приложение', 'noun'],
    ['program', 'программа', 'noun'], ['sieť', 'сеть', 'noun'], ['pripojenie', 'подключение', 'noun'],
    ['signál', 'сигнал', 'noun'], ['batéria', 'батарея', 'noun'], ['kamera', 'камера', 'noun'],
    ['video', 'видео', 'noun'], ['kontakt', 'контакт', 'noun'], ['web', 'веб', 'noun'],
    ['odkaz', 'ссылка', 'noun'], ['profil', 'профиль', 'noun'], ['registrácia', 'регистрация', 'noun'],
    ['prihlásenie', 'вход, авторизация', 'noun'], ['nastavenie', 'настройка', 'noun'],
    ['verzia', 'версия', 'noun'], ['prístup', 'доступ', 'noun'], ['príloha', 'вложение', 'noun'],
    ['prehliadač', 'браузер', 'noun'], ['chat', 'чат', 'noun'], ['komentár', 'комментарий', 'noun'],
    ['kompatibilita', 'совместимость', 'noun'], ['kapacita', 'емкость', 'noun'],
    ['spoľahlivosť', 'надежность', 'noun'], ['presnosť', 'точность', 'noun'],
    ['hlásenie, upozornenie', 'уведомление, предупреждение', 'noun'], ['pokrytie', 'покрытие', 'noun'],
    ['operátor', 'оператор', 'noun'], ['podpora', 'поддержка', 'noun'],
    ['zdieľať', 'делиться', 'verb'], ['odoslať', 'отправить', 'verb'], ['preposlať', 'переслать', 'verb'],
    ['vyhľadať, vyhľadávať', 'искать, найти', 'verb'], ['uložiť', 'сохранить', 'verb'],
    ['vymazať, odstrániť', 'удалить', 'verb'], ['stiahnuť', 'скачать', 'verb'], ['nahrať', 'загрузить', 'verb'],
    ['vytlačiť', 'распечатать', 'verb'], ['kopírovať', 'копировать', 'verb'], ['vložiť', 'вставить', 'verb'],
    ['pripojiť', 'подключить, прикрепить', 'verb'], ['odpojiť', 'отключить', 'verb'],
    ['reštartovať', 'перезапустить', 'verb'], ['aktualizovať', 'обновить', 'verb'],
    ['blokovať', 'блокировать', 'verb'], ['zverejniť', 'опубликовать', 'verb'],
    ['komentovať', 'комментировать', 'verb'], ['sledovať', 'следить, смотреть', 'verb'],
    ['kliknúť', 'кликнуть', 'verb'], ['zobraziť', 'показать', 'verb'], ['skryť', 'скрыть', 'verb'],
    ['inštalovať, nainštalovať', 'устанавливать, установить', 'verb'],
    ['nastaviť, nastavovať', 'настроить, настраивать', 'verb'],
    ['obnoviť', 'восстановить, обновить', 'verb'], ['skontrolovať', 'проверить', 'verb'],
    ['spustiť', 'запустить', 'verb'], ['zastaviť', 'остановить', 'verb'],
    ['povoliť', 'разрешить', 'verb'], ['zakázať', 'запретить', 'verb'],
  ],
  'Финансы и деньги': [
    ['cena', 'цена', 'noun'], ['peniaze', 'деньги', 'noun'], ['euro', 'евро', 'noun'],
    ['účet', 'счет', 'noun'], ['pokladňa', 'касса', 'noun'], ['zľava', 'скидка', 'noun'],
    ['tovar', 'товар', 'noun'], ['nákup', 'покупка', 'noun'],
    ['daň', 'налог', 'noun'], ['poplatok', 'сбор, плата', 'noun'], ['úrok', 'процент (по кредиту)', 'noun'],
    ['dlh', 'долг', 'noun'], ['príjem', 'доход', 'noun'], ['výdavok', 'расход', 'noun'],
    ['majetok, vlastníctvo', 'имущество, собственность', 'noun'], ['nehnuteľnosť', 'недвижимость', 'noun'],
    ['pozemok', 'земельный участок', 'noun'], ['kaucia, depozit', 'залог, депозит', 'noun'],
    ['sporenie', 'накопление', 'noun'], ['investícia', 'инвестиция', 'noun'], ['hypotéka', 'ипотека', 'noun'],
    ['úver', 'кредит', 'noun'], ['splátka', 'взнос', 'noun'], ['poistné', 'страховой взнос', 'noun'],
    ['poistenie', 'страхование', 'noun'], ['poisťovňa', 'страховая компания', 'noun'],
    ['náhrada, odškodnenie', 'компенсация, возмещение', 'noun'],
    ['bankomat', 'банкомат', 'noun'], ['karta', 'карта', 'noun'], ['hotovosť', 'наличные', 'noun'],
    ['minca', 'монета', 'noun'], ['bankovka', 'банкнота', 'noun'], ['výmena', 'обмен', 'noun'],
    ['pôžička', 'заем', 'noun'], ['úspora', 'сбережение', 'noun'],
    ['zisk', 'прибыль', 'noun'], ['strata', 'потеря, убыток', 'noun'], ['náklad', 'расход, груз', 'noun'],
    ['výnos', 'доход', 'noun'], ['obrat', 'оборот', 'noun'], ['tržba', 'выручка', 'noun'],
    ['rozpočet', 'бюджет', 'noun'],
    ['minúť', 'потратить', 'verb'], ['šetriť', 'экономить, беречь', 'verb'], ['ušetriť', 'сэкономить', 'verb'],
    ['vlastniť', 'владеть', 'verb'], ['zarobiť', 'заработать', 'verb'],
    ['platiť, zaplatiť', 'платить, заплатить', 'verb'], ['kúpiť', 'купить', 'verb'], ['predať', 'продать', 'verb'],
    ['uhradiť', 'оплатить', 'verb'], ['požičať', 'одолжить', 'verb'], ['požičať si', 'взять взаймы', 'verb'],
    ['splatiť', 'погасить', 'verb'], ['poistiť', 'застраховать', 'verb'],
  ],
  'Глаголы: работа и организация': [
    ['absolvovať', 'проходить, завершать', 'verb'], ['akceptovať', 'принимать, соглашаться', 'verb'],
    ['analyzovať', 'анализировать', 'verb'], ['aplikovať', 'применять', 'verb'],
    ['chrániť', 'защищать', 'verb'], ['definovať', 'определять', 'verb'], ['diskutovať', 'обсуждать', 'verb'],
    ['doplniť', 'дополнить', 'verb'], ['dovoliť', 'разрешить', 'verb'], ['garantovať', 'гарантировать', 'verb'],
    ['investovať', 'инвестировать', 'verb'], ['kontaktovať', 'связываться', 'verb'],
    ['kritizovať', 'критиковать', 'verb'], ['monitorovať', 'отслеживать', 'verb'],
    ['nahradiť', 'заменить', 'verb'], ['naplánovať', 'запланировать', 'verb'],
    ['odovzdať', 'передать, сдать', 'verb'], ['odhadnúť, odhadovať', 'оценить приблизительно', 'verb'],
    ['organizovať', 'организовывать', 'verb'], ['overiť, overovať', 'проверить, заверить', 'verb'],
    ['podporiť', 'поддержать', 'verb'], ['posúdiť', 'оценить', 'verb'],
    ['prenajať, prenajímať', 'сдать или взять в аренду', 'verb'], ['prevziať', 'получить, перенять', 'verb'],
    ['prihlásiť', 'зарегистрировать', 'verb'], ['prispôsobiť', 'адаптировать', 'verb'],
    ['prerušiť', 'прервать', 'verb'], ['rozdeliť', 'разделить', 'verb'], ['rozšíriť', 'расширить', 'verb'],
    ['spracovať', 'обработать', 'verb'], ['upraviť', 'изменить, отредактировать', 'verb'],
    ['vyhodnotiť', 'оценить результаты', 'verb'], ['zabezpečiť', 'обеспечить', 'verb'],
    ['zaregistrovať', 'зарегистрировать', 'verb'], ['archivovať', 'архивировать', 'verb'],
    ['vážiť', 'взвешивать', 'verb'], ['merať', 'измерять', 'verb'], ['počítať', 'считать', 'verb'],
    ['klesať', 'снижаться', 'verb'], ['vzniknúť', 'возникнуть', 'verb'], ['zaniknúť', 'исчезнуть', 'verb'],
    ['zahŕňať', 'включать', 'verb'], ['predstavovať', 'представлять собой', 'verb'],
    ['odlišovať, líšiť', 'отличать, различать', 'verb'], ['dokázať, preukázať', 'суметь, доказать', 'verb'],
    ['zisťovať', 'выяснять', 'verb'], ['presvedčiť, presviedčať', 'убедить, убеждать', 'verb'],
    ['nesúhlasiť', 'не соглашаться', 'verb'], ['namietať', 'возражать', 'verb'],
    ['pamätať, pamätať si', 'помнить', 'verb'], ['zabudnúť', 'забыть', 'verb'], ['spomenúť', 'вспомнить', 'verb'],
    ['uvedomiť si', 'осознать', 'verb'],
    ['podpisovať', 'подписывать', 'verb'], ['schvaľovať', 'одобрять', 'verb'],
    ['registrovať', 'регистрировать', 'verb'], ['zverejňovať', 'публиковать', 'verb'],
    ['spolupracovať', 'сотрудничать', 'verb'], ['zamestnať, zamestnávať', 'нанять, нанимать', 'verb'],
    ['podnikať', 'заниматься бизнесом', 'verb'], ['riadiť, viesť', 'руководить, вести', 'verb'],
    ['dohliadať', 'контролировать', 'verb'], ['plniť, splniť', 'выполнять, выполнить', 'verb'],
    ['vyjednávať, dohodnúť', 'договориться (переговоры)', 'verb'], ['uzavrieť', 'заключить', 'verb'],
    ['fakturovať', 'выставлять счет', 'verb'], ['dodávať', 'поставлять', 'verb'],
    ['financovať', 'финансировать', 'verb'], ['nahlásiť, ohlásiť', 'сообщить, объявить', 'verb'],
    ['udržiavať', 'поддерживать', 'verb'], ['zapájať', 'подключать', 'verb'],
    ['nabíjať', 'заряжать', 'verb'], ['vybíjať', 'разряжать', 'verb'],
  ],
}

/**
 * Синхронизация preset-наборов: запускается при каждом входе и добавляет
 * только то, чего еще нет (новые наборы из PRESETS, новые слова в них) —
 * не создает дублей и не трогает прогресс уже существующих слов. Поэтому
 * обновление списка PRESETS в коде подхватывается автоматически, без
 * сброса локальных данных пользователя.
 */
export function syncPresetData(userId: string): void {
  // Работаем с массивами в памяти и сохраняем результат один раз в конце —
  // на ~2000 preset-словах поштучные insertWord/attachWordToSet означали бы
  // тысячи полных перезаписей localStorage и заметное подвисание вкладки.
  const words = getWords()
  const sets = getWordSets()
  const items = getWordSetItems()

  const setByName = new Map(sets.filter((s) => s.userId === userId && s.isPreset).map((s) => [s.name, s]))

  // Одно и то же слово может встречаться в нескольких тематических наборах
  // (например "хлеб" в "Еда" и "Гарниры") — переиспользуем уже созданное
  // слово вместо дублирования записи в словаре.
  const wordIndex = new Map<string, string>()
  for (const w of words) {
    if (w.userId !== userId) continue
    wordIndex.set(`${w.slovakWord.toLowerCase()}|${w.russianTranslation.toLowerCase()}`, w.id)
  }
  const attachedKeys = new Set(items.map((i) => `${i.wordId}|${i.wordSetId}`))

  const newWords: Word[] = []
  const newSets: WordSet[] = []
  const newItems: WordSetItem[] = []

  for (const [setName, presetWords] of Object.entries(PRESETS)) {
    let set = setByName.get(setName)
    if (!set) {
      const now = nowIso()
      set = {
        id: uuid(),
        userId,
        name: setName,
        description: null,
        isPreset: true,
        category: SET_CATEGORIES[setName] ?? null,
        createdAt: now,
        updatedAt: now,
      }
      setByName.set(setName, set)
      newSets.push(set)
    }
    for (const [sk, ru, pos] of presetWords) {
      const cacheKey = `${sk.toLowerCase()}|${ru.toLowerCase()}`
      let wordId = wordIndex.get(cacheKey)
      if (!wordId) {
        const now = nowIso()
        const word: Word = {
          id: uuid(),
          userId,
          slovakWord: sk,
          russianTranslation: ru,
          partOfSpeech: pos ?? 'noun',
          gender: null,
          note: null,
          status: 'not_learned',
          solvedInGames: [],
          createdAt: now,
          updatedAt: now,
        }
        wordId = word.id
        wordIndex.set(cacheKey, wordId)
        newWords.push(word)
      }
      const attachKey = `${wordId}|${set.id}`
      if (!attachedKeys.has(attachKey)) {
        attachedKeys.add(attachKey)
        newItems.push({ id: uuid(), wordId, wordSetId: set.id })
      }
    }
  }

  if (newWords.length > 0) replaceWords([...words, ...newWords])
  if (newSets.length > 0) replaceWordSets([...sets, ...newSets])
  if (newItems.length > 0) replaceWordSetItems([...items, ...newItems])
}

/**
 * Точечные исправления и переструктурирование preset-данных, которые нельзя
 * сделать простым добавлением (переименование уже сохраненных слов, удаление
 * дублирующего набора, слияние наборов). Идемпотентна — безопасно вызывать
 * при каждом входе, повторный запуск ничего не делает. Должна выполняться
 * ДО syncPresetData, чтобы синхронизация не создала новые записи поверх
 * еще не исправленных старых.
 */
export function applyDataFixes(userId: string): void {
  // Как и syncPresetData — все делаем над массивами в памяти и сохраняем
  // одним вызовом на таблицу, а не по одному изменению за раз.
  let words = getWords()
  let sets = getWordSets()
  let items = getWordSetItems()
  let wordsChanged = false
  let setsChanged = false
  let itemsChanged = false

  const renames: Array<[oldSk: string, ru: string, newSk: string]> = [
    ['kurča', 'курица', 'kuracie mäso'],
    ['slanina', 'бэкон', 'bekon'],
    // Ранее "sója" по ошибке переименовали в "sójová omáčka" (соевый соус),
    // хотя перевод остался "соя" — возвращаем словацкое слово обратно,
    // это именно продукт соя, а не соус.
    ['sójová omáčka', 'соя', 'sója'],
    ['vyprážať', 'жарить', 'smažiť'],
  ]
  for (const [oldSk, ru, newSk] of renames) {
    const idx = words.findIndex(
      (w) =>
        w.userId === userId &&
        w.slovakWord.toLowerCase() === oldSk.toLowerCase() &&
        w.russianTranslation.toLowerCase() === ru.toLowerCase(),
    )
    if (idx !== -1) {
      words = words.with(idx, { ...words[idx], slovakWord: newSk, updatedAt: nowIso() })
      wordsChanged = true
    }
  }

  // Уточнения русского перевода (словацкое слово то же, меняется только RU-текст).
  const translationFixes: Array<[sk: string, oldRu: string, newRu: string]> = [
    ['neskôr', 'потом', 'позже'],
    ['tu', 'здесь', 'здесь, тут'],
    ['čierne korenie', 'перец (специя)', 'черный перец'],
    ['bekon', 'бэкон', 'бекон'],
    ['trh', 'продуктовый рынок', 'рынок'],
    ['obchodné centrum', 'ТЦ', 'торговый центр'],
    ['hrad', 'замок (крепость)', 'замок, крепость'],
  ]
  for (const [sk, oldRu, newRu] of translationFixes) {
    const idx = words.findIndex(
      (w) =>
        w.userId === userId &&
        w.slovakWord.toLowerCase() === sk.toLowerCase() &&
        w.russianTranslation.toLowerCase() === oldRu.toLowerCase(),
    )
    if (idx !== -1) {
      words = words.with(idx, { ...words[idx], russianTranslation: newRu, updatedAt: nowIso() })
      wordsChanged = true
    }
  }

  // "trh" правка перевода выше ("продуктовый рынок" → "рынок") могла
  // совпасть с уже существовавшим отдельным словом "trh"/"рынок" (было в
  // "Здания и места") — сливаем дубликаты в одно слово, перенося привязки.
  {
    const trhWords = words.filter(
      (w) => w.userId === userId && w.slovakWord.toLowerCase() === 'trh' && w.russianTranslation.toLowerCase() === 'рынок',
    )
    if (trhWords.length > 1) {
      const [keep, ...duplicates] = trhWords
      const dupIds = new Set(duplicates.map((w) => w.id))
      const attachedToKeep = new Set(items.filter((i) => i.wordId === keep.id).map((i) => i.wordSetId))
      const toReattach = items
        .filter((i) => dupIds.has(i.wordId) && !attachedToKeep.has(i.wordSetId))
        .map((i) => ({ id: uuid(), wordId: keep.id, wordSetId: i.wordSetId }))
      items = [...items.filter((i) => !dupIds.has(i.wordId)), ...toReattach]
      words = words.filter((w) => !dupIds.has(w.id))
      wordsChanged = true
      itemsChanged = true
    }
  }

  // Ё убрана из переводов везде (проще вводить ответ без редкой буквы на клавиатуре).
  {
    let anyEChanged = false
    words = words.map((w) => {
      if (w.userId !== userId) return w
      if (!/[ёЁ]/.test(w.russianTranslation) && !(w.note && /[ёЁ]/.test(w.note))) return w
      anyEChanged = true
      return {
        ...w,
        russianTranslation: w.russianTranslation.replace(/ё/g, 'е').replace(/Ё/g, 'Е'),
        note: w.note ? w.note.replace(/ё/g, 'е').replace(/Ё/g, 'Е') : w.note,
        updatedAt: nowIso(),
      }
    })
    if (anyEChanged) wordsChanged = true
  }

  const userSets = sets.filter((s) => s.userId === userId)

  // Категории для группировки добавлены позже — проставляем их уже
  // существующим preset-наборам (пользовательские наборы не трогаем: у них
  // category остаётся null, категория — это только для группировки, не жёсткое требование).
  {
    let anyCategoryChanged = false
    sets = sets.map((s) => {
      if (s.userId !== userId || !s.isPreset) return s
      const expected = SET_CATEGORIES[s.name] ?? null
      if (s.category === expected) return s
      anyCategoryChanged = true
      return { ...s, category: expected, updatedAt: nowIso() }
    })
    if (anyCategoryChanged) setsChanged = true
  }

  // "Дом" полностью дублировал "Дом снаружи"/"Дом внутри" — удаляем набор,
  // сами слова остаются (используются в других наборах).
  const domSet = userSets.find((s) => s.name === 'Дом' && s.isPreset)
  if (domSet) {
    sets = sets.filter((s) => s.id !== domSet.id)
    items = items.filter((i) => i.wordSetId !== domSet.id)
    setsChanged = true
    itemsChanged = true
  }

  // "Морепродукты" сливаем в "Мясо" → переименовываем в "Мясо и рыба".
  const meatSet = userSets.find((s) => (s.name === 'Мясо' || s.name === 'Мясо и рыба') && s.isPreset)
  const seafoodSet = userSets.find((s) => s.name === 'Морепродукты' && s.isPreset)
  if (meatSet) {
    if (seafoodSet) {
      const attachedToMeat = new Set(items.filter((i) => i.wordSetId === meatSet.id).map((i) => i.wordId))
      const toReattach = items
        .filter((i) => i.wordSetId === seafoodSet.id && !attachedToMeat.has(i.wordId))
        .map((i) => ({ id: uuid(), wordId: i.wordId, wordSetId: meatSet.id }))
      items = [...items.filter((i) => i.wordSetId !== seafoodSet.id), ...toReattach]
      sets = sets.filter((s) => s.id !== seafoodSet.id)
      itemsChanged = true
      setsChanged = true
    }
    if (meatSet.name !== 'Мясо и рыба') {
      sets = sets.map((s) => (s.id === meatSet.id ? { ...s, name: 'Мясо и рыба', updatedAt: nowIso() } : s))
      setsChanged = true
    }
  }

  // "Зал" в "Дом снаружи" по смыслу дублировал "Гостиную" — отвязываем от
  // набора (слово остается в словаре, если используется где-то еще).
  const outsideSet = userSets.find((s) => s.name === 'Дом снаружи' && s.isPreset)
  if (outsideSet) {
    const salaWord = words.find(
      (w) => w.userId === userId && w.slovakWord.toLowerCase() === 'sála' && w.russianTranslation.toLowerCase() === 'зал',
    )
    if (salaWord) {
      const before = items.length
      items = items.filter((i) => !(i.wordId === salaWord.id && i.wordSetId === outsideSet.id))
      if (items.length !== before) itemsChanged = true
    }
  }

  // "Еда" был общим списком-дублем: почти все его слова уже входят в более
  // тематические наборы (Гарниры, Напитки, Овощи и т.д.) — переносим
  // оставшиеся слова без дублей в подходящие наборы и удаляем сам набор.
  // "бутылка" — не еда, просто отвязываем от всех наборов (слово остаётся
  // в словаре, но нигде не тренируется).
  const foodSet = sets.find((s) => s.userId === userId && s.name === 'Еда' && s.isPreset)
  if (foodSet) {
    const moves: Array<[sk: string, ru: string, targetSetName: string]> = [
      ['mäso', 'мясо', 'Мясо и рыба'],
      ['zemiak', 'картофель', 'Овощи'],
      ['cukor', 'сахар', 'Специи и приправы'],
      ['zelenina', 'овощи', 'Овощи'],
      ['ovocie', 'фрукты', 'Фрукты'],
      ['rožok', 'булочка', 'Выпечка'],
      ['šalát', 'салат', 'Блюда и кухня'],
      ['koláč', 'пирог, пирожное', 'Десерты'],
    ]
    for (const [sk, ru, targetSetName] of moves) {
      const word = words.find(
        (w) =>
          w.userId === userId &&
          w.slovakWord.toLowerCase() === sk.toLowerCase() &&
          w.russianTranslation.toLowerCase() === ru.toLowerCase(),
      )
      const targetSet = sets.find((s) => s.userId === userId && s.name === targetSetName && s.isPreset)
      if (word && targetSet && !items.some((i) => i.wordId === word.id && i.wordSetId === targetSet.id)) {
        items = [...items, { id: uuid(), wordId: word.id, wordSetId: targetSet.id }]
        itemsChanged = true
      }
    }
    items = items.filter((i) => i.wordSetId !== foodSet.id)
    sets = sets.filter((s) => s.id !== foodSet.id)
    itemsChanged = true
    setsChanged = true
  }

  // "Блюда и кухня" разделяем: "Блюда" — только готовые блюда, кулинарные
  // прилагательные/глаголы уходят в расширенную "Готовку", а остальные
  // слова — в темы, которым они ближе по смыслу.
  const dishesSet = sets.find(
    (s) => s.userId === userId && (s.name === 'Блюда и кухня' || s.name === 'Блюда') && s.isPreset,
  )
  if (dishesSet) {
    if (dishesSet.name !== 'Готовые блюда') {
      sets = sets.map((s) => (s.id === dishesSet.id ? { ...s, name: 'Готовые блюда', updatedAt: nowIso() } : s))
      setsChanged = true
    }
    const relocations: Array<[sk: string, ru: string, targetSetName: string]> = [
      ['mrazený', 'замороженный', 'Готовка'],
      ['varený', 'вареный', 'Готовка'],
      ['pečený', 'печеный', 'Готовка'],
      ['vyprážaný', 'жареный', 'Готовка'],
      ['surový', 'сырой', 'Готовка'],
      ['krájať', 'резать', 'Готовка'],
      ['nakrájať', 'нарезать', 'Готовка'],
      ['miešať', 'мешать', 'Готовка'],
      ['pridať', 'добавить', 'Готовка'],
      ['upiecť', 'испечь', 'Готовка'],
      ['omáčka', 'соус', 'Специи и приправы'],
      ['bryndza', 'брынза', 'Молочные продукты'],
      ['pyré', 'пюре', 'Гарниры и крупы'],
      ['rezance', 'лапша', 'Гарниры и крупы'],
      ['menu', 'меню', 'В ресторане'],
      ['porcia', 'порция', 'В ресторане'],
      ['prepitné', 'чаевые', 'В ресторане'],
      ['dezert', 'десерт', 'Десерты'],
      ['chuť', 'вкус', 'Вкус'],
      ['vôňa', 'запах, аромат', 'Вкус'],
      ['nechutný', 'невкусный', 'Вкус'],
      ['chutiť', 'быть вкусным', 'Вкус'],
    ]
    for (const [sk, ru, targetSetName] of relocations) {
      const word = words.find(
        (w) =>
          w.userId === userId &&
          w.slovakWord.toLowerCase() === sk.toLowerCase() &&
          w.russianTranslation.toLowerCase() === ru.toLowerCase(),
      )
      if (!word) continue
      const targetSet = sets.find((s) => s.userId === userId && s.name === targetSetName && s.isPreset)
      if (targetSet && !items.some((i) => i.wordId === word.id && i.wordSetId === targetSet.id)) {
        items = [...items, { id: uuid(), wordId: word.id, wordSetId: targetSet.id }]
        itemsChanged = true
      }
      const before = items.length
      items = items.filter((i) => !(i.wordId === word.id && i.wordSetId === dishesSet.id))
      if (items.length !== before) itemsChanged = true
    }
  }

  // "hrnček, šálka" объединял в одну запись два разных предмета (кружка и
  // чашка) — разбиваем на два самостоятельных слова, каждое остаётся во
  // всех наборах, где было объединённое (обычно только "Посуда").
  {
    const idx = words.findIndex(
      (w) => w.userId === userId && w.slovakWord === 'hrnček, šálka' && w.russianTranslation === 'кружка, чашка',
    )
    if (idx !== -1) {
      const old = words[idx]
      const now = nowIso()
      const hrncek: Word = { ...old, id: uuid(), slovakWord: 'hrnček', russianTranslation: 'кружка', updatedAt: now }
      const salka: Word = { ...old, id: uuid(), slovakWord: 'šálka', russianTranslation: 'чашка', updatedAt: now }
      words = [...words.slice(0, idx), ...words.slice(idx + 1), hrncek, salka]
      wordsChanged = true
      const oldItems = items.filter((i) => i.wordId === old.id)
      const splitItems = oldItems.flatMap((i) => [
        { id: uuid(), wordId: hrncek.id, wordSetId: i.wordSetId },
        { id: uuid(), wordId: salka.id, wordSetId: i.wordSetId },
      ])
      items = [...items.filter((i) => i.wordId !== old.id), ...splitItems]
      itemsChanged = true
    }
  }

  // "Магазины" → "Виды магазинов" (точнее описывает содержимое набора).
  const shopsSet = sets.find((s) => s.userId === userId && s.name === 'Магазины' && s.isPreset)
  if (shopsSet) {
    sets = sets.map((s) => (s.id === shopsSet.id ? { ...s, name: 'Виды магазинов', updatedAt: nowIso() } : s))
    setsChanged = true
  }

  // У части пользователей "Приемы пищи" продублировался как собственный
  // набор (category = null, попадает в "Свои наборы") — оставляем только
  // preset-набор с категорией "Еда", перенося слова из дубля перед удалением.
  {
    const mealSets = sets.filter((s) => s.userId === userId && s.name === 'Приемы пищи')
    if (mealSets.length > 1) {
      const keeper = mealSets.find((s) => s.isPreset && s.category === 'Еда') ?? mealSets[0]
      const duplicates = mealSets.filter((s) => s.id !== keeper.id)
      const attachedToKeeper = new Set(items.filter((i) => i.wordSetId === keeper.id).map((i) => i.wordId))
      const toReattach = items
        .filter((i) => duplicates.some((d) => d.id === i.wordSetId) && !attachedToKeeper.has(i.wordId))
        .map((i) => ({ id: uuid(), wordId: i.wordId, wordSetId: keeper.id }))
      items = [
        ...items.filter((i) => !duplicates.some((d) => d.id === i.wordSetId)),
        ...toReattach,
      ]
      sets = sets.filter((s) => !duplicates.some((d) => d.id === s.id))
      itemsChanged = true
      setsChanged = true
    }
  }

  // "Дом внутри": убираем ролету/автомат.выключатель/термостат (не отвязываем
  // от других наборов — их там и не было), переносим мобильный телефон в
  // "Утварь".
  {
    const insideSet = sets.find((s) => s.userId === userId && s.name === 'Дом внутри' && s.isPreset)
    const utensilsSet = sets.find((s) => s.userId === userId && s.name === 'Утварь' && s.isPreset)
    if (insideSet) {
      const toDetach: Array<[sk: string, ru: string]> = [
        ['roleta', 'роллета'],
        ['istič', 'автоматический выключатель'],
        ['termostat', 'термостат'],
      ]
      for (const [sk, ru] of toDetach) {
        const word = words.find(
          (w) =>
            w.userId === userId &&
            w.slovakWord.toLowerCase() === sk.toLowerCase() &&
            w.russianTranslation.toLowerCase() === ru.toLowerCase(),
        )
        if (!word) continue
        const before = items.length
        items = items.filter((i) => !(i.wordId === word.id && i.wordSetId === insideSet.id))
        if (items.length !== before) itemsChanged = true
      }

      const mobilWord = words.find(
        (w) => w.userId === userId && w.slovakWord.toLowerCase() === 'mobil' && w.russianTranslation.toLowerCase() === 'мобильный телефон',
      )
      if (mobilWord) {
        const before = items.length
        items = items.filter((i) => !(i.wordId === mobilWord.id && i.wordSetId === insideSet.id))
        if (items.length !== before) itemsChanged = true
        if (utensilsSet && !items.some((i) => i.wordId === mobilWord.id && i.wordSetId === utensilsSet.id)) {
          items = [...items, { id: uuid(), wordId: mobilWord.id, wordSetId: utensilsSet.id }]
          itemsChanged = true
        }
      }
    }
  }

  // "Спорт, хобби и досуг" разделяем: спортивные слова уходят в новый набор
  // "Спорт" (его создаст syncPresetData ниже, слова уже есть в словаре и
  // просто переиспользуются), а сам набор переименовываем в "Хобби и досуг"
  // и переносим в категорию "Люди и общество".
  {
    const mixedSet = sets.find((s) => s.userId === userId && s.name === 'Спорт, хобби и досуг' && s.isPreset)
    if (mixedSet) {
      const sportWords: Array<[sk: string, ru: string]> = [
        ['šport', 'спорт'], ['futbal', 'футбол'], ['hokej', 'хоккей'], ['tenis', 'теннис'],
        ['beh', 'бег'], ['plávanie', 'плавание'], ['cvičenie', 'упражнение'], ['hra', 'игра'],
        ['lopta', 'мяч'], ['tím', 'команда'], ['zápas', 'матч'], ['súťaž', 'соревнование'],
        ['víťaz', 'победитель'], ['prehra', 'поражение'], ['výhra', 'победа, выигрыш'],
        ['gól', 'гол'], ['štadión', 'стадион'], ['lyže', 'лыжи'], ['lyžovanie', 'катание на лыжах'],
        ['korčule', 'коньки'], ['tréning', 'тренировка'], ['posilňovňa', 'тренажерный зал'],
      ]
      for (const [sk, ru] of sportWords) {
        const word = words.find(
          (w) =>
            w.userId === userId &&
            w.slovakWord.toLowerCase() === sk.toLowerCase() &&
            w.russianTranslation.toLowerCase() === ru.toLowerCase(),
        )
        if (!word) continue
        const before = items.length
        items = items.filter((i) => !(i.wordId === word.id && i.wordSetId === mixedSet.id))
        if (items.length !== before) itemsChanged = true
      }
      sets = sets.map((s) =>
        s.id === mixedSet.id ? { ...s, name: 'Хобби и досуг', category: 'Люди и общество', updatedAt: nowIso() } : s,
      )
      setsChanged = true
    }
  }

  if (wordsChanged) replaceWords(words)
  if (setsChanged) replaceWordSets(sets)
  if (itemsChanged) replaceWordSetItems(items)
}
