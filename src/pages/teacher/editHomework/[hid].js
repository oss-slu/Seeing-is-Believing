import {useEffect, useState} from "react";
import Head from "next/head";
import {
	Box,
	Grid,
	Tabs,
	Tab
} from "@mui/material";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import EditHomeworkForm from "../../../components/teacher/homework/EditHomeworkForm";
import SwipeableViews from "react-swipeable-views";
import {db} from "../../../lib/firebase";
import {useAuth} from '../../../hooks/use-auth';
import { useRouter } from "next/router";

const Page = () => {
	const router = useRouter();
    const homeworkId = router.query.hid;
	const {user} = useAuth();
	const [activeStep, setActiveStep] = useState(0);
	const [complete, setComplete] = useState(false);
	const [index, setIndex] = useState(0);
	const [languages, setLanguages] = useState([]);
	const [title, setTitle] = useState([]);
	const [terms, setTerms] = useState([]);
	const [words, setWords] = useState(0);
	const [classes,setClass]= useState(null)
	const [homework, setHomework] = useState(null);
	const [score, setScore] = useState(null);
	const [description, setDescription] = useState([null]);
	const [date, setDate] = useState(null);
	const [studentId, setStudent] = useState(null);
	

	const fetchHomeworkDetails = async () => {
		try {
			await db
				.collection("assignments")
				.doc(homeworkId)
				.get()
				.then((docRef) => {
					const results = docRef.data();
					setHomework(results);
					setWords(results.words);
					setTitle(results.title);
					setDescription(results.description);
					setScore(results.score);
					setDate(results.dueDate);
					setClass(results.class);
				});
		} catch (err) {
			console.log(err.message);
		}
	};

	const fetchDataClasses=async () =>{
		const collection= await db.collection("classes");
		let results=[];
		await collection.get().then(snapshot=>{
			snapshot.docs.forEach(doc=>{
				const newClass={id:doc.id,...doc.data()}
				results.push(newClass)
			})
		})
		setClass(results)
	}
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
	const fetchDataWords= async () =>{
		const collection= await db.collection("words"); 
		let results=[];
		await collection.get().then(snapshot=>{
			snapshot.docs.forEach(doc=>{
				const word={id:doc.id,...doc.data()}
				results.push(word)
			})
		})
		setWords(results)
	}

	useEffect(() => {
		fetchHomeworkDetails();
		fetchDataClasses();
		fetchDataLanguages();
		fetchDataWords();
	}, []);
	
		const handleChange = (evt, value) => {
			setIndex(value);
		};
	
		const handleChangeIndex = (i) => {
			setIndex(i);
		};

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
											label="Edit a homework"
										/>
									</Tabs>
								</Grid>
								<Grid pl={2} md={12} pt={6}>
									<SwipeableViews
										index={index}
										onChangeIndex={handleChangeIndex}
									>
										<Grid>
											<EditHomeworkForm
												title={title}
												words={words}
												classes={classes}
												description={description}
												score={score}
												date={date}
												id={homeworkId}
											/>
										</Grid>
										<Grid>
											Edit
											{/* {index===1 &&
                                <EditLanguageForm stepBack={onStepBack} languages={languages} />
                                } */}
										</Grid>
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

Page.getLayout = (page) => (
	<AuthGuard>
		<DashboardLayout>{page}</DashboardLayout>
	</AuthGuard>
);

export default Page;