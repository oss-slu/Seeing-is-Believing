import { useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Toaster } from 'react-hot-toast';
import nProgress from 'nprogress';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import AdapterDateFns from '@mui/x-date-pickers';
import { RTL } from '../components/rtl';
import { SettingsButton } from '../components/settings-button';
import { SplashScreen } from '../components/splash-screen';
import { SettingsConsumer, SettingsProvider } from '../contexts/settings-context';
import { AuthConsumer, AuthProvider } from '../contexts/firebase-auth-context';
//import { gtmConfig } from '../config';
import { createTheme } from '../theme';
import { createEmotionCache } from '../utils/create-emotion-cache';
import '../styles/globals.css';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  /*useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);*/

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Seeing is Believing</title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <SettingsProvider>
              <SettingsConsumer>
                {({ settings }) => (
                  <ThemeProvider
                    theme={createTheme({
                      direction: settings.direction,
                      responsiveFontSizes: settings.responsiveFontSizes,
                      mode: settings.theme
                    })}
                  >
                    <RTL direction={settings.direction}>
                      <CssBaseline />
                      <Toaster position="top-center" />
                      <SettingsButton />
                      <AuthConsumer>
                        {(auth) => !auth.isInitialized
                          ? <SplashScreen />
                          : getLayout(
                            <Component {...pageProps} />
                          )}
                      </AuthConsumer>
                    </RTL>
                  </ThemeProvider>
                )}
              </SettingsConsumer>
            </SettingsProvider>
          </AuthProvider>
        </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
