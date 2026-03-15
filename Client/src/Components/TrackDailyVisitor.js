import { useEffect } from 'react';
import { supabase } from '../Utils/supabaseClient';
import { useSDK } from '@telegram-apps/sdk-react';

const TrackDailyVisitor = () => {
  const sdk = useSDK(); // Access the SDK instance
  const initData = sdk.initData; // Attempt to get initData directly from SDK
  const userId = initData?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const recordVisit = async () => {
      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('tma_daily_stats')
        .upsert(
          { 
            tg_user_id: userId, 
            visit_date: today,
            last_visited_at: new Date().toISOString() 
          }, 
          { onConflict: 'tg_user_id, visit_date' }
        );

      if (error) console.error("Tracking Error:", error.message);
    };

    recordVisit();
  }, [userId]);

  return null;
};