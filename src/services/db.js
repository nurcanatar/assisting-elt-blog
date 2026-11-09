/**
 * assisting-elt-blog Merkezi Kalıcı Veri Tabanı Servisi (LocalStorage & Relational Model)
 * 
 * Tablolar:
 * - users: Öğretmen (nurcanelci / 123456) ve Kayıtlı Öğrenciler
 * - activities: Öğrencilerin sitede yaptığı hareketler (oyunlar, testler, ziyaretler)
 * - messages: Öğretmen-öğrenci ve öğrenci-öğrenci mesajları (Öğretmen denetiminde)
 * - homeworks: Öğretmenin verdiği ödevler
 * - submissions: Öğrencilerin teslim ettiği ve öğretmenin puanladığı ödevler
 * - teacher_plans: Yıllık planlar, ders modülleri ve haftalık program
 */

const DB_KEYS = {
  USERS: 'assisting_db_users',
  ACTIVITIES: 'assisting_db_activities',
  MESSAGES: 'assisting_db_messages',
  HOMEWORKS: 'assisting_db_homeworks',
  SUBMISSIONS: 'assisting_db_submissions',
  TEACHER_PLANS: 'assisting_db_teacher_plans',
  CURRENT_USER: 'assisting_db_current_user'
};

// Başlangıç Seed Verileri
const INITIAL_USERS = [
  {
    id: 'teacher-1',
    username: 'nurcanelci',
    password: '123456',
    role: 'teacher',
    name: 'Nurcan Elçi',
    title: 'İngilizce Öğretmeni & Zümre Başkanı',
    school: 'Cumhuriyet Ortaokulu',
    email: 'nurcanelci@okul.meb.k12.tr',
    officeHours: 'Salı & Perşembe 10:00 - 11:30',
    bio: 'Öğrencilerime İngilizceyi sevdiren, iletişimsel ve dijital materyallerle zenginleştirilmiş dil eğitimini benimseyen ELT eğitimcisi.',
    quote: 'The limits of my language mean the limits of my world. — Ludwig Wittgenstein',
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'student-demo-1',
    username: 'zeynep_y',
    password: '123456',
    role: 'student',
    name: 'Zeynep Yıldız',
    grade: '8',
    createdAt: '2026-09-10T10:30:00.000Z'
  },
  {
    id: 'student-demo-2',
    username: 'ali_kaya',
    password: '123456',
    role: 'student',
    name: 'Ali Kaya',
    grade: '7',
    createdAt: '2026-09-12T14:15:00.000Z'
  },
  {
    id: 'student-demo-3',
    username: 'elif_demir',
    password: '123456',
    role: 'student',
    name: 'Elif Demir',
    grade: '6',
    createdAt: '2026-09-15T09:00:00.000Z'
  }
];

