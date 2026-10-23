import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ContentItem, ActiveTab, MilestoneItem } from '../types/content';
import {
  ALL_LOVE_EPISODES,
  HERO_FEATURED_ID,
  STORY_MILESTONES,
  TAMIL_SOUNDTRACK,
  ASSETS
} from '../data/mockContent';

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
}

interface StreamingContextType {
  myList: string[];
  addToMyList: (id: string) => void;
  removeFromMyList: (id: string) => void;
  isInMyList: (id: string) => boolean;
  toggleMyList: (id: string) => void;

  likedTitles: string[];
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;

  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ContentItem[];

  selectedTitle: ContentItem | null;
  openDetailsModal: (title: ContentItem) => void;
  closeDetailsModal: () => void;

  playingTitle: ContentItem | null;
  startPlaying: (title: ContentItem) => void;
  stopPlaying: () => void;

  // Soundtrack Audio Player
  isPlayingSong: boolean;
  toggleSong: () => void;
  playSong: () => void;
  pauseSong: () => void;
  songCurrentTime: number;
  songDuration: number;
  songProgress: number;
  seekSong: (percent: number) => void;

  // User Profile
  currentProfile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  profilesList: UserProfile[];

  // Innovative Features
  isCinemaMode: boolean;
  openCinemaMode: (initialIndex?: number) => void;
  closeCinemaMode: () => void;
  cinemaChapterIndex: number;
  setCinemaChapterIndex: (index: number) => void;

  isJourneyMapOpen: boolean;
  openJourneyMap: () => void;
  closeJourneyMap: () => void;

  isSecretVaultOpen: boolean;
  openSecretVault: () => void;
  closeSecretVault: () => void;

  confettiTrigger: number;
  triggerConfetti: () => void;

  toast: string | null;
  showToast: (msg: string) => void;

  heroTitle: ContentItem;
  allEpisodes: ContentItem[];
  milestones: MilestoneItem[];
}

const StreamingContext = createContext<StreamingContextType | undefined>(undefined);

