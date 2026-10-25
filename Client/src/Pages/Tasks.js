import React, { useState, useEffect } from 'react';
import { Runner } from 'react-mini-games';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Utils/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';

const Tasks = () => {
  const navigate = useNavigate();
  const [completedDays, setCompletedDays] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isAdLoading, setIsAdLoading] = useState(false);

  // Identify user (Telegram ID fallback to localStorage/Anonymous)
  const userId =
    typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id
      ? String(window.Telegram.WebApp.initDataUnsafe.user.id)
      : localStorage.getItem('user_id') || 'guest_user_' + Math.random().toString(36).substring(7);

  // Fetch current streak from Supabase on mount
  useEffect(() => {
    const fetchStreak = async () => {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('completed_days')
        .eq('user_identifier', userId)
        .single();

      if (data) {
        setCompletedDays(data.completed_days || 0);
      } else {
        // Initialize record if not exists
        await supabase.from('user_streaks').insert([{ user_identifier: userId, completed_days: 0 }]);
      }
    };
    fetchStreak();
  }, [userId]);

  // Cooldown Timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Safe GigaPub Ad Trigger before recording reward
  const triggerGigaAd = (onSuccess) => {
    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown}s before watching the next ad.`);
      return;
    }

    setIsAdLoading(true);

    if (window.showGiga) {
      window
        .showGiga()
        .then(() => {
          setIsAdLoading(false);
          setCooldown(35); // 35s protection cooldown against ad network sanctions
          if (onSuccess) onSuccess();
        })
        .catch((error) => {
          console.error('Ad failed or skipped:', error);
          setIsAdLoading(false);
          toast.error('Please watch the full video ad to claim task progress!');
        });
    } else {
      // Localhost development fallback
      setIsAdLoading(false);
      setCooldown(10);
      if (onSuccess) onSuccess();
    }
  };

  // Handle Game Over / Score Achievement
  const handleGameOver = (score) => {
    if (score >= 10) {
      triggerGigaAd(async () => {
        const newDays = Math.min(completedDays + 1, 10);

        // Update Supabase Streak
        const { error } = await supabase
          .from('user_streaks')
          .update({ completed_days: newDays, last_active_date: new Date() })
          .eq('user_identifier', userId);

        if (error) {
          toast.error('Failed to sync streak with server.');
        } else {
          setCompletedDays(newDays);
          setTaskCompleted(true);
          toast.success(`🎉 Day Streak Updated! (${newDays}/10 Days)`);
        }
      });
    } else {
      toast.error('Score at least 10 points in the runner game to complete today task!');
    }
  };

  return (
    <>
      <Header />
      <Toaster position="top-center" />
      <div style={{ padding: '24px 16px', maxWidth: '440px', margin: '0 auto', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
        
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
          <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>
            10-DAY UNLOCK CHALLENGE
          </span>
          <h2 style={{ fontSize: '20px', color: '#0f172a', margin: '12px 0 6px 0' }}>Daily Mini-Task</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Score 10+ points in the runner challenge and watch the verification ad to log today's streak.
          </p>

          {cooldown > 0 && (
            <div style={{ background: '#fef3c7', color: '#d97706', fontSize: '12px', padding: '8px', borderRadius: '8px', marginBottom: '16px' }}>
              ⏳ Ad Cooldown Active: <b>{cooldown}s</b> remaining
            </div>
          )}

          {!taskCompleted ? (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'inline-block' }}>
              <Runner width={320} height={200} onGameOver={handleGameOver} />
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>
                Tap or use spacebar to jump over obstacles!
              </p>
              {isAdLoading && <p style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>Loading Ad Verification...</p>}
            </div>
          ) : (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ color: '#16a34a', margin: '0 0 6px 0' }}>✓ Today's Task Logged!</h3>
              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
                Current Progress: <b>{completedDays} / 10 Days</b> completed.
              </p>
              <button
                onClick={() => navigate('/')}
                style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', width: '100%' }}
              >
                Return to App
              </button>
            </div>
          )}

          {/* Progress Tracker Summary */}
          <div style={{ marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              <span>Total Progress</span>
              <span>{completedDays} / 10 Days</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(completedDays / 10) * 100}%`, height: '100%', backgroundColor: completedDays === 10 ? '#16a34a' : '#2563eb', transition: 'width 0.3s ease' }} />
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
              Complete in 10 days to unlock profile
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Tasks;