const INITIAL_TEACHER_PLANS = {
  annualPlans: [
    {
      id: 'plan-5',
      grade: '5. Sınıf',
      title: '5. Sınıf MEB İngilizce Yıllık Planı (2026-2027)',
      units: [
        { no: 1, name: 'Hello!', duration: '4 Hafta', focus: 'Greeting, countries, nationalities, likes/dislikes' },
        { no: 2, name: 'My Town', duration: '4 Hafta', focus: 'Giving directions, public buildings, prepositions' },
        { no: 3, name: 'Games and Hobbies', duration: '4 Hafta', focus: 'Can/can’t, hobbies, expressing abilities' },
        { no: 4, name: 'My Daily Routine', duration: '4 Hafta', focus: 'Telling the time, daily habits, simple present' },
        { no: 5, name: 'Health', duration: '4 Hafta', focus: 'Illnesses, should/shouldn’t, giving advice' }
      ]
    },
    {
      id: 'plan-6',
      grade: '6. Sınıf',
      title: '6. Sınıf MEB İngilizce Yıllık Planı (2026-2027)',
      units: [
        { no: 1, name: 'Life', duration: '4 Hafta', focus: 'Daily routines, telling dates and time, after-school habits' },
        { no: 2, name: 'Yummy Breakfast', duration: '4 Hafta', focus: 'Food & drinks, expressing likes/dislikes, some/any' },
        { no: 3, name: 'Downtown', duration: '4 Hafta', focus: 'Present Continuous, comparing city and village life' },
        { no: 4, name: 'Weather and Emotions', duration: '4 Hafta', focus: 'Weather conditions, describing feelings, adjectives' },
        { no: 5, name: 'At the Fair', duration: '4 Hafta', focus: 'Fair rides, expressing opinions, agreeing/disagreeing' }
      ]
    },
    {
      id: 'plan-7',
      grade: '7. Sınıf',
      title: '7. Sınıf MEB İngilizce Yıllık Planı (2026-2027)',
      units: [
        { no: 1, name: 'Appearance and Personality', duration: '4 Hafta', focus: 'Physical appearance, personality adjectives, comparatives' },
        { no: 2, name: 'Sports', duration: '4 Hafta', focus: 'Types of sports, frequency adverbs, simple present tense' },
        { no: 3, name: 'Biographies', duration: '4 Hafta', focus: 'Simple Past tense, talking about past events & historical figures' },
        { no: 4, name: 'Wild Animals', duration: '4 Hafta', focus: 'Wildlife, should/shouldn’t for animal protection' },
        { no: 5, name: 'Television', duration: '4 Hafta', focus: 'TV programmes, prefer, giving explanations' }
      ]
    },
    {
      id: 'plan-8',
      grade: '8. Sınıf',
      title: '8. Sınıf LGS Hazırlık İngilizce Yıllık Planı (2026-2027)',
      units: [
        { no: 1, name: 'Friendship', duration: '4 Hafta', focus: 'Accepting/refusing, making excuses, personal qualities' },
        { no: 2, name: 'Teen Life', duration: '4 Hafta', focus: 'Daily routines of teens, music genres, preferences' },
        { no: 3, name: 'In the Kitchen', duration: '4 Hafta', focus: 'Cooking processes, ingredients, sequence words (First, Next)' },
        { no: 4, name: 'On the Phone', duration: '4 Hafta', focus: 'Phone conversation phrases, leaving messages, future intentions' },
        { no: 5, name: 'The Internet', duration: '4 Hafta', focus: 'Internet safety, social media vocabulary, asking for clarification' }
      ]
    }
  ],
  modules: [
    { id: 'mod-1', title: 'LGS Soru Çözüm Stratejileri Modülü', grade: '8. Sınıf', status: 'Aktif', filesCount: 12 },
    { id: 'mod-2', title: 'İnteraktif Wordwall & Dijital Oyun Modülü', grade: '5-8. Sınıf', status: 'Aktif', filesCount: 24 },
    { id: 'mod-3', title: 'Dinleme ve Konuşma Etkinlik Modülü', grade: '6-7. Sınıf', status: 'Aktif', filesCount: 16 }
  ],
  dailyActivities: [
    { id: 'act-1', time: '08:40', classCode: '8/A', topic: 'Friendship Unit 1 - LGS Paragraf Çözümü', room: 'Derslik 12' },
    { id: 'act-2', time: '09:35', classCode: '8/B', topic: 'Friendship Unit 1 - Kelime Eşleştirme & Kahoot', room: 'Derslik 14' },
    { id: 'act-3', time: '11:15', classCode: '7/C', topic: 'Biographies Unit 3 - Simple Past Tense Speaking Drills', room: 'Derslik 8' },
    { id: 'act-4', time: '13:00', classCode: '5/A', topic: 'Hello Unit 1 - Ülke ve Milliyetler Wordwall Oyunu', room: 'Dil Laboratuvarı' }
  ],
  timetable: {
    'Pazartesi': [
      { period: 1, time: '08:40 - 09:20', classCode: '8/A', topic: 'Friendship - Soru Çözümü', room: 'D-12' },
      { period: 2, time: '09:35 - 10:15', classCode: '8/A', topic: 'LGS Paragraf Analizi', room: 'D-12' },
      { period: 3, time: '10:30 - 11:10', classCode: '6/B', topic: 'Life - Daily Routines', room: 'D-9' },
      { period: 4, time: '11:25 - 12:05', classCode: '6/B', topic: 'Telling Time Activity', room: 'D-9' }
    ],
    'Salı': [
      { period: 1, time: '08:40 - 09:20', classCode: '7/C', topic: 'Biographies - Past Tense', room: 'D-8' },
      { period: 2, time: '09:35 - 10:15', classCode: '7/C', topic: 'Historical Figures Reading', room: 'D-8' },
      { period: 3, time: '10:30 - 11:10', classCode: '8/B', topic: 'Teen Life - Music Genres', room: 'D-14' },
      { period: 4, time: '11:25 - 12:05', classCode: '8/B', topic: 'Expressing Preferences', room: 'D-14' }
    ],
    'Çarşamba': [
      { period: 1, time: '08:40 - 09:20', classCode: '5/A', topic: 'Hello! - Greetings & Countries', room: 'Dil Lab' },
      { period: 2, time: '09:35 - 10:15', classCode: '5/A', topic: 'Nationalities Flashcards', room: 'Dil Lab' },
      { period: 3, time: '10:30 - 11:10', classCode: '7/B', topic: 'Sports - Frequency Adverbs', room: 'D-7' },
      { period: 4, time: '11:25 - 12:05', classCode: '7/B', topic: 'Outdoor vs Indoor Sports', room: 'D-7' }
    ],
    'Perşembe': [
      { period: 1, time: '08:40 - 09:20', classCode: '8/A', topic: 'In the Kitchen - Recipe Steps', room: 'D-12' },
      { period: 2, time: '09:35 - 10:15', classCode: '8/B', topic: 'On the Phone - Dialogue Practice', room: 'D-14' },
      { period: 3, time: '10:30 - 11:10', classCode: '6/A', topic: 'Yummy Breakfast - Food Vocabulary', room: 'D-10' }
    ],
    'Cuma': [
      { period: 1, time: '08:40 - 09:20', classCode: '5/B', topic: 'My Town - Giving Directions', room: 'Dil Lab' },
      { period: 2, time: '09:35 - 10:15', classCode: '5/B', topic: 'Prepositions of Place', room: 'Dil Lab' },
      { period: 3, time: '10:30 - 11:10', classCode: 'Zümre', topic: 'İngilizce Zümre Değerlendirmesi', room: 'Öğretmenler Odası' }
    ]
  }
};

