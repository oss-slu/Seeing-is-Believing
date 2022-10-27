import {useRouter} from 'next/router';
import { format, subDays } from 'date-fns';
import {useState,useEffect} from 'react';
import numeral from 'numeral';
import {
  Box,
  Card,
  CardHeader,
  Table,
  Button,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from '../scrollbar';
import { SeverityPill } from '../severity-pill';
import { MoreMenu } from '../more-menu class';
import {useAuth} from '../../hooks/use-auth';
import {db} from '../../lib/firebase'



const Content = (props) => {
  const router=useRouter();
  const {classes}=props
  const {isLoading,setIsLoading}=useState(true)
  const [languages,setLanguages]=useState(null)
  const [semesters,setSemesters]=useState(null)

  useEffect(()=>{
    fetchDataLanguages()
    fetchDataSemesters()
  },[])

  const fetchDataLanguages = async () => {
		const collection = await db.collection("languages");
		const results = [];
		classes.forEach(async (el) => {
			await collection
				.doc(el.language)
				.get()
				.then((snapshot) => {
					const language=snapshot.data().name
					results.push(language)
					if (results.length === classes.length) {
						setLanguages(results);
					}
				});
		});
  };

  const seeHomeworks=(class_id)=>{
	router.push(`/teacher/homeworks?cl=${class_id}`)
  }
  
  const fetchDataSemesters = async()=>{
    const collection = await db.collection("terms");
		const results = [];
		classes.forEach(async (el) => {
			await collection
				.doc(el.term)
				.get()
				.then((snapshot) => {
					const semester=snapshot.data().name
					results.push(semester)
					if (results.length === classes.length) {
						setSemesters(results);
					}
				});
		});
  }

  return (
		<>
			{languages && semesters ? (
				<Card>
					<Scrollbar>
						<Table sx={{minWidth: 600}}>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>Langage</TableCell>
									<TableCell>Semester</TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{classes.map((item, pos) => (
									<TableRow
										key={pos}
										sx={{
											"&:last-child td": {
												border: 0,
											},
											"&:hover":{
												backgroundColor: 'rgba(255,255,255, 0.08)'
											}
										}}
									>
										<TableCell
											sx={{cursor:'pointer'}}
											onClick={() => {
												seeHomeworks(item.id);
											}}
										>
											<Typography variant="subtitle2">
												{item.name}
											</Typography>
										</TableCell>
										<TableCell
											sx={{cursor:'pointer'}}
											onClick={() => {
												seeHomeworks(item.id);
											}}
										>
											<Typography
												color="textSecondary"
												variant="subtitle2"
											>
												{languages[pos]}
											</Typography>
										</TableCell>
										<TableCell
											sx={{cursor:'pointer'}}
											onClick={() => {
												seeHomeworks(item.id);
											}}
										>
											<Typography
												color="textSecondary"
												variant="subtitle2"
											>
												{semesters[pos]}
											</Typography>
										</TableCell>
										<TableCell
											sx={{
												textAlign: "center",
												padding: 0,
											}}
										>
											<MoreMenu
												classId={item.id}
												options={[
													{
														display:"See Homeworks",
														link: `/teacher/homeworks?cl=${item.id}`,
													}
												]}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Scrollbar>
				</Card>
			) : (
				<Card {...props}>
					<Scrollbar>
						<Table sx={{minWidth: 600}}>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>Langage</TableCell>
									<TableCell>Semester</TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell colSpan={4}>
										<Typography
											color="textSecondary"
											sx={{textAlign: "center"}}
										>
											{" "}
											No managed classes
										</Typography>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Scrollbar>
				</Card>
			)}
		</>
  );
};


export default Content;