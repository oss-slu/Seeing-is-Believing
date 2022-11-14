import {format} from "date-fns";
import {useState, useEffect} from "react";
import {
	Box,
	Card,
	Table,
	TableBody,
	TableHead,
	TableCell,
	TableRow,
	Typography,
} from "@mui/material";
import {Scrollbar} from "../scrollbar";
import {MoreMenu} from "../more-menu class";
import {useAuth} from "../../hooks/use-auth";
import {db} from "../../lib/firebase";
import {useRouter} from "next/router";

const Content = (props) => {
	const router = useRouter();
	const classId = router.query.cl;
	const {user} = useAuth();
	const [homeworks, setHomeworks] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const fetchDataHomeworks = async () => {
		const collection = await db.collection("assignments");
		const results = [];
		await collection
			.where("class", "==", classId)
			.get()
			.then(async (snapshot) => {
				await snapshot.forEach((doc) => {
					const data = doc.data();
					const date = format(data.dueDate.toDate(), "dd.MM.yyyy");
					results.push({
						id: doc.id,
						...data,
						dueDate: date,
					});
				});
			});
		setHomeworks(results);
	};

	useEffect(() => {
		fetchDataHomeworks();
	}, []);
	useEffect(() => {
		if (homeworks) {
			setIsLoaded(true);
		}
	}, [homeworks]);

	const firstToUpperCase = (i) => {
		if (i) {
			return i.charAt(0).toUpperCase() + i.slice(1, i.length);
		}
		return "";
	};

	const seeHomework = (homework_id) => {
		router.push(`/teacher/homeworks/${homework_id}`);
	};
	if (isLoaded) {
		return (
			<>
				<Card>
					<Scrollbar>
						<Table sx={{minWidth: 600}}>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>Due Date</TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{homeworks.map((item,pos) => (
									<TableRow
										key={pos}
										sx={{
											"&:last-child td": {
												border: 0,
											},
											"&:hover": {backgroundColor: 'rgba(255,255,255, 0.08)'},
										}}
									>
										<TableCell
											sx={{cursor: "pointer"}}
											onClick={() => {
												seeHomework(item.id);
											}}
										>
											<Typography variant="subtitle2">
												{item.title}
											</Typography>
										</TableCell>
										<TableCell
											sx={{cursor: "pointer"}}
											onClick={() => {
												seeHomework(item.id);
											}}
										>
											<Typography
												color="textSecondary"
												variant="subtitle2"
											>
												{item.dueDate.valueOf()}
											</Typography>
										</TableCell>
										<TableCell
											sx={{
												textAlign: "center",
												padding: 0,
											}}
										>
											<MoreMenu
												options={[
													{
														display: "See Homework",
														link: `/teacher/homeworks/${item.id}`,
													},
												]}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Scrollbar>
				</Card>
			</>
		);
	} else {
		return <Box></Box>;
	}
};

export default Content;