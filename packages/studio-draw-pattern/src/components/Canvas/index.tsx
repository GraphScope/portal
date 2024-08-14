import { Button, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { BehaviorSubject, map } from 'rxjs';

const popoverVisible$ = new BehaviorSubject<boolean>(false);

const openPopover = () => popoverVisible$.next(true);

const hidePopver = () => popoverVisible$.next(false);

export const Canvas = () => {
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

  useEffect(() => {
    const subscription = popoverVisible$.pipe(map(value => value)).subscribe(value => setPopoverVisible(value));

    return () => subscription.unsubscribe();
  }, []);
  return (
    <div
      style={{ height: '100%', width: '100%' }}
      onClick={() => {
        popoverVisible ? hidePopver() : openPopover();
      }}
    >
      this is draw pattern canvas area, use studio-importer component
      {popoverVisible && <div>Popover Form Input</div>}
    </div>
  );
};