export const StreamingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myList, setMyList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('karthik_kasthuri_favorites');
      return saved ? JSON.parse(saved) : [
        'ep-01-one-december-coffee',
        'ep-03-hand-held',
        'ep-15-became-husband-wife',
        'ep-18-our-little-oreo'
      ];
    } catch {
      return ['ep-01-one-december-coffee', 'ep-18-our-little-oreo'];
    }
  });

  const [likedTitles, setLikedTitles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('karthik_kasthuri_likes');
      return saved ? JSON.parse(saved) : ['ep-01-one-december-coffee', 'ep-26-karthik-promise'];
    } catch {
      return ['ep-01-one-december-coffee'];
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTitle, setSelectedTitle] = useState<ContentItem | null>(null);
  const [playingTitle, setPlayingTitle] = useState<ContentItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Profiles
  const profilesList: UserProfile[] = [
    {
      name: 'Karthik',
      role: 'Husband & Partner',
      avatar: ASSETS.HERO_FIELD_RUN
    },
    {
      name: 'Kasthuri',
      role: 'Wife & Heart',
      avatar: ASSETS.TRADITIONAL_SAREE
    },
    {
      name: 'Oreo',
      role: 'Our Furry Child 🐾',
      avatar: ASSETS.OREO_CAR
    }
  ];

  const [currentProfile, setCurrentProfile] = useState<UserProfile>(profilesList[0]);

  // Innovative Features State
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [cinemaChapterIndex, setCinemaChapterIndex] = useState(0);
  const [isJourneyMapOpen, setIsJourneyMapOpen] = useState(false);
  const [isSecretVaultOpen, setIsSecretVaultOpen] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Persistent Soundtrack Audio Element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [songCurrentTime, setSongCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(262); // ~4m 22s for karthik kasthuri.mp3

  useEffect(() => {
    const audio = new Audio(TAMIL_SOUNDTRACK.audioUrl);
    audioRef.current = audio;
    audio.preload = 'metadata';

    const onTimeUpdate = () => {
      setSongCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setSongDuration(audio.duration);
      }
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setSongDuration(audio.duration);
      }
    };

    const onEnded = () => {
      // Loop song softly
      audio.currentTime = 0;
      audio.play().catch(() => setIsPlayingSong(false));
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('durationchange', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('durationchange', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.src = '';
    };
  }, []);

  const playSong = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlayingSong(true);
        showToast('Now Playing: ஒரு காபியில் தொடங்கிய காதல் 🎵');
      }).catch(err => {
        console.log('Audio playback prevented or missing:', err);
        // Fallback simulation state
        setIsPlayingSong(true);
        showToast('Now Playing: ஒரு காபியில் தொடங்கிய காதல் (Audio preview)');
      });
    }
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlayingSong(false);
  };

  const toggleSong = () => {
    if (isPlayingSong) {
      pauseSong();
    } else {
      playSong();
    }
  };

  const seekSong = (percent: number) => {
    if (audioRef.current && songDuration) {
      const targetTime = (percent / 100) * songDuration;
      audioRef.current.currentTime = targetTime;
      setSongCurrentTime(targetTime);
    }
  };

  const songProgress = songDuration > 0 ? (songCurrentTime / songDuration) * 100 : 0;

  useEffect(() => {
    try {
      localStorage.setItem('karthik_kasthuri_favorites', JSON.stringify(myList));
    } catch (e) {
      console.error(e);
    }
  }, [myList]);

  useEffect(() => {
    try {
      localStorage.setItem('karthik_kasthuri_likes', JSON.stringify(likedTitles));
    } catch (e) {
      console.error(e);
    }
  }, [likedTitles]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  const addToMyList = (id: string) => {
    if (!myList.includes(id)) {
      setMyList(prev => [...prev, id]);
      const item = ALL_LOVE_EPISODES.find(t => t.id === id);
      showToast(`Saved "${item ? item.title : 'Chapter'}" to My Favorites ❤️`);
    }
  };

  const removeFromMyList = (id: string) => {
    setMyList(prev => prev.filter(item => item !== id));
    const item = ALL_LOVE_EPISODES.find(t => t.id === id);
    showToast(`Removed "${item ? item.title : 'Chapter'}" from Favorites`);
  };

  const isInMyList = (id: string) => myList.includes(id);

  const toggleMyList = (id: string) => {
    if (isInMyList(id)) {
      removeFromMyList(id);
    } else {
      addToMyList(id);
    }
  };

  const isLiked = (id: string) => likedTitles.includes(id);

  const toggleLike = (id: string) => {
    if (isLiked(id)) {
      setLikedTitles(prev => prev.filter(t => t !== id));
    } else {
      setLikedTitles(prev => [...prev, id]);
      const item = ALL_LOVE_EPISODES.find(t => t.id === id);
      showToast(`Cherished moment: "${item ? item.title : 'Memory'}"`);
    }
  };

  const openDetailsModal = (title: ContentItem) => {
    setSelectedTitle(title);
  };

  const closeDetailsModal = () => {
    setSelectedTitle(null);
  };

  const startPlaying = (title: ContentItem) => {
    setPlayingTitle(title);
  };

  const stopPlaying = () => {
    setPlayingTitle(null);
  };

  // Instant search filtering across title, tamilTitle, synopsis, tags, locations
  const searchResults = searchQuery.trim() === ''
    ? []
    : ALL_LOVE_EPISODES.filter(item => {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          (item.tamilTitle && item.tamilTitle.toLowerCase().includes(q)) ||
          item.synopsis.toLowerCase().includes(q) ||
          (item.location && item.location.toLowerCase().includes(q)) ||
          item.genres.some(g => g.toLowerCase().includes(q)) ||
          item.tags.some(t => t.toLowerCase().includes(q))
        );
      });

  const heroTitle = ALL_LOVE_EPISODES.find(t => t.id === HERO_FEATURED_ID) || ALL_LOVE_EPISODES[0];

  const openCinemaMode = (initialIndex: number = 0) => {
    setCinemaChapterIndex(initialIndex);
    setIsCinemaMode(true);
    playSong(); // Automatically starts the personal soundtrack
    showToast('Entered Cinema Story Mode 🎬 Soundtrack playing');
  };

  const closeCinemaMode = () => {
    setIsCinemaMode(false);
  };

  const openJourneyMap = () => {
    setIsJourneyMapOpen(true);
  };

  const closeJourneyMap = () => {
    setIsJourneyMapOpen(false);
  };

  const openSecretVault = () => {
    setIsSecretVaultOpen(true);
  };

  const closeSecretVault = () => {
    setIsSecretVaultOpen(false);
  };

  const triggerConfetti = () => {
    setConfettiTrigger(prev => prev + 1);
    showToast('Celebrating Karthik & Kasthuri! 💖✨');
  };

  return (
    <StreamingContext.Provider
      value={{
        myList,
        addToMyList,
        removeFromMyList,
        isInMyList,
        toggleMyList,
        likedTitles,
        toggleLike,
        isLiked,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        searchResults,
        selectedTitle,
        openDetailsModal,
        closeDetailsModal,
        playingTitle,
        startPlaying,
        stopPlaying,
        isPlayingSong,
        toggleSong,
        playSong,
        pauseSong,
        songCurrentTime,
        songDuration,
        songProgress,
        seekSong,
        currentProfile,
        setProfile: setCurrentProfile,
        profilesList,
        toast,
        showToast,
        isCinemaMode,
        openCinemaMode,
        closeCinemaMode,
        cinemaChapterIndex,
        setCinemaChapterIndex,
        isJourneyMapOpen,
        openJourneyMap,
        closeJourneyMap,
        isSecretVaultOpen,
        openSecretVault,
        closeSecretVault,
        confettiTrigger,
        triggerConfetti,
        heroTitle,
        allEpisodes: ALL_LOVE_EPISODES,
        milestones: STORY_MILESTONES
      }}
    >
      {children}
    </StreamingContext.Provider>
  );
};

export const useStreaming = () => {
  const context = useContext(StreamingContext);
  if (!context) {
    throw new Error('useStreaming must be used within a StreamingProvider');
  }
  return context;
};
