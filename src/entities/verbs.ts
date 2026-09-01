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
    answerSk: `${PRONOUN_SK[pronoun]} ${conj.sk[pronoun]}`,
  }
}
