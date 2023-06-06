import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import GlobalStyles, { lightTheme, darkTheme } from './components/GlobalStyles';
import { GlobalStore } from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

const Home = lazy(() => import('./pages/Home'));
const Page404 = lazy(() => import('./pages/404'));

const App: React.FC = () => {
  const theme = useSelector(({ theme }: GlobalStore) => theme);

  return (
    <div className="app">
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <GlobalStyles />
        <Router basename="/">
          <Suspense fallback={<div />}>
            <Switch>
              <Route path="/:hash?/">
                <Home />
              </Route>
              <Route path="*">
                <Page404 />
              </Route>
            </Switch>
          </Suspense>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
