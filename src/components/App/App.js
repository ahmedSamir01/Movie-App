import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "../elements/Header/Header";
import Home from "../Home/Home";
import Movie from "../Movie/Movie";
import NotFound from "../NotFound/NotFound";

const App = () => {
  return (
    <BrowserRouter basename="/Movie-App/">
      <>
        <Header />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/:movieId" component={Movie} />
          <Route component={NotFound} />
        </Switch>
      </>
    </BrowserRouter>
  );
};
// path will be in props.history.match.path
export default App;
