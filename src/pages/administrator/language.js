import {useEffect, useState} from "react";
import Head from "next/head";
import {
	Avatar,
	Box,
	Grid,
	Tabs,
	Tab,
} from "@mui/material";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {AddLanguageForm} from "../../components/teacher/language/AddLanguageForm";
import {EditLanguageForm} from "../../components/teacher/language/EditLanguageForm";
import {Check as CheckIcon} from "../../icons/check";
import SwipeableViews from "react-swipeable-views";
import {db} from "../../lib/firebase";

const StepIcon = (props) => {
	const {active, completed, icon} = props;
	const highlight = active || completed;

	return (
		<Avatar
			sx={{
				backgroundColor: highlight && "secondary.main",
				color: highlight && "secondary.contrastText",
				height: 40,
				width: 40,
			}}
			variant="rounded"
		>
			{completed ? <CheckIcon fontSize="small" /> : icon}
		</Avatar>
	);
};

const LanguagePage = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [complete, setComplete] = useState(false);
	const [index, setIndex] = useState(0);
	const [languages, setLanguages] = useState([]);

	const fetchData = async () => {
		const collection = await db.collection("languages");
		let results = [];
		await collection.get().then((snapshot) => {
			//results = snapshot.docs[0].data();
			snapshot.docs.forEach((doc) => {
				const newLanguage = doc.data();
				results.push(newLanguage);
			});
		});
		setLanguages(results);
	};
	const onStepBack = () => {
		setIndex(0);
	};
	useEffect(() => {
		if (index === 1) {
			fetchData();
		}
	}, [index]);

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
											label="Add language"
										/>
										<Tab
											sx={{fontSize: 16, ml: 8}}
											label="Edit language"
										/>
									</Tabs>
								</Grid>
								<Grid pl={2} md={8} pt={6}>
									<SwipeableViews
										index={index}
										onChangeIndex={handleChangeIndex}
									>
										<Grid>
											<AddLanguageForm />
										</Grid>
										<Grid>
											{index === 1 && (
												<EditLanguageForm
													stepBack={onStepBack}
													languages={languages}
												/>
											)}
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

LanguagePage.getLayout = (page) => (
	<AuthGuard>
		<DashboardLayout>{page}</DashboardLayout>
	</AuthGuard>
);

export default LanguagePage;
