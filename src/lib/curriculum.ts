// ============================================================
// Zapphi — DepEd Grade 3 Curriculum (K-12 Philippines)
// Based on the DepEd Curriculum Guides for Grade 3
// ============================================================

export type SubjectId = 'math' | 'english' | 'filipino' | 'science' | 'ap'

export interface Topic {
  id: string
  name: string
  nameTaglish: string
  emoji: string
  description: string
}

export interface Subject {
  id: SubjectId
  name: string
  nameFilipino: string
  emoji: string
  color: string
  bgColor: string
  topics: Topic[]
}

export const CURRICULUM: Record<SubjectId, Subject> = {
  math: {
    id: 'math',
    name: 'Mathematics',
    nameFilipino: 'Matematika',
    emoji: '🔢',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-100',
    topics: [
      { id: 'numbers', name: 'Numbers to 10,000', nameTaglish: 'Mga Bilang hanggang 10,000', emoji: '🔢', description: 'Reading, writing, and comparing numbers up to ten thousand' },
      { id: 'addition', name: 'Addition with Regrouping', nameTaglish: 'Pagdaragdag na may Regrouping', emoji: '➕', description: 'Adding 3-4 digit numbers with regrouping' },
      { id: 'subtraction', name: 'Subtraction with Regrouping', nameTaglish: 'Pagbabawas na may Regrouping', emoji: '➖', description: 'Subtracting numbers with regrouping' },
      { id: 'multiplication', name: 'Multiplication (1-5 Tables)', nameTaglish: 'Multiplikasyon (Talahanayan 1-5)', emoji: '✖️', description: 'Multiplication tables from 1 to 5' },
      { id: 'division', name: 'Division Basics', nameTaglish: 'Pangunahing Pagbabahagi', emoji: '➗', description: 'Basic division concepts and facts' },
      { id: 'fractions', name: 'Fractions (½, ¼, ¾)', nameTaglish: 'Mga Praksyon', emoji: '🍕', description: 'Understanding halves, quarters, and three-quarters' },
      { id: 'money', name: 'Money and Prices', nameTaglish: 'Pera at Halaga', emoji: '💰', description: 'Philippine peso coins and bills, counting money' },
      { id: 'time', name: 'Telling Time', nameTaglish: 'Pagbabasa ng Oras', emoji: '🕐', description: 'Reading clocks, days, weeks, months' },
      { id: 'measurement', name: 'Measurement', nameTaglish: 'Pagsukat', emoji: '📏', description: 'Length, weight, and capacity using standard units' },
      { id: 'geometry', name: 'Shapes and Figures', nameTaglish: 'Mga Hugis at Pigura', emoji: '🔷', description: 'Plane figures and solid figures' },
    ]
  },

  english: {
    id: 'english',
    name: 'English',
    nameFilipino: 'Ingles',
    emoji: '📖',
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-100',
    topics: [
      { id: 'nouns', name: 'Nouns', nameTaglish: 'Mga Noun (Pangngalan)', emoji: '🏠', description: 'Common nouns, proper nouns, collective nouns' },
      { id: 'verbs', name: 'Verbs', nameTaglish: 'Mga Verb (Pandiwa)', emoji: '🏃', description: 'Action words and describing what people do' },
      { id: 'adjectives', name: 'Adjectives', nameTaglish: 'Mga Adjective (Pang-uri)', emoji: '🌈', description: 'Describing words for size, color, shape, taste' },
      { id: 'pronouns', name: 'Pronouns', nameTaglish: 'Mga Pronoun (Panghalip)', emoji: '👤', description: 'I, you, he, she, it, we, they' },
      { id: 'sentences', name: 'Complete Sentences', nameTaglish: 'Kumpletong Pangungusap', emoji: '✍️', description: 'Subject, predicate, and forming complete sentences' },
      { id: 'reading', name: 'Reading Comprehension', nameTaglish: 'Pag-unawa sa Binasa', emoji: '📚', description: 'Understanding stories and informational texts' },
      { id: 'vocabulary', name: 'Vocabulary', nameTaglish: 'Bokabularyo', emoji: '📝', description: 'Synonyms, antonyms, and word meanings' },
      { id: 'phonics', name: 'Phonics & Spelling', nameTaglish: 'Poniks at Ispeling', emoji: '🔤', description: 'Letter sounds, blends, and correct spelling' },
    ]
  },

  filipino: {
    id: 'filipino',
    name: 'Filipino',
    nameFilipino: 'Filipino',
    emoji: '🇵🇭',
    color: 'from-red-400 to-yellow-500',
    bgColor: 'bg-red-100',
    topics: [
      { id: 'pangngalan', name: 'Pangngalan', nameTaglish: 'Pangngalan (Nouns)', emoji: '🏡', description: 'Mga uri ng pangngalan: pantangi, pambalana, kolektibo' },
      { id: 'pandiwa', name: 'Pandiwa', nameTaglish: 'Pandiwa (Verbs)', emoji: '🤸', description: 'Mga kilos at gawain, pokus ng pandiwa' },
      { id: 'pang-uri', name: 'Pang-uri', nameTaglish: 'Pang-uri (Adjectives)', emoji: '🎨', description: 'Paglalarawan ng tao, bagay, at lugar' },
      { id: 'panghalip', name: 'Panghalip', nameTaglish: 'Panghalip (Pronouns)', emoji: '👥', description: 'Ako, ikaw, siya, kami, tayo, kayo, sila' },
      { id: 'pagbabasa', name: 'Pagbabasa at Pag-unawa', nameTaglish: 'Reading and Comprehension', emoji: '📖', description: 'Pag-unawa sa binasang kwento at impormasyon' },
      { id: 'pagsulat', name: 'Pagsusulat', nameTaglish: 'Writing', emoji: '✏️', description: 'Pagsulat ng pangungusap at maikling kwento' },
      { id: 'bokabularyo', name: 'Talasalitaan', nameTaglish: 'Vocabulary', emoji: '📔', description: 'Mga salitang magkasingkahulugan at magkasalungat' },
      { id: 'tayutay', name: 'Tayutay', nameTaglish: 'Figurative Language', emoji: '🌟', description: 'Simile, metapora, at iba pang tayutay' },
    ]
  },

  science: {
    id: 'science',
    name: 'Science',
    nameFilipino: 'Agham',
    emoji: '🔬',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-100',
    topics: [
      { id: 'plants', name: 'Plants and Their Parts', nameTaglish: 'Mga Halaman at Kanilang Bahagi', emoji: '🌱', description: 'Parts of a plant, photosynthesis basics, plant needs' },
      { id: 'animals', name: 'Animals and Their Habitats', nameTaglish: 'Mga Hayop at Kanilang Tirahan', emoji: '🦁', description: 'Types of animals, habitats, and animal needs' },
      { id: 'matter', name: 'Properties of Matter', nameTaglish: 'Katangian ng Bagay', emoji: '⚗️', description: 'Solid, liquid, gas — properties and changes' },
      { id: 'light', name: 'Light and Shadow', nameTaglish: 'Liwanag at Anino', emoji: '💡', description: 'Sources of light, reflection, and shadows' },
      { id: 'sound', name: 'Sound and Music', nameTaglish: 'Tunog at Musika', emoji: '🔊', description: 'Sources of sound, loud and soft, pitch' },
      { id: 'weather', name: 'Weather and Climate', nameTaglish: 'Panahon at Klima', emoji: '⛅', description: 'Types of weather, seasons in the Philippines' },
      { id: 'soil', name: 'Soil and Earth Materials', nameTaglish: 'Lupa at Materyales sa Mundo', emoji: '🪨', description: 'Types of soil, rocks, and earth materials' },
      { id: 'health', name: 'Health and Body', nameTaglish: 'Kalusugan at Katawan', emoji: '💪', description: 'Body parts, healthy habits, and personal hygiene' },
    ]
  },

  ap: {
    id: 'ap',
    name: 'Araling Panlipunan',
    nameFilipino: 'Araling Panlipunan',
    emoji: '🌍',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-100',
    topics: [
      { id: 'pamilya', name: 'Pamilya at Pag-aasawa', nameTaglish: 'Family and Relationships', emoji: '👨‍👩‍👧‍👦', description: 'Mga miyembro ng pamilya, tungkulin, at halaga' },
      { id: 'pamayanan', name: 'Pamayanan', nameTaglish: 'Community', emoji: '🏘️', description: 'Rural at urban na pamayanan, lugar, at serbisyo' },
      { id: 'pamahalaan', name: 'Lokal na Pamahalaan', nameTaglish: 'Local Government', emoji: '🏛️', description: 'Barangay, munisipalidad, lalawigan, at kanilang mga opisyal' },
      { id: 'kasaysayan', name: 'Kasaysayan ng Pilipinas', nameTaglish: 'Philippine History', emoji: '📜', description: 'Maagang kasaysayan ng Pilipinas at mga bayani' },
      { id: 'heograpiya', name: 'Heograpiya ng Pilipinas', nameTaglish: 'Philippine Geography', emoji: '🗺️', description: 'Mapa ng Pilipinas, mga pulo, kabundukan, at dagat' },
      { id: 'kultura', name: 'Kultura at Tradisyon', nameTaglish: 'Culture and Traditions', emoji: '🎭', description: 'Mga pagdiriwang, tradisyon, at kultura ng Pilipinas' },
      { id: 'kalikasan', name: 'Pangangalaga sa Kalikasan', nameTaglish: 'Environmental Care', emoji: '🌿', description: 'Pag-aalaga ng kapaligiran at likas na yaman' },
    ]
  }
}

export const SUBJECT_ORDER: SubjectId[] = ['math', 'english', 'filipino', 'science', 'ap']

export function getSubject(id: SubjectId): Subject {
  return CURRICULUM[id]
}

export function getTopic(subjectId: SubjectId, topicId: string): Topic | undefined {
  return CURRICULUM[subjectId]?.topics.find(t => t.id === topicId)
}
