import {useEffect, useState} from "react";
import Head from "next/head";
import {
	Box,
	Container,
	Grid,
	Typography,
} from "@mui/material";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
//import {gtm} from "../../lib/gtm";
import OverviewClasses from "../../components/administrator/OverviewClasses";
import {useAuth} from "../../hooks/use-auth.js";
import {db} from "../../lib/firebase";


const Homework = () => {

	const {user} = useAuth()
	const [fetchedClasses,setFetchedClasses]=useState(null)
	const [languages,setLanguages]=useState(null)
	const [isFetching,setIsFetching]=useState(true)



	const fetchDataClasses= async()=>{
		const collection = await db.collection("classes");
		const results=[]
		await collection.where("administrator","==",user.id)
		  .get()
		  .then(snapshot=>{
			if(snapshot)
			{snapshot.forEach(doc=>{
			  results.push({id:doc.id,...doc.data()})
			})}
		  })
			setFetchedClasses(results);
	  }	
	

  useEffect(()=>{
		if(fetchedClasses){
			setIsFetching(false)
		}
  },[fetchedClasses])
  
	useEffect(() => {
		//gtm.push({event: "page_view"});
		fetchDataClasses();
	}, []);




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
					<Grid mt={2} xs={10} md={10}>
						{!isFetching && (
							<>
								<Typography variant="subtitle1" sx={{my: 1}}>
									Select the class you want to see the
									homework
								</Typography>
								<OverviewClasses classes={fetchedClasses} />
							</>
						)}
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
