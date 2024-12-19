import * as React from 'react';
import Typewriter from 'typewriter-effect';
interface ITypingTextProps {
  children: string;
}

const TypingText: React.FunctionComponent<ITypingTextProps> = ({ children }) => {
  return (
    <Typewriter
      options={{
        delay: 10,
        deleteSpeed: 10,
        loop: false,
      }}
      onInit={typewriter => {
        typewriter
          .typeString('Generating...')
          .pauseFor(100)
          .deleteChars(14)
          .typeString(children)
          .start()
          .callFunction(function (state) {
            state.elements.cursor.style.display = 'none';
          });
      }}
    />
  );
};

export default TypingText;
