import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  useNavigate,
  Routes,
  Route,
  useLocation,
  matchPath,
} from 'react-router-dom';
import ProtectedRoute from './Utils/ProtectedRoute';
import {
  Home,
  Register,
  Login,
  ChatRoom,
  Private,
  Lifehacks,
  MemeFeed,
  EarningDashboard,
  MorningSprint,
  FactAbout,
  FactTerms,
  GuestProfiles,
  GuestChat,
  FactPrivacy,
  FactPins,
  FactDate,
  FactProfile,
  GroupChat,
  Videos,
  FactVideos,
  ResetPassword,
  Sketch,
  AppSketch,
  WebSketch,
  OptionsPage,
  Refund,
  Updates,
  Results,
  Media,
  EnterPage,
  Notifications,
  Prompt,
  Pricing,
  Secret,
  Adult,
  MissScratch,
  Settings,
  Roast,
  About,
  Contact,
  Terms,
  Privacy,
  NotFound,
  AppDoodle,
  WebDoodle,
  Chat,
  ChatEntrance,
  GuestUser,
  ChatList,
  Profile,
  Coins,
  PaymentPage,
  Demo,
  LiveSupport,
  Dating,
} from './Pages/index';
import LoadingSpinner from './Components/LoadingSpinner';
import { supabase } from './Utils/supabaseClient';
import SketchyAlert from './Components/SketchyAlert';
import InternetStatusAlert from './Components/InternetStatusAlert';
import FeedbackPopup from './Components/FeedbackPopup';
import { isRunningAsPWA } from './CheckPWA';
import { trackEvent } from './Utils/analytics';
import i18n from './i18n';
import { isWebView } from './Utils/isWebView';
import { isTelegram } from './Utils/useIsTelegram';
import DatingNavbar from './Components/DatingNavbar';

const HomeComponent = isTelegram ? GuestUser : Adult;

const protectedRoutes = [
  { path: '/notifications', component: Notifications },
  { path: '/chat/:id', component: Chat },
  { path: '/profile/:id', component: Profile },
  { path: '/settings', component: Settings },
  {
    /*
  { path: '/prompt', component: Prompt },
  { path: '/app-doodle', component: AppDoodle },
  { path: '/payments/:id', component: PaymentPage },
  { path: '/web-doodle', component: WebDoodle },
  { path: '/coins/:id', component: Coins 
  */
  },
];

const publicRoutes = [
  { path: '/', component: GuestProfiles }, // FactPins, Home, Sketch
  { path: '/home-page', component: GuestProfiles },
  { path: '/login', component: Login },
  { path: '/register', component: Register },

  { path: '/dashboard', component: EarningDashboard },
  { path: '/meme-feed', component: MemeFeed },

  { path: '/chat-room', component: ChatRoom },
  { path: '/group-chat', component: GroupChat },
  { path: '/guest-profiles', component: GuestProfiles },
  { path: '/guest-chat/:receiverId', component: GuestChat },
  { path: '/guest-user', component: GuestUser },
  { path: '/chat-list', component: ChatList },
  { path: '/videos', component: Videos },

  { path: '/roast', component: Roast },
  { path: '/date', component: Dating },

  { path: '/about', component: About },
  { path: '/terms', component: Terms },
  { path: '/privacy-policy', component: Privacy },
  { path: '/updates', component: Updates },
  { path: '/contact-us', component: Contact },

  { path: '/reset-password', component: ResetPassword },

  { path: '/demo', component: Demo },
  {
    /* 
     { path: '/community', component: Adult },
  path: '/game', component: MorningSprint },
  { path: '/demo', component: Demo },

     
  { path: '/viewer', component: Private },
  { path: '/fact-pins', component: FactPins },
  { path: '/fact-videos', component: FactVideos },
  { path: '/private', component: Private },
  { path: '/fact-profile', component: FactProfile },
  { path: '/fact-about', component: FactAbout },
  { path: '/fact-terms', component: FactTerms },
  { path: '/fact-privacy', component: FactPrivacy },
  { path: '/results', component: Results },
  { path: '/refund', component: Refund },
  { path: '/chat-entrance', component: ChatEntrance },
  { path: '/media', component: Media },
  { path: '/fact-date', component: FactDate }, 
  { path: '/life-hacks', component: Lifehacks },
  { path: '/live-support', component: LiveSupport },
  { path: '/options', component: OptionsPage },
  { path: '/pricing', component: Pricing },
  { path: '/app-sketch', component: AppSketch },
  { path: '/web-sketch', component: WebSketch },
  { path: '/share-secret', component: Secret },
  { path: '/miss-scratch', component: MissScratch 
  */
  },
];

