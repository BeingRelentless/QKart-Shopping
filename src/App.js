import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";



export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/">
          <Login /> {/* default route */}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
