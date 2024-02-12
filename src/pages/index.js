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
      //const url= (user.status=="Student")?'/student':'/teacher'
      var url = "";
      //const url= (user.status=="Student")?'/student':'/teacher'
      if(user.status == "Student"){
        url = '/student';
      }else if(user.status == "Teacher"){
        url = '/teacher';
      }else if(user.status == 'Administrator'){
        url = '/administrator';
      }
      router.push(url);
    }
  }, []);

  return (
    <>
    </>
  );
};


export default Home;