const INITIAL_HOMEWORKS = [
  {
    id: 'hw-1',
    title: '8. Sınıf Unit 1: Friendship Kelime ve Diyalog Alıştırması',
    description: 'Kitabınızdaki Unit 1 Friendship kelimelerinden en az 10 tanesini seçerek her biriyle birer kabul etme (accepting) veya reddetme (refusing) cümlesi yazınız ve sisteme gönderiniz.',
    targetGrade: '8',
    targetStudentIds: 'all',
    dueDate: '2026-11-15',
    createdAt: '2026-11-05T09:00:00.000Z',
    maxScore: 100
  },
  {
    id: 'hw-2',
    title: '7. Sınıf Unit 3: Biographies - Tarihi Bir Şahsiyetin Biyografisi',
    description: 'Geçmişte yaşamış ünlü bir bilim insanı veya sanatçının (örn: Atatürk, Nikola Tesla, Marie Curie) hayatını anlatan 5 cümlelik Simple Past Tense paragrafı yazıp iletiniz.',
    targetGrade: '7',
    targetStudentIds: 'all',
    dueDate: '2026-11-18',
    createdAt: '2026-11-06T11:00:00.000Z',
    maxScore: 100
  }
];

const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-1',
    homeworkId: 'hw-1',
    studentId: 'student-demo-1',
    studentUsername: 'zeynep_y',
    studentName: 'Zeynep Yıldız',
    content: "Öğretmenim ödevimi hazırladım:\n1. Would you like to come to my party? - Sure, that sounds great! (Accepting)\n2. How about studying together? - I'd love to, but I have to help my mom. (Refusing)\n3. Are you doing anything on Saturday? - No, not at all.\n4. I can't accept your invitation because I am busy.",
    submittedAt: '2026-11-07T16:45:00.000Z',
    status: 'graded',
    score: 95,
    teacherFeedback: 'Harika bir çalışma Zeynep! Cümle yapıların ve kalıpların kullanımı son derece doğru. Tebrik ederim!',
    gradedAt: '2026-11-08T10:20:00.000Z'
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    senderId: 'student-demo-1',
    senderName: 'Zeynep Yıldız (zeynep_y)',
    senderRole: 'student',
    receiverId: 'teacher-1',
    receiverName: 'Nurcan Elçi',
    receiverRole: 'teacher',
    text: 'Hocam merhaba, 8. sınıf LGS deneme sınavı ne zaman yapılacak?',
    timestamp: '2026-11-08T14:30:00.000Z',
    read: true
  },
  {
    id: 'msg-2',
    senderId: 'teacher-1',
    senderName: 'Nurcan Elçi',
    senderRole: 'teacher',
    receiverId: 'student-demo-1',
    receiverName: 'Zeynep Yıldız (zeynep_y)',
    receiverRole: 'student',
    text: 'Merhaba Zeynep, deneme sınavımız önümüzdeki Çarşamba 2. derste yapılacak. Friendship ve Teen Life ünitelerine ağırlık ver lütfen.',
    timestamp: '2026-11-08T15:10:00.000Z',
    read: true
  },
  {
    id: 'msg-3',
    senderId: 'student-demo-2',
    senderName: 'Ali Kaya (ali_kaya)',
    senderRole: 'student',
    receiverId: 'student-demo-1',
    receiverName: 'Zeynep Yıldız (zeynep_y)',
    receiverRole: 'student',
    text: 'Zeynep, 7. ünitedeki Wordwall oyununu tamamladın mı? Skorum 90!',
    timestamp: '2026-11-08T16:00:00.000Z',
    read: true
  }
];

