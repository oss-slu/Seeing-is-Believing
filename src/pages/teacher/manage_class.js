import {useEffect, useState} from "react";
import Head from "next/head";
import {
	Box,
	Grid,
	Tabs,
	Tab,
} from "@mui/material";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import AddClassForm from '../../components/teacher/classPage/AddClassForm'
import EditClassForm from "../../components/teacher/classPage/EditClassForm";
import DeleteClassForm from "../../components/teacher/classPage/DeleteClassForm";
import SwipeableViews from "react-swipeable-views";
import {db} from "../../lib/firebase";
import { useAuth } from '../../hooks/use-auth';

const ClassPage = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [complete, setComplete] = useState(false);
	const { user } = useAuth();
	const [index, setIndex] = useState(0);
	const [languages, setLanguages] = useState([]);
	const [terms, setTerms] = useState([]);
	const [students, setStudents] = useState(0);
	const [classes,setClass]= useState(null)

	const fetchDataLanguages = async () => {
		const collection = await db.collection("languages");
		let results = [];
		await collection.get().then((snapshot) => {
			//results = snapshot.docs[0].data();
			snapshot.docs.forEach((doc) => {
				const newLanguage = doc.data();
				newLanguage={id:doc.id,...newLanguage}
				results.push(newLanguage);
			});
		});
		setLanguages(results);
	};

	const fetchDataTerms = async () =>{
		const collection = await db.collection("terms");
		let results=[]
		await collection.get().then((snapshot) => {
			//results = snapshot.docs[0].data();
			snapshot.docs.forEach((doc) => {
				const newTerm = doc.data();
				newTerm={id:doc.id,...newTerm}
				results.push(newTerm);
			});
		});
		setTerms(results);
	}


	const fetchDataStudents= async () =>{
		const collection= await db.collection("users"); 
		let results=[];
		await collection.where("status","==","Student")
		.get().then(snapshot=>{
			snapshot.docs.forEach(doc=>{
				const student={id:doc.id,...doc.data()}
				results.push(student)
			})
		})
		setStudents(results)
	}

	const fetchDataClasses=async () =>{
		const collection= await db.collection("classes");
		let results=[];
		await collection.where("teacher","==",user.id).get().then(snapshot=>{
			snapshot.docs.forEach(doc=>{
				const newClass={id:doc.id,...doc.data()}
				results.push(newClass)
			})
		})
		setClass(results)
	}
	
	useEffect(() => {
			fetchDataLanguages();
			fetchDataTerms();
			fetchDataStudents();
		}, []);
	
	useEffect(()=>{
		if(index===1){
			fetchDataClasses();
		}
		if(index === 2){
			fetchDataClasses();
		}
	},[index])
	const handleChange = (evt, value) => {
		setIndex(value);
	};

	const handleChangeIndex = (i) => {
		setIndex(i);
	};

	const handleRefetch=()=>{
		fetchDataClasses()
	}

	return (
		<>
			<Head>
				<title>Seeing is believing</title>
			</Head>
			<Box
				component="main"
				sx={{
					display: "flex",
					flexGrow: 1,
				}}
			>
				<Grid container sx={{flexGrow: 1}}>
					<Grid
						item
						sm={4}
						xs={12}
						sx={{
							backgroundImage:
								"url(/static/images/background.png)",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
							backgroundSize: "cover",
							display: {
								xs: "none",
								md: "block",
							},
						}}
					/>
					<Grid
						item
						xs={12}
						md={8}
						sx={{
							px: {
								xs: 4,
								sm: 6,
								md: 8,
							},
							py: 2,
						}}
					>
						<Box maxWidth="sm">
							<Grid container spacing={2}>
								<Grid item container>
									<Tabs
										value={index}
										fullWidth
										onChange={handleChange}
									>
										<Tab
											sx={{fontSize: 16}}
											label="Add class"
										/>
										<Tab
											sx={{fontSize: 16}}
											label="Edit class"
										/>
										<Tab
											sx={{fontSize: 16}}
											label="Delete Class"
										/>
									</Tabs>
								</Grid>
								<Grid pl={2} md={8} pt={6}>
									<SwipeableViews
										index={index}
										onChangeIndex={handleChangeIndex}
									>
										<Grid>
											<AddClassForm  languages={languages} students={students} terms={terms}/>
										</Grid>
									 {index === 1 && 
										<Grid>
												<EditClassForm
													classes={classes}
													students={students}
													terms={terms}
													languages={languages}
													refetch={handleRefetch}
												/>
										</Grid>
										}
									{index === 2 && 
										<Grid>
												<DeleteClassForm
													classes={classes}
													students={students}
													terms={terms}
													languages={languages}
													refetch={handleRefetch}
												/>
										</Grid>
										}
									
									</SwipeableViews>
								</Grid>
							</Grid>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

ClassPage.getLayout = (page) => (
	<AuthGuard>
		<DashboardLayout>{page}</DashboardLayout>
	</AuthGuard>
);

export default ClassPage;
