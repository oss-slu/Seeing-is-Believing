import {useRouter} from 'next/router';
import {useEffect } from 'react'
import { useAuth } from '../hooks/use-auth';

const Home = () => {
  const router=useRouter();
  const {isAuthenticated,user}=useAuth()

  useEffect(() => {

    if(!isAuthenticated) {
      router.push("authentication/login");
    } else {
      const url= (user.status=="Student")?'/student':'/teacher'
      router.push(url);
    }
  }, []);

  return (
    <>
    </>
  );
};


export default Home;