const INITIAL_ACTIVITIES = [
  {
    id: 'act-log-1',
    studentId: 'student-demo-1',
    studentUsername: 'zeynep_y',
    actionType: 'game_played',
    details: '8. Sınıf Friendship Wordwall Eşleştirme Oyunu tamamlandı. (Skor: 10/10)',
    timestamp: '2026-11-08T14:20:00.000Z'
  },
  {
    id: 'act-log-2',
    studentId: 'student-demo-1',
    studentUsername: 'zeynep_y',
    actionType: 'quiz_completed',
    details: 'Günün 5 Soruluk Mini Testi tamamlandı. Puan: 100/100',
    timestamp: '2026-11-08T14:25:00.000Z'
  },
  {
    id: 'act-log-3',
    studentId: 'student-demo-2',
    studentUsername: 'ali_kaya',
    actionType: 'material_viewed',
    details: '7. Sınıf Biographies PDF Çalışma Kağıdını indirdi.',
    timestamp: '2026-11-08T15:40:00.000Z'
  },
  {
    id: 'act-log-4',
    studentId: 'student-demo-2',
    studentUsername: 'ali_kaya',
    actionType: 'game_played',
    details: '7. Sınıf Sports Kahoot Quiz oynandı. (Skor: 85 Puan)',
    timestamp: '2026-11-08T15:55:00.000Z'
  }
];

// Helper: LocalStorage Get & Set
function getTable(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`DB read error for ${key}:`, err);
    return fallback;
  }
}

