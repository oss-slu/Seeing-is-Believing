//import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Card, Button, Container, Typography } from '@mui/material';
import { GuestGuard } from '../../components/authentication/guest-guard';
import { AmplifyPasswordRecovery } from '../../components/authentication/password-recovery';
import { Logo } from '../../components/logo';
//import { gtm } from '../../lib/gtm';


const PasswordRecovery = () => {
  const router = useRouter();
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
					backgroundColor: "background.default",
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				<Container
					maxWidth="sm"
					sx={{
						py: {
							xs: "40px",
							md: "45px",
						},
					}}
				>
					<Box>
						<Button
							fullWidth
							size="large"
							type="submit"
							variant="contained"
							sx={{
								backgroundColor: "#D1D5DB",
								"&:hover": {
									background: "#6B7280",
								},
                borderBottomLeftRadius:1,
                borderBottomRightRadius:1,
							}}
							onClick={() => router.back()}
						>
							Back to Login
						</Button>
					</Box>
					<Card elevation={16} sx={{p: 4}}>
						<Box
							sx={{
								alignItems: "center",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
							}}
						>
							<NextLink href="/" passHref>
								<a>
									<Logo
										sx={{
											height: 40,
											width: 40,
										}}
									/>
								</a>
							</NextLink>
							<Typography variant="h4">
								Password Recovery
							</Typography>
							<Typography
								color="textSecondary"
								sx={{mt: 2}}
								variant="body2"
							>
								Tell us your email so we can send you a reset
								link
							</Typography>
						</Box>
						<Box
							sx={{
								flexGrow: 1,
								mt: 3,
							}}
						>
							<AmplifyPasswordRecovery />
						</Box>
					</Card>
				</Container>
			</Box>
		</>
  );
};

PasswordRecovery.getLayout = (page) => (
  <GuestGuard>
    {page}
  </GuestGuard>
);

export default PasswordRecovery;
