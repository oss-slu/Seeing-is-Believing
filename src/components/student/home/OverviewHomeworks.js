import { format } from 'date-fns';
import {useState,useEffect} from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from '../../scrollbar';
import { MoreMenu } from '../../more-menu class';
import {useAuth} from '../../../hooks/use-auth';
import {db} from '../../../lib/firebase'
import {useRouter} from 'next/router';
import CircleIcon from '@mui/icons-material/Circle';


const Content = (props) => {
	const router = useRouter();
    const classId=router.query.cl
    const {user} = useAuth();
    const [homeworks,setHomeworks]=useState(null)
    const [isLoaded,setIsLoaded]=useState(false)

    const fetchDataHomeworks= async()=>{
        const collection = await db.collection("assignments");
        const results=[]
        await collection.where("class","==",classId)
          .get()
          .then(async (snapshot)=>{
             await snapshot.forEach(doc=>{
                const data=doc.data();
                const student=data.students.filter(std=>std.id==user.id);
                const studentAssignement=data.studentsAssignements.filter(assignment=>assignment.idStudent==user.id);

                const date=format(data.dueDate.toDate(),'MM/dd/yyyy');
                results.push({
					id: doc.id,
					...data,
					status:student.submitted != "yes" ? "New" : studentAssignement.grade? "Graded":"Submitted", dueDate:date
				});
            })
        })
        setHomeworks(results);
      }	

	useEffect(() => {
        fetchDataHomeworks()
    }, []);
    useEffect(()=>{
        if(homeworks){
            setIsLoaded(true);
        }   
    },[homeworks])

    const firstToUpperCase=(i)=>{
        if(i){
          return i.charAt(0).toUpperCase()+i.slice(1,i.length)
        }
        return ""
      }
	const seeHomework=(link)=>{
		router.push(link)
	}
    if(isLoaded){
	return (
		<>
			<Card>
				<Scrollbar>
					<Table sx={{ minWidth: 600 }}>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Submitted</TableCell>
								<TableCell>Due Date</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{homeworks.map((item, pos) => (
								<TableRow
									key={pos}
									sx={{
										"&:last-child td": {
											border: 0,
										},
										"&:hover": { backgroundColor: "rgba(255,255,255, 0.08)" },
									}}
								>
									<TableCell
										sx={{ cursor: "pointer" }}
										onClick={() => {
											seeHomework(
												item.status === "New"
													? `/student/homeworks/${item.id}`
													: `/student/homework_grad?hid=${item.id}`
											);
										}}
									>
										<Typography variant="subtitle2">{item.title}</Typography>
									</TableCell>
									<TableCell
										sx={{ cursor: "pointer" }}
										onClick={() => {
											seeHomework(
												item.status === "New"
													? `/student/homeworks/${item.id}`
													: `/student/homework_grad?hid=${item.id}`
											);
										}}
									>
										<Typography
											color="textSecondary"
											variant="subtitle2"
											sx={{
												display: "flex",
												alignItems: "center",
											}}
										>
											<CircleIcon
												sx={{
													fontSize: "0.8em",
													mr: 1,
													color:
														item.status === "New"
															? "#7582EB"
															:"#10B981"
												}}
											/>
											{item.status}
										</Typography>
									</TableCell>
									<TableCell
										sx={{ cursor: "pointer" }}
										onClick={() => {
											seeHomework(
												item.status === "New"
													? `/student/homeworks/${item.id}`
													: `/student/homework_grad?hid=${item.id}`
											);
										}}
									>
										<Typography color="textSecondary" variant="subtitle2">
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
													display:"See Homework",
													link:
														item.status === "New"
															? `/student/homeworks/${item.id}`
															: `/student/homework_grad?hid=${item.id}`,
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
    }else{
        return <Box></Box>
    }
};

export default Content;