function setTable(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`DB write error for ${key}:`, err);
  }
}

// Database Initialization
export function initDB() {
  getTable(DB_KEYS.USERS, INITIAL_USERS);
  getTable(DB_KEYS.TEACHER_PLANS, INITIAL_TEACHER_PLANS);
  getTable(DB_KEYS.HOMEWORKS, INITIAL_HOMEWORKS);
  getTable(DB_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  getTable(DB_KEYS.MESSAGES, INITIAL_MESSAGES);
  getTable(DB_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
}

// ----------------------------------------------------------------------
// AUTH & USERS
// ----------------------------------------------------------------------

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(DB_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
  }
}

export function loginUser(username, password) {
  const users = getTable(DB_KEYS.USERS, INITIAL_USERS);
  const cleanUser = username.trim().toLowerCase();
  
  // Öğretmen kontrolü: nurcanelci / 123456
  if (cleanUser === 'nurcanelci' && password === '123456') {
    const teacher = users.find(u => u.username === 'nurcanelci') || INITIAL_USERS[0];
    setCurrentUser(teacher);
    return { success: true, user: teacher };
  }

  // Öğrenci kontrolü
  const found = users.find(
    u => u.username.toLowerCase() === cleanUser && u.password === password
  );

  if (found) {
    setCurrentUser(found);
    logActivity(found.id, found.username, 'page_visit', 'Öğrenci paneline giriş yaptı.');
    return { success: true, user: found };
  }

  return { success: false, error: 'Kullanıcı adı veya şifre hatalı!' };
}

export function registerStudent(username, password, grade = '8') {
  const cleanUser = username.trim().toLowerCase();
  if (!cleanUser || !password) {
    return { success: false, error: 'Kullanıcı adı ve şifre zorunludur!' };
  }

  if (cleanUser === 'nurcanelci') {
    return { success: false, error: 'Bu kullanıcı adı öğretmen için ayrılmıştır!' };
  }

  const users = getTable(DB_KEYS.USERS, INITIAL_USERS);
  const exists = users.find(u => u.username.toLowerCase() === cleanUser);
  if (exists) {
    return { success: false, error: 'Bu kullanıcı adı zaten kullanılıyor! Lütfen başka bir ad seçiniz.' };
  }

  const newStudent = {
    id: 'student-' + Date.now(),
    username: cleanUser,
    password: password,
    role: 'student',
    name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
    grade: String(grade),
    createdAt: new Date().toISOString()
  };

  users.push(newStudent);
  setTable(DB_KEYS.USERS, users);
  setCurrentUser(newStudent);

  logActivity(newStudent.id, newStudent.username, 'account_created', 'Yeni öğrenci kaydı oluşturuldu.');
  return { success: true, user: newStudent };
}

export function getStudents() {
  const users = getTable(DB_KEYS.USERS, INITIAL_USERS);
  return users.filter(u => u.role === 'student');
}

export function getTeacherProfile() {
  const users = getTable(DB_KEYS.USERS, INITIAL_USERS);
  return users.find(u => u.role === 'teacher') || INITIAL_USERS[0];
}

export function updateTeacherProfile(updatedFields) {
  const users = getTable(DB_KEYS.USERS, INITIAL_USERS);
  const idx = users.findIndex(u => u.role === 'teacher');
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updatedFields };
    setTable(DB_KEYS.USERS, users);
    const curr = getCurrentUser();
    if (curr && curr.role === 'teacher') {
      setCurrentUser(users[idx]);
    }
    return users[idx];
  }
  return null;
}

// ----------------------------------------------------------------------
// AKTİVİTE TAKİBİ (Sadece Öğretmenin Gördüğü Geçmiş)
// ----------------------------------------------------------------------

