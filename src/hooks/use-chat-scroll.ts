import { useEffect, useCallback, useRef, useState } from 'react';

interface UseChatScrollProps {
  chatRef: React.MutableRefObject<HTMLDivElement | null>;
  bottomRef: React.MutableRefObject<HTMLDivElement | null>;
  count: number;
  shouldLoadMore: boolean;
  loadMore: () => Promise<void>;
}

const useChatScroll = ({
  chatRef,
  bottomRef,
  count,
  shouldLoadMore,
  loadMore,
}: UseChatScrollProps) => {

  const [hasEnitialized, setHasInitialized] = useState(false);

  useEffect(() => {

    const topDiv = chatRef?.current;
    const handleSroll = () => {
      const scrollTop = topDiv?.scrollTop || 0;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener('scroll', handleSroll);
    return topDiv?.removeEventListener('scroll', handleSroll);

  }, [shouldLoadMore, loadMore, chatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;
    const shouldAutoScroll = () => {
      if (!hasEnitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if(!topDiv) return false;

      const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 100;
    }

    if(shouldAutoScroll()) {
       setTimeout(() => {
        bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
       } , 100);
    }

  }, [bottomRef , chatRef , count , hasEnitialized]);

};

export default useChatScroll;