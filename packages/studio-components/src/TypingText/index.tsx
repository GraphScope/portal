import * as React from 'react';
import Typewriter from 'typewriter-effect';
import { useCallback } from 'react';

/**
 * TypingText 组件的属性接口
 */
export interface ITypingTextProps {
  /** 要显示的文本内容 */
  children: string;
  /** 打字延迟时间（毫秒） */
  delay?: number;
  /** 删除速度（毫秒） */
  deleteSpeed?: number;
  /** 是否循环播放 */
  loop?: boolean;
  /** 打字完成后的回调函数 */
  onComplete?: () => void;
  /** 加载提示文本 */
  loadingText?: string;
}

/**
 * 打字机效果文本组件
 * @description 使用 typewriter-effect 实现的打字机效果文本组件
 */
const TypingText: React.FC<ITypingTextProps> = ({
  children,
  delay = 10,
  deleteSpeed = 10,
  loop = false,
  onComplete,
  loadingText = 'Generating...',
}) => {
  // 使用 useCallback 优化初始化函数
  const handleInit = useCallback(
    (typewriter: any) => {
      if (loop) {
        // 循环播放时，直接显示文本，不显示加载提示
        typewriter.typeString(children).pauseFor(1000).deleteAll().start();
      } else {
        // 非循环播放时，显示加载提示然后显示实际文本
        typewriter
          .typeString(loadingText)
          .pauseFor(100)
          .deleteChars(loadingText.length)
          .typeString(children)
          .start()
          .callFunction(function (state: any) {
            state.elements.cursor.style.display = 'none';
            onComplete?.();
          });
      }
    },
    [children, loop, onComplete, loadingText],
  );

  return (
    <Typewriter
      options={{
        delay,
        deleteSpeed,
        loop,
        cursor: loop ? '|' : '', // 循环播放时显示光标
      }}
      onInit={handleInit}
    />
  );
};

export default TypingText;
