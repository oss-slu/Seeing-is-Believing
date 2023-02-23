import {useState} from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {Box, Button,FormHelperText, TextField,Alert } from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';
import firebase from 'firebase/app';


export const FirebaseLogin = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(true)

  const { signInWithEmailAndPassword,logout} = useAuth();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const user= await signInWithEmailAndPassword(
          values.email,
          values.password
        ).then(async (authUser) => {
          
          const user=firebase.auth().currentUser;
         
          if(user.emailVerified){
            if (isMounted()) {
              const returnUrl = router.query.returnUrl || "/student";
              //router.push('returnUrl');
              router.push("/")
              
            }
          
    
          }else{
            
            await logout();
            await user.sendEmailVerification();
            setIsUserAuthenticated(false);
            helpers.setStatus({success: false});
            helpers.setSubmitting(false);
  
  
          }
        });

        }
			 catch (err) {
			if (isMounted()) {
				helpers.setStatus({success: false});
				helpers.setErrors({submit: err.message});
				helpers.setSubmitting(false);
			}
		}
    }
  });

  return (
    <div {...props}>
      <form
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <TextField
          error={Boolean(formik.touched.email && formik.errors.email)}
          fullWidth
          helperText={formik.touched.email && formik.errors.email}
          label="Email Address"
          margin="normal"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email}
        />
        <TextField
          error={Boolean(formik.touched.password && formik.errors.password)}
          fullWidth
          helperText={formik.touched.password && formik.errors.password}
          label="Password"
          margin="normal"
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.password}
        />
        {formik.errors.submit && (
          <Box sx={{ mt: 3 }}>
            <FormHelperText error>
              {formik.errors.submit}
            </FormHelperText>
          </Box>
        )}
        <Box sx={{ mt: 2 }}>
          <Button
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Log In
          </Button>
          {!isUserAuthenticated && <Alert severity="warning">Your Account is not Verified! Click the Link sent to your Email</Alert>}
        </Box>
      </form>
    </div>
  );
};