import { useSuspenseQuery } from '@tanstack/react-query';
import {
  SESSION_QUERY_KEY,
  SESSION_QUERY_STALE_TIME,
  SessionInfoSchema,
  TSessionInfo
} from '@stock-day/core/react-query/constant';

export const useSessionQuery = () => {
  return useSuspenseQuery<TSessionInfo | null>({
    queryKey: [SESSION_QUERY_KEY],
    staleTime: SESSION_QUERY_STALE_TIME,
    queryFn: async (): Promise<TSessionInfo | null> => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`);
        if (!response.ok) {
          // throw new Error(`HTTP error status: ${response.status}`);
          return null;
        }

        const responseBody = await response.json();
        const { error, data: user } = SessionInfoSchema.safeParse(responseBody?.user);
        if (error) {
          // throw new Error(`Invalid session: ${error.message}`);
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          image: user.image
        };
      } catch (error: unknown) {
        // throwError(error);
        return null;
      }
    }
  });
};
