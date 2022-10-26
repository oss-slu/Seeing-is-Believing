import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
	Box,
	Container,
	Grid,
	Typography,
	Table,
	TableBody,
	TableHead,
	TableCell,
	TableRow,
	Card,
} from "@mui/material";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import OverviewClasses from "../../../components/student/grades/OverviewClasses";
//import { gtm } from "../../../lib/gtm";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../hooks/use-auth.js";
import { format } from "date-fns";
import { Scrollbar } from "../../../components/scrollbar";

const Overview = () => {
	const { user } = useAuth();
	const router = useRouter();
	const classId = router.query.cl;
	const [fetchedClasses, setFetchedClasses] = useState(null);
	const [isFetching, setIsFetching] = useState(true);
	const [gradesDetails, setGradesDetails] = useState(null);

	const fetchDataClasses = async () => {
		const collection = await db.collection("classes");
		const results = [];
		await collection
			.where("students", "array-contains", user.id)
			.get()
			.then((snapshot) => {
				if (snapshot) {
					snapshot.forEach((doc) => {
						results.push({ id: doc.id, ...doc.data() });
					});
				}
			});
		setFetchedClasses(results);
	};

	useEffect(() => {
		if (fetchedClasses) {
			setIsFetching(false);
		}
	}, [fetchedClasses]);

	useEffect(() => {
		//gtm.push({ event: "page_view" });
		fetchDataClasses();
	}, []);

	useEffect(() => {
		if (classId) {
			const getHomeworksDetails = async () => {
				await db
					.collection("assignments")
					.where("class", "==", classId)
					.get()
					.then((snapshot) => {
						const tmp = [];
						snapshot.forEach((doc) => {
							const data = doc.data();
							const date = format(data.dueDate.toDate(), "MM//dd/yyyy");
							const score = data.score;
							const studentAssignment = data.studentsAssignements.find(
								(el) => el.idStudent === user.id && el.grade
							);
							if (studentAssignment)
								tmp.push({
									name: data.title,
									grade: studentAssignment.grade,
									dueDate: date,
									score,
								});
						});
						setGradesDetails(tmp);
					});
			};
			getHomeworksDetails();
		}
	}, [classId]);

	return (
		<Box>
			<Head>
				<title>Seeing is believing</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pt: 1,
					pb: 8,
				}}
			>
				<Container maxWidth="xl">
					<Grid container>
						<Grid item sx={{ p: 0, mt: 4, mb: 1 }} md={12} xs={12}>
							<Typography variant="h5" color="neutral.700">
								Enrolled classes
							</Typography>
						</Grid>

						<Grid item md={10} xs={12}>
							{!isFetching && <OverviewClasses classes={fetchedClasses} />}
						</Grid>
						{gradesDetails && (
							<>
								<Grid
									item
									sx={{ p: 0, mt: 4, mb: 1 }}
									md={10}
									xs={12}
									container
								>
									<Typography variant="h5" color="neutral.700">
										Grades
									</Typography>
								</Grid>
								<Grid item md={10} xs={12}>
									<Card>
										<Scrollbar>
											<Table sx={{ minWidth: 600 }}>
												<TableHead>
													<TableRow>
														<TableCell>Name</TableCell>
														<TableCell>Grade</TableCell>
														<TableCell>Due Date</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{gradesDetails.map((item, pos) => (
														<TableRow
															sx={{
																"&:last-child td": {
																	border: 0,
																},
																"&:hover": {
																	backgroundColor: "rgba(255,255,255, 0.08)",
																},
															}}
														>
															<TableCell>
																<Typography variant="subtitle2">
																	{item.name}
																</Typography>
															</TableCell>
															<TableCell>
																<Typography
																	color="textSecondary"
																	variant="subtitle2"
																	sx={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	{item.grade + "/" + item.score}
																</Typography>
															</TableCell>
															<TableCell>
																<Typography
																	color="textSecondary"
																	variant="subtitle2"
																>
																	{item.dueDate}
																</Typography>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</Scrollbar>
									</Card>
								</Grid>
							</>
						)}
					</Grid>
				</Container>
			</Box>
		</Box>
	);
};

Overview.getLayout = (page) => (
	<AuthGuard>
		<DashboardLayout>{page}</DashboardLayout>
	</AuthGuard>
);

export default Overview;
