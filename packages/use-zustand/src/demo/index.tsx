import React from "react";
import StoreProvider from "../index";
import ReactDOM from "react-dom/client";
import A from "./A";
import B from "./B";
import C from "./C";
interface IAppProps {
  id?: string;
}

const App: React.FunctionComponent<IAppProps> = (props) => {
  const { id } = props;

  return (
    <StoreProvider id={id} store={{ count: 0, name: "hello" }}>
      <A>
        <B>
          <C />
        </B>
      </A>
    </StoreProvider>
  );
};

const Apps = () => {
  return (
    <div>
      <App id='app-1' />
      <hr />
      <App id='app-2' />
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<Apps />);
