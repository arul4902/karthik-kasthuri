import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  X,
  Heart,
  Music,
  ScrollText,
  Calendar,
  Menu,
  Check,
  Film,
  MapPin,
  Lock,
  Sparkles
} from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import { ActiveTab } from '../../types/content';
import './Navbar.css';

interface MemoryNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  thumb: string;
  targetId: string;
  unread: boolean;
}

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    myList,
    searchQuery,
    setSearchQuery,
    allEpisodes,
    openDetailsModal,
    showToast,
    currentProfile,
    setProfile,
    profilesList,
    isPlayingSong,
    toggleSong,
    openCinemaMode,
    openJourneyMap,
    openSecretVault,
    triggerConfetti
  } = useStreaming();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<MemoryNotification[]>([
    {
      id: 'n1',
      title: 'Our Special Memory Alert',
      desc: 'One December Coffee: That Adyar CCD meeting started our forever journey.',
      time: 'Just now',
      thumb: '/assets/WhatsApp%20Image%202026-10-17%20at%2011.29.10%20PM.jpeg',
      targetId: 'ep-01-one-december-coffee',
      unread: true
    },
    {
      id: 'n2',
      title: 'New Chapter Added',
      desc: 'Our Story Has No End Card: Written for Karthik & Kasthuri.',
      time: 'Today',
      thumb: '/assets/WhatsApp%20Image%202026-10-17%20at%2011.30.40%20PM%20(2).jpeg',
      targetId: 'ep-30-no-end-card',
      unread: true
    },
    {
      id: 'n3',
      title: 'Furry Baby Memory 🐾',
      desc: 'Car ride adventures with Oreo are streaming in 4K Ultra HD.',
      time: 'Yesterday',
      thumb: '/assets/WhatsApp%20Image%202026-10-17%20at%2011.28.25%20PM.jpeg',
      targetId: 'ep-18-our-little-oreo',
      unread: false
    }
  ]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchToggle = () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 150);
    } else if (searchQuery.trim() === '') {
      setIsSearchOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNotifClick = (notif: MemoryNotification) => {
    setIsNotifOpen(false);
    setNotifications(prev =>
      prev.map(n => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    const target = allEpisodes.find(t => t.id === notif.targetId);
    if (target) {
      openDetailsModal(target);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All memory notifications marked as read');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-left">
          {/* Custom Brand Logo for Karthik & Kasthuri */}
          <div
            className="brand-logo"
            onClick={() => handleTabClick('home')}
            role="button"
            tabIndex={0}
            aria-label="Karthik & Kasthuri Home"
          >
            <span className="brand-symbol">
              <Heart size={18} fill="#fff" />
            </span>
            <div className="brand-text-stack">
              <span className="brand-name">KARTHIK & KASTHURI</span>
              <span className="brand-subline">AN ORIGINAL LOVE STORY</span>
            </div>
          </div>

          <nav className="nav-links" aria-label="Primary Navigation">
            <button
              className={`nav-link-btn ${activeTab === 'home' && searchQuery === '' ? 'active' : ''}`}
              onClick={() => handleTabClick('home')}
            >
              Our Story
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'chapters' ? 'active' : ''}`}
              onClick={() => handleTabClick('chapters')}
            >
              Chapters
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'milestones' ? 'active' : ''}`}
              onClick={() => handleTabClick('milestones')}
            >
              Milestones
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'soundtrack' ? 'active' : ''}`}
              onClick={() => handleTabClick('soundtrack')}
            >
              Soundtrack
              <span className="music-note-icon">🎵</span>
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'promise' ? 'active' : ''}`}
              onClick={() => handleTabClick('promise')}
            >
              Karthik's Promise
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'my-list' ? 'active' : ''}`}
              onClick={() => handleTabClick('my-list')}
            >
              My Favorites
              {myList.length > 0 && <span className="nav-badge">{myList.length}</span>}
            </button>
          </nav>
        </div>

        <div className="navbar-right">
          {/* Direct Soundtrack Quick Audio Button with Mini Visualizer */}
          <button
            className={`soundtrack-quick-btn ${isPlayingSong ? 'playing' : ''}`}
            onClick={toggleSong}
            title={isPlayingSong ? 'Pause Soundtrack' : 'Play Official Tamil Soundtrack'}
            aria-label="Toggle Soundtrack"
          >
            <Music size={18} />
            {isPlayingSong && (
              <span className="mini-bars">
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
              </span>
            )}
          </button>

          {/* Animated Expandable Search */}
          <div className="search-container">
            <div className={`search-box ${isSearchOpen || searchQuery ? 'expanded' : ''}`}>
              <button
                className="search-btn"
                onClick={handleSearchToggle}
                aria-label="Search memories"
              >
                <Search size={19} />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search coffee, Oreo, wedding..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => {
                  if (searchQuery.trim() === '') setIsSearchOpen(false);
                }}
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Notifications Dropdown */}
          <div className="notification-container" ref={notifRef}>
            <button
              className="icon-btn"
              onClick={() => setIsNotifOpen(prev => !prev)}
              aria-label="View memory alerts"
              aria-expanded={isNotifOpen}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="notif-badge" />}
            </button>

            {isNotifOpen && (
              <div className="dropdown-card notifications-menu" role="dialog" aria-label="Notifications">
                <div className="notif-header">
                  <h4>Memory Alerts & Milestones</h4>
                  {unreadCount > 0 && (
                    <button className="notif-mark-read" onClick={handleMarkAllRead}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className="notif-item"
                      onClick={() => handleNotifClick(notif)}
                    >
                      <img src={notif.thumb} alt="" className="notif-thumb" />
                      <div className="notif-content">
                        <div className="notif-title">{notif.title}</div>
                        <div className="notif-desc">{notif.desc}</div>
                        <div className="notif-time">{notif.time}</div>
                      </div>
                      {notif.unread && (
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#E50914',
                            marginTop: 6
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown with Karthik, Kasthuri, and Oreo */}
          <div className="profile-container" ref={profileRef}>
            <div
              className={`profile-trigger ${isProfileOpen ? 'active' : ''}`}
              onClick={() => setIsProfileOpen(prev => !prev)}
              role="button"
              tabIndex={0}
              aria-label="Select family profile"
            >
              <img
                src={currentProfile.avatar}
                alt={currentProfile.name}
                className="profile-avatar"
              />
              <ChevronDown size={14} className="caret-icon" />
            </div>

            {isProfileOpen && (
              <div className="dropdown-card profile-menu" role="menu">
                <div className="profile-menu-header">Who is Watching Our Story?</div>
                {profilesList.map(p => (
                  <button
                    key={p.name}
                    className="profile-item"
                    onClick={() => {
                      setProfile(p);
                      setIsProfileOpen(false);
                      showToast(`Watching as ${p.name} (${p.role}) ❤️`);
                    }}
                  >
                    <img src={p.avatar} alt="" className="profile-item-avatar" />
                    <div className="profile-item-text">
                      <span className="profile-name">{p.name}</span>
                      <span className="profile-role">{p.role}</span>
                    </div>
                    {currentProfile.name === p.name && (
                      <Check size={14} style={{ marginLeft: 'auto', color: '#E50914' }} />
                    )}
                  </button>
                ))}

                <div className="profile-divider" />

                <button
                  className="profile-item"
                  onClick={() => {
                    handleTabClick('promise');
                    setIsProfileOpen(false);
                  }}
                >
                  <ScrollText size={16} />
                  <span>Karthik's Promise</span>
                </button>
                <button
                  className="profile-item"
                  onClick={() => {
                    handleTabClick('milestones');
                    setIsProfileOpen(false);
                  }}
                >
                  <Calendar size={16} />
                  <span>Story Timeline</span>
                </button>
                <button
                  className="profile-item"
                  onClick={() => {
                    handleTabClick('soundtrack');
                    setIsProfileOpen(false);
                  }}
                >
                  <Music size={16} />
                  <span>Tamil Soundtrack</span>
                </button>
                <button
                  className="profile-item highlight-vault"
                  onClick={() => {
                    openSecretVault();
                    setIsProfileOpen(false);
                  }}
                >
                  <Lock size={16} />
                  <span>💌 Secret Note for Kasthuri</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer" role="navigation">
          <div className="mobile-drawer-header">
            <span className="mobile-drawer-title">KARTHIK & KASTHURI</span>
            <span className="mobile-drawer-sub">EXCLUSIVE SERIES</span>
          </div>

          <button
            className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleTabClick('home')}
          >
            <span>Our Story</span>
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'chapters' ? 'active' : ''}`}
            onClick={() => handleTabClick('chapters')}
          >
            <span>All Chapters (30 Episodes)</span>
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'milestones' ? 'active' : ''}`}
            onClick={() => handleTabClick('milestones')}
          >
            <span>Milestones Timeline</span>
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'soundtrack' ? 'active' : ''}`}
            onClick={() => handleTabClick('soundtrack')}
          >
            <span>Tamil Soundtrack 🎵</span>
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'promise' ? 'active' : ''}`}
            onClick={() => handleTabClick('promise')}
          >
            <span>Karthik's Promise</span>
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'my-list' ? 'active' : ''}`}
            onClick={() => handleTabClick('my-list')}
          >
            <span>My Favorites ({myList.length})</span>
          </button>

          <div className="mobile-drawer-divider" />

          {/* Innovative Feature Triggers in Mobile Drawer */}
          <button
            className="mobile-feature-btn cinema"
            onClick={() => {
              setIsMobileMenuOpen(false);
              openCinemaMode(0);
            }}
          >
            <Film size={18} />
            <span>🎬 Binge Our Story (Cinema Mode)</span>
          </button>

          <button
            className="mobile-feature-btn map"
            onClick={() => {
              setIsMobileMenuOpen(false);
              openJourneyMap();
            }}
          >
            <MapPin size={18} />
            <span>🗺️ Our Journey Map</span>
          </button>

          <button
            className="mobile-feature-btn vault"
            onClick={() => {
              setIsMobileMenuOpen(false);
              openSecretVault();
            }}
          >
            <Lock size={18} />
            <span>💌 Secret Note for Kasthuri</span>
          </button>

          <button
            className="mobile-feature-btn confetti"
            onClick={() => {
              setIsMobileMenuOpen(false);
              triggerConfetti();
            }}
          >
            <Sparkles size={18} />
            <span>💖 Shower Love Confetti</span>
          </button>
        </div>
      )}
    </>
  );
};
