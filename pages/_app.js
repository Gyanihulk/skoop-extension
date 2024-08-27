import '../styles/globals.css'
import '../styles/auth.css'
import '../styles/welcome.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GlobalStatesProvider } from '../contexts/GlobalStates'
import ScreenContext, { ScreenProvider } from '../contexts/ScreenContext'
import { AuthProvider } from '../contexts/AuthContext'
import { MediaUtilsProvider } from '../contexts/MediaUtilsContext'
import { Toaster } from 'react-hot-toast'
import { MessageProvider } from '../contexts/MessageContext'
import { TourContextProvider } from '../contexts/TourContext'

import { AppProps } from 'next/app'

import Script from 'next/script'
import { RecordingProvider } from '../contexts/RecordingContext'
import { TimerProvider } from '../contexts/TimerContext'
import { UserSettingsProvider } from '../contexts/UserSettingsContext'
export default function App({ Component, pageProps }) {
  return (
    <>
      <Script src="/jquery-3.2.1.slim.min.js"></Script>
      <Script src="/bootstrap.min.js"></Script>
      <Script src="/popper.min.js"></Script>

      <TimerProvider>
        <MediaUtilsProvider>
          <GlobalStatesProvider>
            <ScreenProvider>
              <AuthProvider>
               <TourContextProvider>
                <MessageProvider>
                  <RecordingProvider>
                    <UserSettingsProvider>

                    <Toaster
                      position="top-right"
                      toastOptions={{
                        className: 'custom-toast',
                        duration: 3000,
                      }}
                      />

                    <Component {...pageProps} />
                      </UserSettingsProvider>
                  </RecordingProvider>
                </MessageProvider>
                </TourContextProvider>
              </AuthProvider>
            </ScreenProvider>
          </GlobalStatesProvider>
        </MediaUtilsProvider>
      </TimerProvider>
    </>
  )
}
