export type Pronoun = 'ja' | 'ty' | 'on' | 'ona' | 'ono' | 'my' | 'vy' | 'oni'
export type Tense = 'present' | 'past' | 'future'

export const PRONOUNS: Pronoun[] = ['ja', 'ty', 'on', 'ona', 'ono', 'my', 'vy', 'oni']

export const PRONOUN_SK: Record<Pronoun, string> = {
  ja: 'Ja', ty: 'Ty', on: 'On', ona: 'Ona', ono: 'Ono', my: 'My', vy: 'Vy', oni: 'Oni',
}

export const PRONOUN_RU: Record<Pronoun, string> = {
  ja: 'Я', ty: 'Ты', on: 'Он', ona: 'Она', ono: 'Оно', my: 'Мы', vy: 'Вы', oni: 'Они',
}

export const TENSES: Tense[] = ['present', 'past', 'future']

export const TENSE_LABELS: Record<Tense, string> = {
  present: 'Настоящее',
  past: 'Прошедшее',
  future: 'Будущее',
}

interface Conjugation {
  sk: Record<Pronoun, string>
  ru: Record<Pronoun, string>
}

export interface VerbEntry {
  id: string
  infinitiveSk: string
  infinitiveRu: string
  present: Conjugation
  past: Conjugation
  future: Conjugation
}

/**
 * Спряжения глаголов вносятся вручную (не выводятся по правилам) — словацкий
 * язык полон исключений. Род для местоимений "я/ты/мы/вы/они" (не выражен в
 * русском) по умолчанию мужской. Формы прошедшего времени уже включают
 * вспомогательный глагол ("som pil"), будущего — полную перифрастическую
 * форму ("budem piť"), кроме "ísť", у которого будущее синтетическое
 * ("pôjdem").
 */
