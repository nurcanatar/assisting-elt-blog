import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Users, BookOpen, Send, CheckCircle2, Clock, 
  Calendar, FileText, CheckSquare, Plus, MessageSquare, ShieldCheck, 
  Search, Star, Award, ChevronRight, Eye, Edit3, Trash2, Download,
  Upload, Play, RotateCcw, Volume2, Sparkles, Filter, AlertCircle
} from 'lucide-react';
import { 
  getTeacherProfile, updateTeacherProfile, getStudents, getActivities, 
  getAllHomeworks, createHomework, getAllSubmissions, gradeSubmission, 
  getAllMessagesForTeacher, sendMessage, getTeacherPlans, saveTeacherPlans,
  exportFullDatabaseJSON, importFullDatabaseJSON
} from '../services/db';

export default function TeacherPage({ currentUser, onOpenAuth, onNavigate }) {
  // If not logged in as teacher, show access denied / login prompt
  const isTeacher = currentUser && currentUser.role === 'teacher';

  const [activeTab, setActiveTab] = useState('students'); // 'overview' | 'students' | 'homework' | 'messages' | 'plans' | 'schedule' | 'database'
  const [teacher, setTeacher] = useState(getTeacherProfile);
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [plans, setPlans] = useState(getTeacherPlans);

  // Selected Student for detailed Dossier
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');

  // Homework creation modal state
  const [showNewHwModal, setShowNewHwModal] = useState(false);
  const [newHwTitle, setNewHwTitle] = useState('');
  const [newHwDesc, setNewHwDesc] = useState('');
  const [newHwGrade, setNewHwGrade] = useState('8');
  const [newHwTarget, setNewHwTarget] = useState('all'); // 'all' or 'custom'
  const [newHwSelectedStudents, setNewHwSelectedStudents] = useState([]);
  const [newHwDueDate, setNewHwDueDate] = useState('');

  // Grading modal state
  const [gradingSub, setGradingSub] = useState(null);
  const [gradeScore, setGradeScore] = useState(100);
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Direct Messaging State
  const [activeChatStudent, setActiveChatStudent] = useState(null);
  const [chatMessageText, setChatMessageText] = useState('');
  const [chatFilter, setChatFilter] = useState('direct'); // 'direct' or 'supervise'

  // Teacher Profile Edit Modal
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editName, setEditName] = useState(teacher.name || 'Nurcan Elçi');
  const [editSchool, setEditSchool] = useState(teacher.school || '');
  const [editHours, setEditHours] = useState(teacher.officeHours || '');
  const [editQuote, setEditQuote] = useState(teacher.quote || '');
  const [editBio, setEditBio] = useState(teacher.bio || '');

  // Classroom Tool: Timer
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Classroom Tool: Random Student Picker
  const [pickedStudent, setPickedStudent] = useState(null);
  const [isPicking, setIsPicking] = useState(false);

  // Classroom Tool: Quick Grade Calculator
  const [calcTotalQuestions, setCalcTotalQuestions] = useState(20);
  const [calcCorrectAnswers, setCalcCorrectAnswers] = useState(18);

  // Refresh DB Data
  const refreshData = () => {
    setTeacher(getTeacherProfile());
    setStudents(getStudents());
    setActivities(getActivities());
    setHomeworks(getAllHomeworks());
    setSubmissions(getAllSubmissions());
    setAllMessages(getAllMessagesForTeacher());
    setPlans(getTeacherPlans());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Classroom Timer Effect
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      // Play soft beep or alert
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  if (!isTeacher) {
    return (
      <div class="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div class="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-3xl mx-auto flex items-center justify-center shadow-lg">
          <ShieldCheck class="w-10 h-10" />
        </div>
        <div class="space-y-2">
          <h1 class="text-3xl font-black text-slate-900">Öğretmen Yönetim Paneli</h1>
          <p class="text-slate-600 max-w-md mx-auto text-sm">
            Bu ekran yalnızca yönetici öğretmen (<strong>Nurcan Elçi</strong>) kullanımına açıktır.
            Yıllık planlar, öğrenci aktiviteleri, ödev puanlama ve mesajlaşma kontrollerine erişmek için lütfen giriş yapınız.
          </p>
        </div>
        <div class="pt-4">
          <button
            onClick={() => onOpenAuth('teacher-login')}
            class="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 inline-flex items-center space-x-2"
          >
            <GraduationCap class="w-5 h-5" />
            <span>Öğretmen Girişi Yap (nurcanelci)</span>
          </button>
        </div>
      </div>
    );
  }

  // Handle Save Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = updateTeacherProfile({
      name: editName,
      school: editSchool,
      officeHours: editHours,
      quote: editQuote,
      bio: editBio
    });
    if (updated) setTeacher(updated);
    setShowProfileEdit(false);
  };

  // Handle Create Homework
  const handleCreateHomework = (e) => {
    e.preventDefault();
    if (!newHwTitle || !newHwDesc) return;

    createHomework({
      title: newHwTitle,
      description: newHwDesc,
      targetGrade: newHwGrade,
      targetStudentIds: newHwTarget === 'all' ? 'all' : newHwSelectedStudents,
      dueDate: newHwDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      maxScore: 100
    });

    setNewHwTitle('');
    setNewHwDesc('');
    setNewHwSelectedStudents([]);
    setShowNewHwModal(false);
    refreshData();
  };

  // Handle Grade Submission
  const handleGradeSubmission = (e) => {
    e.preventDefault();
    if (!gradingSub) return;

    gradeSubmission(gradingSub.id, gradeScore, gradeFeedback);
    setGradingSub(null);
    setGradeFeedback('');
    refreshData();
  };

  // Handle Send Direct Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !activeChatStudent) return;

    sendMessage(
      currentUser,
      activeChatStudent.id,
      chatMessageText
    );

    setChatMessageText('');
    refreshData();
  };

  // Pick Random Student
  const handlePickRandomStudent = () => {
    if (students.length === 0) return;
    setIsPicking(true);
    let count = 0;
    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * students.length);
      setPickedStudent(students[randIdx]);
      count++;
      if (count > 12) {
        clearInterval(interval);
        setIsPicking(false);
      }
    }, 100);
  };

  // Handle Export DB
  const handleExportDB = () => {
    const data = exportFullDatabaseJSON();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assisting_db_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  // Filtered Students
  const filteredStudents = students.filter(s => 
    s.username.toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  // Pending Submissions count
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  // Messages between teacher and active student
  const activeChatMessages = activeChatStudent 
    ? allMessages.filter(
        m => (m.senderId === currentUser.id && m.receiverId === activeChatStudent.id) ||
             (m.senderId === activeChatStudent.id && m.receiverId === currentUser.id)
      )
    : [];

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Teacher Top Header & Identity Card */}
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div class="flex items-start sm:items-center space-x-5">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-brand-500/30 shrink-0">
              👩‍🏫
            </div>
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">{teacher.name || 'Nurcan Elçi'}</h1>
                <span class="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-full">
                  Yönetici Öğretmen
                </span>
              </div>
              <p class="text-sm text-slate-300 font-medium">
                {teacher.title || 'İngilizce Öğretmeni & Zümre Başkanı'} • <span class="text-slate-400">{teacher.school || 'Cumhuriyet Ortaokulu'}</span>
              </p>
              <p class="text-xs text-brand-300 italic pt-0.5">
                "{teacher.quote || 'The limits of my language mean the limits of my world.'}"
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowProfileEdit(true)}
              class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border border-white/10"
            >
              <Edit3 class="w-3.5 h-3.5" />
              <span>Bilgileri Düzenle</span>
            </button>
            <button
              onClick={handleExportDB}
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md shadow-emerald-900/40"
              title="Tüm veri tabanını bilgisayara yedekle"
            >
              <Download class="w-3.5 h-3.5" />
              <span>Veri Tabanını Yedekle (JSON)</span>
            </button>
          </div>

        </div>

        {/* Quick Stats Banner */}
        <div class="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div class="bg-white/5 p-3.5 rounded-2xl border border-white/5">
            <p class="text-2xl sm:text-3xl font-black text-brand-400">{students.length}</p>
            <p class="text-xs text-slate-400 font-medium">Kayıtlı Öğrenci</p>
          </div>
          <div class="bg-white/5 p-3.5 rounded-2xl border border-white/5">
            <p class="text-2xl sm:text-3xl font-black text-rose-400">{pendingSubmissions.length}</p>
            <p class="text-xs text-slate-400 font-medium">Puan Bekleyen Ödev</p>
          </div>
          <div class="bg-white/5 p-3.5 rounded-2xl border border-white/5">
            <p class="text-2xl sm:text-3xl font-black text-purple-400">{allMessages.length}</p>
            <p class="text-xs text-slate-400 font-medium">Toplam Mesajlaşma</p>
          </div>
          <div class="bg-white/5 p-3.5 rounded-2xl border border-white/5">
            <p class="text-2xl sm:text-3xl font-black text-amber-400">{activities.length}</p>
            <p class="text-xs text-slate-400 font-medium">Öğrenci Aktivite Logu</p>
          </div>
        </div>
      </div>

      {/* Main Tabbed Navigation */}
      <div class="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'students', label: '👥 Öğrenci Takibi & Aktiviteler', badge: students.length },
          { id: 'homework', label: '📝 Ödev & Puanlama', badge: pendingSubmissions.length > 0 ? `${pendingSubmissions.length} Bekleyen` : null },
          { id: 'messages', label: '💬 Denetimli Mesajlaşma', badge: allMessages.length },
          { id: 'plans', label: '📅 Yıllık Planlar & Modüller', badge: 'MEB 5-8' },
          { id: 'schedule', label: '⏰ Günlük Ders Programı & Araçlar', badge: 'Canlı' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            class={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span class={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-indigo-100 text-indigo-700'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: ÖĞRENCİ TAKİBİ VE AKTİVİTE GEÇMİŞİ                      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'students' && (
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-black text-slate-900">Kayıtlı Öğrenciler ve Aktivite Geçmişi</h2>
              <p class="text-xs text-slate-500">
                Öğrencilerin oynadığı oyunlar, çözdüğü testler ve sitedeki tüm geçmişi yalnızca bu ekranda siz görebilirsiniz.
              </p>
            </div>
            <div class="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Öğrenci kullanıcı adı ara..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                class="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Student List */}
            <div class="lg:col-span-1 space-y-3">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Öğrenci Listesi ({filteredStudents.length})</h3>
              
              <div class="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                {filteredStudents.length === 0 ? (
                  <div class="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                    Henüz kayıtlı öğrenci bulunamadı.
                  </div>
                ) : (
                  filteredStudents.map((stu) => {
                    const stuActivities = activities.filter(a => a.studentId === stu.id);
                    const isSelected = selectedStudent?.id === stu.id;

                    return (
                      <div
                        key={stu.id}
                        onClick={() => setSelectedStudent(stu)}
                        class={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-300 shadow-md ring-2 ring-indigo-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                              {stu.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p class="text-sm font-bold text-slate-900">{stu.name || stu.username}</p>
                              <p class="text-xs text-slate-500">@{stu.username} • {stu.grade}. Sınıf</p>
                            </div>
                          </div>
                          <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">
                            {stuActivities.length} Aktivite
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected Student Activity Dossier */}
            <div class="lg:col-span-2">
              {selectedStudent ? (
                <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                  
                  {/* Student Dossier Header */}
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                    <div class="flex items-center space-x-4">
                      <div class="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
                        {selectedStudent.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div class="flex items-center space-x-2">
                          <h3 class="text-lg font-black text-slate-900">{selectedStudent.name || selectedStudent.username}</h3>
                          <span class="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold">
                            {selectedStudent.grade}. Sınıf
                          </span>
                        </div>
                        <p class="text-xs text-slate-500">
                          Kullanıcı Adı: <strong>@{selectedStudent.username}</strong> • Kayıt Tarihi: {new Date(selectedStudent.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveChatStudent(selectedStudent);
                        setActiveTab('messages');
                      }}
                      class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                    >
                      <MessageSquare class="w-3.5 h-3.5" />
                      <span>Bu Öğrenciye Mesaj Yaz</span>
                    </button>
                  </div>

                  {/* Student Activity History Timeline */}
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                        <Clock class="w-4 h-4 text-indigo-600" />
                        <span>Aktivite & Oyun Geçmişi (Yalnızca Öğretmen Görür)</span>
                      </h4>
                      <span class="text-xs text-slate-400">
                        {activities.filter(a => a.studentId === selectedStudent.id).length} Kayıt
                      </span>
                    </div>

                    <div class="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {activities.filter(a => a.studentId === selectedStudent.id).length === 0 ? (
                        <div class="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                          Bu öğrencinin henüz kayıtlı bir aktivitesi yok.
                        </div>
                      ) : (
                        activities.filter(a => a.studentId === selectedStudent.id).map((act) => (
                          <div key={act.id} class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-3 text-xs">
                            <div class="p-2 bg-indigo-100 text-indigo-700 rounded-xl mt-0.5 shrink-0">
                              {act.actionType === 'game_played' && <Play class="w-3.5 h-3.5" />}
                              {act.actionType === 'quiz_completed' && <Award class="w-3.5 h-3.5" />}
                              {act.actionType === 'material_viewed' && <FileText class="w-3.5 h-3.5" />}
                              {act.actionType === 'homework_submitted' && <CheckCircle2 class="w-3.5 h-3.5" />}
                              {act.actionType === 'message_sent' && <MessageSquare class="w-3.5 h-3.5" />}
                              {(!['game_played', 'quiz_completed', 'material_viewed', 'homework_submitted', 'message_sent'].includes(act.actionType)) && (
                                <Eye class="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div class="flex-grow space-y-1">
                              <p class="font-bold text-slate-800">{act.details}</p>
                              <p class="text-[11px] text-slate-400">
                                {new Date(act.timestamp).toLocaleDateString('tr-TR')} - {new Date(act.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div class="h-full min-h-[300px] bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-10 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                  <Users class="w-12 h-12 text-slate-300" />
                  <p class="text-sm font-medium">Aktivite ve oyun geçmişini incelemek için sol listeden bir öğrenci seçiniz.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: ÖDEV MERKEZİ VE PUANLAMA                               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'homework' && (
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-black text-slate-900">Ödev Yönetimi & Puanlama Merkezi</h2>
              <p class="text-xs text-slate-500">
                Öğrencilerinize haftalık veya özel ödevler gönderin, teslim edilenleri 100 üzerinden puanlayıp geri bildirimle iletin.
              </p>
            </div>
            <button
              onClick={() => setShowNewHwModal(true)}
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
            >
              <Plus class="w-4 h-4" />
              <span>Yeni Ödev Gönder</span>
            </button>
          </div>

          {/* Submissions Section */}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pending Submissions awaiting grading */}
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 class="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>Puanlanmayı Bekleyen Teslimler ({pendingSubmissions.length})</span>
                </h3>
              </div>

              <div class="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {pendingSubmissions.length === 0 ? (
                  <div class="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
                    Şu anda değerlendirilmeyi bekleyen ödev teslimi bulunmuyor.
                  </div>
                ) : (
                  pendingSubmissions.map((sub) => {
                    const hw = homeworks.find(h => h.id === sub.homeworkId);

                    return (
                      <div key={sub.id} class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div class="flex items-center justify-between">
                          <div>
                            <span class="text-xs font-bold text-indigo-700">@{sub.studentUsername}</span>
                            <h4 class="text-xs font-extrabold text-slate-900">{hw?.title || 'Ödev'}</h4>
                          </div>
                          <span class="text-[10px] text-slate-400 font-medium">
                            {new Date(sub.submittedAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>

                        <div class="p-3 bg-white rounded-xl text-xs text-slate-700 font-sans border border-slate-100 whitespace-pre-line">
                          {sub.content}
                        </div>

                        <button
                          onClick={() => {
                            setGradingSub(sub);
                            setGradeScore(90);
                            setGradeFeedback('Tebrikler, ödevin başarıyla tamamlandı!');
                          }}
                          class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1"
                        >
                          <Award class="w-3.5 h-3.5" />
                          <span>Puanla & Geri Bildirim Yaz</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Graded Submissions List */}
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 class="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <CheckCircle2 class="w-4 h-4 text-emerald-500" />
                  <span>Puanlanmış & Geri Gönderilmiş Ödevler ({submissions.filter(s => s.status === 'graded').length})</span>
                </h3>
              </div>

              <div class="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {submissions.filter(s => s.status === 'graded').length === 0 ? (
                  <div class="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
                    Henüz puanlanmış bir ödev bulunmamaktadır.
                  </div>
                ) : (
                  submissions.filter(s => s.status === 'graded').map((sub) => {
                    const hw = homeworks.find(h => h.id === sub.homeworkId);

                    return (
                      <div key={sub.id} class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2 text-xs">
                        <div class="flex items-center justify-between">
                          <div>
                            <span class="font-bold text-slate-900">@{sub.studentUsername}</span>
                            <p class="text-slate-600 font-medium text-[11px]">{hw?.title}</p>
                          </div>
                          <span class="px-2.5 py-1 bg-emerald-600 text-white font-black text-xs rounded-lg shadow-sm">
                            {sub.score} / 100 Puan
                          </span>
                        </div>

                        <div class="p-2.5 bg-white rounded-xl border border-emerald-100 text-slate-600 italic">
                          " {sub.teacherFeedback} "
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Active Homeworks List */}
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-sm font-black text-slate-900">Sistemdeki Aktif Ödevler ({homeworks.length})</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homeworks.map((hw) => (
                <div key={hw.id} class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 bg-brand-50 text-brand-700 font-bold rounded-md text-[10px]">
                      {hw.targetGrade === 'all' ? 'Tüm Sınıflar' : `${hw.targetGrade}. Sınıf`}
                    </span>
                    <span class="text-slate-400 font-medium">Son Teslim: {hw.dueDate}</span>
                  </div>
                  <h4 class="font-bold text-slate-900 text-sm">{hw.title}</h4>
                  <p class="text-slate-600 leading-relaxed">{hw.description}</p>
                  <p class="text-[11px] text-slate-400 pt-1">
                    Hedef: {hw.targetStudentIds === 'all' ? 'Tüm Kayıtlı Öğrenciler' : `${hw.targetStudentIds.length} Seçili Öğrenci`}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: DENETİMLİ MESAJLAŞMA MERKEZİ                           */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'messages' && (
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-black text-slate-900">Merkezi Denetimli Mesajlaşma</h2>
              <p class="text-xs text-slate-500">
                Öğrencilerinizle doğrudan mesajlaşın ya da öğrenciler arasındaki tüm mesajları denetleyip kontrolü elinizde tutun.
              </p>
            </div>

            {/* Sub Tabs */}
            <div class="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setChatFilter('direct')}
                class={`px-3 py-1.5 rounded-lg transition-all ${
                  chatFilter === 'direct' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Öğrenciyle Doğrudan Sohbet
              </button>
              <button
                onClick={() => setChatFilter('supervise')}
                class={`px-3 py-1.5 rounded-lg transition-all ${
                  chatFilter === 'supervise' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🛡️ Tüm Sohbetleri Denetle
              </button>
            </div>
          </div>

          {chatFilter === 'direct' ? (
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Student Picker for Chat */}
              <div class="lg:col-span-1 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Öğrenci Seç</h3>
                <div class="space-y-1.5 max-h-[500px] overflow-y-auto">
                  {students.map((stu) => {
                    const isSelected = activeChatStudent?.id === stu.id;
                    return (
                      <div
                        key={stu.id}
                        onClick={() => setActiveChatStudent(stu)}
                        class={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div class="flex items-center space-x-2.5">
                          <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                            {stu.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p class="text-xs font-bold">{stu.name || stu.username}</p>
                            <p class="text-[10px] text-slate-400">@{stu.username}</p>
                          </div>
                        </div>
                        <ChevronRight class="w-4 h-4 text-slate-400" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat View */}
              <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
                {activeChatStudent ? (
                  <>
                    <div class="p-4 border-b border-slate-100 flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm">
                        {activeChatStudent.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 class="text-sm font-bold text-slate-900">{activeChatStudent.name || activeChatStudent.username}</h4>
                        <p class="text-xs text-slate-400">@{activeChatStudent.username} • {activeChatStudent.grade}. Sınıf</p>
                      </div>
                    </div>

                    <div class="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                      {activeChatMessages.length === 0 ? (
                        <div class="p-8 text-center text-slate-400 text-xs">
                          Bu öğrenciyle henüz bir mesajlaşmanız bulunmuyor. İlk mesajı siz yazabilirsiniz!
                        </div>
                      ) : (
                        activeChatMessages.map((msg) => {
                          const isMine = msg.senderId === currentUser.id;
                          return (
                            <div
                              key={msg.id}
                              class={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                class={`max-w-[75%] p-3 rounded-2xl text-xs ${
                                  isMine
                                    ? 'bg-indigo-600 text-white rounded-br-sm'
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
                        placeholder="Öğrenciye mesajınızı yazınız..."
                        value={chatMessageText}
                        onChange={(e) => setChatMessageText(e.target.value)}
                        class="flex-grow px-4 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        class="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all"
                      >
                        <Send class="w-4 h-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div class="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
                    <MessageSquare class="w-10 h-10 text-slate-300" />
                    <p class="text-xs">Mesajlaşmak için sol listeden bir öğrenci seçiniz.</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Supervised Audit View */
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center space-x-2">
                <ShieldCheck class="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  <strong>Öğretmen Gözetim Modu:</strong> Öğrencilerin birbirleri arasında yaptığı tüm yazışmalar güvenli öğrenme ortamı sağlamak için bu denetim panosunda kayıt altındadır.
                </span>
              </div>

              <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {allMessages.length === 0 ? (
                  <div class="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
                    Sistemde henüz mesajlaşma kaydı bulunmuyor.
                  </div>
                ) : (
                  allMessages.map((msg) => (
                    <div key={msg.id} class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between text-xs">
                      <div class="space-y-1">
                        <div class="flex items-center space-x-2">
                          <span class="font-bold text-indigo-700">{msg.senderName}</span>
                          <span class="text-slate-400">➔</span>
                          <span class="font-bold text-slate-800">{msg.receiverName}</span>
                        </div>
                        <p class="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 max-w-xl">
                          {msg.text}
                        </p>
                      </div>
                      <span class="text-[10px] text-slate-400 whitespace-nowrap ml-4">
                        {new Date(msg.timestamp).toLocaleDateString('tr-TR')} {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: YILLIK PLANLAR VE MODÜLLER                             */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'plans' && (
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-black text-slate-900">Yıllık Planlar ve Ders Modülleri (MEB 5-8. Sınıf)</h2>
            <p class="text-xs text-slate-500">
              Milli Eğitim Bakanlığı müfredatına tam uyumlu yıllık ünite planları ve ders modülleriniz.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.annualPlans.map((plan) => (
              <div key={plan.id} class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div class="flex items-center space-x-2">
                    <span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black">
                      {plan.grade}
                    </span>
                    <h3 class="text-sm font-bold text-slate-900">{plan.title}</h3>
                  </div>
                </div>

                <div class="space-y-2.5">
                  {plan.units.map((unit) => (
                    <div key={unit.no} class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div class="flex items-center justify-between font-bold text-slate-900">
                        <span>Unit {unit.no}: {unit.name}</span>
                        <span class="text-indigo-600 font-medium text-[11px]">{unit.duration}</span>
                      </div>
                      <p class="text-slate-500 text-[11px]">{unit.focus}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Teacher Modules */}
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-sm font-black text-slate-900">Aktif Öğretmen Ders Modülleri</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plans.modules.map((mod) => (
                <div key={mod.id} class="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                      {mod.grade}
                    </span>
                    <span class="text-emerald-600 font-bold text-[10px]">{mod.status}</span>
                  </div>
                  <h4 class="font-extrabold text-slate-900">{mod.title}</h4>
                  <p class="text-slate-500">{mod.filesCount} Dijital Materyal & Oyun</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: DERS PROGRAMI VE CANLI SINIF ARAÇLARI                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'schedule' && (
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-black text-slate-900">Haftalık Ders Programı & Sınıf İçi Canlı Araçlar</h2>
            <p class="text-xs text-slate-500">
              Ders saatleri, sınıf şubeleri ve ders esnasında kullanabileceğiniz pratik dijital araçlar.
            </p>
          </div>

          {/* Live Classroom Utilities Row */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Timer / Stopwatch */}
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-center">
              <div class="flex items-center justify-center space-x-2 text-xs font-bold text-indigo-600 uppercase">
                <Clock class="w-4 h-4" />
                <span>Sınıf İçi Geri Sayım Sayacı</span>
              </div>

              <div class="text-5xl font-black text-slate-900 tracking-tight font-mono py-2">
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </div>

              <div class="flex items-center justify-center gap-2">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  class={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                    timerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {timerRunning ? 'Duraklat' : 'Başlat'}
                </button>
                <button
                  onClick={() => { setTimerRunning(false); setTimerSeconds(60); }}
                  class="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                  title="Sıfırla"
                >
                  <RotateCcw class="w-4 h-4" />
                </button>
              </div>

              <div class="flex items-center justify-center gap-1.5 pt-1 text-[11px]">
                {[30, 60, 120, 300].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => { setTimerRunning(false); setTimerSeconds(sec); }}
                    class="px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg font-bold"
                  >
                    {sec >= 60 ? `${sec / 60} dk` : `${sec} sn`}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Random Student Picker */}
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-center">
              <div class="flex items-center justify-center space-x-2 text-xs font-bold text-brand-600 uppercase">
                <Sparkles class="w-4 h-4" />
                <span>Rastgele Öğrenci Seçici</span>
              </div>

              <div class="h-16 flex items-center justify-center">
                {pickedStudent ? (
                  <div class="animate-bounce">
                    <p class="text-xl font-black text-indigo-700">🎯 {pickedStudent.name || pickedStudent.username}</p>
                    <p class="text-xs text-slate-500">@{pickedStudent.username}</p>
                  </div>
                ) : (
                  <p class="text-xs text-slate-400">Çarkı çevirip sınıftan bir öğrenci seçin</p>
                )}
              </div>

              <button
                onClick={handlePickRandomStudent}
                disabled={isPicking || students.length === 0}
                class="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {isPicking ? 'Seçiliyor...' : '🎲 Rastgele Öğrenci Seç'}
              </button>
            </div>

            {/* 3. Quick Grade Calculator */}
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-center space-x-2 text-xs font-bold text-purple-600 uppercase">
                <Award class="w-4 h-4" />
                <span>Hızlı Sınav Notu Hesaplayıcı</span>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label class="block text-slate-500 mb-1">Toplam Soru</label>
                  <input
                    type="number"
                    min="1"
                    value={calcTotalQuestions}
                    onChange={(e) => setCalcTotalQuestions(Number(e.target.value) || 1)}
                    class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                  />
                </div>
                <div>
                  <label class="block text-slate-500 mb-1">Doğru Sayısı</label>
                  <input
                    type="number"
                    min="0"
                    value={calcCorrectAnswers}
                    onChange={(e) => setCalcCorrectAnswers(Number(e.target.value) || 0)}
                    class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                  />
                </div>
              </div>

              <div class="text-center pt-1">
                <span class="text-xs text-slate-400">100 Üzerinden Puan: </span>
                <span class="text-xl font-black text-purple-700">
                  {Math.round((calcCorrectAnswers / (calcTotalQuestions || 1)) * 100)}
                </span>
              </div>
            </div>

          </div>

          {/* Weekly Timetable Table */}
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-sm font-black text-slate-900">Haftalık Ders Dağılım Tablosu (Pazartesi - Cuma)</h3>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(plans.timetable).map(([day, periods]) => (
                <div key={day} class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <div class="text-center font-black text-xs text-indigo-700 pb-2 border-b border-slate-200">
                    {day}
                  </div>
                  <div class="space-y-2">
                    {periods.map((p, idx) => (
                      <div key={idx} class="p-2.5 bg-white rounded-xl border border-slate-100 text-xs space-y-1">
                        <div class="flex items-center justify-between font-bold text-slate-900">
                          <span class="text-indigo-600">{p.classCode}</span>
                          <span class="text-[10px] text-slate-400">{p.room}</span>
                        </div>
                        <p class="text-[11px] text-slate-600 truncate">{p.topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: YENİ ÖDEV OLUŞTURMA                                    */}
      {/* ------------------------------------------------------------- */}
      {showNewHwModal && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-lg font-black text-slate-900">Öğrencilere Yeni Ödev Gönder</h3>
              <button onClick={() => setShowNewHwModal(false)} class="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateHomework} class="space-y-4 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Ödev Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 8. Sınıf Unit 2 Teen Life Kelime Alıştırması"
                  value={newHwTitle}
                  onChange={(e) => setNewHwTitle(e.target.value)}
                  class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Ödev Talimatı & Açıklama</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Öğrencilerinizin yapmasını istediğiniz yönergeyi yazınız..."
                  value={newHwDesc}
                  onChange={(e) => setNewHwDesc(e.target.value)}
                  class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Sınıf Seviyesi</label>
                  <select
                    value={newHwGrade}
                    onChange={(e) => setNewHwGrade(e.target.value)}
                    class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Tüm Sınıflar</option>
                    <option value="5">5. Sınıf</option>
                    <option value="6">6. Sınıf</option>
                    <option value="7">7. Sınıf</option>
                    <option value="8">8. Sınıf (LGS)</option>
                  </select>
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Son Teslim Tarihi</label>
                  <input
                    type="date"
                    value={newHwDueDate}
                    onChange={(e) => setNewHwDueDate(e.target.value)}
                    class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Hedef Öğrenciler</label>
                <div class="flex items-center space-x-4 mb-2">
                  <label class="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="hwTarget"
                      checked={newHwTarget === 'all'}
                      onChange={() => setNewHwTarget('all')}
                    />
                    <span>Tüm Kayıtlı Öğrenciler</span>
                  </label>
                  <label class="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="hwTarget"
                      checked={newHwTarget === 'custom'}
                      onChange={() => setNewHwTarget('custom')}
                    />
                    <span>Belirli Öğrencileri Seç</span>
                  </label>
                </div>

                {newHwTarget === 'custom' && (
                  <div class="max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl space-y-1.5 bg-slate-50">
                    {students.map((stu) => {
                      const isChecked = newHwSelectedStudents.includes(stu.id);
                      return (
                        <label key={stu.id} class="flex items-center space-x-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewHwSelectedStudents([...newHwSelectedStudents, stu.id]);
                              } else {
                                setNewHwSelectedStudents(newHwSelectedStudents.filter(id => id !== stu.id));
                              }
                            }}
                          />
                          <span>{stu.name || stu.username} (@{stu.username} - {stu.grade}. Sınıf)</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div class="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewHwModal(false)}
                  class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md"
                >
                  Ödevi Yayınla 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ÖDEV PUANLAMA & DÖNÜT YAZMA                           */}
      {/* ------------------------------------------------------------- */}
      {gradingSub && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-base font-black text-slate-900">Ödev Puanlama ve Dönüt</h3>
              <button onClick={() => setGradingSub(null)} class="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <p class="text-slate-500">Öğrenci: <strong class="text-slate-900">@{gradingSub.studentUsername}</strong></p>
              <div class="text-slate-700 font-sans italic bg-white p-2 rounded-lg border border-slate-200 whitespace-pre-line max-h-36 overflow-y-auto">
                {gradingSub.content}
              </div>
            </div>

            <form onSubmit={handleGradeSubmission} class="space-y-4 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Verilen Puan (100 Üzerinden)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-center text-lg text-indigo-700"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Öğretmen Geri Bildirimi / Notu</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Öğrencinize yapıcı geri bildiriminizi yazınız..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div class="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setGradingSub(null)}
                  class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md"
                >
                  Puanı Kaydet & Öğrenciye İlet ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: PROFİL DÜZENLEME                                       */}
      {/* ------------------------------------------------------------- */}
      {showProfileEdit && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-base font-black text-slate-900">Öğretmen Bilgilerini Güncelle</h3>
              <button onClick={() => setShowProfileEdit(false)} class="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} class="space-y-3 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Okul Adı</label>
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Veli Görüşme Saatleri</label>
                <input
                  type="text"
                  value={editHours}
                  onChange={(e) => setEditHours(e.target.value)}
                  class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Günün İlham Sözü (Motto)</label>
                <input
                  type="text"
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Öğretmen Biyografisi</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div class="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileEdit(false)}
                  class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
