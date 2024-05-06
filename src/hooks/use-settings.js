import { useContext } from 'react';
import { SettingsContext } from '../contexts/settings-context';

export const useSettings = () => useContext(SettingsContext);

//Similar to the use-auth hook, this just uses a context as defined by reacts useContext hook. Check the settingsContext
//If you believe this is the issue here