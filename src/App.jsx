import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BlogListPage from './pages/BlogListPage';
import CategoriesPage from './pages/CategoriesPage';
import PostDetailPage from './pages/PostDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import AuthModal from './components/AuthModal';

import { initDB, getCurrentUser, setCurrentUser as setDBCurrentUser } from './services/db';
import { POSTS as INITIAL_POSTS } from './data/posts';
import { CATEGORIES as INITIAL_CATEGORIES } from './data/categories';

export default function App() {
  // Initialize Database
  useEffect(() => {
    initDB();
  }, []);

  // Current Active User from Database
  const [currentUser, setCurrUser] = useState(() => getCurrentUser());

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState('student-login');

  // Open Auth Modal helper
  const handleOpenAuth = (tab = 'student-login') => {
    setAuthModalDefaultTab(tab);
    setIsAuthModalOpen(true);
  };

  // Auth Success Callback
  const handleAuthSuccess = (user) => {
    setCurrUser(user);
    if (user.role === 'teacher') {
      handleNavigate('teacher');
    } else {
      handleNavigate('student');
    }
  };

  // Logout Callback
  const handleUserLogout = () => {
    setDBCurrentUser(null);
    setCurrUser(null);
    handleNavigate('home');
  };

  // Legacy Admin Auth State (for /admin blog editor)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('assisting_auth') === 'true';
  });

  // Persistent Posts State from localStorage
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('assisting_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse posts from localStorage', e);
      }
    }
    return INITIAL_POSTS;
  });

  // Persistent Categories State from localStorage
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('assisting_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse categories from localStorage', e);
      }
    }
    return INITIAL_CATEGORIES;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('assisting_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('assisting_categories', JSON.stringify(categories));
  }, [categories]);

  // Admin Login Handler
  const handleAdminLogin = (username, password) => {
    if (
      (username.toLowerCase() === 'admin' || username.toLowerCase() === 'nurcanelci') &&
      (password === '123456' || password === 'assisting123')
    ) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('assisting_auth', 'true');
      return true;
    }
    return false;
  };

  // Admin Logout Handler
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('assisting_auth');
  };

  // URL Helper to parse current path/query (Supports GitHub Pages sub-path)
  const parseUrlState = useCallback((currentPosts) => {
    let path = window.location.pathname;
    
    // Normalize path by stripping GitHub Pages repo name if present
    if (path.startsWith('/assisting-elt-blog')) {
      path = path.replace('/assisting-elt-blog', '') || '/';
    }

    const search = window.location.search;
    const hash = window.location.hash;
    const params = new URLSearchParams(search);
    const postIdParam = params.get('post');
    const pageParam = params.get('page');

    if (pageParam === 'teacher' || hash === '#teacher' || path === '/teacher' || path === '/ogretmen') {
      return { page: 'teacher', post: null, filter: 'all' };
    }
    if (pageParam === 'student' || hash === '#student' || path === '/student' || path === '/ogrenci') {
      return { page: 'student', post: null, filter: 'all' };
    }

    // Handle post detail URL (e.g. /post/1 or ?post=1)
    if (path.startsWith('/post/') || postIdParam) {
      let idStr = postIdParam;
      if (!idStr && path.startsWith('/post/')) {
        idStr = path.replace('/post/', '');
      }
      
      const foundPost = currentPosts.find(p => String(p.id) === String(idStr) || p.slug === idStr);
      if (foundPost) {
        return { page: 'post-detail', post: foundPost, filter: 'all' };
      }
    }

    if (path === '/admin' || hash === '#admin') return { page: 'admin', post: null, filter: 'all' };
    if (path === '/games') return { page: 'blog', post: null, filter: 'games' };
    if (path === '/drive') return { page: 'blog', post: null, filter: 'drive' };
    if (path === '/blog') return { page: 'blog', post: null, filter: 'all' };
    if (path === '/categories') return { page: 'categories', post: null, filter: 'all' };
    if (path === '/about') return { page: 'about', post: null, filter: 'all' };
    if (path === '/contact') return { page: 'contact', post: null, filter: 'all' };

    return { page: 'home', post: null, filter: 'all' };
  }, []);

  const initialState = parseUrlState(posts);
  const [activePage, setActivePage] = useState(initialState.page);
  const [selectedPost, setSelectedPost] = useState(initialState.post);
  const [filterType, setFilterType] = useState(initialState.filter || 'all');
  const [previousPage, setPreviousPage] = useState(window.history.state?.fromAdmin ? 'admin' : 'home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Browser Back (←), Forward (→), and Hash changes
  useEffect(() => {
    const handlePopState = (event) => {
      const parsed = parseUrlState(posts);
      setActivePage(parsed.page);
      setSelectedPost(parsed.post);
      if (parsed.filter) setFilterType(parsed.filter);
      
      if (event.state?.fromAdmin) {
        setPreviousPage('admin');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [posts, parseUrlState]);

  // Navigate to a page with browser history push
  const handleNavigate = (page, post = null, fromAdmin = false) => {
    let targetUrl = '/';
    if (page === 'teacher') targetUrl = '#teacher';
    else if (page === 'student') targetUrl = '#student';
    else if (page === 'admin') targetUrl = '#admin';
    else if (page === 'blog') {
      if (filterType === 'games') targetUrl = '#games';
      else if (filterType === 'drive') targetUrl = '#drive';
      else targetUrl = '#blog';
    }
    else if (page === 'categories') targetUrl = '#categories';
    else if (page === 'about') targetUrl = '#about';
    else if (page === 'contact') targetUrl = '#contact';
    else if (page === 'post-detail' && post) {
      targetUrl = `?post=${post.id}`;
    }

    const stateObj = { page, postId: post?.id, fromAdmin, filterType };

    try {
      window.history.pushState(stateObj, '', targetUrl);
    } catch (e) {
      // In case of sandbox / file uri limitations
    }

    if (fromAdmin) {
      setPreviousPage('admin');
    } else if (page !== 'post-detail') {
      setPreviousPage(page);
    }

    setSelectedPost(post);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selecting a post
  const handleSelectPost = (post, origin = null) => {
    const isFromAdmin = origin === 'admin' || activePage === 'admin';
    handleNavigate('post-detail', post, isFromAdmin);
  };

  // Back button click handler inside PostDetailPage
  const handleBackFromDetail = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      const target = previousPage === 'admin' ? 'admin' : 'blog';
      handleNavigate(target);
    }
  };

  return (
    <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Top Navbar */}
      {activePage !== 'admin' && (
        <Navbar 
          activePage={activePage} 
          setActivePage={(page) => handleNavigate(page)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filterType={filterType}
          setFilterType={setFilterType}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleUserLogout}
        />
      )}

      {/* Main Content Area */}
      <main class="flex-grow">
        
        {/* Home Page */}
        {activePage === 'home' && (
          <HomePage 
            posts={posts}
            onSelectPost={handleSelectPost}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setFilterType('all');
              handleNavigate('blog');
            }}
            onNavigate={(page) => {
              setFilterType('all');
              handleNavigate(page);
            }}
          />
        )}

        {/* Teacher Panel (Nurcan Elçi) */}
        {activePage === 'teacher' && (
          <TeacherPage 
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onNavigate={handleNavigate}
          />
        )}

        {/* Student Panel */}
        {activePage === 'student' && (
          <StudentPage 
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onNavigate={handleNavigate}
          />
        )}

        {/* Blog & Materials List */}
        {activePage === 'blog' && (
          <BlogListPage 
            posts={posts}
            onSelectPost={handleSelectPost}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        )}

        {/* Grade Categories Page */}
        {activePage === 'categories' && (
          <CategoriesPage 
            posts={posts}
            onSelectPost={handleSelectPost}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onNavigate={(page) => {
              setFilterType('all');
              handleNavigate(page);
            }}
          />
        )}

        {/* Post Detail */}
        {activePage === 'post-detail' && selectedPost && (
          <PostDetailPage 
            post={selectedPost}
            allPosts={posts}
            onSelectPost={handleSelectPost}
            onBack={handleBackFromDetail}
            fromAdmin={previousPage === 'admin' || window.history.state?.fromAdmin}
          />
        )}

        {/* About Page */}
        {activePage === 'about' && (
          <AboutPage />
        )}

        {/* Contact Page */}
        {activePage === 'contact' && (
          <ContactPage />
        )}

        {/* Admin Post Management Page */}
        {activePage === 'admin' && (
          <AdminPage 
            posts={posts}
            setPosts={setPosts}
            categories={categories}
            setCategories={setCategories}
            onNavigate={(page) => {
              setFilterType('all');
              handleNavigate(page);
            }}
            onSelectPost={handleSelectPost}
            isAuthenticated={isAdminAuthenticated}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Global Footer */}
      {activePage !== 'admin' && (
        <Footer 
          setActivePage={(page) => {
            setFilterType('all');
            handleNavigate(page);
          }}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {/* Global Auth Modal for Teacher & Student Login/Registration */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        defaultTab={authModalDefaultTab}
      />

    </div>
  );
}
