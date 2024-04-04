import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import firebase,{db} from '../lib/firebase';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: ""
};

const reducer = (state, action) => {
  if (action.type === 'AUTH_STATE_CHANGED') {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  }

  return state;
};

export const AuthContext = createContext({
  ...initialState,
  platform: 'Firebase',
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const fetchUserData = async (user) => {
    const collection = await db.collection("users");
    let userFound = false; // Flag to check if user document exists
    await collection
      .where("email", "==", user.email)
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length > 0) {
          const userData = snapshot.docs[0].data();
          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              isAuthenticated: true,
              user: {
                id: snapshot.docs[0].id,
                avatar: user.photoURL,
                ...userData
              }
            }
          });
          userFound = true;
        } else {
          console.error('No user document found with this email');
        }
      });
  
    if (!userFound) {
      // Dispatch a different action or handle the "user not found" state
      // For example, you might want to set isAuthenticated to false
      dispatch({
        type: 'AUTH_STATE_CHANGED',
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  };
  
  
  useEffect(() => firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // Here you should extract the complete user profile to make it available in your entire app.
      // The auth state only provides basic information.
      fetchUserData(user)
    } else {
      dispatch({
        type: 'AUTH_STATE_CHANGED',
        payload: {
          isAuthenticated: false,
          user: ""
        }
      });
    }
  }), []);

  const signInWithEmailAndPassword = async (email,
    password) => {
	  await firebase.auth().signInWithEmailAndPassword(email, password)
    .then(async(userCredentials)=>{
      await fetchUserData(userCredentials.user);
    })
	}

  const getUser=()=>{
    return state
  }

  const createUserWithEmailAndPassword = async (email,
    password) => await firebase.auth().createUserWithEmailAndPassword(email, password);

  const logout = async () => {
    await firebase.auth().signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Firebase',
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        getUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
