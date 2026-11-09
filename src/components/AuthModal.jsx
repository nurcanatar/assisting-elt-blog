import React, { useState } from 'react';
import { X, Lock, User, UserPlus, GraduationCap, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginUser, registerStudent } from '../services/db';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, defaultTab = 'student-login' }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'student-login' | 'student-register' | 'teacher-login'
  
  // Student Login State
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  // Student Register State
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGrade, setRegGrade] = useState('8');

  // Teacher Login State
  const [teacherUsername, setTeacherUsername] = useState('nurcanelci');
  const [teacherPassword, setTeacherPassword] = useState('');

  // Status & Error
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Switch Tab
  const switchTab = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  // Handle Student Login
  const handleStudentLogin = (e) => {
    e.preventDefault();
    resetForm();

    if (!studentUsername || !studentPassword) {
      setErrorMsg('Lütfen kullanıcı adı ve şifrenizi giriniz.');
      return;
    }

    const res = loginUser(studentUsername, studentPassword);
    if (res.success) {
      setSuccessMsg(`Hoş geldin, ${res.user.name || res.user.username}!`);
      setTimeout(() => {
        onAuthSuccess(res.user);
        onClose();
      }, 600);
    } else {
      setErrorMsg(res.error || 'Giriş başarısız! Bilgilerinizi kontrol ediniz.');
    }
  };

  // Handle Student Register
  const handleStudentRegister = (e) => {
    e.preventDefault();
    resetForm();

    if (!regUsername || !regPassword) {
      setErrorMsg('Kayıt olmak için kullanıcı adı ve şifre zorunludur!');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMsg('Şifreniz en az 4 karakter olmalıdır.');
      return;
    }

    const res = registerStudent(regUsername, regPassword, regGrade);
    if (res.success) {
      setSuccessMsg(`Kaydınız başarıyla oluşturuldu! Giriş yapılıyor...`);
      setTimeout(() => {
        onAuthSuccess(res.user);
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.error);
    }
  };

  // Handle Teacher Login
  const handleTeacherLogin = (e) => {
    e.preventDefault();
    resetForm();

    if (!teacherUsername || !teacherPassword) {
      setErrorMsg('Öğretmen kullanıcı adı ve şifresi gereklidir.');
      return;
    }

    const res = loginUser(teacherUsername, teacherPassword);
    if (res.success && res.user.role === 'teacher') {
      setSuccessMsg('Öğretmen girişi başarılı. Hoş geldiniz Nurcan Öğretmenim!');
      setTimeout(() => {
        onAuthSuccess(res.user);
        onClose();
      }, 600);
    } else {
      setErrorMsg('Hatalı öğretmen giriş bilgileri! (Kullanıcı Adı: nurcanelci | Şifre: 123456)');
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative transform transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X class="w-5 h-5" />
        </button>

        {/* Modal Header Tabs */}
        <div class="bg-slate-50 border-b border-slate-200 px-6 pt-6 pb-3">
          <div class="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
            <GraduationCap class="w-4 h-4" />
            <span>assisting.com ELT Portalı</span>
          </div>
          <h3 class="text-xl font-black text-slate-900">
            {activeTab === 'teacher-login' ? 'Öğretmen Yönetim Girişi' : 'Öğrenci Portalı Giriş & Kayıt'}
          </h3>

          {/* Navigation Pill Tabs */}
          <div class="grid grid-cols-3 gap-1.5 mt-4 p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
            <button
              onClick={() => switchTab('student-login')}
              class={`py-2 rounded-lg transition-all ${
                activeTab === 'student-login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Öğrenci Girişi
            </button>
            <button
              onClick={() => switchTab('student-register')}
              class={`py-2 rounded-lg transition-all ${
                activeTab === 'student-register'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kayıt Ol ✨
            </button>
            <button
              onClick={() => switchTab('teacher-login')}
              class={`py-2 rounded-lg transition-all ${
                activeTab === 'teacher-login'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-indigo-700 hover:text-indigo-900'
              }`}
            >
              👩‍🏫 Öğretmen
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div class="p-6">
          
          {/* Alerts */}
          {errorMsg && (
            <div class="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2 animate-shake">
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div class="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle2 class="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: Öğrenci Girişi */}
          {activeTab === 'student-login' && (
            <form onSubmit={handleStudentLogin} class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Öğrenci Kullanıcı Adı</label>
                <div class="relative">
                  <input
                    type="text"
                    required
                    placeholder="Örn: zeynep_y veya ali_kaya"
                    value={studentUsername}
                    onChange={(e) => setStudentUsername(e.target.value)}
                    class="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                  <User class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Şifre</label>
                <div class="relative">
                  <input
                    type="password"
                    required
                    placeholder="Şifrenizi giriniz"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    class="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                  <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                class="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/25 transition-all hover:scale-[1.01]"
              >
                Öğrenci Paneline Giriş Yap 🚀
              </button>

              <div class="text-center pt-2">
                <p class="text-xs text-slate-500">
                  Henüz bir hesabın yok mu?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('student-register')}
                    class="text-brand-600 font-bold hover:underline"
                  >
                    Hemen Kayıt Ol
                  </button>
                </p>
                <p class="text-[11px] text-slate-400 mt-2">
                  (Örnek demo öğrenciler: <code>zeynep_y</code> / <code>123456</code> veya <code>ali_kaya</code> / <code>123456</code>)
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: Öğrenci Kaydı */}
          {activeTab === 'student-register' && (
            <form onSubmit={handleStudentRegister} class="space-y-4">
              <div class="p-3 bg-brand-50 border border-brand-200/80 rounded-xl text-brand-800 text-xs">
                💡 Kayıt olmak için yalnızca <strong>kullanıcı adı</strong> ve <strong>şifre</strong> belirlemen yeterlidir!
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">İstediğin Kullanıcı Adı</label>
                <div class="relative">
                  <input
                    type="text"
                    required
                    placeholder="Örn: mehmet2026 veya elif_ingilizce"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    class="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                  <UserPlus class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Şifre Belirle</label>
                <div class="relative">
                  <input
                    type="password"
                    required
                    placeholder="En az 4 karakterli bir şifre"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    class="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                  <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Sınıf Seviyeniz</label>
                <select
                  value={regGrade}
                  onChange={(e) => setRegGrade(e.target.value)}
                  class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="5">5. Sınıf</option>
                  <option value="6">6. Sınıf</option>
                  <option value="7">7. Sınıf</option>
                  <option value="8">8. Sınıf (LGS Hazırlık)</option>
                </select>
              </div>

              <button
                type="submit"
                class="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25 transition-all hover:scale-[1.01]"
              >
                Hemen Kaydol ve Başla ✨
              </button>

              <div class="text-center pt-2">
                <p class="text-xs text-slate-500">
                  Zaten bir hesabın var mı?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('student-login')}
                    class="text-brand-600 font-bold hover:underline"
                  >
                    Giriş Yap
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 3: Öğretmen Girişi */}
          {activeTab === 'teacher-login' && (
            <form onSubmit={handleTeacherLogin} class="space-y-4">
              <div class="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-xs flex items-center space-x-2">
                <ShieldCheck class="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Tek yönetici öğretmen paneli. Yıllık planlar, ödevler ve tüm kontroller bu alandadır.</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Öğretmen Kullanıcı Adı</label>
                <div class="relative">
                  <input
                    type="text"
                    required
                    value={teacherUsername}
                    onChange={(e) => setTeacherUsername(e.target.value)}
                    class="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                  />
                  <ShieldCheck class="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Şifre</label>
                <div class="relative">
                  <input
                    type="password"
                    required
                    placeholder="Şifrenizi giriniz"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    class="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                <p class="text-[11px] text-slate-400 mt-1">Öğretmen şifresi: <code>123456</code></p>
              </div>

              <button
                type="submit"
                class="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.01]"
              >
                Öğretmen Masasına Geç 👩‍🏫
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
