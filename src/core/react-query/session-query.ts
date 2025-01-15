// 'use server';

import { QueryClient } from '@tanstack/react-query';
import { auth } from '@stock-day/core/auth/auth';
import {
  SESSION_QUERY_KEY,
  SESSION_QUERY_STALE_TIME,
  SessionInfoSchema,
  TSessionInfo
} from '@stock-day/core/react-query/constant';

export async function sessionQueryPrefetch(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: [SESSION_QUERY_KEY],
    staleTime: SESSION_QUERY_STALE_TIME,
    queryFn: async (): Promise<TSessionInfo | null> => {
      try {
        const session = await auth();
        if (!session) {
          return null;
        }
        const { error, data: user } = SessionInfoSchema.safeParse(session?.user);
        if (error) {
          // throw new Error('Invalid session');
          return null;
        }

        return {
          id: user.id,
          image: user.image,
          email: user.email
        };
      } catch (error: unknown) {
        return null;
        // throwError(error);
      }
    }
  });
}
