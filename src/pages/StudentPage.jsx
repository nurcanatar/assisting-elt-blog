import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, Send, CheckCircle2, Clock, 
  MessageSquare, Award, Play, RotateCcw, Volume2, Sparkles, 
  ExternalLink, FileText, Check, AlertCircle, ArrowRight, User
} from 'lucide-react';
import { 
  getHomeworksForStudent, getSubmissionsForStudent, submitHomework,
  getMessagesBetween, sendMessage, logActivity, getTeacherProfile, getStudents
} from '../services/db';

export default function StudentPage({ currentUser, onOpenAuth, onNavigate }) {
  const isStudent = currentUser && currentUser.role === 'student';

  const [activeTab, setActiveTab] = useState('homework'); // 'homework' | 'messages' | 'learning' | 'profile'
  const [selectedGrade, setSelectedGrade] = useState(currentUser?.grade || '8');
  
  // Homework Data
  const [myHomeworks, setMyHomeworks] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [submittingHwId, setSubmittingHwId] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  // Messaging Data
  const teacher = getTeacherProfile();
  const [classmates, setClassmates] = useState([]);
  const [chatPartner, setChatPartner] = useState({ id: 'teacher-1', name: 'Nurcan Elçi (Öğretmen)', role: 'teacher' });
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  // Interactive Learning: Word of the Day
  const wordsOfDay = {
    '5': { word: 'Friendly', meaning: 'Arkadaş canlısı, samimi', example: 'She is a very friendly person.' },
    '6': { word: 'Exciting', meaning: 'Heyecan verici', example: 'The roller coaster was so exciting!' },
    '7': { word: 'Achieve', meaning: 'Başarmak, elde etmek', example: 'He worked hard to achieve his dream.' },
    '8': { word: 'Supportive', meaning: 'Destekleyici, arka çıkan', example: 'A true friend is always supportive.' }
  };
  const activeWord = wordsOfDay[selectedGrade] || wordsOfDay['8'];

  // Interactive Learning: Mini Quiz
  const quizzesByGrade = {
    '8': [
      {
        q: 'Which of the following is a way of "refusing" an invitation politely?',
        options: [
          'A) Sure, that sounds fun!',
          'B) I would love to, but I have another plan.',
          'C) Yes, definitely!',
          'D) Why not?'
        ],
        correct: 1,
        exp: '"I would love to, but..." kalıbı kibarca reddetmek için kullanılır.'
      },
      {
        q: 'Complete the sentence: "A true friend never tells your secrets to others. He is ______."',
        options: ['A) jealous', 'B) trustworthy', 'C) selfish', 'D) stubborn'],
        correct: 1,
        exp: 'Sır tutan ve güvenilen kişi "trustworthy" (güvenilir) olarak tanımlanır.'
      },
      {
        q: 'What does "count on" mean?',
        options: ['A) Sayı saymak', 'B) Güvenmek / Bel bağlamak', 'C) Tartışmak', 'D) Reddetmek'],
        correct: 1,
        exp: '"Count on" İngilizcede "rely on / depend on" ile eş anlamlı olup "güvenmek" demektir.'
      }
    ],
    '7': [
      {
        q: 'Atatürk was born in Thessaloniki in 1881. Which question matches this sentence?',
        options: [
          'A) Where and when was Atatürk born?',
          'B) What was his favorite sport?',
          'C) Why did he become a soldier?',
          'D) Who was his best friend?'
        ],
        correct: 0,
        exp: 'Cümle yer (Thessaloniki) ve zaman (1881) bilgisi verdiği için doğru soru "Where and when..." kalıbıdır.'
      },
      {
        q: 'An elephant is ______ than a lion.',
        options: ['A) heavier', 'B) heavy', 'C) more heavy', 'D) heaviest'],
        correct: 0,
        exp: '"Heavy" sıfatı tek heceli kuralla -ier alarak "heavier" (daha ağır) olur.'
      }
    ],
    '6': [
      {
        q: 'What time is it? "It is half past nine."',
        options: ['A) 09:15', 'B) 09:30', 'C) 09:45', 'D) 10:30'],
        correct: 1,
        exp: '"Half past" buçuk anlamına gelir. 09:30 doğrudur.'
      }
    ],
    '5': [
      {
        q: 'Where are you from? - I am from ______.',
        options: ['A) Turkish', 'B) Türkiye', 'C) English', 'D) Spanish'],
        correct: 1,
        exp: '"Where are you from?" sorusuna ülke ismiyle (Türkiye) yanıt verilir.'
      }
    ]
  };

  const currentQuizList = quizzesByGrade[selectedGrade] || quizzesByGrade['8'];
  const [userQuizAnswers, setUserQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  // Flashcards state
  const flashcards = [
    { en: 'Honest', tr: 'Dürüst', ex: 'He never tells lies, he is honest.' },
    { en: 'Back up', tr: 'Arka çıkmak, desteklemek', ex: 'Friends always back each other up.' },
    { en: 'Invitation', tr: 'Davet, davetiye', ex: 'Thanks for the party invitation!' },
    { en: 'Stubborn', tr: 'İnatçı', ex: 'He never changes his mind because he is stubborn.' },
    { en: 'Generous', tr: 'Cömert', ex: 'She shares her books, she is generous.' }
  ];
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Focus Pomodoro Timer
  const [studySeconds, setStudySeconds] = useState(25 * 60);
  const [studyRunning, setStudyRunning] = useState(false);

  // Refresh student data
  const refreshStudentData = () => {
    if (!currentUser) return;
    const hws = getHomeworksForStudent(currentUser);
    const subs = getSubmissionsForStudent(currentUser.id);
    setMyHomeworks(hws);
    setMySubmissions(subs);

    const allStudents = getStudents();
    setClassmates(allStudents.filter(s => s.id !== currentUser.id));

    if (chatPartner) {
      setChatMessages(getMessagesBetween(currentUser.id, chatPartner.id));
    }
  };

  useEffect(() => {
    refreshStudentData();
  }, [currentUser, chatPartner]);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval = null;
    if (studyRunning && studySeconds > 0) {
      interval = setInterval(() => setStudySeconds(s => s - 1), 1000);
    } else if (studySeconds === 0 && studyRunning) {
      setStudyRunning(false);
      alert('🎉 Tebrikler! 25 dakikalık İngilizce çalışma periyodunu tamamladın. Şimdi 5 dakika dinlenme zamanı!');
      logActivity(currentUser.id, currentUser.username, 'pomodoro_completed', '25 dakikalık ders çalışma periyodunu tamamladı.');
    }
    return () => clearInterval(interval);
  }, [studyRunning, studySeconds]);

  // If not logged in as student, display login / registration callout
  if (!isStudent) {
    return (
      <div class="max-w-4xl mx-auto px-4 py-16 text-center space-y-8 animate-fadeIn">
        <div class="w-20 h-20 bg-gradient-to-tr from-brand-500 to-indigo-600 text-white rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-xl shadow-brand-500/25">
          🎒
        </div>

        <div class="space-y-3">
          <span class="px-3 py-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-full text-xs font-bold uppercase tracking-wider">
            assisting.com Öğrenci Alanı
          </span>
          <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Öğrenci Portalı Giriş & Kayıt Alanı
          </h1>
          <p class="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
            Sevgili öğrencimiz; öğretmeninin gönderdiği ödevleri görmek, ödevlerini teslim edip puanını öğrenmek, 
            sesli kelime kartlarıyla çalışmak ve öğretmenine soru sormak için kullanıcı adınla giriş yapabilir veya anında kayıt olabilirsin.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenAuth('student-login')}
            class="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/25 transition-all hover:scale-105 flex items-center justify-center space-x-2"
          >
            <User class="w-5 h-5" />
            <span>Kullanıcı Adı ile Giriş Yap</span>
          </button>

          <button
            onClick={() => onOpenAuth('student-register')}
            class="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Sparkles class="w-5 h-5" />
            <span>Yeni Öğrenci Kaydı Aç ✨</span>
          </button>
        </div>

        <div class="p-4 bg-slate-100 rounded-2xl max-w-md mx-auto text-xs text-slate-500 border border-slate-200">
          💡 Kayıt olmak için yalnızca <strong>kullanıcı adı</strong> ve <strong>şifre</strong> belirlemen yeterlidir. E-posta veya telefon gerekmez.
        </div>
      </div>
    );
  }

  // Handle Homework Submission
  const handleSubmitHomework = (e) => {
    e.preventDefault();
    if (!submittingHwId || !submissionText.trim()) return;

    submitHomework(submittingHwId, currentUser, submissionText);
    setSubmissionText('');
    setSubmittingHwId(null);
    setSubmitSuccessMsg('Ödevin Nurcan Öğretmene başarıyla gönderildi! Puanlandığında buradan görebilirsin.');
    setTimeout(() => setSubmitSuccessMsg(''), 4000);
    refreshStudentData();
  };

  // Handle Send Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !chatPartner) return;

    sendMessage(currentUser, chatPartner.id, messageInput);
    setMessageInput('');
    refreshStudentData();
  };

  // Pronounce Word using Web Speech API
  const handlePronounce = (text) => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
        logActivity(currentUser.id, currentUser.username, 'word_pronounced', `"${text}" kelimesinin sesli telaffuzunu dinledi.`);
      }
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  };

  // Submit Mini Quiz
  const handleQuizSubmit = () => {
    let correctCount = 0;
    currentQuizList.forEach((q, idx) => {
      if (userQuizAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / currentQuizList.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    // Otomatik olarak öğrencinin aktivite geçmişine kaydet!
    logActivity(
      currentUser.id,
      currentUser.username,
      'quiz_completed',
      `${selectedGrade}. Sınıf Günün Mini Testini tamamladı. Skor: ${calculatedScore}/100 (${correctCount}/${currentQuizList.length} Doğru)`
    );
  };

  // Track Game Click
  const handleGamePlay = (gameName) => {
    logActivity(
      currentUser.id,
      currentUser.username,
      'game_played',
      `${selectedGrade}. Sınıf ${gameName} oyununu oynadı.`
    );
  };

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Student Top Welcome Banner */}
      <div class="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md text-white text-3xl font-black flex items-center justify-center border border-white/20 shadow-md">
              🎒
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h1 class="text-2xl sm:text-3xl font-black tracking-tight">Hoş Geldin, {currentUser.name || currentUser.username}!</h1>
                <span class="px-2.5 py-0.5 bg-white/20 text-white rounded-full text-xs font-black uppercase">
                  {currentUser.grade}. Sınıf
                </span>
              </div>
              <p class="text-xs sm:text-sm text-brand-100 mt-1">
                İngilizce ders materyallerin, ödevlerin ve öğretmeninin geri bildirimleri bu paneldedir.
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div class="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center">
              <span class="block text-xl font-black">{mySubmissions.length}</span>
              <span class="text-[10px] text-brand-100 font-bold uppercase">Teslim Edilen</span>
            </div>
            <div class="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center">
              <span class="block text-xl font-black">
                {mySubmissions.filter(s => s.status === 'graded').length}
              </span>
              <span class="text-[10px] text-brand-100 font-bold uppercase">Puanlanan Ödev</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Student Navigation Tabs */}
      <div class="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'homework', label: '📝 Ödevlerim & Puanlarım', badge: myHomeworks.length },
          { id: 'messages', label: '💬 Öğretmenle Mesajlaşma', badge: 'Canlı' },
          { id: 'learning', label: '🎮 İnteraktif Oyunlar & Mini Test', badge: 'Sesli' },
          { id: 'pomodoro', label: '⏱️ Odaklanma Sayacı (Pomodoro)', badge: null }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            class={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span class={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: ÖDEVLERİM VE PUANLARIM                                 */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'homework' && (
        <div class="space-y-6">
          
          {submitSuccessMsg && (
            <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{submitSuccessMsg}</span>
            </div>
          )}

          <div>
            <h2 class="text-xl font-black text-slate-900">Öğretmeninin Gönderdiği Ödevler</h2>
            <p class="text-xs text-slate-500">
              Nurcan Öğretmen tarafından size özel veya sınıfınıza atanan tüm ödevler burada listelenir.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Assigned Homeworks List */}
            <div class="space-y-4">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktif Ödev Listesi</h3>

              {myHomeworks.length === 0 ? (
                <div class="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                  Şu anda atanmış bir ödeviniz bulunmuyor.
                </div>
              ) : (
                myHomeworks.map((hw) => {
                  const existingSub = mySubmissions.find(s => s.homeworkId === hw.id);
                  const isGraded = existingSub?.status === 'graded';

                  return (
                    <div key={hw.id} class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div class="flex items-center justify-between">
                        <span class="px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg text-[10px] font-black">
                          {hw.targetGrade === 'all' ? 'Tüm Sınıflar' : `${hw.targetGrade}. Sınıf Ödevi`}
                        </span>
                        <span class="text-slate-400 text-xs">Son Teslim: {hw.dueDate}</span>
                      </div>

                      <div>
                        <h4 class="text-base font-extrabold text-slate-900">{hw.title}</h4>
                        <p class="text-xs text-slate-600 mt-1 leading-relaxed">{hw.description}</p>
                      </div>

                      {/* Status / Submit Action */}
                      <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                        {existingSub ? (
                          isGraded ? (
                            <div class="flex items-center space-x-2">
                              <span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
                                ✨ Puanlandı: {existingSub.score}/100
                              </span>
                            </div>
                          ) : (
                            <span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                              ⏳ Öğretmenin Puanlaması Bekleniyor
                            </span>
                          )
                        ) : (
                          <button
                            onClick={() => {
                              setSubmittingHwId(hw.id);
                              setSubmissionText('');
                            }}
                            class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
                          >
                            <Send class="w-3.5 h-3.5" />
                            <span>Ödevi Cevapla & Gönder</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Graded Homework Feedback Cards */}
            <div class="space-y-4">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Öğretmen Değerlendirmeleri & Notlar</h3>

              {mySubmissions.filter(s => s.status === 'graded').length === 0 ? (
                <div class="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-slate-400 text-xs">
                  Henüz puanlanan bir ödeviniz bulunmuyor. Ödevinizi teslim ettiğinizde öğretmeniniz inceleyip puan verecektir.
                </div>
              ) : (
                mySubmissions.filter(s => s.status === 'graded').map((sub) => {
                  const hw = myHomeworks.find(h => h.id === sub.homeworkId);

                  return (
                    <div key={sub.id} class="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-3">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-600">{hw?.title || 'Ödev'}</span>
                        <div class="px-3 py-1 bg-emerald-600 text-white rounded-xl font-black text-sm shadow-sm">
                          {sub.score} / 100 Puan
                        </div>
                      </div>

                      {/* Teacher's personal feedback */}
                      <div class="p-3 bg-white rounded-2xl border border-emerald-100 shadow-sm space-y-1">
                        <span class="text-[10px] font-black text-indigo-700 uppercase tracking-wider flex items-center space-x-1">
                          <span>👩‍🏫 Nurcan Öğretmenin Notu:</span>
                        </span>
                        <p class="text-xs text-slate-800 font-medium italic">
                          "{sub.teacherFeedback}"
                        </p>
                      </div>

                      <div class="text-[11px] text-slate-500 pt-1">
                        <strong>Senin Gönderdiğin Cevap:</strong>
                        <p class="bg-slate-50 p-2 rounded-lg text-slate-600 mt-1 whitespace-pre-line">
                          {sub.content}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Submission Modal */}
          {submittingHwId && (
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
              <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 class="text-base font-black text-slate-900">Ödevini Hazırla ve Gönder</h3>
                  <button onClick={() => setSubmittingHwId(null)} class="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleSubmitHomework} class="space-y-4 text-xs">
                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Cevabın / Ödev Metnin</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Ödevinin İngilizce cümlelerini, kelimelerini veya cevabını buraya yazınız..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-slate-800"
                    />
                  </div>

                  <div class="flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setSubmittingHwId(null)}
                      class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md"
                    >
                      Öğretmene Gönder 🚀
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: ÖĞRETMENLE VE ARKADAŞLARLA MESAJLAŞMA                   */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'messages' && (
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-black text-slate-900">Mesajlaşma Alanı</h2>
              <p class="text-xs text-slate-500">
                Nurcan Öğretmene doğrudan sorularınızı sorabilir veya arkadaşlarınızla iletişim kurabilirsiniz.
              </p>
            </div>
            <div class="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] font-medium flex items-center space-x-1.5">
              <span>🛡️ Tüm mesajlaşmalar güvenliğiniz için öğretmen gözetimindedir.</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Contacts List */}
            <div class="lg:col-span-1 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Kişiler</h3>
              
              {/* Teacher Button */}
              <div
                onClick={() => setChatPartner({ id: 'teacher-1', name: 'Nurcan Elçi (Öğretmen)', role: 'teacher' })}
                class={`p-3 rounded-2xl cursor-pointer transition-all flex items-center space-x-3 ${
                  chatPartner?.id === 'teacher-1'
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg">
                  👩‍🏫
                </div>
                <div>
                  <p class="text-xs font-bold">Nurcan Elçi</p>
                  <p class="text-[10px] text-indigo-600 font-medium">İngilizce Öğretmeni</p>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-100">
                <span class="text-[10px] font-bold text-slate-400 uppercase px-2 block mb-1">Sınıf Arkadaşları</span>
                <div class="space-y-1 max-h-60 overflow-y-auto">
                  {classmates.map((mate) => {
                    const isSelected = chatPartner?.id === mate.id;
                    return (
                      <div
                        key={mate.id}
                        onClick={() => setChatPartner(mate)}
                        class={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center space-x-2.5 ${
                          isSelected ? 'bg-brand-50 text-brand-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div class="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                          {mate.username.charAt(0).toUpperCase()}
                        </div>
                        <span class="text-xs">{mate.name || mate.username}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chat Box */}
            <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
              <div class="p-4 border-b border-slate-100 flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                  {chatPartner?.role === 'teacher' ? '👩‍🏫' : chatPartner?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-slate-900">{chatPartner?.name || chatPartner?.username}</h4>
                  <p class="text-[10px] text-slate-400">
                    {chatPartner?.role === 'teacher' ? 'Öğretmenine Doğrudan Mesaj' : 'Sınıf Arkadaşı'}
                  </p>
                </div>
              </div>

              <div class="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                {chatMessages.length === 0 ? (
                  <div class="p-8 text-center text-slate-400 text-xs">
                    Henüz bir mesajlaşma bulunmuyor. Merhaba yazarak sohbete başlayabilirsin!
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isMine = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} class={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                        <div
                          class={`max-w-[75%] p-3 rounded-2xl text-xs ${
                            isMine
                              ? 'bg-brand-600 text-white rounded-br-sm'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'
                          }`}
                        >
                          <p class="leading-relaxed">{msg.text}</p>
                        </div>
                        <span class="text-[10px] text-slate-400 mt-1 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} class="p-3 border-t border-slate-100 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Mesajını yaz..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  class="flex-grow px-4 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  class="p-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md transition-all"
                >
                  <Send class="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: İNTERAKTİF OYUNLAR VE MİNİ TEST                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'learning' && (
        <div class="space-y-8">
          
          {/* Grade Selector */}
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold text-slate-500">Sınıfını Seç:</span>
            {['5', '6', '7', '8'].map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedGrade(g);
                  setUserQuizAnswers({});
                  setQuizSubmitted(false);
                  setQuizScore(null);
                }}
                class={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedGrade === g
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {g}. Sınıf {g === '8' && '(LGS)'}
              </button>
            ))}
          </div>

          {/* Word of the Day with Web Speech API audio */}
          <div class="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div class="relative z-10 max-w-2xl space-y-3">
              <span class="px-3 py-1 bg-brand-500/30 text-brand-200 rounded-full text-[10px] font-black uppercase tracking-wider">
                Günün Kelimesi ({selectedGrade}. Sınıf)
              </span>
              
              <div class="flex items-center space-x-4">
                <h3 class="text-3xl sm:text-4xl font-black text-white">{activeWord.word}</h3>
                <button
                  onClick={() => handlePronounce(activeWord.word)}
                  class="p-2.5 bg-brand-500 hover:bg-brand-400 text-white rounded-xl shadow-md transition-all flex items-center space-x-1"
                  title="Sesli Dinle (Pronounce)"
                >
                  <Volume2 class="w-5 h-5" />
                  <span class="text-xs font-bold hidden sm:inline">Dinle</span>
                </button>
              </div>

              <p class="text-brand-300 font-bold text-sm">Türkçe Anlamı: {activeWord.meaning}</p>
              <p class="text-slate-300 text-xs italic">Örnek: "{activeWord.example}"</p>
            </div>
          </div>

          {/* Flashcards & Mini Quiz Grid */}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Interactive Flashcard */}
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <BookOpen class="w-4 h-4 text-brand-600" />
                  <span>Kelime Kartı ({cardIdx + 1} / {flashcards.length})</span>
                </h3>
                <button
                  onClick={() => handlePronounce(flashcards[cardIdx].en)}
                  class="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg text-xs flex items-center space-x-1 font-bold"
                >
                  <Volume2 class="w-4 h-4" />
                  <span>Telaffuz</span>
                </button>
              </div>

              {/* Flip Card Area */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                class="min-h-[180px] bg-gradient-to-br from-brand-50 to-indigo-50 border-2 border-dashed border-brand-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.01]"
              >
                {!isFlipped ? (
                  <div class="space-y-2">
                    <p class="text-2xl font-black text-slate-900">{flashcards[cardIdx].en}</p>
                    <p class="text-xs text-slate-500 italic">"{flashcards[cardIdx].ex}"</p>
                    <span class="inline-block mt-3 px-3 py-1 bg-white rounded-full text-[10px] font-bold text-brand-600 shadow-sm">
                      Anlamı görmek için tıkla 🔄
                    </span>
                  </div>
                ) : (
                  <div class="space-y-2 animate-fadeIn">
                    <p class="text-2xl font-black text-brand-700">{flashcards[cardIdx].tr}</p>
                    <span class="inline-block mt-3 px-3 py-1 bg-brand-600 text-white rounded-full text-[10px] font-bold">
                      Kelimeye dönmek için tıkla 🔄
                    </span>
                  </div>
                )}
              </div>

              {/* Card Controls */}
              <div class="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIdx((cardIdx - 1 + flashcards.length) % flashcards.length);
                  }}
                  class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  ← Önceki
                </button>
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIdx((cardIdx + 1) % flashcards.length);
                  }}
                  class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Sonraki →
                </button>
              </div>
            </div>

            {/* Daily Interactive 3-Question Quiz (Logs activity to DB!) */}
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <Award class="w-4 h-4 text-amber-500" />
                  <span>{selectedGrade}. Sınıf Günün Mini Testi</span>
                </h3>
                {quizSubmitted && (
                  <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
                    Puanın: {quizScore}/100
                  </span>
                )}
              </div>

              <div class="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {currentQuizList.map((item, qIdx) => (
                  <div key={qIdx} class="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                    <p class="font-bold text-slate-900">{qIdx + 1}. {item.q}</p>
                    <div class="space-y-1">
                      {item.options.map((opt, optIdx) => {
                        const isSelected = userQuizAnswers[qIdx] === optIdx;
                        const isCorrect = item.correct === optIdx;
                        let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                        if (quizSubmitted) {
                          if (isCorrect) optionStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                          else if (isSelected && !isCorrect) optionStyle = 'bg-rose-100 border-rose-300 text-rose-800';
                        } else if (isSelected) {
                          optionStyle = 'bg-brand-50 border-brand-400 text-brand-800 font-bold';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setUserQuizAnswers({ ...userQuizAnswers, [qIdx]: optIdx });
                              }
                            }}
                            class={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${optionStyle}`}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p class="text-[11px] text-slate-500 italic pt-1">
                        💡 {item.exp}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(userQuizAnswers).length !== currentQuizList.length}
                  class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  Testi Bitir ve Öğretmene Gönder 🚀
                </button>
              ) : (
                <button
                  onClick={() => {
                    setUserQuizAnswers({});
                    setQuizSubmitted(false);
                    setQuizScore(null);
                  }}
                  class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Tekrar Çöz 🔄
                </button>
              )}
            </div>

          </div>

          {/* Educational Game Links (Wordwall, Kahoot, Quizizz) */}
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-sm font-black text-slate-900">Popüler İngilizce Oyun Bağlantıları</h3>
            <p class="text-xs text-slate-500">
              Oynadığınız oyunlar otomatik olarak öğretmeninizin ekranındaki aktivite geçmişinize kaydedilir.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="https://wordwall.net/tr-tr/community/lgs-%c4%b0ngilizce"
                target="_blank"
                rel="noreferrer"
                onClick={() => handleGamePlay('Wordwall LGS Kelime Oyunu')}
                class="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <span class="text-xs font-bold text-rose-700 uppercase">Wordwall</span>
                  <h4 class="font-black text-slate-900 text-sm mt-1 group-hover:text-rose-600">
                    LGS & Ünite Kelime Eşleştirmece
                  </h4>
                </div>
                <div class="pt-3 flex items-center space-x-1 text-xs font-bold text-rose-600">
                  <span>Oyunu Başlat</span>
                  <ExternalLink class="w-3.5 h-3.5" />
                </div>
              </a>

              <a
                href="https://quizizz.com/join"
                target="_blank"
                rel="noreferrer"
                onClick={() => handleGamePlay('Quizizz Canlı Sınıf Testi')}
                class="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <span class="text-xs font-bold text-purple-700 uppercase">Quizizz</span>
                  <h4 class="font-black text-slate-900 text-sm mt-1 group-hover:text-purple-600">
                    Canlı Yarışma & Soru Çözümü
                  </h4>
                </div>
                <div class="pt-3 flex items-center space-x-1 text-xs font-bold text-purple-600">
                  <span>Odaya Katıl</span>
                  <ExternalLink class="w-3.5 h-3.5" />
                </div>
              </a>

              <a
                href="https://kahoot.it/"
                target="_blank"
                rel="noreferrer"
                onClick={() => handleGamePlay('Kahoot PIN Oyunu')}
                class="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <span class="text-xs font-bold text-indigo-700 uppercase">Kahoot!</span>
                  <h4 class="font-black text-slate-900 text-sm mt-1 group-hover:text-indigo-600">
                    Sınıf İçi Hızlı Yanıtlama
                  </h4>
                </div>
                <div class="pt-3 flex items-center space-x-1 text-xs font-bold text-indigo-600">
                  <span>PIN Gir ve Oyna</span>
                  <ExternalLink class="w-3.5 h-3.5" />
                </div>
              </a>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: POMODORO ODAKLANMA SAYACI                              */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'pomodoro' && (
        <div class="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
          <div class="inline-flex items-center space-x-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold">
            <Clock class="w-4 h-4" />
            <span>25 Dakika Ders + 5 Dakika Mola</span>
          </div>

          <div class="space-y-1">
            <h3 class="text-2xl font-black text-slate-900">İngilizce Çalışma & Odaklanma Sayacı</h3>
            <p class="text-xs text-slate-500">Ödevlerini yaparken dikkatin dağılmadan çalışmanı sağlar.</p>
          </div>

          <div class="text-6xl font-black text-slate-900 font-mono tracking-tight py-4">
            {Math.floor(studySeconds / 60)}:{(studySeconds % 60).toString().padStart(2, '0')}
          </div>

          <div class="flex items-center justify-center gap-3">
            <button
              onClick={() => setStudyRunning(!studyRunning)}
              class={`px-8 py-3 rounded-2xl text-sm font-bold text-white shadow-lg transition-all ${
                studyRunning
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
              }`}
            >
              {studyRunning ? 'Mola Ver / Duraklat' : 'Ders Çalışmaya Başla 🚀'}
            </button>
            <button
              onClick={() => {
                setStudyRunning(false);
                setStudySeconds(25 * 60);
              }}
              class="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all"
              title="Sıfırla"
            >
              <RotateCcw class="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
