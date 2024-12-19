import React, { Suspense, useEffect, useRef, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

interface LazyLoadProps {
  children: React.ReactNode;
  //TODO: future lazy load edge
  type: 'EDGE' | 'NODE';
}

const Loading = () => <div>Loading...</div>;

export const LazyLoad: React.FC<LazyLoadProps> = ({ children, type = 'NODE' }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(true);

  // 用 BehaviorSubject 存储当前可见状态
  const visibility$ = new BehaviorSubject<boolean>(true);

  useEffect(() => {
    // 订阅可见性状态变化
    const subscription = visibility$.subscribe(setVisible);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        visibility$.next(isVisible); // 更新可见性状态
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0,
      },
    );

    const currentWrapper = wrapperRef.current;
    if (currentWrapper) observer.observe(currentWrapper);

    return () => {
      if (currentWrapper) observer.unobserve(currentWrapper);
      observer.disconnect();
      subscription.unsubscribe();
    };
  }, []);

  const GraphNode = visible && <Suspense fallback={<Loading />}>{children}</Suspense>;

  return (
    <div ref={wrapperRef} style={{ height: '100px', width: '100px' }}>
      {visible ? GraphNode : null}
    </div>
  );
};
