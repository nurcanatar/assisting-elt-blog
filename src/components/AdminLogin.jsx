import React, { useState } from 'react';
import { BookOpenCheck, Lock, User, Eye, EyeOff, ArrowLeft, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLogin({ onLogin, onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Call authentication handler
    const success = onLogin(username.trim(), password);
    if (!success) {
      setErrorMessage('Kullanıcı adı veya şifre hatalı! Lütfen tekrar deneyin.');
    }
  };

  const fillDefaultCredentials = () => {
    setUsername('admin');
    setPassword('123456');
    setErrorMessage('');
  };

  return (
    <div class="min-h-[85vh] bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-6">
        
        {/* Top Logo & Title */}
        <div class="text-center space-y-3">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-brand-500/25">
            <BookOpenCheck class="w-9 h-9" />
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            assisting<span class="text-brand-600">.com</span>
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium">
            Öğretmen Yönetim Paneli Girişi
          </p>
        </div>

        {/* Login Form Card */}
        <div class="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          
          <div class="border-b border-slate-100 pb-4">
            <h3 class="text-lg font-bold text-slate-900">Giriş Yapın</h3>
            <p class="text-xs text-slate-500 mt-0.5">İçerik ve materyallerinizi yönetmek için hesabınıza erişin.</p>
          </div>

          {/* Quick Demo Info Callout */}
          <div class="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start space-x-2.5 text-xs text-indigo-900">
            <ShieldCheck class="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div class="flex-1 space-y-1">
              <p class="font-bold">Örnek Giriş Bilgileri:</p>
              <p class="font-mono text-[11px] text-indigo-800">
                Kullanıcı Adı: <span class="font-bold">admin</span> | Şifre: <span class="font-bold">123456</span>
              </p>
              <button
                type="button"
                onClick={fillDefaultCredentials}
                class="text-[10px] font-bold text-brand-600 underline hover:text-brand-800 pt-0.5"
              >
                Otomatik Doldur ⚡
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div class="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-rose-700 text-xs font-semibold animate-fade-in">
              <AlertCircle class="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} class="space-y-4">
            
            {/* Username Input */}
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Kullanıcı Adı *</label>
              <div class="relative">
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  class="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-medium"
                />
                <User class="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Şifre *</label>
              <div class="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-medium"
                />
                <Lock class="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  class="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff class="w-4 h-4" /> : <Eye class="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              class="w-full flex items-center justify-center space-x-2 py-3.5 px-6 font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl mt-2"
            >
              <LogIn class="w-4 h-4" />
              <span>Admin Paneline Giriş Yap</span>
            </button>
          </form>

          {/* Return to Public Site */}
          <div class="pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              class="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft class="w-3.5 h-3.5" />
              <span>Ana Sayfaya Dön</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