// Detect mobile
const isMobileDevice = () =>
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const useUserStatusSync = () => {
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser?.id) return;

    let isUserActive = true;
    let activityTimeout = null;
    let heartbeatInterval = null;

    const updateStatus = async (status) => {
      try {
        await supabase.from('users').update({ status }).eq('id', storedUser.id);
      } catch (err) {
        console.error('Status update failed:', err);
      }
    };

    const setActive = () => {
      isUserActive = true;
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        isUserActive = false;
        updateStatus('offline');
      }, 60000);
      updateStatus('online');
    };

    const interactionEvents = [
      'mousemove',
      'keydown',
      'scroll',
      'click',
      'touchstart',
      'touchmove',
    ];
    interactionEvents.forEach((event) =>
      window.addEventListener(event, setActive)
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateStatus('offline');
      } else {
        setActive();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handlePageHide = () => updateStatus('offline');
    const handlePageShow = () => setActive();
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    heartbeatInterval = setInterval(() => {
      if (isUserActive && document.visibilityState === 'visible') {
        updateStatus('online');
      }
    }, 30000);

    const handleUnload = () => updateStatus('offline');
    window.addEventListener('beforeunload', handleUnload);

    const handleStorage = (event) => {
      if (event.key === 'user-activity') {
        setActive();
      }
    };
    window.addEventListener('storage', handleStorage);

    const localHeartbeat = setInterval(() => {
      localStorage.setItem('user-activity', Date.now());
    }, 5000);

    setActive();

    return () => {
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, setActive)
      );
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('storage', handleStorage);
      clearTimeout(activityTimeout);
      clearInterval(heartbeatInterval);
      clearInterval(localHeartbeat);
      updateStatus('offline');
    };
  }, []);
};

function UserStatusWrapper() {
  useUserStatusSync();
  return null;
}

