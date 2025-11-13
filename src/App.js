import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks"

export const config = {
  endpoint: `hhttps://amankumar-qkart.onrender.com/api/v1`,
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/register" exact>
            <Register />
          </Route>
          <Route path="/checkout" exact>
            <Checkout />
          </Route>
          <Route path="/" exact>
            <Products />
          </Route>
          <Route path="/thanks" exact>
            <Thanks />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}


export default App;
