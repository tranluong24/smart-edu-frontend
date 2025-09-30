import { useState, useEffect, useRef, useCallback } from "react";
import { getStudentCourseCompletion } from "../api/apiService";

export const useProgressSync = (courseId, userId, userRole) => {
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [lastSyncTime, setLastSyncTime] = useState(0);

  const lastFetchTimeRef = useRef(0);
  const isMountedRef = useRef(true);

  const fetchProgress = useCallback(
    async (force = false) => {
      if (!userId || !courseId || userRole !== "student") return;

      const now = Date.now();
      if (!force && now - lastFetchTimeRef.current < 2000) {
        
        return;
      }

      lastFetchTimeRef.current = now;

      try {
        const response = await getStudentCourseCompletion(userId, courseId);
        const newCompletedIds = new Set(
          response.data?.completedLessonIds || []
        );

        if (!isMountedRef.current) return;

        setCompletedLessonIds((prev) => {
          const hasChanges =
            prev.size !== newCompletedIds.size ||
            [...prev].some((id) => !newCompletedIds.has(id));

          if (hasChanges) {

            setLastSyncTime(now);
            return newCompletedIds;
          }

          return prev;
        });
      } catch (error) {
        
      } finally {
        if (isMountedRef.current) {
        }
      }
    },
    [userId, courseId, userRole]
  );

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!userId || !courseId || userRole !== "student") return;

    
    fetchProgress(true);
  }, [courseId, userId, userRole, fetchProgress]);

  useEffect(() => {
    if (!userId || !courseId || userRole !== "student") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        
      } else {
        
        fetchProgress(true);
      }
    };

    const handleFocus = () => {
      if (!document.hidden) {
        
        fetchProgress(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [courseId, userId, userRole, fetchProgress]);

  return {
    completedLessonIds,
    lastSyncTime,
  };
};