function AppContent() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const showInstallBanner = !isWebView();

  useEffect(() => {
    let isDeveloper = false;

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser?.name === 'Shivani' || 'Madison') {
        isDeveloper = true;
      }
    } catch (e) {
      // ignore JSON errors
    }

    if (!isDeveloper) {
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
      console.info = () => {};
      console.debug = () => {};
    } else {
      console.log('👩‍💻 Developer mode enabled for Developer — logs active');
    }
  }, []);

  useEffect(() => {
    const visibilityChannel = new BroadcastChannel('chat_app_visibility');
    const sendVisibility = () => {
      const isVisible = document.visibilityState === 'visible';
      visibilityChannel.postMessage({ visible: isVisible });
    };
    document.addEventListener('visibilitychange', sendVisibility);
    sendVisibility();
    return () => {
      document.removeEventListener('visibilitychange', sendVisibility);
      visibilityChannel.close();
    };
  }, []);

  {
    /*useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.id) return;

    const interval = setInterval(async () => {
      try {
        const { error } = await supabase.rpc('increment_reward_coins', {
          user_id_input: storedUser.id,
          increment_by: 3,
        });
        if (!error) {
          setAlertMessage({
            text: `✅ ${i18n.t('coinsReward')}`,
            withButton: true,
          });
        }
      } catch {}
    }, 3600000);
    return () => clearInterval(interval);
  }, []);*/
  }

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.id) return;

    if (storedUser && storedUser.id) {
      setUser(storedUser);
    } else {
      setUser(null);
      return;
    }

    const rewardKey = `${storedUser.id}`;

    if (isRunningAsPWA() && !localStorage.getItem(rewardKey)) {
      //console.log("🚀 PWA detected – rewarding 30 coins");

      (async () => {
        try {
          const { error } = await supabase.rpc('increment_reward_coins', {
            user_id_input: storedUser.id,
            increment_by: 30,
          });

          if (error) {
            // console.error("❌ PWA reward error:", error.message);
          } else {
            localStorage.setItem(rewardKey, 'true');
            setAlertMessage({
              text: `🎉 ${i18n.t('appInstalled')}`,
              withButton: true,
            });
          }
        } catch (err) {
          // console.error("❗ Unexpected PWA reward error:", err);
        }
      })();
    }
  }, []);

  useEffect(() => {
    const hasSubmitted = localStorage.getItem('feedback_submitted');
    if (hasSubmitted === 'true') return;

    const lastShown = localStorage.getItem('last_feedback_shown');
    const now = new Date();

    if (lastShown) {
      const lastDate = new Date(lastShown);
      const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) return; // Already shown within the past 7 days
    }
    const delayMs = 90 * 1000; // 1 min 30 sec

    const timeout = setTimeout(() => {
      setShowFeedback(true);
      localStorage.setItem('last_feedback_shown', now.toISOString());
    }, delayMs);

    return () => clearTimeout(timeout);
  }, []);

  const handleSubmitSuccess = () => {
    trackEvent({
      action: 'button_click',
      category: 'Chat List Page',
      label: 'Feedback Submission Button',
    });
    localStorage.setItem('feedback_submitted', 'true');
    setShowFeedback(false);
  };

  {
    /*  useEffect(() => {
     if (!isMobileDevice() || isMobileDevice()) {
      setReady(true); // render routes normally on desktop
      return;
    }
  }, [])*/
  }

  useEffect(() => {
    {
      /* if (!isMobileDevice()) {
      setReady(true); // render routes normally on desktop
      return;
    }*/
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));

    // If mobile and user exists, prevent /guest-user access
    if (storedUser?.id && location.pathname === '/guest-user') {
      navigate('/chat-list', { replace: true });
      return;
    }

    // Mobile root "/" redirection
    if (location.pathname === '/') {
      if (!storedUser?.id) {
        navigate('/home-page', { replace: true }); //guest-user
        return;
      } else {
        navigate('/chat-list', { replace: true }); //chat-list
        return;
      }
    }

    if (storedUser?.id && location.pathname === '/guest-user') {
      navigate('/chat-list', { replace: true });
      return;
    }

    const protectedRoutes = ['/chat-list', '/chat/:id', '/profile/:id'];
    if (!storedUser?.id && protectedRoutes.includes(location.pathname)) {
      navigate('/home-page', { replace: true }); //guest-user
      return;
    }

    setReady(true); // safe to render routes
  }, [navigate, location.pathname]);
  const hideNavbarRoutes = [
    '/chat/:id',
    '/guest-chat/:receiverId',
    '/chat-room',
  ];

  const shouldHideNavbar = hideNavbarRoutes.some((pattern) =>
    matchPath(pattern, location.pathname)
  );
  if (!ready && isMobileDevice() && location.pathname === '/') {
    // Prevent flicker — show nothing or a loader until redirect happens
    return <LoadingSpinner />; // could be <LoadingSpinner /> if you want
  }

  return (
    <>
      <UserStatusWrapper />
      {/* <AdsterraScripts /> */}
      <Routes>
        {publicRoutes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        {protectedRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            }
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!shouldHideNavbar && <DatingNavbar />}

      <InternetStatusAlert />
      {/*showInstallBanner && <InstallBanner />*/}
      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
      {/*showFeedback && (
        <FeedbackPopup
          onSubmitSuccess={handleSubmitSuccess}
          onClose={() => setShowFeedback(false)}
        />
      )*/}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
