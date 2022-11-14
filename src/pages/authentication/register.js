//import { useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';
import { GuestGuard } from '../../components/authentication/guest-guard';
import { FirebaseRegister } from '../../components/authentication/firebase-register';
import { useAuth } from '../../hooks/use-auth';
//import { gtm } from '../../lib/gtm';
import { db } from '../../lib/firebase';


const Register = (props) => {
  const router = useRouter();
  const { disableGuard } = router.query;
 
  
  /*useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);*/

  return (
    <>
      <Head>
        <title>Seeing Is Believing</title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '40px',
              md: '45px'
            }
          }}
        >

        <Box
            sx={{
              alignItems: 'center',
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'neutral.900'
                : 'neutral.100',
              borderColor: 'divider',
              borderRadius: 1,
              borderStyle: 'solid',
              borderWidth: 1,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              mb: 4,
              p: 2,
              '& > img': {
                height: 32,
                width: 'auto',
                flexGrow: 0,
                flexShrink: 0
              }
            }}
          >
            <Typography
              color="textSecondary"
              variant="caption"
            >
              Seeing Is Believing
            </Typography>
            <img
              alt="Logo"
              src={'/static/icons/logo1.png'}
              style={{height: 50, width: 50}}
            />
          </Box>
  
          <Card
            elevation={16}
            sx={{ p: 4 }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <NextLink
                href="/"
                passHref
              >
                <a>
                  <img
                    alt="Logo"
                    src={'/static/icons/logo1.png'}
                    style={{height: 50, width: 50}}
                  />
                </a>
              </NextLink>
              <Typography variant="h4">
                Register
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3
              }}
            >
              <FirebaseRegister codes={props.codes} />
            </Box>
            <Divider sx={{ my: 3 }} />
            <Typography variant="body2">Already have an account?&#160;
            <NextLink
              href={disableGuard
                ? `/authentication/login?disableGuard=${disableGuard}`
                : '/authentication/login'}
              passHref
            >
              <Link
                color="primary"
                variant="body2"
              >
                Sign In
              </Link>
            </NextLink>
            </Typography>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Register.getLayout = (page) => (
  <GuestGuard>
    {page}
  </GuestGuard>
);


export async function getServerSideProps(context) {
	const collection = await db.collection("code");
  let codes;
	await collection.get().then((snapshot) => {
		if (snapshot) {
			snapshot.forEach((doc) => {
				codes=doc.data();
			});
		}
	});
	return {
		props: {
			codes
		}, // will be passed to the page component as props
	};
}


export default Register;