export const VERBS: VerbEntry[] = [
  {
    id: 'robit',
    infinitiveSk: 'robiť',
    infinitiveRu: 'делать',
    present: {
      sk: { ja: 'robím', ty: 'robíš', on: 'robí', ona: 'robí', ono: 'robí', my: 'robíme', vy: 'robíte', oni: 'robia' },
      ru: { ja: 'делаю', ty: 'делаешь', on: 'делает', ona: 'делает', ono: 'делает', my: 'делаем', vy: 'делаете', oni: 'делают' },
    },
    past: {
      sk: { ja: 'som robil', ty: 'si robil', on: 'robil', ona: 'robila', ono: 'robilo', my: 'sme robili', vy: 'ste robili', oni: 'robili' },
      ru: { ja: 'делал', ty: 'делал', on: 'делал', ona: 'делала', ono: 'делало', my: 'делали', vy: 'делали', oni: 'делали' },
    },
    future: {
      sk: { ja: 'budem robiť', ty: 'budeš robiť', on: 'bude robiť', ona: 'bude robiť', ono: 'bude robiť', my: 'budeme robiť', vy: 'budete robiť', oni: 'budú robiť' },
      ru: { ja: 'буду делать', ty: 'будешь делать', on: 'будет делать', ona: 'будет делать', ono: 'будет делать', my: 'будем делать', vy: 'будете делать', oni: 'будут делать' },
    },
  },
  {
    id: 'ist',
    infinitiveSk: 'ísť',
    infinitiveRu: 'идти',
    present: {
      sk: { ja: 'idem', ty: 'ideš', on: 'ide', ona: 'ide', ono: 'ide', my: 'ideme', vy: 'idete', oni: 'idú' },
      ru: { ja: 'иду', ty: 'идёшь', on: 'идёт', ona: 'идёт', ono: 'идёт', my: 'идём', vy: 'идёте', oni: 'идут' },
    },
    past: {
      sk: { ja: 'som išiel', ty: 'si išiel', on: 'išiel', ona: 'išla', ono: 'išlo', my: 'sme išli', vy: 'ste išli', oni: 'išli' },
      ru: { ja: 'шёл', ty: 'шёл', on: 'шёл', ona: 'шла', ono: 'шло', my: 'шли', vy: 'шли', oni: 'шли' },
    },
    future: {
      sk: { ja: 'pôjdem', ty: 'pôjdeš', on: 'pôjde', ona: 'pôjde', ono: 'pôjde', my: 'pôjdeme', vy: 'pôjdete', oni: 'pôjdu' },
      ru: { ja: 'пойду', ty: 'пойдёшь', on: 'пойдёт', ona: 'пойдёт', ono: 'пойдёт', my: 'пойдём', vy: 'пойдёте', oni: 'пойдут' },
    },
  },
  {
    id: 'chciet',
    infinitiveSk: 'chcieť',
    infinitiveRu: 'хотеть',
    present: {
      sk: { ja: 'chcem', ty: 'chceš', on: 'chce', ona: 'chce', ono: 'chce', my: 'chceme', vy: 'chcete', oni: 'chcú' },
      ru: { ja: 'хочу', ty: 'хочешь', on: 'хочет', ona: 'хочет', ono: 'хочет', my: 'хотим', vy: 'хотите', oni: 'хотят' },
    },
    past: {
      sk: { ja: 'som chcel', ty: 'si chcel', on: 'chcel', ona: 'chcela', ono: 'chcelo', my: 'sme chceli', vy: 'ste chceli', oni: 'chceli' },
      ru: { ja: 'хотел', ty: 'хотел', on: 'хотел', ona: 'хотела', ono: 'хотело', my: 'хотели', vy: 'хотели', oni: 'хотели' },
    },
    future: {
      sk: { ja: 'budem chcieť', ty: 'budeš chcieť', on: 'bude chcieť', ona: 'bude chcieť', ono: 'bude chcieť', my: 'budeme chcieť', vy: 'budete chcieť', oni: 'budú chcieť' },
      ru: { ja: 'буду хотеть', ty: 'будешь хотеть', on: 'будет хотеть', ona: 'будет хотеть', ono: 'будет хотеть', my: 'будем хотеть', vy: 'будете хотеть', oni: 'будут хотеть' },
    },
  },
  {
    id: 'moct',
    infinitiveSk: 'môcť',
    infinitiveRu: 'мочь',
    present: {
      sk: { ja: 'môžem', ty: 'môžeš', on: 'môže', ona: 'môže', ono: 'môže', my: 'môžeme', vy: 'môžete', oni: 'môžu' },
      ru: { ja: 'могу', ty: 'можешь', on: 'может', ona: 'может', ono: 'может', my: 'можем', vy: 'можете', oni: 'могут' },
    },
    past: {
      sk: { ja: 'som mohol', ty: 'si mohol', on: 'mohol', ona: 'mohla', ono: 'mohlo', my: 'sme mohli', vy: 'ste mohli', oni: 'mohli' },
      ru: { ja: 'мог', ty: 'мог', on: 'мог', ona: 'могла', ono: 'могло', my: 'могли', vy: 'могли', oni: 'могли' },
    },
    future: {
      sk: { ja: 'budem môcť', ty: 'budeš môcť', on: 'bude môcť', ona: 'bude môcť', ono: 'bude môcť', my: 'budeme môcť', vy: 'budete môcť', oni: 'budú môcť' },
      ru: { ja: 'буду мочь', ty: 'будешь мочь', on: 'будет мочь', ona: 'будет мочь', ono: 'будет мочь', my: 'будем мочь', vy: 'будете мочь', oni: 'будут мочь' },
    },
  },
  {
    id: 'vidiet',
    infinitiveSk: 'vidieť',
    infinitiveRu: 'видеть',
    present: {
      sk: { ja: 'vidím', ty: 'vidíš', on: 'vidí', ona: 'vidí', ono: 'vidí', my: 'vidíme', vy: 'vidíte', oni: 'vidia' },
      ru: { ja: 'вижу', ty: 'видишь', on: 'видит', ona: 'видит', ono: 'видит', my: 'видим', vy: 'видите', oni: 'видят' },
    },
    past: {
      sk: { ja: 'som videl', ty: 'si videl', on: 'videl', ona: 'videla', ono: 'videlo', my: 'sme videli', vy: 'ste videli', oni: 'videli' },
      ru: { ja: 'видел', ty: 'видел', on: 'видел', ona: 'видела', ono: 'видело', my: 'видели', vy: 'видели', oni: 'видели' },
    },
    future: {
      sk: { ja: 'budem vidieť', ty: 'budeš vidieť', on: 'bude vidieť', ona: 'bude vidieť', ono: 'bude vidieť', my: 'budeme vidieť', vy: 'budete vidieť', oni: 'budú vidieť' },
      ru: { ja: 'буду видеть', ty: 'будешь видеть', on: 'будет видеть', ona: 'будет видеть', ono: 'будет видеть', my: 'будем видеть', vy: 'будете видеть', oni: 'будут видеть' },
    },
  },
  {
    id: 'vediet',
    infinitiveSk: 'vedieť',
    infinitiveRu: 'знать',
    present: {
      sk: { ja: 'viem', ty: 'vieš', on: 'vie', ona: 'vie', ono: 'vie', my: 'vieme', vy: 'viete', oni: 'vedia' },
      ru: { ja: 'знаю', ty: 'знаешь', on: 'знает', ona: 'знает', ono: 'знает', my: 'знаем', vy: 'знаете', oni: 'знают' },
    },
    past: {
      sk: { ja: 'som vedel', ty: 'si vedel', on: 'vedel', ona: 'vedela', ono: 'vedelo', my: 'sme vedeli', vy: 'ste vedeli', oni: 'vedeli' },
      ru: { ja: 'знал', ty: 'знал', on: 'знал', ona: 'знала', ono: 'знало', my: 'знали', vy: 'знали', oni: 'знали' },
    },
    future: {
      sk: { ja: 'budem vedieť', ty: 'budeš vedieť', on: 'bude vedieť', ona: 'bude vedieť', ono: 'bude vedieť', my: 'budeme vedieť', vy: 'budete vedieť', oni: 'budú vedieť' },
      ru: { ja: 'буду знать', ty: 'будешь знать', on: 'будет знать', ona: 'будет знать', ono: 'будет знать', my: 'будем знать', vy: 'будете знать', oni: 'будут знать' },
    },
  },
  {
    id: 'hovorit',
    infinitiveSk: 'hovoriť',
    infinitiveRu: 'говорить',
    present: {
      sk: { ja: 'hovorím', ty: 'hovoríš', on: 'hovorí', ona: 'hovorí', ono: 'hovorí', my: 'hovoríme', vy: 'hovoríte', oni: 'hovoria' },
      ru: { ja: 'говорю', ty: 'говоришь', on: 'говорит', ona: 'говорит', ono: 'говорит', my: 'говорим', vy: 'говорите', oni: 'говорят' },
    },
    past: {
      sk: { ja: 'som hovoril', ty: 'si hovoril', on: 'hovoril', ona: 'hovorila', ono: 'hovorilo', my: 'sme hovorili', vy: 'ste hovorili', oni: 'hovorili' },
      ru: { ja: 'говорил', ty: 'говорил', on: 'говорил', ona: 'говорила', ono: 'говорило', my: 'говорили', vy: 'говорили', oni: 'говорили' },
    },
    future: {
      sk: { ja: 'budem hovoriť', ty: 'budeš hovoriť', on: 'bude hovoriť', ona: 'bude hovoriť', ono: 'bude hovoriť', my: 'budeme hovoriť', vy: 'budete hovoriť', oni: 'budú hovoriť' },
      ru: { ja: 'буду говорить', ty: 'будешь говорить', on: 'будет говорить', ona: 'будет говорить', ono: 'будет говорить', my: 'будем говорить', vy: 'будете говорить', oni: 'будут говорить' },
    },
  },
  {
    id: 'pit',
    infinitiveSk: 'piť',
    infinitiveRu: 'пить',
    present: {
      sk: { ja: 'pijem', ty: 'piješ', on: 'pije', ona: 'pije', ono: 'pije', my: 'pijeme', vy: 'pijete', oni: 'pijú' },
      ru: { ja: 'пью', ty: 'пьёшь', on: 'пьёт', ona: 'пьёт', ono: 'пьёт', my: 'пьём', vy: 'пьёте', oni: 'пьют' },
    },
    past: {
      sk: { ja: 'som pil', ty: 'si pil', on: 'pil', ona: 'pila', ono: 'pilo', my: 'sme pili', vy: 'ste pili', oni: 'pili' },
      ru: { ja: 'пил', ty: 'пил', on: 'пил', ona: 'пила', ono: 'пило', my: 'пили', vy: 'пили', oni: 'пили' },
    },
    future: {
      sk: { ja: 'budem piť', ty: 'budeš piť', on: 'bude piť', ona: 'bude piť', ono: 'bude piť', my: 'budeme piť', vy: 'budete piť', oni: 'budú piť' },
      ru: { ja: 'буду пить', ty: 'будешь пить', on: 'будет пить', ona: 'будет пить', ono: 'будет пить', my: 'будем пить', vy: 'будете пить', oni: 'будут пить' },
    },
  },
  {
    id: 'jest',
    infinitiveSk: 'jesť',
    infinitiveRu: 'есть',
    present: {
      sk: { ja: 'jem', ty: 'ješ', on: 'je', ona: 'je', ono: 'je', my: 'jeme', vy: 'jete', oni: 'jedia' },
      ru: { ja: 'ем', ty: 'ешь', on: 'ест', ona: 'ест', ono: 'ест', my: 'едим', vy: 'едите', oni: 'едят' },
    },
    past: {
      sk: { ja: 'som jedol', ty: 'si jedol', on: 'jedol', ona: 'jedla', ono: 'jedlo', my: 'sme jedli', vy: 'ste jedli', oni: 'jedli' },
      ru: { ja: 'ел', ty: 'ел', on: 'ел', ona: 'ела', ono: 'ело', my: 'ели', vy: 'ели', oni: 'ели' },
    },
    future: {
      sk: { ja: 'budem jesť', ty: 'budeš jesť', on: 'bude jesť', ona: 'bude jesť', ono: 'bude jesť', my: 'budeme jesť', vy: 'budete jesť', oni: 'budú jesť' },
      ru: { ja: 'буду есть', ty: 'будешь есть', on: 'будет есть', ona: 'будет есть', ono: 'будет есть', my: 'будем есть', vy: 'будете есть', oni: 'будут есть' },
    },
  },
  {
    id: 'zit',
    infinitiveSk: 'žiť',
    infinitiveRu: 'жить',
    present: {
      sk: { ja: 'žijem', ty: 'žiješ', on: 'žije', ona: 'žije', ono: 'žije', my: 'žijeme', vy: 'žijete', oni: 'žijú' },
      ru: { ja: 'живу', ty: 'живёшь', on: 'живёт', ona: 'живёт', ono: 'живёт', my: 'живём', vy: 'живёте', oni: 'живут' },
    },
    past: {
      sk: { ja: 'som žil', ty: 'si žil', on: 'žil', ona: 'žila', ono: 'žilo', my: 'sme žili', vy: 'ste žili', oni: 'žili' },
      ru: { ja: 'жил', ty: 'жил', on: 'жил', ona: 'жила', ono: 'жило', my: 'жили', vy: 'жили', oni: 'жили' },
    },
    future: {
      sk: { ja: 'budem žiť', ty: 'budeš žiť', on: 'bude žiť', ona: 'bude žiť', ono: 'bude žiť', my: 'budeme žiť', vy: 'budete žiť', oni: 'budú žiť' },
      ru: { ja: 'буду жить', ty: 'будешь жить', on: 'будет жить', ona: 'будет жить', ono: 'будет жить', my: 'будем жить', vy: 'будете жить', oni: 'будут жить' },
    },
  },
  {
    id: 'pracovat',
    infinitiveSk: 'pracovať',
    infinitiveRu: 'работать',
    present: {
      sk: { ja: 'pracujem', ty: 'pracuješ', on: 'pracuje', ona: 'pracuje', ono: 'pracuje', my: 'pracujeme', vy: 'pracujete', oni: 'pracujú' },
      ru: { ja: 'работаю', ty: 'работаешь', on: 'работает', ona: 'работает', ono: 'работает', my: 'работаем', vy: 'работаете', oni: 'работают' },
    },
    past: {
      sk: { ja: 'som pracoval', ty: 'si pracoval', on: 'pracoval', ona: 'pracovala', ono: 'pracovalo', my: 'sme pracovali', vy: 'ste pracovali', oni: 'pracovali' },
      ru: { ja: 'работал', ty: 'работал', on: 'работал', ona: 'работала', ono: 'работало', my: 'работали', vy: 'работали', oni: 'работали' },
    },
    future: {
      sk: { ja: 'budem pracovať', ty: 'budeš pracovať', on: 'bude pracovať', ona: 'bude pracovať', ono: 'bude pracovať', my: 'budeme pracovať', vy: 'budete pracovať', oni: 'budú pracovať' },
      ru: { ja: 'буду работать', ty: 'будешь работать', on: 'будет работать', ona: 'будет работать', ono: 'будет работать', my: 'будем работать', vy: 'будете работать', oni: 'будут работать' },
    },
  },
  {
    id: 'citat',
    infinitiveSk: 'čítať',
    infinitiveRu: 'читать',
    present: {
      sk: { ja: 'čítam', ty: 'čítaš', on: 'číta', ona: 'číta', ono: 'číta', my: 'čítame', vy: 'čítate', oni: 'čítajú' },
      ru: { ja: 'читаю', ty: 'читаешь', on: 'читает', ona: 'читает', ono: 'читает', my: 'читаем', vy: 'читаете', oni: 'читают' },
    },
    past: {
      sk: { ja: 'som čítal', ty: 'si čítal', on: 'čítal', ona: 'čítala', ono: 'čítalo', my: 'sme čítali', vy: 'ste čítali', oni: 'čítali' },
      ru: { ja: 'читал', ty: 'читал', on: 'читал', ona: 'читала', ono: 'читало', my: 'читали', vy: 'читали', oni: 'читали' },
    },
    future: {
      sk: { ja: 'budem čítať', ty: 'budeš čítať', on: 'bude čítať', ona: 'bude čítať', ono: 'bude čítať', my: 'budeme čítať', vy: 'budete čítať', oni: 'budú čítať' },
      ru: { ja: 'буду читать', ty: 'будешь читать', on: 'будет читать', ona: 'будет читать', ono: 'будет читать', my: 'будем читать', vy: 'будете читать', oni: 'будут читать' },
    },
  },
  {
    id: 'pisat',
    infinitiveSk: 'písať',
    infinitiveRu: 'писать',
    present: {
      sk: { ja: 'píšem', ty: 'píšeš', on: 'píše', ona: 'píše', ono: 'píše', my: 'píšeme', vy: 'píšete', oni: 'píšu' },
      ru: { ja: 'пишу', ty: 'пишешь', on: 'пишет', ona: 'пишет', ono: 'пишет', my: 'пишем', vy: 'пишете', oni: 'пишут' },
    },
    past: {
      sk: { ja: 'som písal', ty: 'si písal', on: 'písal', ona: 'písala', ono: 'písalo', my: 'sme písali', vy: 'ste písali', oni: 'písali' },
      ru: { ja: 'писал', ty: 'писал', on: 'писал', ona: 'писала', ono: 'писало', my: 'писали', vy: 'писали', oni: 'писали' },
    },
    future: {
      sk: { ja: 'budem písať', ty: 'budeš písať', on: 'bude písať', ona: 'bude písať', ono: 'bude písať', my: 'budeme písať', vy: 'budete písať', oni: 'budú písať' },
      ru: { ja: 'буду писать', ty: 'будешь писать', on: 'будет писать', ona: 'будет писать', ono: 'будет писать', my: 'будем писать', vy: 'будете писать', oni: 'будут писать' },
    },
  },
  {
    id: 'spat',
    infinitiveSk: 'spať',
    infinitiveRu: 'спать',
    present: {
      sk: { ja: 'spím', ty: 'spíš', on: 'spí', ona: 'spí', ono: 'spí', my: 'spíme', vy: 'spíte', oni: 'spia' },
      ru: { ja: 'сплю', ty: 'спишь', on: 'спит', ona: 'спит', ono: 'спит', my: 'спим', vy: 'спите', oni: 'спят' },
    },
    past: {
      sk: { ja: 'som spal', ty: 'si spal', on: 'spal', ona: 'spala', ono: 'spalo', my: 'sme spali', vy: 'ste spali', oni: 'spali' },
      ru: { ja: 'спал', ty: 'спал', on: 'спал', ona: 'спала', ono: 'спало', my: 'спали', vy: 'спали', oni: 'спали' },
    },
    future: {
      sk: { ja: 'budem spať', ty: 'budeš spať', on: 'bude spať', ona: 'bude spať', ono: 'bude spať', my: 'budeme spať', vy: 'budete spať', oni: 'budú spať' },
      ru: { ja: 'буду спать', ty: 'будешь спать', on: 'будет спать', ona: 'будет спать', ono: 'будет спать', my: 'будем спать', vy: 'будете спать', oni: 'будут спать' },
    },
  },
  {
    id: 'varit',
    infinitiveSk: 'variť',
    infinitiveRu: 'готовить',
    present: {
      sk: { ja: 'varím', ty: 'varíš', on: 'varí', ona: 'varí', ono: 'varí', my: 'varíme', vy: 'varíte', oni: 'varia' },
      ru: { ja: 'готовлю', ty: 'готовишь', on: 'готовит', ona: 'готовит', ono: 'готовит', my: 'готовим', vy: 'готовите', oni: 'готовят' },
    },
    past: {
      sk: { ja: 'som varil', ty: 'si varil', on: 'varil', ona: 'varila', ono: 'varilo', my: 'sme varili', vy: 'ste varili', oni: 'varili' },
      ru: { ja: 'готовил', ty: 'готовил', on: 'готовил', ona: 'готовила', ono: 'готовило', my: 'готовили', vy: 'готовили', oni: 'готовили' },
    },
    future: {
      sk: { ja: 'budem variť', ty: 'budeš variť', on: 'bude variť', ona: 'bude variť', ono: 'bude variť', my: 'budeme variť', vy: 'budete variť', oni: 'budú variť' },
      ru: { ja: 'буду готовить', ty: 'будешь готовить', on: 'будет готовить', ona: 'будет готовить', ono: 'будет готовить', my: 'будем готовить', vy: 'будете готовить', oni: 'будут готовить' },
    },
  },
  {
    id: 'volat',
    infinitiveSk: 'volať',
    infinitiveRu: 'звонить',
    present: {
      sk: { ja: 'volám', ty: 'voláš', on: 'volá', ona: 'volá', ono: 'volá', my: 'voláme', vy: 'voláte', oni: 'volajú' },
      ru: { ja: 'звоню', ty: 'звонишь', on: 'звонит', ona: 'звонит', ono: 'звонит', my: 'звоним', vy: 'звоните', oni: 'звонят' },
    },
    past: {
      sk: { ja: 'som volal', ty: 'si volal', on: 'volal', ona: 'volala', ono: 'volalo', my: 'sme volali', vy: 'ste volali', oni: 'volali' },
      ru: { ja: 'звонил', ty: 'звонил', on: 'звонил', ona: 'звонила', ono: 'звонило', my: 'звонили', vy: 'звонили', oni: 'звонили' },
    },
    future: {
      sk: { ja: 'budem volať', ty: 'budeš volať', on: 'bude volať', ona: 'bude volať', ono: 'bude volať', my: 'budeme volať', vy: 'budete volať', oni: 'budú volať' },
      ru: { ja: 'буду звонить', ty: 'будешь звонить', on: 'будет звонить', ona: 'будет звонить', ono: 'будет звонить', my: 'будем звонить', vy: 'будете звонить', oni: 'будут звонить' },
    },
  },
  {
    id: 'milovat',
    infinitiveSk: 'milovať',
    infinitiveRu: 'любить',
    present: {
      sk: { ja: 'milujem', ty: 'miluješ', on: 'miluje', ona: 'miluje', ono: 'miluje', my: 'milujeme', vy: 'milujete', oni: 'milujú' },
      ru: { ja: 'люблю', ty: 'любишь', on: 'любит', ona: 'любит', ono: 'любит', my: 'любим', vy: 'любите', oni: 'любят' },
    },
    past: {
      sk: { ja: 'som miloval', ty: 'si miloval', on: 'miloval', ona: 'milovala', ono: 'milovalo', my: 'sme milovali', vy: 'ste milovali', oni: 'milovali' },
      ru: { ja: 'любил', ty: 'любил', on: 'любил', ona: 'любила', ono: 'любило', my: 'любили', vy: 'любили', oni: 'любили' },
    },
    future: {
      sk: { ja: 'budem milovať', ty: 'budeš milovať', on: 'bude milovať', ona: 'bude milovať', ono: 'bude milovať', my: 'budeme milovať', vy: 'budete milovať', oni: 'budú milovať' },
      ru: { ja: 'буду любить', ty: 'будешь любить', on: 'будет любить', ona: 'будет любить', ono: 'будет любить', my: 'будем любить', vy: 'будете любить', oni: 'будут любить' },
    },
  },
  {
    id: 'rozumiet',
    infinitiveSk: 'rozumieť',
    infinitiveRu: 'понимать',
    present: {
      sk: { ja: 'rozumiem', ty: 'rozumieš', on: 'rozumie', ona: 'rozumie', ono: 'rozumie', my: 'rozumieme', vy: 'rozumiete', oni: 'rozumejú' },
      ru: { ja: 'понимаю', ty: 'понимаешь', on: 'понимает', ona: 'понимает', ono: 'понимает', my: 'понимаем', vy: 'понимаете', oni: 'понимают' },
    },
    past: {
      sk: { ja: 'som rozumel', ty: 'si rozumel', on: 'rozumel', ona: 'rozumela', ono: 'rozumelo', my: 'sme rozumeli', vy: 'ste rozumeli', oni: 'rozumeli' },
      ru: { ja: 'понимал', ty: 'понимал', on: 'понимал', ona: 'понимала', ono: 'понимало', my: 'понимали', vy: 'понимали', oni: 'понимали' },
    },
    future: {
      sk: { ja: 'budem rozumieť', ty: 'budeš rozumieť', on: 'bude rozumieť', ona: 'bude rozumieť', ono: 'bude rozumieť', my: 'budeme rozumieť', vy: 'budete rozumieť', oni: 'budú rozumieť' },
      ru: { ja: 'буду понимать', ty: 'будешь понимать', on: 'будет понимать', ona: 'будет понимать', ono: 'будет понимать', my: 'будем понимать', vy: 'будете понимать', oni: 'будут понимать' },
    },
  },
  {
    id: 'mat',
    infinitiveSk: 'mať',
    infinitiveRu: 'иметь',
    present: {
      sk: { ja: 'mám', ty: 'máš', on: 'má', ona: 'má', ono: 'má', my: 'máme', vy: 'máte', oni: 'majú' },
      ru: { ja: 'имею', ty: 'имеешь', on: 'имеет', ona: 'имеет', ono: 'имеет', my: 'имеем', vy: 'имеете', oni: 'имеют' },
    },
    past: {
      sk: { ja: 'som mal', ty: 'si mal', on: 'mal', ona: 'mala', ono: 'malo', my: 'sme mali', vy: 'ste mali', oni: 'mali' },
      ru: { ja: 'имел', ty: 'имел', on: 'имел', ona: 'имела', ono: 'имело', my: 'имели', vy: 'имели', oni: 'имели' },
    },
    future: {
      sk: { ja: 'budem mať', ty: 'budeš mať', on: 'bude mať', ona: 'bude mať', ono: 'bude mať', my: 'budeme mať', vy: 'budete mať', oni: 'budú mať' },
      ru: { ja: 'буду иметь', ty: 'будешь иметь', on: 'будет иметь', ona: 'будет иметь', ono: 'будет иметь', my: 'будем иметь', vy: 'будете иметь', oni: 'будут иметь' },
    },
  },
  {
    id: 'brat',
    infinitiveSk: 'brať',
    infinitiveRu: 'брать',
    present: {
      sk: { ja: 'beriem', ty: 'berieš', on: 'berie', ona: 'berie', ono: 'berie', my: 'berieme', vy: 'beriete', oni: 'berú' },
      ru: { ja: 'беру', ty: 'берёшь', on: 'берёт', ona: 'берёт', ono: 'берёт', my: 'берём', vy: 'берёте', oni: 'берут' },
    },
    past: {
      sk: { ja: 'som bral', ty: 'si bral', on: 'bral', ona: 'brala', ono: 'bralo', my: 'sme brali', vy: 'ste brali', oni: 'brali' },
      ru: { ja: 'брал', ty: 'брал', on: 'брал', ona: 'брала', ono: 'брало', my: 'брали', vy: 'брали', oni: 'брали' },
    },
    future: {
      sk: { ja: 'budem brať', ty: 'budeš brať', on: 'bude brať', ona: 'bude brať', ono: 'bude brať', my: 'budeme brať', vy: 'budete brať', oni: 'budú brať' },
      ru: { ja: 'буду брать', ty: 'будешь брать', on: 'будет брать', ona: 'будет брать', ono: 'будет брать', my: 'будем брать', vy: 'будете брать', oni: 'будут брать' },
    },
  },
  {
    id: 'byt',
    infinitiveSk: 'byť',
    infinitiveRu: 'быть',
    present: {
      sk: { ja: 'som', ty: 'si', on: 'je', ona: 'je', ono: 'je', my: 'sme', vy: 'ste', oni: 'sú' },
      ru: { ja: 'есть', ty: 'есть', on: 'есть', ona: 'есть', ono: 'есть', my: 'есть', vy: 'есть', oni: 'есть' },
    },
    past: {
      sk: { ja: 'som bol', ty: 'si bol', on: 'bol', ona: 'bola', ono: 'bolo', my: 'sme boli', vy: 'ste boli', oni: 'boli' },
      ru: { ja: 'был', ty: 'был', on: 'был', ona: 'была', ono: 'было', my: 'были', vy: 'были', oni: 'были' },
    },
    future: {
      sk: { ja: 'budem', ty: 'budeš', on: 'bude', ona: 'bude', ono: 'bude', my: 'budeme', vy: 'budete', oni: 'budú' },
      ru: { ja: 'буду', ty: 'будешь', on: 'будет', ona: 'будет', ono: 'будет', my: 'будем', vy: 'будете', oni: 'будут' },
    },
  },
  {
    id: 'vracat_sa',
    infinitiveSk: 'vracať sa',
    infinitiveRu: 'возвращаться',
    present: {
      sk: { ja: 'vraciam sa', ty: 'vraciaš sa', on: 'vracia sa', ona: 'vracia sa', ono: 'vracia sa', my: 'vraciame sa', vy: 'vraciate sa', oni: 'vracajú sa' },
      ru: { ja: 'возвращаюсь', ty: 'возвращаешься', on: 'возвращается', ona: 'возвращается', ono: 'возвращается', my: 'возвращаемся', vy: 'возвращаетесь', oni: 'возвращаются' },
    },
    past: {
      sk: { ja: 'som sa vracal', ty: 'si sa vracal', on: 'vracal sa', ona: 'vracala sa', ono: 'vracalo sa', my: 'sme sa vracali', vy: 'ste sa vracali', oni: 'vracali sa' },
      ru: { ja: 'возвращался', ty: 'возвращался', on: 'возвращался', ona: 'возвращалась', ono: 'возвращалось', my: 'возвращались', vy: 'возвращались', oni: 'возвращались' },
    },
    future: {
      sk: { ja: 'budem sa vracať', ty: 'budeš sa vracať', on: 'bude sa vracať', ona: 'bude sa vracať', ono: 'bude sa vracať', my: 'budeme sa vracať', vy: 'budete sa vracať', oni: 'budú sa vracať' },
      ru: { ja: 'буду возвращаться', ty: 'будешь возвращаться', on: 'будет возвращаться', ona: 'будет возвращаться', ono: 'будет возвращаться', my: 'будем возвращаться', vy: 'будете возвращаться', oni: 'будут возвращаться' },
    },
  },
  {
    id: 'prechadzat_sa',
    infinitiveSk: 'prechádzať sa',
    infinitiveRu: 'гулять',
    present: {
      sk: { ja: 'prechádzam sa', ty: 'prechádzaš sa', on: 'prechádza sa', ona: 'prechádza sa', ono: 'prechádza sa', my: 'prechádzame sa', vy: 'prechádzate sa', oni: 'prechádzajú sa' },
      ru: { ja: 'гуляю', ty: 'гуляешь', on: 'гуляет', ona: 'гуляет', ono: 'гуляет', my: 'гуляем', vy: 'гуляете', oni: 'гуляют' },
    },
    past: {
      sk: { ja: 'som sa prechádzal', ty: 'si sa prechádzal', on: 'prechádzal sa', ona: 'prechádzala sa', ono: 'prechádzalo sa', my: 'sme sa prechádzali', vy: 'ste sa prechádzali', oni: 'prechádzali sa' },
      ru: { ja: 'гулял', ty: 'гулял', on: 'гулял', ona: 'гуляла', ono: 'гуляло', my: 'гуляли', vy: 'гуляли', oni: 'гуляли' },
    },
    future: {
      sk: { ja: 'budem sa prechádzať', ty: 'budeš sa prechádzať', on: 'bude sa prechádzať', ona: 'bude sa prechádzať', ono: 'bude sa prechádzať', my: 'budeme sa prechádzať', vy: 'budete sa prechádzať', oni: 'budú sa prechádzať' },
      ru: { ja: 'буду гулять', ty: 'будешь гулять', on: 'будет гулять', ona: 'будет гулять', ono: 'будет гулять', my: 'будем гулять', vy: 'будете гулять', oni: 'будут гулять' },
    },
  },
  {
    id: 'davat',
    infinitiveSk: 'dávať',
    infinitiveRu: 'давать',
    present: {
      sk: { ja: 'dávam', ty: 'dávaš', on: 'dáva', ona: 'dáva', ono: 'dáva', my: 'dávame', vy: 'dávate', oni: 'dávajú' },
      ru: { ja: 'даю', ty: 'даёшь', on: 'даёт', ona: 'даёт', ono: 'даёт', my: 'даём', vy: 'даёте', oni: 'дают' },
    },
    past: {
      sk: { ja: 'som dával', ty: 'si dával', on: 'dával', ona: 'dávala', ono: 'dávalo', my: 'sme dávali', vy: 'ste dávali', oni: 'dávali' },
      ru: { ja: 'давал', ty: 'давал', on: 'давал', ona: 'давала', ono: 'давало', my: 'давали', vy: 'давали', oni: 'давали' },
    },
    future: {
      sk: { ja: 'budem dávať', ty: 'budeš dávať', on: 'bude dávať', ona: 'bude dávať', ono: 'bude dávať', my: 'budeme dávať', vy: 'budete dávať', oni: 'budú dávať' },
      ru: { ja: 'буду давать', ty: 'будешь давать', on: 'будет давать', ona: 'будет давать', ono: 'будет давать', my: 'будем давать', vy: 'будете давать', oni: 'будут давать' },
    },
  },
  {
    id: 'mysliet',
    infinitiveSk: 'myslieť',
    infinitiveRu: 'думать',
    present: {
      sk: { ja: 'myslím', ty: 'myslíš', on: 'myslí', ona: 'myslí', ono: 'myslí', my: 'myslíme', vy: 'myslíte', oni: 'myslia' },
      ru: { ja: 'думаю', ty: 'думаешь', on: 'думает', ona: 'думает', ono: 'думает', my: 'думаем', vy: 'думаете', oni: 'думают' },
    },
    past: {
      sk: { ja: 'som myslel', ty: 'si myslel', on: 'myslel', ona: 'myslela', ono: 'myslelo', my: 'sme mysleli', vy: 'ste mysleli', oni: 'mysleli' },
      ru: { ja: 'думал', ty: 'думал', on: 'думал', ona: 'думала', ono: 'думало', my: 'думали', vy: 'думали', oni: 'думали' },
    },
    future: {
      sk: { ja: 'budem myslieť', ty: 'budeš myslieť', on: 'bude myslieť', ona: 'bude myslieť', ono: 'bude myslieť', my: 'budeme myslieť', vy: 'budete myslieť', oni: 'budú myslieť' },
      ru: { ja: 'буду думать', ty: 'будешь думать', on: 'будет думать', ona: 'будет думать', ono: 'будет думать', my: 'будем думать', vy: 'будете думать', oni: 'будут думать' },
    },
  },
  {
    id: 'cakat',
    infinitiveSk: 'čakať',
    infinitiveRu: 'ждать',
    present: {
      sk: { ja: 'čakám', ty: 'čakáš', on: 'čaká', ona: 'čaká', ono: 'čaká', my: 'čakáme', vy: 'čakáte', oni: 'čakajú' },
      ru: { ja: 'жду', ty: 'ждёшь', on: 'ждёт', ona: 'ждёт', ono: 'ждёт', my: 'ждём', vy: 'ждёте', oni: 'ждут' },
    },
    past: {
      sk: { ja: 'som čakal', ty: 'si čakal', on: 'čakal', ona: 'čakala', ono: 'čakalo', my: 'sme čakali', vy: 'ste čakali', oni: 'čakali' },
      ru: { ja: 'ждал', ty: 'ждал', on: 'ждал', ona: 'ждала', ono: 'ждало', my: 'ждали', vy: 'ждали', oni: 'ждали' },
    },
    future: {
      sk: { ja: 'budem čakať', ty: 'budeš čakať', on: 'bude čakať', ona: 'bude čakať', ono: 'bude čakať', my: 'budeme čakať', vy: 'budete čakať', oni: 'budú čakať' },
      ru: { ja: 'буду ждать', ty: 'будешь ждать', on: 'будет ждать', ona: 'будет ждать', ono: 'будет ждать', my: 'будем ждать', vy: 'будете ждать', oni: 'будут ждать' },
    },
  },
  {
    id: 'zabudat',
    infinitiveSk: 'zabúdať',
    infinitiveRu: 'забывать',
    present: {
      sk: { ja: 'zabúdam', ty: 'zabúdaš', on: 'zabúda', ona: 'zabúda', ono: 'zabúda', my: 'zabúdame', vy: 'zabúdate', oni: 'zabúdajú' },
      ru: { ja: 'забываю', ty: 'забываешь', on: 'забывает', ona: 'забывает', ono: 'забывает', my: 'забываем', vy: 'забываете', oni: 'забывают' },
    },
    past: {
      sk: { ja: 'som zabúdal', ty: 'si zabúdal', on: 'zabúdal', ona: 'zabúdala', ono: 'zabúdalo', my: 'sme zabúdali', vy: 'ste zabúdali', oni: 'zabúdali' },
      ru: { ja: 'забывал', ty: 'забывал', on: 'забывал', ona: 'забывала', ono: 'забывало', my: 'забывали', vy: 'забывали', oni: 'забывали' },
    },
    future: {
      sk: { ja: 'budem zabúdať', ty: 'budeš zabúdať', on: 'bude zabúdať', ona: 'bude zabúdať', ono: 'bude zabúdať', my: 'budeme zabúdať', vy: 'budete zabúdať', oni: 'budú zabúdať' },
      ru: { ja: 'буду забывать', ty: 'будешь забывать', on: 'будет забывать', ona: 'будет забывать', ono: 'будет забывать', my: 'будем забывать', vy: 'будете забывать', oni: 'будут забывать' },
    },
  },
  {
    id: 'koncit',
    infinitiveSk: 'končiť',
    infinitiveRu: 'заканчивать',
    present: {
      sk: { ja: 'končím', ty: 'končíš', on: 'končí', ona: 'končí', ono: 'končí', my: 'končíme', vy: 'končíte', oni: 'končia' },
      ru: { ja: 'заканчиваю', ty: 'заканчиваешь', on: 'заканчивает', ona: 'заканчивает', ono: 'заканчивает', my: 'заканчиваем', vy: 'заканчиваете', oni: 'заканчивают' },
    },
    past: {
      sk: { ja: 'som končil', ty: 'si končil', on: 'končil', ona: 'končila', ono: 'končilo', my: 'sme končili', vy: 'ste končili', oni: 'končili' },
      ru: { ja: 'заканчивал', ty: 'заканчивал', on: 'заканчивал', ona: 'заканчивала', ono: 'заканчивало', my: 'заканчивали', vy: 'заканчивали', oni: 'заканчивали' },
    },
    future: {
      sk: { ja: 'budem končiť', ty: 'budeš končiť', on: 'bude končiť', ona: 'bude končiť', ono: 'bude končiť', my: 'budeme končiť', vy: 'budete končiť', oni: 'budú končiť' },
      ru: { ja: 'буду заканчивать', ty: 'будешь заканчивать', on: 'будет заканчивать', ona: 'будет заканчивать', ono: 'будет заканчивать', my: 'будем заканчивать', vy: 'будете заканчивать', oni: 'будут заканчивать' },
    },
  },
  {
    id: 'zavriet',
    infinitiveSk: 'zavrieť',
    infinitiveRu: 'закрыть',
    present: {
      sk: { ja: 'zavriem', ty: 'zavrieš', on: 'zavrie', ona: 'zavrie', ono: 'zavrie', my: 'zavrieme', vy: 'zavriete', oni: 'zavrú' },
      ru: { ja: 'закрою', ty: 'закроешь', on: 'закроет', ona: 'закроет', ono: 'закроет', my: 'закроем', vy: 'закроете', oni: 'закроют' },
    },
    past: {
      sk: { ja: 'som zavrel', ty: 'si zavrel', on: 'zavrel', ona: 'zavrela', ono: 'zavrelo', my: 'sme zavreli', vy: 'ste zavreli', oni: 'zavreli' },
      ru: { ja: 'закрыл', ty: 'закрыл', on: 'закрыл', ona: 'закрыла', ono: 'закрыло', my: 'закрыли', vy: 'закрыли', oni: 'закрыли' },
    },
    future: {
      sk: { ja: 'budem zavrieť', ty: 'budeš zavrieť', on: 'bude zavrieť', ona: 'bude zavrieť', ono: 'bude zavrieť', my: 'budeme zavrieť', vy: 'budete zavrieť', oni: 'budú zavrieť' },
      ru: { ja: 'буду закрыть', ty: 'будешь закрыть', on: 'будет закрыть', ona: 'будет закрыть', ono: 'будет закрыть', my: 'будем закрыть', vy: 'будете закрыть', oni: 'будут закрыть' },
    },
  },
  {
    id: 'zapamatat_si',
    infinitiveSk: 'zapamätať si',
    infinitiveRu: 'запомнить',
    present: {
      sk: { ja: 'zapamätám si', ty: 'zapamätáš si', on: 'zapamätá si', ona: 'zapamätá si', ono: 'zapamätá si', my: 'zapamätáme si', vy: 'zapamätáte si', oni: 'zapamätajú si' },
      ru: { ja: 'запомню', ty: 'запомнишь', on: 'запомнит', ona: 'запомнит', ono: 'запомнит', my: 'запомним', vy: 'запомните', oni: 'запомнят' },
    },
    past: {
      sk: { ja: 'som si zapamätal', ty: 'si si zapamätal', on: 'zapamätal si', ona: 'zapamätala si', ono: 'zapamätalo si', my: 'sme si zapamätali', vy: 'ste si zapamätali', oni: 'zapamätali si' },
      ru: { ja: 'запомнил', ty: 'запомнил', on: 'запомнил', ona: 'запомнила', ono: 'запомнило', my: 'запомнили', vy: 'запомнили', oni: 'запомнили' },
    },
    future: {
      sk: { ja: 'budem si zapamätať', ty: 'budeš si zapamätať', on: 'bude si zapamätať', ona: 'bude si zapamätať', ono: 'bude si zapamätať', my: 'budeme si zapamätať', vy: 'budete si zapamätať', oni: 'budú si zapamätať' },
      ru: { ja: 'буду запомнить', ty: 'будешь запомнить', on: 'будет запомнить', ona: 'будет запомнить', ono: 'будет запомнить', my: 'будем запомнить', vy: 'будете запомнить', oni: 'будут запомнить' },
    },
  },
  {
    id: 'hrat',
    infinitiveSk: 'hrať',
    infinitiveRu: 'играть',
    present: {
      sk: { ja: 'hrám', ty: 'hráš', on: 'hrá', ona: 'hrá', ono: 'hrá', my: 'hráme', vy: 'hráte', oni: 'hrajú' },
      ru: { ja: 'играю', ty: 'играешь', on: 'играет', ona: 'играет', ono: 'играет', my: 'играем', vy: 'играете', oni: 'играют' },
    },
    past: {
      sk: { ja: 'som hral', ty: 'si hral', on: 'hral', ona: 'hrala', ono: 'hralo', my: 'sme hrali', vy: 'ste hrali', oni: 'hrali' },
      ru: { ja: 'играл', ty: 'играл', on: 'играл', ona: 'играла', ono: 'играло', my: 'играли', vy: 'играли', oni: 'играли' },
    },
    future: {
      sk: { ja: 'budem hrať', ty: 'budeš hrať', on: 'bude hrať', ona: 'bude hrať', ono: 'bude hrať', my: 'budeme hrať', vy: 'budete hrať', oni: 'budú hrať' },
      ru: { ja: 'буду играть', ty: 'будешь играть', on: 'будет играть', ona: 'будет играть', ono: 'будет играть', my: 'будем играть', vy: 'будете играть', oni: 'будут играть' },
    },
  },
  {
    id: 'hladat',
    infinitiveSk: 'hľadať',
    infinitiveRu: 'искать',
    present: {
      sk: { ja: 'hľadám', ty: 'hľadáš', on: 'hľadá', ona: 'hľadá', ono: 'hľadá', my: 'hľadáme', vy: 'hľadáte', oni: 'hľadajú' },
      ru: { ja: 'ищу', ty: 'ищешь', on: 'ищет', ona: 'ищет', ono: 'ищет', my: 'ищем', vy: 'ищете', oni: 'ищут' },
    },
    past: {
      sk: { ja: 'som hľadal', ty: 'si hľadal', on: 'hľadal', ona: 'hľadala', ono: 'hľadalo', my: 'sme hľadali', vy: 'ste hľadali', oni: 'hľadali' },
      ru: { ja: 'искал', ty: 'искал', on: 'искал', ona: 'искала', ono: 'искало', my: 'искали', vy: 'искали', oni: 'искали' },
    },
    future: {
      sk: { ja: 'budem hľadať', ty: 'budeš hľadať', on: 'bude hľadať', ona: 'bude hľadať', ono: 'bude hľadať', my: 'budeme hľadať', vy: 'budete hľadať', oni: 'budú hľadať' },
      ru: { ja: 'буду искать', ty: 'будешь искать', on: 'будет искать', ona: 'будет искать', ono: 'будет искать', my: 'будем искать', vy: 'будете искать', oni: 'будут искать' },
    },
  },
  {
    id: 'menit_sa',
    infinitiveSk: 'meniť sa',
    infinitiveRu: 'меняться',
    present: {
      sk: { ja: 'mením sa', ty: 'meníš sa', on: 'mení sa', ona: 'mení sa', ono: 'mení sa', my: 'meníme sa', vy: 'meníte sa', oni: 'menia sa' },
      ru: { ja: 'меняюсь', ty: 'меняешься', on: 'меняется', ona: 'меняется', ono: 'меняется', my: 'меняемся', vy: 'меняетесь', oni: 'меняются' },
    },
    past: {
      sk: { ja: 'som sa menil', ty: 'si sa menil', on: 'menil sa', ona: 'menila sa', ono: 'menilo sa', my: 'sme sa menili', vy: 'ste sa menili', oni: 'menili sa' },
      ru: { ja: 'менялся', ty: 'менялся', on: 'менялся', ona: 'менялась', ono: 'менялось', my: 'менялись', vy: 'менялись', oni: 'менялись' },
    },
    future: {
      sk: { ja: 'budem sa meniť', ty: 'budeš sa meniť', on: 'bude sa meniť', ona: 'bude sa meniť', ono: 'bude sa meniť', my: 'budeme sa meniť', vy: 'budete sa meniť', oni: 'budú sa meniť' },
      ru: { ja: 'буду меняться', ty: 'будешь меняться', on: 'будет меняться', ona: 'будет меняться', ono: 'будет меняться', my: 'будем меняться', vy: 'будете меняться', oni: 'будут меняться' },
    },
  },
  {
    id: 'dufat',
    infinitiveSk: 'dúfať',
    infinitiveRu: 'надеяться',
    present: {
      sk: { ja: 'dúfam', ty: 'dúfaš', on: 'dúfa', ona: 'dúfa', ono: 'dúfa', my: 'dúfame', vy: 'dúfate', oni: 'dúfajú' },
      ru: { ja: 'надеюсь', ty: 'надеешься', on: 'надеется', ona: 'надеется', ono: 'надеется', my: 'надеемся', vy: 'надеетесь', oni: 'надеются' },
    },
    past: {
      sk: { ja: 'som dúfal', ty: 'si dúfal', on: 'dúfal', ona: 'dúfala', ono: 'dúfalo', my: 'sme dúfali', vy: 'ste dúfali', oni: 'dúfali' },
      ru: { ja: 'надеялся', ty: 'надеялся', on: 'надеялся', ona: 'надеялась', ono: 'надеялось', my: 'надеялись', vy: 'надеялись', oni: 'надеялись' },
    },
    future: {
      sk: { ja: 'budem dúfať', ty: 'budeš dúfať', on: 'bude dúfať', ona: 'bude dúfať', ono: 'bude dúfať', my: 'budeme dúfať', vy: 'budete dúfať', oni: 'budú dúfať' },
      ru: { ja: 'буду надеяться', ty: 'будешь надеяться', on: 'будет надеяться', ona: 'будет надеяться', ono: 'будет надеяться', my: 'будем надеяться', vy: 'будете надеяться', oni: 'будут надеяться' },
    },
  },
  {
    id: 'nachadzat',
    infinitiveSk: 'nachádzať',
    infinitiveRu: 'находить',
    present: {
      sk: { ja: 'nachádzam', ty: 'nachádzaš', on: 'nachádza', ona: 'nachádza', ono: 'nachádza', my: 'nachádzame', vy: 'nachádzate', oni: 'nachádzajú' },
      ru: { ja: 'нахожу', ty: 'находишь', on: 'находит', ona: 'находит', ono: 'находит', my: 'находим', vy: 'находите', oni: 'находят' },
    },
    past: {
      sk: { ja: 'som nachádzal', ty: 'si nachádzal', on: 'nachádzal', ona: 'nachádzala', ono: 'nachádzalo', my: 'sme nachádzali', vy: 'ste nachádzali', oni: 'nachádzali' },
      ru: { ja: 'находил', ty: 'находил', on: 'находил', ona: 'находила', ono: 'находило', my: 'находили', vy: 'находили', oni: 'находили' },
    },
    future: {
      sk: { ja: 'budem nachádzať', ty: 'budeš nachádzať', on: 'bude nachádzať', ona: 'bude nachádzať', ono: 'bude nachádzať', my: 'budeme nachádzať', vy: 'budete nachádzať', oni: 'budú nachádzať' },
      ru: { ja: 'буду находить', ty: 'будешь находить', on: 'будет находить', ona: 'будет находить', ono: 'будет находить', my: 'будем находить', vy: 'будете находить', oni: 'будут находить' },
    },
  },
  {
    id: 'stretavat',
    infinitiveSk: 'stretávať',
    infinitiveRu: 'встречать',
    present: {
      sk: { ja: 'stretávam', ty: 'stretávaš', on: 'stretáva', ona: 'stretáva', ono: 'stretáva', my: 'stretávame', vy: 'stretávate', oni: 'stretávajú' },
      ru: { ja: 'встречаю', ty: 'встречаешь', on: 'встречает', ona: 'встречает', ono: 'встречает', my: 'встречаем', vy: 'встречаете', oni: 'встречают' },
    },
    past: {
      sk: { ja: 'som stretával', ty: 'si stretával', on: 'stretával', ona: 'stretávala', ono: 'stretávalo', my: 'sme stretávali', vy: 'ste stretávali', oni: 'stretávali' },
      ru: { ja: 'встречал', ty: 'встречал', on: 'встречал', ona: 'встречала', ono: 'встречало', my: 'встречали', vy: 'встречали', oni: 'встречали' },
    },
    future: {
      sk: { ja: 'budem stretávať', ty: 'budeš stretávať', on: 'bude stretávať', ona: 'bude stretávať', ono: 'bude stretávať', my: 'budeme stretávať', vy: 'budete stretávať', oni: 'budú stretávať' },
      ru: { ja: 'буду встречать', ty: 'будешь встречать', on: 'будет встречать', ona: 'будет встречать', ono: 'будет встречать', my: 'будем встречать', vy: 'будете встречать', oni: 'будут встречать' },
    },
  },
  {
    id: 'zacinat',
    infinitiveSk: 'začínať',
    infinitiveRu: 'начинать',
    present: {
      sk: { ja: 'začínam', ty: 'začínaš', on: 'začína', ona: 'začína', ono: 'začína', my: 'začíname', vy: 'začínate', oni: 'začínajú' },
      ru: { ja: 'начинаю', ty: 'начинаешь', on: 'начинает', ona: 'начинает', ono: 'начинает', my: 'начинаем', vy: 'начинаете', oni: 'начинают' },
    },
    past: {
      sk: { ja: 'som začínal', ty: 'si začínal', on: 'začínal', ona: 'začínala', ono: 'začínalo', my: 'sme začínali', vy: 'ste začínali', oni: 'začínali' },
      ru: { ja: 'начинал', ty: 'начинал', on: 'начинал', ona: 'начинала', ono: 'начинало', my: 'начинали', vy: 'начинали', oni: 'начинали' },
    },
    future: {
      sk: { ja: 'budem začínať', ty: 'budeš začínať', on: 'bude začínať', ona: 'bude začínať', ono: 'bude začínať', my: 'budeme začínať', vy: 'budete začínať', oni: 'budú začínať' },
      ru: { ja: 'буду начинать', ty: 'будешь начинать', on: 'будет начинать', ona: 'будет начинать', ono: 'будет начинать', my: 'будем начинать', vy: 'будете начинать', oni: 'будут начинать' },
    },
  },
  {
    id: 'nenavidiet',
    infinitiveSk: 'nenávidieť',
    infinitiveRu: 'ненавидеть',
    present: {
      sk: { ja: 'nenávidím', ty: 'nenávidíš', on: 'nenávidí', ona: 'nenávidí', ono: 'nenávidí', my: 'nenávidíme', vy: 'nenávidíte', oni: 'nenávidia' },
      ru: { ja: 'ненавижу', ty: 'ненавидишь', on: 'ненавидит', ona: 'ненавидит', ono: 'ненавидит', my: 'ненавидим', vy: 'ненавидите', oni: 'ненавидят' },
    },
    past: {
      sk: { ja: 'som nenávidel', ty: 'si nenávidel', on: 'nenávidel', ona: 'nenávidela', ono: 'nenávidelo', my: 'sme nenávideli', vy: 'ste nenávideli', oni: 'nenávideli' },
      ru: { ja: 'ненавидел', ty: 'ненавидел', on: 'ненавидел', ona: 'ненавидела', ono: 'ненавидело', my: 'ненавидели', vy: 'ненавидели', oni: 'ненавидели' },
    },
    future: {
      sk: { ja: 'budem nenávidieť', ty: 'budeš nenávidieť', on: 'bude nenávidieť', ona: 'bude nenávidieť', ono: 'bude nenávidieť', my: 'budeme nenávidieť', vy: 'budete nenávidieť', oni: 'budú nenávidieť' },
      ru: { ja: 'буду ненавидеть', ty: 'будешь ненавидеть', on: 'будет ненавидеть', ona: 'будет ненавидеть', ono: 'будет ненавидеть', my: 'будем ненавидеть', vy: 'будете ненавидеть', oni: 'будут ненавидеть' },
    },
  },
  {
    id: 'pacit_sa',
    infinitiveSk: 'páčiť sa',
    infinitiveRu: 'нравиться',
    present: {
      sk: { ja: 'páčim sa', ty: 'páčiš sa', on: 'páči sa', ona: 'páči sa', ono: 'páči sa', my: 'páčime sa', vy: 'páčite sa', oni: 'páčia sa' },
      ru: { ja: 'нравлюсь', ty: 'нравишься', on: 'нравится', ona: 'нравится', ono: 'нравится', my: 'нравимся', vy: 'нравитесь', oni: 'нравятся' },
    },
    past: {
      sk: { ja: 'som sa páčil', ty: 'si sa páčil', on: 'páčil sa', ona: 'páčila sa', ono: 'páčilo sa', my: 'sme sa páčili', vy: 'ste sa páčili', oni: 'páčili sa' },
      ru: { ja: 'нравился', ty: 'нравился', on: 'нравился', ona: 'нравилась', ono: 'нравилось', my: 'нравились', vy: 'нравились', oni: 'нравились' },
    },
    future: {
      sk: { ja: 'budem sa páčiť', ty: 'budeš sa páčiť', on: 'bude sa páčiť', ona: 'bude sa páčiť', ono: 'bude sa páčiť', my: 'budeme sa páčiť', vy: 'budete sa páčiť', oni: 'budú sa páčiť' },
      ru: { ja: 'буду нравиться', ty: 'будешь нравиться', on: 'будет нравиться', ona: 'будет нравиться', ono: 'будет нравиться', my: 'будем нравиться', vy: 'будете нравиться', oni: 'будут нравиться' },
    },
  },
  {
    id: 'zostavat',
    infinitiveSk: 'zostávať',
    infinitiveRu: 'оставаться',
    present: {
      sk: { ja: 'zostávam', ty: 'zostávaš', on: 'zostáva', ona: 'zostáva', ono: 'zostáva', my: 'zostávame', vy: 'zostávate', oni: 'zostávajú' },
      ru: { ja: 'остаюсь', ty: 'остаёшься', on: 'остаётся', ona: 'остаётся', ono: 'остаётся', my: 'остаёмся', vy: 'остаётесь', oni: 'остаются' },
    },
    past: {
      sk: { ja: 'som zostával', ty: 'si zostával', on: 'zostával', ona: 'zostávala', ono: 'zostávalo', my: 'sme zostávali', vy: 'ste zostávali', oni: 'zostávali' },
      ru: { ja: 'оставался', ty: 'оставался', on: 'оставался', ona: 'оставалась', ono: 'оставалось', my: 'оставались', vy: 'оставались', oni: 'оставались' },
    },
    future: {
      sk: { ja: 'budem zostávať', ty: 'budeš zostávať', on: 'bude zostávať', ona: 'bude zostávať', ono: 'bude zostávať', my: 'budeme zostávať', vy: 'budete zostávať', oni: 'budú zostávať' },
      ru: { ja: 'буду оставаться', ty: 'будешь оставаться', on: 'будет оставаться', ona: 'будет оставаться', ono: 'будет оставаться', my: 'будем оставаться', vy: 'будете оставаться', oni: 'будут оставаться' },
    },
  },
  {
    id: 'nechavat',
    infinitiveSk: 'nechávať',
    infinitiveRu: 'оставлять',
    present: {
      sk: { ja: 'nechávam', ty: 'nechávaš', on: 'necháva', ona: 'necháva', ono: 'necháva', my: 'nechávame', vy: 'nechávate', oni: 'nechávajú' },
      ru: { ja: 'оставляю', ty: 'оставляешь', on: 'оставляет', ona: 'оставляет', ono: 'оставляет', my: 'оставляем', vy: 'оставляете', oni: 'оставляют' },
    },
    past: {
      sk: { ja: 'som nechával', ty: 'si nechával', on: 'nechával', ona: 'nechávala', ono: 'nechávalo', my: 'sme nechávali', vy: 'ste nechávali', oni: 'nechávali' },
      ru: { ja: 'оставлял', ty: 'оставлял', on: 'оставлял', ona: 'оставляла', ono: 'оставляло', my: 'оставляли', vy: 'оставляли', oni: 'оставляли' },
    },
    future: {
      sk: { ja: 'budem nechávať', ty: 'budeš nechávať', on: 'bude nechávať', ona: 'bude nechávať', ono: 'bude nechávať', my: 'budeme nechávať', vy: 'budete nechávať', oni: 'budú nechávať' },
      ru: { ja: 'буду оставлять', ty: 'будешь оставлять', on: 'будет оставлять', ona: 'будет оставлять', ono: 'будет оставлять', my: 'будем оставлять', vy: 'будете оставлять', oni: 'будут оставлять' },
    },
  },
  {
    id: 'opustat',
    infinitiveSk: 'opúšťať',
    infinitiveRu: 'покидать',
    present: {
      sk: { ja: 'opúšťam', ty: 'opúšťaš', on: 'opúšťa', ona: 'opúšťa', ono: 'opúšťa', my: 'opúšťame', vy: 'opúšťate', oni: 'opúšťajú' },
      ru: { ja: 'покидаю', ty: 'покидаешь', on: 'покидает', ona: 'покидает', ono: 'покидает', my: 'покидаем', vy: 'покидаете', oni: 'покидают' },
    },
    past: {
      sk: { ja: 'som opúšťal', ty: 'si opúšťal', on: 'opúšťal', ona: 'opúšťala', ono: 'opúšťalo', my: 'sme opúšťali', vy: 'ste opúšťali', oni: 'opúšťali' },
      ru: { ja: 'покидал', ty: 'покидал', on: 'покидал', ona: 'покидала', ono: 'покидало', my: 'покидали', vy: 'покидали', oni: 'покидали' },
    },
    future: {
      sk: { ja: 'budem opúšťať', ty: 'budeš opúšťať', on: 'bude opúšťať', ona: 'bude opúšťať', ono: 'bude opúšťať', my: 'budeme opúšťať', vy: 'budete opúšťať', oni: 'budú opúšťať' },
      ru: { ja: 'буду покидать', ty: 'будешь покидать', on: 'будет покидать', ona: 'будет покидать', ono: 'будет покидать', my: 'будем покидать', vy: 'будете покидать', oni: 'будут покидать' },
    },
  },
  {
    id: 'odpovedat',
    infinitiveSk: 'odpovedať',
    infinitiveRu: 'отвечать',
    present: {
      sk: { ja: 'odpovedám', ty: 'odpovedáš', on: 'odpovedá', ona: 'odpovedá', ono: 'odpovedá', my: 'odpovedáme', vy: 'odpovedáte', oni: 'odpovedajú' },
      ru: { ja: 'отвечаю', ty: 'отвечаешь', on: 'отвечает', ona: 'отвечает', ono: 'отвечает', my: 'отвечаем', vy: 'отвечаете', oni: 'отвечают' },
    },
    past: {
      sk: { ja: 'som odpovedal', ty: 'si odpovedal', on: 'odpovedal', ona: 'odpovedala', ono: 'odpovedalo', my: 'sme odpovedali', vy: 'ste odpovedali', oni: 'odpovedali' },
      ru: { ja: 'отвечал', ty: 'отвечал', on: 'отвечал', ona: 'отвечала', ono: 'отвечало', my: 'отвечали', vy: 'отвечали', oni: 'отвечали' },
    },
    future: {
      sk: { ja: 'budem odpovedať', ty: 'budeš odpovedať', on: 'bude odpovedať', ona: 'bude odpovedať', ono: 'bude odpovedať', my: 'budeme odpovedať', vy: 'budete odpovedať', oni: 'budú odpovedať' },
      ru: { ja: 'буду отвечать', ty: 'будешь отвечать', on: 'будет отвечать', ona: 'будет отвечать', ono: 'будет отвечать', my: 'будем отвечать', vy: 'будете отвечать', oni: 'будут отвечать' },
    },
  },
  {
    id: 'otvorit',
    infinitiveSk: 'otvoriť',
    infinitiveRu: 'открыть',
    present: {
      sk: { ja: 'otvorím', ty: 'otvoríš', on: 'otvorí', ona: 'otvorí', ono: 'otvorí', my: 'otvoríme', vy: 'otvoríte', oni: 'otvoria' },
      ru: { ja: 'открою', ty: 'откроешь', on: 'откроет', ona: 'откроет', ono: 'откроет', my: 'откроем', vy: 'откроете', oni: 'откроют' },
    },
    past: {
      sk: { ja: 'som otvoril', ty: 'si otvoril', on: 'otvoril', ona: 'otvorila', ono: 'otvorilo', my: 'sme otvorili', vy: 'ste otvorili', oni: 'otvorili' },
      ru: { ja: 'открыл', ty: 'открыл', on: 'открыл', ona: 'открыла', ono: 'открыло', my: 'открыли', vy: 'открыли', oni: 'открыли' },
    },
    future: {
      sk: { ja: 'budem otvoriť', ty: 'budeš otvoriť', on: 'bude otvoriť', ona: 'bude otvoriť', ono: 'bude otvoriť', my: 'budeme otvoriť', vy: 'budete otvoriť', oni: 'budú otvoriť' },
      ru: { ja: 'буду открыть', ty: 'будешь открыть', on: 'будет открыть', ona: 'будет открыть', ono: 'будет открыть', my: 'будем открыть', vy: 'будете открыть', oni: 'будут открыть' },
    },
  },
  {
    id: 'spievat',
    infinitiveSk: 'spievať',
    infinitiveRu: 'петь',
    present: {
      sk: { ja: 'spievam', ty: 'spievaš', on: 'spieva', ona: 'spieva', ono: 'spieva', my: 'spievame', vy: 'spievate', oni: 'spievajú' },
      ru: { ja: 'пою', ty: 'поёшь', on: 'поёт', ona: 'поёт', ono: 'поёт', my: 'поём', vy: 'поёте', oni: 'поют' },
    },
    past: {
      sk: { ja: 'som spieval', ty: 'si spieval', on: 'spieval', ona: 'spievala', ono: 'spievalo', my: 'sme spievali', vy: 'ste spievali', oni: 'spievali' },
      ru: { ja: 'пел', ty: 'пел', on: 'пел', ona: 'пела', ono: 'пело', my: 'пели', vy: 'пели', oni: 'пели' },
    },
    future: {
      sk: { ja: 'budem spievať', ty: 'budeš spievať', on: 'bude spievať', ona: 'bude spievať', ono: 'bude spievať', my: 'budeme spievať', vy: 'budete spievať', oni: 'budú spievať' },
      ru: { ja: 'буду петь', ty: 'будешь петь', on: 'будет петь', ona: 'будет петь', ono: 'будет петь', my: 'будем петь', vy: 'будете петь', oni: 'будут петь' },
    },
  },
  {
    id: 'plavat',
    infinitiveSk: 'plávať',
    infinitiveRu: 'плавать',
    present: {
      sk: { ja: 'plávam', ty: 'plávaš', on: 'pláva', ona: 'pláva', ono: 'pláva', my: 'plávame', vy: 'plávate', oni: 'plávajú' },
      ru: { ja: 'плаваю', ty: 'плаваешь', on: 'плавает', ona: 'плавает', ono: 'плавает', my: 'плаваем', vy: 'плаваете', oni: 'плавают' },
    },
    past: {
      sk: { ja: 'som plával', ty: 'si plával', on: 'plával', ona: 'plávala', ono: 'plávalo', my: 'sme plávali', vy: 'ste plávali', oni: 'plávali' },
      ru: { ja: 'плавал', ty: 'плавал', on: 'плавал', ona: 'плавала', ono: 'плавало', my: 'плавали', vy: 'плавали', oni: 'плавали' },
    },
    future: {
      sk: { ja: 'budem plávať', ty: 'budeš plávať', on: 'bude plávať', ona: 'bude plávať', ono: 'bude plávať', my: 'budeme plávať', vy: 'budete plávať', oni: 'budú plávať' },
      ru: { ja: 'буду плавать', ty: 'будешь плавать', on: 'будет плавать', ona: 'будет плавать', ono: 'будет плавать', my: 'будем плавать', vy: 'будете плавать', oni: 'будут плавать' },
    },
  },
  {
    id: 'platit',
    infinitiveSk: 'platiť',
    infinitiveRu: 'платить',
    present: {
      sk: { ja: 'platím', ty: 'platíš', on: 'platí', ona: 'platí', ono: 'platí', my: 'platíme', vy: 'platíte', oni: 'platia' },
      ru: { ja: 'плачу', ty: 'платишь', on: 'платит', ona: 'платит', ono: 'платит', my: 'платим', vy: 'платите', oni: 'платят' },
    },
    past: {
      sk: { ja: 'som platil', ty: 'si platil', on: 'platil', ona: 'platila', ono: 'platilo', my: 'sme platili', vy: 'ste platili', oni: 'platili' },
      ru: { ja: 'платил', ty: 'платил', on: 'платил', ona: 'платила', ono: 'платило', my: 'платили', vy: 'платили', oni: 'платили' },
    },
    future: {
      sk: { ja: 'budem platiť', ty: 'budeš platiť', on: 'bude platiť', ona: 'bude platiť', ono: 'bude platiť', my: 'budeme platiť', vy: 'budete platiť', oni: 'budú platiť' },
      ru: { ja: 'буду платить', ty: 'будешь платить', on: 'будет платить', ona: 'будет платить', ono: 'будет платить', my: 'будем платить', vy: 'будете платить', oni: 'будут платить' },
    },
  },
  {
    id: 'ukazovat',
    infinitiveSk: 'ukazovať',
    infinitiveRu: 'показывать',
    present: {
      sk: { ja: 'ukazujem', ty: 'ukazuješ', on: 'ukazuje', ona: 'ukazuje', ono: 'ukazuje', my: 'ukazujeme', vy: 'ukazujete', oni: 'ukazujú' },
      ru: { ja: 'показываю', ty: 'показываешь', on: 'показывает', ona: 'показывает', ono: 'показывает', my: 'показываем', vy: 'показываете', oni: 'показывают' },
    },
    past: {
      sk: { ja: 'som ukazoval', ty: 'si ukazoval', on: 'ukazoval', ona: 'ukazovala', ono: 'ukazovalo', my: 'sme ukazovali', vy: 'ste ukazovali', oni: 'ukazovali' },
      ru: { ja: 'показывал', ty: 'показывал', on: 'показывал', ona: 'показывала', ono: 'показывало', my: 'показывали', vy: 'показывали', oni: 'показывали' },
    },
    future: {
      sk: { ja: 'budem ukazovať', ty: 'budeš ukazovať', on: 'bude ukazovať', ona: 'bude ukazovať', ono: 'bude ukazovať', my: 'budeme ukazovať', vy: 'budete ukazovať', oni: 'budú ukazovať' },
      ru: { ja: 'буду показывать', ty: 'будешь показывать', on: 'будет показывать', ona: 'будет показывать', ono: 'будет показывать', my: 'будем показывать', vy: 'будете показывать', oni: 'будут показывать' },
    },
  },
  {
    id: 'kupovat',
    infinitiveSk: 'kupovať',
    infinitiveRu: 'покупать',
    present: {
      sk: { ja: 'kupujem', ty: 'kupuješ', on: 'kupuje', ona: 'kupuje', ono: 'kupuje', my: 'kupujeme', vy: 'kupujete', oni: 'kupujú' },
      ru: { ja: 'покупаю', ty: 'покупаешь', on: 'покупает', ona: 'покупает', ono: 'покупает', my: 'покупаем', vy: 'покупаете', oni: 'покупают' },
    },
    past: {
      sk: { ja: 'som kupoval', ty: 'si kupoval', on: 'kupoval', ona: 'kupovala', ono: 'kupovalo', my: 'sme kupovali', vy: 'ste kupovali', oni: 'kupovali' },
      ru: { ja: 'покупал', ty: 'покупал', on: 'покупал', ona: 'покупала', ono: 'покупало', my: 'покупали', vy: 'покупали', oni: 'покупали' },
    },
    future: {
      sk: { ja: 'budem kupovať', ty: 'budeš kupovať', on: 'bude kupovať', ona: 'bude kupovať', ono: 'bude kupovať', my: 'budeme kupovať', vy: 'budete kupovať', oni: 'budú kupovať' },
      ru: { ja: 'буду покупать', ty: 'будешь покупать', on: 'будет покупать', ona: 'будет покупать', ono: 'будет покупать', my: 'будем покупать', vy: 'будете покупать', oni: 'будут покупать' },
    },
  },
  {
    id: 'dostat',
    infinitiveSk: 'dostať',
    infinitiveRu: 'получить',
    present: {
      sk: { ja: 'dostanem', ty: 'dostaneš', on: 'dostane', ona: 'dostane', ono: 'dostane', my: 'dostaneme', vy: 'dostanete', oni: 'dostanú' },
      ru: { ja: 'получу', ty: 'получишь', on: 'получит', ona: 'получит', ono: 'получит', my: 'получим', vy: 'получите', oni: 'получат' },
    },
    past: {
      sk: { ja: 'som dostal', ty: 'si dostal', on: 'dostal', ona: 'dostala', ono: 'dostalo', my: 'sme dostali', vy: 'ste dostali', oni: 'dostali' },
      ru: { ja: 'получил', ty: 'получил', on: 'получил', ona: 'получила', ono: 'получило', my: 'получили', vy: 'получили', oni: 'получили' },
    },
    future: {
      sk: { ja: 'budem dostať', ty: 'budeš dostať', on: 'bude dostať', ona: 'bude dostať', ono: 'bude dostať', my: 'budeme dostať', vy: 'budete dostať', oni: 'budú dostať' },
      ru: { ja: 'буду получить', ty: 'будешь получить', on: 'будет получить', ona: 'будет получить', ono: 'будет получить', my: 'будем получить', vy: 'будете получить', oni: 'будут получить' },
    },
  },
  {
    id: 'pomahat',
    infinitiveSk: 'pomáhať',
    infinitiveRu: 'помогать',
    present: {
      sk: { ja: 'pomáham', ty: 'pomáhaš', on: 'pomáha', ona: 'pomáha', ono: 'pomáha', my: 'pomáhame', vy: 'pomáhate', oni: 'pomáhajú' },
      ru: { ja: 'помогаю', ty: 'помогаешь', on: 'помогает', ona: 'помогает', ono: 'помогает', my: 'помогаем', vy: 'помогаете', oni: 'помогают' },
    },
    past: {
      sk: { ja: 'som pomáhal', ty: 'si pomáhal', on: 'pomáhal', ona: 'pomáhala', ono: 'pomáhalo', my: 'sme pomáhali', vy: 'ste pomáhali', oni: 'pomáhali' },
      ru: { ja: 'помогал', ty: 'помогал', on: 'помогал', ona: 'помогала', ono: 'помогало', my: 'помогали', vy: 'помогали', oni: 'помогали' },
    },
    future: {
      sk: { ja: 'budem pomáhať', ty: 'budeš pomáhať', on: 'bude pomáhať', ona: 'bude pomáhať', ono: 'bude pomáhať', my: 'budeme pomáhať', vy: 'budete pomáhať', oni: 'budú pomáhať' },
      ru: { ja: 'буду помогать', ty: 'будешь помогать', on: 'будет помогать', ona: 'будет помогать', ono: 'будет помогать', my: 'будем помогать', vy: 'будете помогать', oni: 'будут помогать' },
    },
  },
  {
    id: 'navstevovat',
    infinitiveSk: 'navštevovať',
    infinitiveRu: 'посещать',
    present: {
      sk: { ja: 'navštevujem', ty: 'navštevuješ', on: 'navštevuje', ona: 'navštevuje', ono: 'navštevuje', my: 'navštevujeme', vy: 'navštevujete', oni: 'navštevujú' },
      ru: { ja: 'посещаю', ty: 'посещаешь', on: 'посещает', ona: 'посещает', ono: 'посещает', my: 'посещаем', vy: 'посещаете', oni: 'посещают' },
    },
    past: {
      sk: { ja: 'som navštevoval', ty: 'si navštevoval', on: 'navštevoval', ona: 'navštevovala', ono: 'navštevovalo', my: 'sme navštevovali', vy: 'ste navštevovali', oni: 'navštevovali' },
      ru: { ja: 'посещал', ty: 'посещал', on: 'посещал', ona: 'посещала', ono: 'посещало', my: 'посещали', vy: 'посещали', oni: 'посещали' },
    },
    future: {
      sk: { ja: 'budem navštevovať', ty: 'budeš navštevovať', on: 'bude navštevovať', ona: 'bude navštevovať', ono: 'bude navštevovať', my: 'budeme navštevovať', vy: 'budete navštevovať', oni: 'budú navštevovať' },
      ru: { ja: 'буду посещать', ty: 'будешь посещать', on: 'будет посещать', ona: 'будет посещать', ono: 'будет посещать', my: 'будем посещать', vy: 'будете посещать', oni: 'будут посещать' },
    },
  },
  {
    id: 'prichadzat',
    infinitiveSk: 'prichádzať',
    infinitiveRu: 'приходить',
    present: {
      sk: { ja: 'prichádzam', ty: 'prichádzaš', on: 'prichádza', ona: 'prichádza', ono: 'prichádza', my: 'prichádzame', vy: 'prichádzate', oni: 'prichádzajú' },
      ru: { ja: 'прихожу', ty: 'приходишь', on: 'приходит', ona: 'приходит', ono: 'приходит', my: 'приходим', vy: 'приходите', oni: 'приходят' },
    },
    past: {
      sk: { ja: 'som prichádzal', ty: 'si prichádzal', on: 'prichádzal', ona: 'prichádzala', ono: 'prichádzalo', my: 'sme prichádzali', vy: 'ste prichádzali', oni: 'prichádzali' },
      ru: { ja: 'приходил', ty: 'приходил', on: 'приходил', ona: 'приходила', ono: 'приходило', my: 'приходили', vy: 'приходили', oni: 'приходили' },
    },
    future: {
      sk: { ja: 'budem prichádzať', ty: 'budeš prichádzať', on: 'bude prichádzať', ona: 'bude prichádzať', ono: 'bude prichádzať', my: 'budeme prichádzať', vy: 'budete prichádzať', oni: 'budú prichádzať' },
      ru: { ja: 'буду приходить', ty: 'будешь приходить', on: 'будет приходить', ona: 'будет приходить', ono: 'будет приходить', my: 'будем приходить', vy: 'будете приходить', oni: 'будут приходить' },
    },
  },
  {
    id: 'skusat',
    infinitiveSk: 'skúšať',
    infinitiveRu: 'пробовать',
    present: {
      sk: { ja: 'skúšam', ty: 'skúšaš', on: 'skúša', ona: 'skúša', ono: 'skúša', my: 'skúšame', vy: 'skúšate', oni: 'skúšajú' },
      ru: { ja: 'пробую', ty: 'пробуешь', on: 'пробует', ona: 'пробует', ono: 'пробует', my: 'пробуем', vy: 'пробуете', oni: 'пробуют' },
    },
    past: {
      sk: { ja: 'som skúšal', ty: 'si skúšal', on: 'skúšal', ona: 'skúšala', ono: 'skúšalo', my: 'sme skúšali', vy: 'ste skúšali', oni: 'skúšali' },
      ru: { ja: 'пробовал', ty: 'пробовал', on: 'пробовал', ona: 'пробовала', ono: 'пробовало', my: 'пробовали', vy: 'пробовали', oni: 'пробовали' },
    },
    future: {
      sk: { ja: 'budem skúšať', ty: 'budeš skúšať', on: 'bude skúšať', ona: 'bude skúšať', ono: 'bude skúšať', my: 'budeme skúšať', vy: 'budete skúšať', oni: 'budú skúšať' },
      ru: { ja: 'буду пробовать', ty: 'будешь пробовать', on: 'будет пробовать', ona: 'будет пробовать', ono: 'будет пробовать', my: 'будем пробовать', vy: 'будете пробовать', oni: 'будут пробовать' },
    },
  },
  {
    id: 'predavat',
    infinitiveSk: 'predávať',
    infinitiveRu: 'продавать',
    present: {
      sk: { ja: 'predávam', ty: 'predávaš', on: 'predáva', ona: 'predáva', ono: 'predáva', my: 'predávame', vy: 'predávate', oni: 'predávajú' },
      ru: { ja: 'продаю', ty: 'продаёшь', on: 'продаёт', ona: 'продаёт', ono: 'продаёт', my: 'продаём', vy: 'продаёте', oni: 'продают' },
    },
    past: {
      sk: { ja: 'som predával', ty: 'si predával', on: 'predával', ona: 'predávala', ono: 'predávalo', my: 'sme predávali', vy: 'ste predávali', oni: 'predávali' },
      ru: { ja: 'продавал', ty: 'продавал', on: 'продавал', ona: 'продавала', ono: 'продавало', my: 'продавали', vy: 'продавали', oni: 'продавали' },
    },
    future: {
      sk: { ja: 'budem predávať', ty: 'budeš predávať', on: 'bude predávať', ona: 'bude predávať', ono: 'bude predávať', my: 'budeme predávať', vy: 'budete predávať', oni: 'budú predávať' },
      ru: { ja: 'буду продавать', ty: 'будешь продавать', on: 'будет продавать', ona: 'будет продавать', ono: 'будет продавать', my: 'будем продавать', vy: 'будете продавать', oni: 'будут продавать' },
    },
  },
  {
    id: 'zobudit_sa',
    infinitiveSk: 'zobudiť sa',
    infinitiveRu: 'проснуться',
    present: {
      sk: { ja: 'zobudím sa', ty: 'zobudíš sa', on: 'zobudí sa', ona: 'zobudí sa', ono: 'zobudí sa', my: 'zobudíme sa', vy: 'zobudíte sa', oni: 'zobudia sa' },
      ru: { ja: 'проснусь', ty: 'проснёшься', on: 'проснётся', ona: 'проснётся', ono: 'проснётся', my: 'проснёмся', vy: 'проснётесь', oni: 'проснутся' },
    },
    past: {
      sk: { ja: 'som sa zobudil', ty: 'si sa zobudil', on: 'zobudil sa', ona: 'zobudila sa', ono: 'zobudilo sa', my: 'sme sa zobudili', vy: 'ste sa zobudili', oni: 'zobudili sa' },
      ru: { ja: 'проснулся', ty: 'проснулся', on: 'проснулся', ona: 'проснулась', ono: 'проснулось', my: 'проснулись', vy: 'проснулись', oni: 'проснулись' },
    },
    future: {
      sk: { ja: 'budem sa zobudiť', ty: 'budeš sa zobudiť', on: 'bude sa zobudiť', ona: 'bude sa zobudiť', ono: 'bude sa zobudiť', my: 'budeme sa zobudiť', vy: 'budete sa zobudiť', oni: 'budú sa zobudiť' },
      ru: { ja: 'буду проснуться', ty: 'будешь проснуться', on: 'будет проснуться', ona: 'будет проснуться', ono: 'будет проснуться', my: 'будем проснуться', vy: 'будете проснуться', oni: 'будут проснуться' },
    },
  },
  {
    id: 'cestovat',
    infinitiveSk: 'cestovať',
    infinitiveRu: 'путешествовать',
    present: {
      sk: { ja: 'cestujem', ty: 'cestuješ', on: 'cestuje', ona: 'cestuje', ono: 'cestuje', my: 'cestujeme', vy: 'cestujete', oni: 'cestujú' },
      ru: { ja: 'путешествую', ty: 'путешествуешь', on: 'путешествует', ona: 'путешествует', ono: 'путешествует', my: 'путешествуем', vy: 'путешествуете', oni: 'путешествуют' },
    },
    past: {
      sk: { ja: 'som cestoval', ty: 'si cestoval', on: 'cestoval', ona: 'cestovala', ono: 'cestovalo', my: 'sme cestovali', vy: 'ste cestovali', oni: 'cestovali' },
      ru: { ja: 'путешествовал', ty: 'путешествовал', on: 'путешествовал', ona: 'путешествовала', ono: 'путешествовало', my: 'путешествовали', vy: 'путешествовали', oni: 'путешествовали' },
    },
    future: {
      sk: { ja: 'budem cestovať', ty: 'budeš cestovať', on: 'bude cestovať', ona: 'bude cestovať', ono: 'bude cestovať', my: 'budeme cestovať', vy: 'budete cestovať', oni: 'budú cestovať' },
      ru: { ja: 'буду путешествовать', ty: 'будешь путешествовать', on: 'будет путешествовать', ona: 'будет путешествовать', ono: 'будет путешествовать', my: 'будем путешествовать', vy: 'будете путешествовать', oni: 'будут путешествовать' },
    },
  },
  {
    id: 'porozpravat',
    infinitiveSk: 'porozprávať',
    infinitiveRu: 'рассказать',
    present: {
      sk: { ja: 'porozprávam', ty: 'porozprávaš', on: 'porozpráva', ona: 'porozpráva', ono: 'porozpráva', my: 'porozprávame', vy: 'porozprávate', oni: 'porozprávajú' },
      ru: { ja: 'расскажу', ty: 'расскажешь', on: 'расскажет', ona: 'расскажет', ono: 'расскажет', my: 'расскажем', vy: 'расскажете', oni: 'расскажут' },
    },
    past: {
      sk: { ja: 'som porozprával', ty: 'si porozprával', on: 'porozprával', ona: 'porozprávala', ono: 'porozprávalo', my: 'sme porozprávali', vy: 'ste porozprávali', oni: 'porozprávali' },
      ru: { ja: 'рассказал', ty: 'рассказал', on: 'рассказал', ona: 'рассказала', ono: 'рассказало', my: 'рассказали', vy: 'рассказали', oni: 'рассказали' },
    },
    future: {
      sk: { ja: 'budem porozprávať', ty: 'budeš porozprávať', on: 'bude porozprávať', ona: 'bude porozprávať', ono: 'bude porozprávať', my: 'budeme porozprávať', vy: 'budete porozprávať', oni: 'budú porozprávať' },
      ru: { ja: 'буду рассказать', ty: 'будешь рассказать', on: 'будет рассказать', ona: 'будет рассказать', ono: 'будет рассказать', my: 'будем рассказать', vy: 'будете рассказать', oni: 'будут рассказать' },
    },
  },
  {
    id: 'povedat',
    infinitiveSk: 'povedať',
    infinitiveRu: 'сказать',
    present: {
      sk: { ja: 'poviem', ty: 'povieš', on: 'povie', ona: 'povie', ono: 'povie', my: 'povieme', vy: 'poviete', oni: 'povedia' },
      ru: { ja: 'скажу', ty: 'скажешь', on: 'скажет', ona: 'скажет', ono: 'скажет', my: 'скажем', vy: 'скажете', oni: 'скажут' },
    },
    past: {
      sk: { ja: 'som povedal', ty: 'si povedal', on: 'povedal', ona: 'povedala', ono: 'povedalo', my: 'sme povedali', vy: 'ste povedali', oni: 'povedali' },
      ru: { ja: 'сказал', ty: 'сказал', on: 'сказал', ona: 'сказала', ono: 'сказало', my: 'сказали', vy: 'сказали', oni: 'сказали' },
    },
    future: {
      sk: { ja: 'budem povedať', ty: 'budeš povedať', on: 'bude povedať', ona: 'bude povedať', ono: 'bude povedať', my: 'budeme povedať', vy: 'budete povedať', oni: 'budú povedať' },
      ru: { ja: 'буду сказать', ty: 'будешь сказать', on: 'будет сказать', ona: 'будет сказать', ono: 'будет сказать', my: 'будем сказать', vy: 'будете сказать', oni: 'будут сказать' },
    },
  },
  {
    id: 'pocuvat',
    infinitiveSk: 'počúvať',
    infinitiveRu: 'слушать',
    present: {
      sk: { ja: 'počúvam', ty: 'počúvaš', on: 'počúva', ona: 'počúva', ono: 'počúva', my: 'počúvame', vy: 'počúvate', oni: 'počúvajú' },
      ru: { ja: 'слушаю', ty: 'слушаешь', on: 'слушает', ona: 'слушает', ono: 'слушает', my: 'слушаем', vy: 'слушаете', oni: 'слушают' },
    },
    past: {
      sk: { ja: 'som počúval', ty: 'si počúval', on: 'počúval', ona: 'počúvala', ono: 'počúvalo', my: 'sme počúvali', vy: 'ste počúvali', oni: 'počúvali' },
      ru: { ja: 'слушал', ty: 'слушал', on: 'слушал', ona: 'слушала', ono: 'слушало', my: 'слушали', vy: 'слушали', oni: 'слушали' },
    },
    future: {
      sk: { ja: 'budem počúvať', ty: 'budeš počúvať', on: 'bude počúvať', ona: 'bude počúvať', ono: 'bude počúvať', my: 'budeme počúvať', vy: 'budete počúvať', oni: 'budú počúvať' },
      ru: { ja: 'буду слушать', ty: 'будешь слушать', on: 'будет слушать', ona: 'будет слушать', ono: 'будет слушать', my: 'будем слушать', vy: 'будете слушать', oni: 'будут слушать' },
    },
  },
  {
    id: 'pocut',
    infinitiveSk: 'počuť',
    infinitiveRu: 'слышать',
    present: {
      sk: { ja: 'počujem', ty: 'počuješ', on: 'počuje', ona: 'počuje', ono: 'počuje', my: 'počujeme', vy: 'počujete', oni: 'počujú' },
      ru: { ja: 'слышу', ty: 'слышишь', on: 'слышит', ona: 'слышит', ono: 'слышит', my: 'слышим', vy: 'слышите', oni: 'слышат' },
    },
    past: {
      sk: { ja: 'som počul', ty: 'si počul', on: 'počul', ona: 'počula', ono: 'počulo', my: 'sme počuli', vy: 'ste počuli', oni: 'počuli' },
      ru: { ja: 'слышал', ty: 'слышал', on: 'слышал', ona: 'слышала', ono: 'слышало', my: 'слышали', vy: 'слышали', oni: 'слышали' },
    },
    future: {
      sk: { ja: 'budem počuť', ty: 'budeš počuť', on: 'bude počuť', ona: 'bude počuť', ono: 'bude počuť', my: 'budeme počuť', vy: 'budete počuť', oni: 'budú počuť' },
      ru: { ja: 'буду слышать', ty: 'будешь слышать', on: 'будет слышать', ona: 'будет слышать', ono: 'будет слышать', my: 'будем слышать', vy: 'будете слышать', oni: 'будут слышать' },
    },
  },
  {
    id: 'pozerat_sa',
    infinitiveSk: 'pozerať sa',
    infinitiveRu: 'смотреть',
    present: {
      sk: { ja: 'pozerám sa', ty: 'pozeráš sa', on: 'pozerá sa', ona: 'pozerá sa', ono: 'pozerá sa', my: 'pozeráme sa', vy: 'pozeráte sa', oni: 'pozerajú sa' },
      ru: { ja: 'смотрю', ty: 'смотришь', on: 'смотрит', ona: 'смотрит', ono: 'смотрит', my: 'смотрим', vy: 'смотрите', oni: 'смотрят' },
    },
    past: {
      sk: { ja: 'som sa pozeral', ty: 'si sa pozeral', on: 'pozeral sa', ona: 'pozerala sa', ono: 'pozeralo sa', my: 'sme sa pozerali', vy: 'ste sa pozerali', oni: 'pozerali sa' },
      ru: { ja: 'смотрел', ty: 'смотрел', on: 'смотрел', ona: 'смотрела', ono: 'смотрело', my: 'смотрели', vy: 'смотрели', oni: 'смотрели' },
    },
    future: {
      sk: { ja: 'budem sa pozerať', ty: 'budeš sa pozerať', on: 'bude sa pozerať', ona: 'bude sa pozerať', ono: 'bude sa pozerať', my: 'budeme sa pozerať', vy: 'budete sa pozerať', oni: 'budú sa pozerať' },
      ru: { ja: 'буду смотреть', ty: 'будешь смотреть', on: 'будет смотреть', ona: 'будет смотреть', ono: 'будет смотреть', my: 'будем смотреть', vy: 'будете смотреть', oni: 'будут смотреть' },
    },
  },
  {
    id: 'pytat_sa',
    infinitiveSk: 'pýtať sa',
    infinitiveRu: 'спрашивать',
    present: {
      sk: { ja: 'pýtam sa', ty: 'pýtaš sa', on: 'pýta sa', ona: 'pýta sa', ono: 'pýta sa', my: 'pýtame sa', vy: 'pýtate sa', oni: 'pýtajú sa' },
      ru: { ja: 'спрашиваю', ty: 'спрашиваешь', on: 'спрашивает', ona: 'спрашивает', ono: 'спрашивает', my: 'спрашиваем', vy: 'спрашиваете', oni: 'спрашивают' },
    },
    past: {
      sk: { ja: 'som sa pýtal', ty: 'si sa pýtal', on: 'pýtal sa', ona: 'pýtala sa', ono: 'pýtalo sa', my: 'sme sa pýtali', vy: 'ste sa pýtali', oni: 'pýtali sa' },
      ru: { ja: 'спрашивал', ty: 'спрашивал', on: 'спрашивал', ona: 'спрашивала', ono: 'спрашивало', my: 'спрашивали', vy: 'спрашивали', oni: 'спрашивали' },
    },
    future: {
      sk: { ja: 'budem sa pýtať', ty: 'budeš sa pýtať', on: 'bude sa pýtať', ona: 'bude sa pýtať', ono: 'bude sa pýtať', my: 'budeme sa pýtať', vy: 'budete sa pýtať', oni: 'budú sa pýtať' },
      ru: { ja: 'буду спрашивать', ty: 'будешь спрашивать', on: 'будет спрашивать', ona: 'будет спрашивать', ono: 'будет спрашивать', my: 'будем спрашивать', vy: 'будете спрашивать', oni: 'будут спрашивать' },
    },
  },
  {
    id: 'stavat',
    infinitiveSk: 'stavať',
    infinitiveRu: 'ставить',
    present: {
      sk: { ja: 'staviam', ty: 'staviaš', on: 'stavia', ona: 'stavia', ono: 'stavia', my: 'staviame', vy: 'staviate', oni: 'stavajú' },
      ru: { ja: 'ставлю', ty: 'ставишь', on: 'ставит', ona: 'ставит', ono: 'ставит', my: 'ставим', vy: 'ставите', oni: 'ставят' },
    },
    past: {
      sk: { ja: 'som staval', ty: 'si staval', on: 'staval', ona: 'stavala', ono: 'stavalo', my: 'sme stavali', vy: 'ste stavali', oni: 'stavali' },
      ru: { ja: 'ставил', ty: 'ставил', on: 'ставил', ona: 'ставила', ono: 'ставило', my: 'ставили', vy: 'ставили', oni: 'ставили' },
    },
    future: {
      sk: { ja: 'budem stavať', ty: 'budeš stavať', on: 'bude stavať', ona: 'bude stavať', ono: 'bude stavať', my: 'budeme stavať', vy: 'budete stavať', oni: 'budú stavať' },
      ru: { ja: 'буду ставить', ty: 'будешь ставить', on: 'будет ставить', ona: 'будет ставить', ono: 'будет ставить', my: 'будем ставить', vy: 'будете ставить', oni: 'будут ставить' },
    },
  },
  {
    id: 'klast',
    infinitiveSk: 'klásť',
    infinitiveRu: 'класть',
    present: {
      sk: { ja: 'kladiem', ty: 'kladieš', on: 'kladie', ona: 'kladie', ono: 'kladie', my: 'kladieme', vy: 'kladiete', oni: 'kladú' },
      ru: { ja: 'кладу', ty: 'кладёшь', on: 'кладёт', ona: 'кладёт', ono: 'кладёт', my: 'кладём', vy: 'кладёте', oni: 'кладут' },
    },
    past: {
      sk: { ja: 'som kládol', ty: 'si kládol', on: 'kládol', ona: 'kládla', ono: 'kládlo', my: 'sme kládli', vy: 'ste kládli', oni: 'kládli' },
      ru: { ja: 'клал', ty: 'клал', on: 'клал', ona: 'клала', ono: 'клало', my: 'клали', vy: 'клали', oni: 'клали' },
    },
    future: {
      sk: { ja: 'budem klásť', ty: 'budeš klásť', on: 'bude klásť', ona: 'bude klásť', ono: 'bude klásť', my: 'budeme klásť', vy: 'budete klásť', oni: 'budú klásť' },
      ru: { ja: 'буду класть', ty: 'будешь класть', on: 'будет класть', ona: 'будет класть', ono: 'будет класть', my: 'будем класть', vy: 'будете класть', oni: 'будут класть' },
    },
  },
  {
    id: 'tancovat',
    infinitiveSk: 'tancovať',
    infinitiveRu: 'танцевать',
    present: {
      sk: { ja: 'tancujem', ty: 'tancuješ', on: 'tancuje', ona: 'tancuje', ono: 'tancuje', my: 'tancujeme', vy: 'tancujete', oni: 'tancujú' },
      ru: { ja: 'танцую', ty: 'танцуешь', on: 'танцует', ona: 'танцует', ono: 'танцует', my: 'танцуем', vy: 'танцуете', oni: 'танцуют' },
    },
    past: {
      sk: { ja: 'som tancoval', ty: 'si tancoval', on: 'tancoval', ona: 'tancovala', ono: 'tancovalo', my: 'sme tancovali', vy: 'ste tancovali', oni: 'tancovali' },
      ru: { ja: 'танцевал', ty: 'танцевал', on: 'танцевал', ona: 'танцевала', ono: 'танцевало', my: 'танцевали', vy: 'танцевали', oni: 'танцевали' },
    },
    future: {
      sk: { ja: 'budem tancovať', ty: 'budeš tancovať', on: 'bude tancovať', ona: 'bude tancovať', ono: 'bude tancovať', my: 'budeme tancovať', vy: 'budete tancovať', oni: 'budú tancovať' },
      ru: { ja: 'буду танцевать', ty: 'будешь танцевать', on: 'будет танцевать', ona: 'будет танцевать', ono: 'будет танцевать', my: 'будем танцевать', vy: 'будете танцевать', oni: 'будут танцевать' },
    },
  },
  {
    id: 'stracat',
    infinitiveSk: 'strácať',
    infinitiveRu: 'терять',
    present: {
      sk: { ja: 'strácam', ty: 'strácaš', on: 'stráca', ona: 'stráca', ono: 'stráca', my: 'strácame', vy: 'strácate', oni: 'strácajú' },
      ru: { ja: 'теряю', ty: 'теряешь', on: 'теряет', ona: 'теряет', ono: 'теряет', my: 'теряем', vy: 'теряете', oni: 'теряют' },
    },
    past: {
      sk: { ja: 'som strácal', ty: 'si strácal', on: 'strácal', ona: 'strácala', ono: 'strácalo', my: 'sme strácali', vy: 'ste strácali', oni: 'strácali' },
      ru: { ja: 'терял', ty: 'терял', on: 'терял', ona: 'теряла', ono: 'теряло', my: 'теряли', vy: 'теряли', oni: 'теряли' },
    },
    future: {
      sk: { ja: 'budem strácať', ty: 'budeš strácať', on: 'bude strácať', ona: 'bude strácať', ono: 'bude strácať', my: 'budeme strácať', vy: 'budete strácať', oni: 'budú strácať' },
      ru: { ja: 'буду терять', ty: 'будешь терять', on: 'будет терять', ona: 'будет терять', ono: 'будет терять', my: 'будем терять', vy: 'будете терять', oni: 'будут терять' },
    },
  },
  {
    id: 'respektovat',
    infinitiveSk: 'rešpektovať',
    infinitiveRu: 'уважать',
    present: {
      sk: { ja: 'rešpektujem', ty: 'rešpektuješ', on: 'rešpektuje', ona: 'rešpektuje', ono: 'rešpektuje', my: 'rešpektujeme', vy: 'rešpektujete', oni: 'rešpektujú' },
      ru: { ja: 'уважаю', ty: 'уважаешь', on: 'уважает', ona: 'уважает', ono: 'уважает', my: 'уважаем', vy: 'уважаете', oni: 'уважают' },
    },
    past: {
      sk: { ja: 'som rešpektoval', ty: 'si rešpektoval', on: 'rešpektoval', ona: 'rešpektovala', ono: 'rešpektovalo', my: 'sme rešpektovali', vy: 'ste rešpektovali', oni: 'rešpektovali' },
      ru: { ja: 'уважал', ty: 'уважал', on: 'уважал', ona: 'уважала', ono: 'уважало', my: 'уважали', vy: 'уважали', oni: 'уважали' },
    },
    future: {
      sk: { ja: 'budem rešpektovať', ty: 'budeš rešpektovať', on: 'bude rešpektovať', ona: 'bude rešpektovať', ono: 'bude rešpektovať', my: 'budeme rešpektovať', vy: 'budete rešpektovať', oni: 'budú rešpektovať' },
      ru: { ja: 'буду уважать', ty: 'будешь уважать', on: 'будет уважать', ona: 'будет уважать', ono: 'будет уважать', my: 'будем уважать', vy: 'будете уважать', oni: 'будут уважать' },
    },
  },
  {
    id: 'umierat',
    infinitiveSk: 'umierať',
    infinitiveRu: 'умирать',
    present: {
      sk: { ja: 'umieram', ty: 'umieraš', on: 'umiera', ona: 'umiera', ono: 'umiera', my: 'umierame', vy: 'umierate', oni: 'umierajú' },
      ru: { ja: 'умираю', ty: 'умираешь', on: 'умирает', ona: 'умирает', ono: 'умирает', my: 'умираем', vy: 'умираете', oni: 'умирают' },
    },
    past: {
      sk: { ja: 'som umieral', ty: 'si umieral', on: 'umieral', ona: 'umierala', ono: 'umieralo', my: 'sme umierali', vy: 'ste umierali', oni: 'umierali' },
      ru: { ja: 'умирал', ty: 'умирал', on: 'умирал', ona: 'умирала', ono: 'умирало', my: 'умирали', vy: 'умирали', oni: 'умирали' },
    },
    future: {
      sk: { ja: 'budem umierať', ty: 'budeš umierať', on: 'bude umierať', ona: 'bude umierať', ono: 'bude umierať', my: 'budeme umierať', vy: 'budete umierať', oni: 'budú umierať' },
      ru: { ja: 'буду умирать', ty: 'будешь умирать', on: 'будет умирать', ona: 'будет умирать', ono: 'будет умирать', my: 'будем умирать', vy: 'будете умирать', oni: 'будут умирать' },
    },
  },
  {
    id: 'ucit_sa',
    infinitiveSk: 'učiť sa',
    infinitiveRu: 'учиться',
    present: {
      sk: { ja: 'učím sa', ty: 'učíš sa', on: 'učí sa', ona: 'učí sa', ono: 'učí sa', my: 'učíme sa', vy: 'učíte sa', oni: 'učia sa' },
      ru: { ja: 'учусь', ty: 'учишься', on: 'учится', ona: 'учится', ono: 'учится', my: 'учимся', vy: 'учитесь', oni: 'учатся' },
    },
    past: {
      sk: { ja: 'som sa učil', ty: 'si sa učil', on: 'učil sa', ona: 'učila sa', ono: 'učilo sa', my: 'sme sa učili', vy: 'ste sa učili', oni: 'učili sa' },
      ru: { ja: 'учился', ty: 'учился', on: 'учился', ona: 'училась', ono: 'училось', my: 'учились', vy: 'учились', oni: 'учились' },
    },
    future: {
      sk: { ja: 'budem sa učiť', ty: 'budeš sa učiť', on: 'bude sa učiť', ona: 'bude sa učiť', ono: 'bude sa učiť', my: 'budeme sa učiť', vy: 'budete sa učiť', oni: 'budú sa učiť' },
      ru: { ja: 'буду учиться', ty: 'будешь учиться', on: 'будет учиться', ona: 'будет учиться', ono: 'будет учиться', my: 'будем учиться', vy: 'будете учиться', oni: 'будут учиться' },
    },
  },
  {
    id: 'citit',
    infinitiveSk: 'cítiť',
    infinitiveRu: 'чувствовать',
    present: {
      sk: { ja: 'cítim', ty: 'cítiš', on: 'cíti', ona: 'cíti', ono: 'cíti', my: 'cítime', vy: 'cítite', oni: 'cítia' },
      ru: { ja: 'чувствую', ty: 'чувствуешь', on: 'чувствует', ona: 'чувствует', ono: 'чувствует', my: 'чувствуем', vy: 'чувствуете', oni: 'чувствуют' },
    },
    past: {
      sk: { ja: 'som cítil', ty: 'si cítil', on: 'cítil', ona: 'cítila', ono: 'cítilo', my: 'sme cítili', vy: 'ste cítili', oni: 'cítili' },
      ru: { ja: 'чувствовал', ty: 'чувствовал', on: 'чувствовал', ona: 'чувствовала', ono: 'чувствовало', my: 'чувствовали', vy: 'чувствовали', oni: 'чувствовали' },
    },
    future: {
      sk: { ja: 'budem cítiť', ty: 'budeš cítiť', on: 'bude cítiť', ona: 'bude cítiť', ono: 'bude cítiť', my: 'budeme cítiť', vy: 'budete cítiť', oni: 'budú cítiť' },
      ru: { ja: 'буду чувствовать', ty: 'будешь чувствовать', on: 'будет чувствовать', ona: 'будет чувствовать', ono: 'будет чувствовать', my: 'будем чувствовать', vy: 'будете чувствовать', oni: 'будут чувствовать' },
    },
  },
]

export interface VerbPhrase {
  verbId: string
  infinitiveSk: string
  pronoun: Pronoun
  tense: Tense
  promptRu: string
  answerSk: string
}

export function buildPhrase(verb: VerbEntry, pronoun: Pronoun, tense: Tense): VerbPhrase {
  const conj = verb[tense]
  return {
    verbId: verb.id,
    infinitiveSk: verb.infinitiveSk,
    pronoun,
    tense,
    promptRu: `${PRONOUN_RU[pronoun]} ${conj.ru[pronoun]}`,
    answerSk: conj.sk[pronoun],
  }
}
