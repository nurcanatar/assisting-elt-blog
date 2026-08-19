import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderPlus, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  BookOpen,
  X,
  Search,
  Image,
  User,
  Tag,
  HardDrive,
  Gamepad2,
  LogOut
} from 'lucide-react';
import AdminLogin from '../components/AdminLogin';

export default function AdminPage({ 
  posts, 
  setPosts, 
  categories, 
  setCategories, 
  onNavigate, 
  onSelectPost,
  isAuthenticated,
  onLogin,
  onLogout
}) {
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard' | 'posts' | 'categories'
  
  // Post Form State
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postFormData, setPostFormData] = useState({
    title: '',
    coverImage: '',
    categoryId: categories[0]?.id || '',
    authorName: 'Öğr. Elif Yılmaz',
    authorRole: 'Ortaokul İngilizce Öğretmeni',
    content: '',
    summary: '',
    driveLink: '',
    gameLink: ''
  });

  // Category Form State
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [catFormData, setCatFormData] = useState({
    name: '',
    description: '',
    icon: 'FileText'
  });

  // Admin Search Query
  const [adminSearch, setAdminSearch] = useState('');
  
  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Preset Cover Images for Teachers
  const presetImages = [
    { label: 'İngilizce Kitap & Sözlük', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Sınıf & Öğrenciler', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Ders Teknolojisi & Bilgisayar', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Yapay Zeka & Dijital Tasarım', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Oyun & Eğlenceli Etkinlik', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80' }
  ];

  // If not logged in, render Login Component!
  if (!isAuthenticated) {
    return <AdminLogin onLogin={onLogin} onNavigate={onNavigate} />;
  }

  // Open Post Form (New or Edit)
  const handleOpenPostForm = (postToEdit = null) => {
    if (postToEdit) {
      setEditingPostId(postToEdit.id);
      setPostFormData({
        title: postToEdit.title,
        coverImage: postToEdit.coverImage,
        categoryId: postToEdit.categoryId,
        authorName: postToEdit.author.name,
        authorRole: postToEdit.author.role,
        content: postToEdit.content,
        summary: postToEdit.summary || '',
        driveLink: postToEdit.driveLink || '',
        gameLink: postToEdit.gameLink || ''
      });
    } else {
      setEditingPostId(null);
      setPostFormData({
        title: '',
        coverImage: presetImages[0].url,
        categoryId: categories[0]?.id || '',
        authorName: 'Öğr. Elif Yılmaz',
        authorRole: 'Ortaokul İngilizce Öğretmeni',
        content: '',
        summary: '',
        driveLink: '',
        gameLink: ''
      });
    }
    setIsPostFormOpen(true);
  };

  // Save Post (Create or Update)
  const handleSavePost = (e) => {
    e.preventDefault();

    const selectedCat = categories.find(c => c.id === postFormData.categoryId) || categories[0];
    
    // Auto-generate summary from content if empty
    const plainContent = postFormData.content.replace(/<[^>]+>/g, '');
    const finalSummary = postFormData.summary || (plainContent.slice(0, 150) + '...');

    if (editingPostId) {
      // Update existing
      const updatedPosts = posts.map(p => {
        if (p.id === editingPostId) {
          return {
            ...p,
            title: postFormData.title,
            coverImage: postFormData.coverImage,
            category: selectedCat.name,
            categoryId: selectedCat.id,
            summary: finalSummary,
            driveLink: postFormData.driveLink,
            gameLink: postFormData.gameLink,
            content: postFormData.content.startsWith('<') ? postFormData.content : `<p class="lead text-lg text-slate-600 mb-6">${postFormData.content}</p>`,
            author: {
              ...p.author,
              name: postFormData.authorName,
              role: postFormData.authorRole
            }
          };
        }
        return p;
      });
      setPosts(updatedPosts);
      showToast('Blog yazısı başarıyla güncellendi!');
    } else {
      // Create new
      const newPostObj = {
        id: Date.now(),
        slug: postFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: postFormData.title,
        summary: finalSummary,
        coverImage: postFormData.coverImage || presetImages[0].url,
        category: selectedCat.name,
        categoryId: selectedCat.id,
        driveLink: postFormData.driveLink,
        gameLink: postFormData.gameLink,
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        readTime: '5 dk okuma',
        featured: false,
        author: {
          name: postFormData.authorName,
          role: postFormData.authorRole,
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        },
        content: postFormData.content.startsWith('<') ? postFormData.content : `<p class="lead text-lg text-slate-600 mb-6">${postFormData.content}</p>`
      };
      setPosts([newPostObj, ...posts]);
      showToast('Yeni blog yazısı başarıyla eklendi!');
    }

    setIsPostFormOpen(false);
  };

  // Delete Post
  const handleDeletePost = (id) => {
    if (window.confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) {
      const filtered = posts.filter(p => p.id !== id);
      setPosts(filtered);
      showToast('Blog yazısı silindi.');
    }
  };

  // Save Category
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!catFormData.name) return;

    const newCatId = catFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check if exists
    if (categories.some(c => c.id === newCatId)) {
      alert('Bu isimde bir kategori zaten mevcut!');
      return;
    }

    const newCategoryObj = {
      id: newCatId,
      name: catFormData.name,
      description: catFormData.description || `${catFormData.name} ile ilgili İngilizce materyalleri.`,
      icon: catFormData.icon,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
      count: 0
    };

    setCategories([...categories, newCategoryObj]);
    setCatFormData({ name: '', description: '', icon: 'FileText' });
    setIsCategoryFormOpen(false);
    showToast('Yeni kategori eklendi!');
  };

  // Delete Category
  const handleDeleteCategory = (catId) => {
    if (categories.length <= 1) {
      alert('En az bir kategori bulunmalıdır.');
      return;
    }
    if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      const updatedCats = categories.filter(c => c.id !== catId);
      setCategories(updatedCats);
      showToast('Kategori silindi.');
    }
  };

  // Filtered posts for admin table
  const filteredAdminPosts = posts.filter(p => 
    p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div class="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div class="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 border border-slate-700 animate-bounce">
          <CheckCircle2 class="w-5 h-5 text-emerald-400" />
          <span class="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div class="max-w-7xl mx-auto space-y-6">
        
        {/* Admin Header */}
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
              <LayoutDashboard class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h1 class="text-2xl font-black text-slate-900">Yönetim Paneli</h1>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Oturum Açıldı
                </span>
              </div>
              <p class="text-xs text-slate-500">assisting.com web sitesi içerik, Google Drive ve Oyun yönetim ekranı</p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('home')}
              class="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-300"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>Web Sitesine Dön</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              class="flex items-center space-x-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all border border-rose-200"
              title="Güvenli Çıkış Yap"
            >
              <LogOut class="w-4 h-4 text-rose-600" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div class="flex items-center space-x-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setAdminTab('dashboard')}
            class={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              adminTab === 'dashboard'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setAdminTab('posts')}
            class={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              adminTab === 'posts'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <FileText class="w-4 h-4" />
            <span>Blog Yazıları ({posts.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('categories')}
            class={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              adminTab === 'categories'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <FolderPlus class="w-4 h-4" />
            <span>Kategoriler ({categories.length})</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD */}
        {adminTab === 'dashboard' && (
          <div class="space-y-6">
            {/* Summary Metrics */}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam Blog Yazısı</p>
                  <h3 class="text-3xl font-black text-slate-900 mt-1">{posts.length}</h3>
                  <p class="text-[11px] text-emerald-600 font-semibold mt-1">Yayında olan içerik sayısı</p>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText class="w-6 h-6" />
                </div>
              </div>

              <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam Kategori</p>
                  <h3 class="text-3xl font-black text-slate-900 mt-1">{categories.length}</h3>
                  <p class="text-[11px] text-purple-600 font-semibold mt-1">Sınıf seviyeleri ve alanlar</p>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FolderPlus class="w-6 h-6" />
                </div>
              </div>

              <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Hızlı İşlem</p>
                  <button
                    onClick={() => { setAdminTab('posts'); handleOpenPostForm(); }}
                    class="mt-3 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5"
                  >
                    <Plus class="w-4 h-4" />
                    <span>Yeni Yazı & Drive Bağlantısı Ekle</span>
                  </button>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles class="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Recent Posts Overview */}
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-slate-900">Son Eklenen Blog Yazıları ve Bağlantılar</h3>
                <button 
                  onClick={() => setAdminTab('posts')}
                  class="text-xs font-bold text-brand-600 hover:underline"
                >
                  Tümünü Yönet →
                </button>
              </div>

              <div class="divide-y divide-slate-100">
                {posts.slice(0, 4).map((post) => (
                  <div key={post.id} class="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                    <div class="flex items-center space-x-3">
                      <img src={post.coverImage} alt="" class="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                      <div>
                        <h4 class="text-sm font-bold text-slate-900 line-clamp-1">{post.title}</h4>
                        <div class="flex items-center space-x-2 text-[11px] text-slate-500">
                          <span class="font-medium text-brand-600">{post.category}</span>
                          <span>•</span>
                          <span>{post.date}</span>
                          {post.driveLink && <span class="text-blue-600 font-bold">📂 Drive Var</span>}
                          {post.gameLink && <span class="text-rose-600 font-bold">🎮 Oyun Var</span>}
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center space-x-1">
                      <button
                        onClick={() => { onSelectPost(post, 'admin'); }}
                        class="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 flex items-center space-x-1"
                        title="Sitede İncele"
                      >
                        <Eye class="w-4 h-4 text-brand-600" />
                        <span class="text-xs font-bold text-slate-600">İncele</span>
                      </button>
                      <button
                        onClick={() => { setAdminTab('posts'); handleOpenPostForm(post); }}
                        class="p-2 text-brand-600 hover:bg-brand-50 rounded-lg"
                        title="Düzenle"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: BLOG POSTS MANAGEMENT */}
        {adminTab === 'posts' && (
          <div class="space-y-6">
            
            {/* Actions Bar */}
            <div class="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Yazı veya kategori ara..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  class="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Search class="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <button
                onClick={() => handleOpenPostForm()}
                class="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                <Plus class="w-4 h-4" />
                <span>Yeni Blog Yazısı & Materyal Ekle</span>
              </button>
            </div>

            {/* Posts List Table */}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th class="py-4 px-6">Görsel & Başlık</th>
                      <th class="py-4 px-4">Kategori</th>
                      <th class="py-4 px-4">Drive & Oyun</th>
                      <th class="py-4 px-4">Tarih</th>
                      <th class="py-4 px-6 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    {filteredAdminPosts.map((post) => (
                      <tr key={post.id} class="hover:bg-slate-50/70 transition-colors">
                        <td class="py-4 px-6">
                          <div class="flex items-center space-x-3">
                            <img src={post.coverImage} alt="" class="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                            <div>
                              <p class="font-bold text-slate-900 text-sm line-clamp-1">{post.title}</p>
                              <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{post.summary}</p>
                            </div>
                          </div>
                        </td>

                        <td class="py-4 px-4">
                          <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                            {post.category}
                          </span>
                        </td>

                        <td class="py-4 px-4 whitespace-nowrap space-x-1">
                          {post.driveLink ? (
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center space-x-1">
                              <HardDrive class="w-3 h-3" />
                              <span>Drive Var</span>
                            </span>
                          ) : (
                            <span class="text-slate-400 text-[11px]">-</span>
                          )}

                          {post.gameLink && (
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center space-x-1">
                              <Gamepad2 class="w-3 h-3" />
                              <span>Oyun Var</span>
                            </span>
                          )}
                        </td>

                        <td class="py-4 px-4 text-slate-500 font-medium whitespace-nowrap">
                          {post.date}
                        </td>

                        <td class="py-4 px-6 text-right whitespace-nowrap">
                          <div class="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => { onSelectPost(post, 'admin'); }}
                              class="p-2 text-brand-600 hover:bg-brand-50 rounded-lg flex items-center space-x-1"
                              title="İncele (Önizleme)"
                            >
                              <Eye class="w-4 h-4" />
                              <span class="text-xs font-bold">İncele</span>
                            </button>
                            <button
                              onClick={() => handleOpenPostForm(post)}
                              class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                              title="Düzenle"
                            >
                              <Edit class="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              class="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Sil"
                            >
                              <Trash2 class="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {adminTab === 'categories' && (
          <div class="space-y-6">
            
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-extrabold text-slate-900">Mevcut Kategoriler</h2>
              <button
                onClick={() => setIsCategoryFormOpen(true)}
                class="flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                <Plus class="w-4 h-4" />
                <span>Yeni Kategori Ekle</span>
              </button>
            </div>

            {/* Category Form Modal / Inline */}
            {isCategoryFormOpen && (
              <div class="bg-white p-6 rounded-3xl border border-brand-200 shadow-md space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 class="font-bold text-slate-900">Yeni Kategori Oluştur</h3>
                  <button onClick={() => setIsCategoryFormOpen(false)} class="text-slate-400 hover:text-slate-600">
                    <X class="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveCategory} class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Kategori Adı *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: 8. Sınıf LGS Denemeleri"
                      value={catFormData.name}
                      onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                      class="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Açıklama</label>
                    <input
                      type="text"
                      placeholder="Kategori hakkında kısa bilgi..."
                      value={catFormData.description}
                      onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                      class="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div class="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCategoryFormOpen(false)}
                      class="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      class="px-5 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl hover:bg-brand-700"
                    >
                      Kategoriyi Kaydet
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories Table */}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="divide-y divide-slate-100">
                {categories.map((cat) => {
                  const postCount = posts.filter(p => p.categoryId === cat.id).length;
                  return (
                    <div key={cat.id} class="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <div class="flex items-center space-x-2">
                          <h4 class="font-bold text-slate-900 text-base">{cat.name}</h4>
                          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {postCount} Yazı
                          </span>
                        </div>
                        <p class="text-xs text-slate-500 mt-1">{cat.description}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        class="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Kategoriyi Sil"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* POST FORM MODAL (ADD / EDIT BLOG POST) */}
      {isPostFormOpen && (
        <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div class="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto my-8">
            
            <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 class="text-xl font-extrabold text-slate-900">
                  {editingPostId ? 'Blog Yazısını & Materyali Düzenle' : 'Yeni Blog Yazısı & Drive Materyali Ekle'}
                </h3>
                <p class="text-xs text-slate-500">Öğretmenler için içeriğinizi ve Drive/Oyun bağlantılarınızı eksiksiz doldurun.</p>
              </div>
              <button 
                onClick={() => setIsPostFormOpen(false)} 
                class="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X class="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSavePost} class="space-y-6">
              
              {/* Title */}
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Yazı Başlığı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 8. Sınıf LGS İngilizce 1. Ünite Kelime Listesi"
                  value={postFormData.title}
                  onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                  class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              {/* Category & Author Grid */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Kategori *</label>
                  <select
                    value={postFormData.categoryId}
                    onChange={(e) => setPostFormData({ ...postFormData, categoryId: e.target.value })}
                    class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Yazar Adı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Öğr. Elif Yılmaz"
                    value={postFormData.authorName}
                    onChange={(e) => setPostFormData({ ...postFormData, authorName: e.target.value })}
                    class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Google Drive & Game Links Grid */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                
                {/* Google Drive Link */}
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="text-xs font-bold text-slate-800 flex items-center space-x-1">
                      <HardDrive class="w-4 h-4 text-blue-600" />
                      <span>Google Drive Linki (PDF / Dosya)</span>
                    </label>
                  </div>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={postFormData.driveLink}
                    onChange={(e) => setPostFormData({ ...postFormData, driveLink: e.target.value })}
                    class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPostFormData({ ...postFormData, driveLink: 'https://drive.google.com/drive/folders/sample-elt-materials' })}
                    class="mt-1 text-[10px] font-bold text-blue-600 hover:underline"
                  >
                    + Örnek Drive Linki Ekle
                  </button>
                </div>

                {/* Game Link */}
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="text-xs font-bold text-slate-800 flex items-center space-x-1">
                      <Gamepad2 class="w-4 h-4 text-rose-600" />
                      <span>İnteraktif Oyun Linki (Wordwall / Kahoot)</span>
                    </label>
                  </div>
                  <input
                    type="url"
                    placeholder="https://wordwall.net/..."
                    value={postFormData.gameLink}
                    onChange={(e) => setPostFormData({ ...postFormData, gameLink: e.target.value })}
                    class="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPostFormData({ ...postFormData, gameLink: 'https://wordwall.net/tr/resource/10-unite-lgs-ingilizce-kelime-carki' })}
                    class="mt-1 text-[10px] font-bold text-rose-600 hover:underline"
                  >
                    + Örnek Oyun Linki Ekle
                  </button>
                </div>

              </div>

              {/* Cover Image URL & Presets */}
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-700">Kapak Görseli URL'si *</label>
                <div class="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={postFormData.coverImage}
                    onChange={(e) => setPostFormData({ ...postFormData, coverImage: e.target.value })}
                    class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                {/* Preset image buttons for quick picking */}
                <div class="pt-1">
                  <p class="text-[11px] text-slate-500 font-medium mb-1.5">Örnek Kapak Görselleri Seçin:</p>
                  <div class="flex flex-wrap gap-2">
                    {presetImages.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPostFormData({ ...postFormData, coverImage: preset.url })}
                        class="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 rounded-lg transition-colors"
                      >
                        📷 {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Blog İçeriği (Metin / HTML) *</label>
                <textarea
                  required
                  rows="8"
                  placeholder="İçeriğinizi buraya yazabilirsiniz. Paragraf ve başlıklar otomatik olarak formatlanır..."
                  value={postFormData.content}
                  onChange={(e) => setPostFormData({ ...postFormData, content: e.target.value })}
                  class="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white font-mono"
                ></textarea>
                <p class="text-[11px] text-slate-400 mt-1">Düz metin yazabilir veya &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt; gibi temel HTML etiketleri kullanabilirsiniz.</p>
              </div>

              {/* Form Buttons */}
              <div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostFormOpen(false)}
                  class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  class="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {editingPostId ? 'Değişiklikleri Kaydet' : 'Yazıyı Yayınla'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
