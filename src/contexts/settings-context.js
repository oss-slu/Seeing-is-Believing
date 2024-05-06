import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import firebase from '../lib/firebase';
import { useAuth } from '../hooks/use-auth';

//Default settings here

const initialSettings = {
  direction: 'ltr',
  responsiveFontSizes: true,
  theme: 'light'
};

//Basic context that starts with default settings and updates with saveSettings function

export const SettingsContext = createContext({
  settings: initialSettings,
  saveSettings: () => {}
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(initialSettings);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const restoreSettings = async () => {
        let newSettings = initialSettings;

        try {
          const userDocRef = firebase.firestore().collection('users').doc(user.id);
          const userDocSnap = await userDocRef.get();

          if (userDocSnap.exists && userDocSnap.data().settings) {
            newSettings = userDocSnap.data().settings;
          } else {
            newSettings = {
              ...initialSettings,
              theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            };
            await userDocRef.set({ settings: newSettings }, { merge: true });
          }
        } catch (err) {
          console.error(err);
        }

        setSettings(newSettings);
      };

      restoreSettings();
    }
  }, [user]);

  const saveSettings = async (updatedSettings) => {
    if (!user) {
      return;
    }

    try {
      const userDocRef = firebase.firestore().collection('users').doc(user.id);
      await userDocRef.set({ settings: updatedSettings }, { merge: true });
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

//Provider allows for DOM integration
  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const SettingsConsumer = SettingsContext.Consumer;
