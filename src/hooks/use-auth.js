import { useContext } from 'react';
import { AuthContext } from '../contexts/firebase-auth-context';
export const useAuth = () => useContext(AuthContext);

//This is a simply hook, it uses the context defined in contexts/firebase-auth-context which is explained there
// This hook will be used throughout the application to ensure users are authenticated