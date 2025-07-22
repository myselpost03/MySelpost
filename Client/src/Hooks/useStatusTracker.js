import { useEffect, useRef, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { supabase } from "../Utils/supabaseClient";

export function useStatusTracker(user) {
  const [status, setStatus] = useState("offline");
  const lastStatusRef = useRef(null);
  const debounceTimeout = useRef(null);

  const updateStatus = async (newStatus) => {
    if (!user?.id || newStatus === lastStatusRef.current) return;

    lastStatusRef.current = newStatus;
    setStatus(newStatus);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      await supabase
        .from("users")
        .update({ status: newStatus })
        .eq("id", user.id);
    }, 1000);
  };

  const onIdle = () => {
    updateStatus("idle");
  };

  const onActive = () => {
    if (!document.hidden) {
      updateStatus("online");
    }
  };

  useIdleTimer({
    timeout: 5 * 60 * 1000, // 5 minutes
    onIdle,
    onActive,
    debounce: 500,
  });

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        updateStatus("away");
      } else {
        updateStatus("online");
      }
    };

    const handleUnload = () => {
      updateStatus("offline");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleUnload);

    // Set initial status
    if (!document.hidden) updateStatus("online");

    // 👇 cleanup inside a function, important
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [user]);

  return status;
}