export function logActivity(studentId, studentUsername, actionType, details) {
  const activities = getTable(DB_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  const newActivity = {
    id: 'act-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    studentId,
    studentUsername,
    actionType, // 'game_played' | 'quiz_completed' | 'material_viewed' | 'page_visit' | 'homework_submitted'
    details,
    timestamp: new Date().toISOString()
  };
  activities.unshift(newActivity); // En son yapılan en başta
  // Maksimum 500 log tut
  if (activities.length > 500) activities.length = 500;
  setTable(DB_KEYS.ACTIVITIES, activities);
  return newActivity;
}

export function getActivities(studentId = null) {
  const activities = getTable(DB_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  if (!studentId) return activities;
  return activities.filter(a => a.studentId === studentId);
}

// ----------------------------------------------------------------------
// MESAJLAŞMA (Öğretmen Denetimli)
// ----------------------------------------------------------------------

export function sendMessage(sender, receiverId, text) {
  if (!text || !text.trim()) return null;
  const messages = getTable(DB_KEYS.MESSAGES, INITIAL_MESSAGES);
  const users = getTable(DB_KEYS.USERS, INITIAL_USERS);
  
  const receiver = users.find(u => u.id === receiverId) || {
    id: receiverId,
    name: receiverId === 'teacher-1' ? 'Nurcan Elçi' : 'Kullanıcı',
    role: receiverId === 'teacher-1' ? 'teacher' : 'student'
  };

  const newMsg = {
    id: 'msg-' + Date.now(),
    senderId: sender.id,
    senderName: sender.name || sender.username,
    senderRole: sender.role,
    receiverId: receiver.id,
    receiverName: receiver.name || receiver.username,
    receiverRole: receiver.role,
    text: text.trim(),
    timestamp: new Date().toISOString(),
    read: false
  };

  messages.push(newMsg);
  setTable(DB_KEYS.MESSAGES, messages);

  // Öğrenci mesaj attığında aktiviteye kaydet
  if (sender.role === 'student') {
    logActivity(sender.id, sender.username, 'message_sent', `Mesaj gönderdi: "${receiver.name}" alıcısına.`);
  }

  return newMsg;
}

export function getMessagesBetween(userId1, userId2) {
  const messages = getTable(DB_KEYS.MESSAGES, INITIAL_MESSAGES);
  return messages.filter(
    m => (m.senderId === userId1 && m.receiverId === userId2) ||
         (m.senderId === userId2 && m.receiverId === userId1)
  );
}

export function getAllMessagesForTeacher() {
  return getTable(DB_KEYS.MESSAGES, INITIAL_MESSAGES);
}

export function markMessagesAsRead(senderId, currentUserId) {
  const messages = getTable(DB_KEYS.MESSAGES, INITIAL_MESSAGES);
  let changed = false;
  messages.forEach(m => {
    if (m.senderId === senderId && m.receiverId === currentUserId && !m.read) {
      m.read = true;
      changed = true;
    }
  });
  if (changed) setTable(DB_KEYS.MESSAGES, messages);
}

// ----------------------------------------------------------------------
// ÖDEV SİSTEMİ (Oluşturma, Teslim, Puanlama & Geri Bildirim)
// ----------------------------------------------------------------------

export function createHomework(data) {
  const homeworks = getTable(DB_KEYS.HOMEWORKS, INITIAL_HOMEWORKS);
  const newHw = {
    id: 'hw-' + Date.now(),
    title: data.title,
    description: data.description,
    targetGrade: data.targetGrade || 'all',
    targetStudentIds: data.targetStudentIds || 'all', // 'all' veya ['student-1', 'student-2']
    dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    maxScore: data.maxScore || 100
  };
  homeworks.unshift(newHw);
  setTable(DB_KEYS.HOMEWORKS, homeworks);
  return newHw;
}

export function getAllHomeworks() {
  return getTable(DB_KEYS.HOMEWORKS, INITIAL_HOMEWORKS);
}

export function getHomeworksForStudent(student) {
  const homeworks = getTable(DB_KEYS.HOMEWORKS, INITIAL_HOMEWORKS);
  return homeworks.filter(hw => {
    if (hw.targetGrade !== 'all' && hw.targetGrade !== student.grade) return false;
    if (hw.targetStudentIds === 'all') return true;
    if (Array.isArray(hw.targetStudentIds) && hw.targetStudentIds.includes(student.id)) return true;
    return false;
  });
}

export function submitHomework(homeworkId, student, content) {
  const submissions = getTable(DB_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  
  // Varsa önceki teslimi güncelle, yoksa yeni oluştur
  const existingIdx = submissions.findIndex(
    s => s.homeworkId === homeworkId && s.studentId === student.id
  );

  const submissionObj = {
    id: existingIdx !== -1 ? submissions[existingIdx].id : 'sub-' + Date.now(),
    homeworkId,
    studentId: student.id,
    studentUsername: student.username,
    studentName: student.name || student.username,
    content: content.trim(),
    submittedAt: new Date().toISOString(),
    status: 'pending',
    score: null,
    teacherFeedback: null,
    gradedAt: null
  };

  if (existingIdx !== -1) {
    submissions[existingIdx] = submissionObj;
  } else {
    submissions.push(submissionObj);
  }

  setTable(DB_KEYS.SUBMISSIONS, submissions);
  logActivity(student.id, student.username, 'homework_submitted', `Ödev teslim edildi (Ödev ID: ${homeworkId}).`);
  return submissionObj;
}

export function gradeSubmission(submissionId, score, feedback) {
  const submissions = getTable(DB_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  const sub = submissions.find(s => s.id === submissionId);
  if (!sub) return null;

  sub.score = Number(score);
  sub.teacherFeedback = feedback ? feedback.trim() : 'Öğretmen tarafından değerlendirildi.';
  sub.status = 'graded';
  sub.gradedAt = new Date().toISOString();

  setTable(DB_KEYS.SUBMISSIONS, submissions);
  return sub;
}

export function getAllSubmissions() {
  return getTable(DB_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
}

export function getSubmissionsForStudent(studentId) {
  const submissions = getTable(DB_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  return submissions.filter(s => s.studentId === studentId);
}

// ----------------------------------------------------------------------
// ÖĞRETMEN YILLIK PLANLARI & MODÜLLER
// ----------------------------------------------------------------------

export function getTeacherPlans() {
  return getTable(DB_KEYS.TEACHER_PLANS, INITIAL_TEACHER_PLANS);
}

export function saveTeacherPlans(plans) {
  setTable(DB_KEYS.TEACHER_PLANS, plans);
  return plans;
}

// ----------------------------------------------------------------------
// VERİ TABANI YEDEKLEME & DIŞA/İÇE AKTARMA (JSON)
// ----------------------------------------------------------------------

export function exportFullDatabaseJSON() {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    users: getTable(DB_KEYS.USERS, INITIAL_USERS),
    activities: getTable(DB_KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
    messages: getTable(DB_KEYS.MESSAGES, INITIAL_MESSAGES),
    homeworks: getTable(DB_KEYS.HOMEWORKS, INITIAL_HOMEWORKS),
    submissions: getTable(DB_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS),
    teacher_plans: getTable(DB_KEYS.TEACHER_PLANS, INITIAL_TEACHER_PLANS)
  };
}

export function importFullDatabaseJSON(data) {
  try {
    if (data.users) setTable(DB_KEYS.USERS, data.users);
    if (data.activities) setTable(DB_KEYS.ACTIVITIES, data.activities);
    if (data.messages) setTable(DB_KEYS.MESSAGES, data.messages);
    if (data.homeworks) setTable(DB_KEYS.HOMEWORKS, data.homeworks);
    if (data.submissions) setTable(DB_KEYS.SUBMISSIONS, data.submissions);
    if (data.teacher_plans) setTable(DB_KEYS.TEACHER_PLANS, data.teacher_plans);
    return true;
  } catch (err) {
    console.error('Database import error:', err);
    return false;
  }
}
