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

import { POSTS as INITIAL_POSTS } from './data/posts';
import { CATEGORIES as INITIAL_CATEGORIES } from './data/categories';

export default function App() {
  
  // Authentication State (Persistent via localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
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

  // Login Handler
  const handleLogin = (username, password) => {
    // Valid credentials: admin / 123456 or ogretmen / 123456
    if (
      (username.toLowerCase() === 'admin' || username.toLowerCase() === 'ogretmen') &&
      (password === '123456' || password === 'assisting123')
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('assisting_auth', 'true');
      return true;
    }
    return false;
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('assisting_auth');
  };

  // URL Helper to parse current path/query
  const parseUrlState = useCallback((currentPosts) => {
    const path = window.location.pathname;
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const postIdParam = params.get('post');

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

    if (path === '/admin' || window.location.hash === '#admin') return { page: 'admin', post: null, filter: 'all' };
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
    if (page === 'admin') targetUrl = '/admin';
    else if (page === 'blog') {
      if (filterType === 'games') targetUrl = '/games';
      else if (filterType === 'drive') targetUrl = '/drive';
      else targetUrl = '/blog';
    }
    else if (page === 'categories') targetUrl = '/categories';
    else if (page === 'about') targetUrl = '/about';
    else if (page === 'contact') targetUrl = '/contact';
    else if (page === 'post-detail' && post) {
      targetUrl = `/post/${post.id}`;
    }

    const stateObj = { page, postId: post?.id, fromAdmin, filterType };

    if (window.location.pathname !== targetUrl) {
      window.history.pushState(stateObj, '', targetUrl);
    } else {
      window.history.replaceState(stateObj, '', targetUrl);
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
        />
      )}

      {/* Main Content Area */}
      <main class="flex-grow">
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

        {activePage === 'post-detail' && selectedPost && (
          <PostDetailPage 
            post={selectedPost}
            allPosts={posts}
            onSelectPost={handleSelectPost}
            onBack={handleBackFromDetail}
            fromAdmin={previousPage === 'admin' || window.history.state?.fromAdmin}
          />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}

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
            isAuthenticated={isAuthenticated}
            onLogin={handleLogin}
            onLogout={handleLogout}
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

    </div>
  );
}
