import {useEffect, useState} from "react";
import Head from "next/head";
import {
	Box,
	Container,
	Grid,
	Typography,
} from "@mui/material";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
//import {gtm} from "../../../lib/gtm";
import HomeworkOverview from '../../../components/teacher/OverviewHomeworks'

const Homework = () => {
	const [displayBanner, setDisplayBanner] = useState(true);

	/*useEffect(() => {
		gtm.push({event: "page_view"});
	}, []);*/

	useEffect(() => {
		// Restore the persistent state from local/session storage
		const value = globalThis.sessionStorage.getItem("dismiss-banner");

		if (value === "true") {
			// setDisplayBanner(false);
		}
	}, []);


	const handleDismissBanner = () => {
		// Update the persistent state
		// globalThis.sessionStorage.setItem('dismiss-banner', 'true');
		setDisplayBanner(false);
	};

	return (
		<>
			<Head>
				<title>Seeing-is-believing</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pt: 5,
					pb: 8,
				}}
			>
				<Container maxWidth="xl">
					<Grid container spacing={4}>
						<Grid item>
							<Typography variant="h4">Homework</Typography>
						</Grid>
					</Grid>
                    <Grid mt={2} xs={10}>
					<Typography variant="subtitle1" sx={{my: 1}}>
							Select the homework you want to see who already submitted
						</Typography>
                    <HomeworkOverview/>
                    </Grid>
				</Container>
			</Box>
		</>
	);
};

Homework.getLayout = (page) => (
	<AuthGuard>
		<DashboardLayout>{page}</DashboardLayout>
	</AuthGuard>
);

export default Homework;
