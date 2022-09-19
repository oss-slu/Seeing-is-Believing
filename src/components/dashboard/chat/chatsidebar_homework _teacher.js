import {useState,useEffect} from "react";
import PropTypes from "prop-types";
import {
	Box,
	Drawer,
	IconButton,
	List,
	Typography,
	useMediaQuery,
	ListItemButton,
	ListItemText
} from "@mui/material";
import {styled} from "@mui/material/styles";
import {X as XIcon} from "../../../icons/x";
import {db} from '../../../lib/firebase'

const ChatSidebarDesktop = styled(Drawer)({
	flexShrink: 0,
	width: 380,
	"& .MuiDrawer-paper": {
		position: "relative",
		width: 380,
	},
});

const ChatSidebarMobile = styled(Drawer)({
	maxWidth: "100%",
	width: 380,
	"& .MuiDrawer-paper": {
		height: "calc(100% - 64px)",
		maxWidth: "100%",
		top: 64,
		width: 380,
	},
});

export const ChatSidebar = (props) => {
	const {homework, refresh, chooseStudent, containerRef, onClose, open, ...other} =props;
	const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
	const [homeworkDetails,setHomeworkDetails]=useState(null);
	const [studentsFetched,setStudentsFetched]=useState([]);

	const fetchHomeworkDetails=async()=>{
		try {
			await db
				.collection("assignments")
				.doc(homework)
				.get()
				.then(async (docRef) => {
					 const hmw=docRef.data();
					 setHomeworkDetails(hmw)
				});
		} catch (err) {
			console.log(err.message);
		}
	}

	const fetchStudents = async () => {
		try {
			const tmp = [];
			
			const std_with_submitted_homeworks=homeworkDetails.students.filter(std=>std.submitted=="yes")
			std_with_submitted_homeworks.forEach(async (std) => {
				await db
					.collection("users")
					.where("__name__", "==", std.id)
					.get()
					.then(async (docRef) => {
						docRef.forEach((doc) => {
							tmp.push({id: doc.id, ...doc.data()});
							if (
								tmp.length === std_with_submitted_homeworks.length
							) {
								setStudentsFetched(tmp);
							}
						});
					});
			});
		} catch (err) {
			console.log(err.message);
		}
	};

	const handleChooseStudent = (id) => {
		chooseStudent(id);
	};


	useEffect(() => {
		fetchHomeworkDetails();
	}, []);

	useEffect(() =>{
		if(refresh){
		fetchHomeworkDetails()
		}
	},[refresh])

	useEffect(()=>{
		if(homeworkDetails){
		fetchStudents()
		}
	},[homeworkDetails])

	const content = (
		<div>
			<Box
				sx={{
					alignItems: "center",
					display: "flex",
					p: 2,
				}}
			>
				<Typography variant="h5">Submitted homeworks</Typography>
				<Box sx={{flexGrow: 1}} />
				<IconButton
					onClick={onClose}
					sx={{
						display: {
							sm: "none",
						},
						ml: 2,
					}}
				>
					<XIcon fontSize="small" />
				</IconButton>
			</Box>
			<Box
				sx={{
					borderTopColor: "divider",
					borderTopStyle: "solid",
					borderTopWidth: 1,
					display:"block",
				}}
			>
				{
				studentsFetched.length >0 &&
				 <List disablePadding>
					{studentsFetched.map((std, pos) => (
						<ListItemButton
							key={pos}
							onClick={() => handleChooseStudent(std.id)}
						>
							<ListItemText
								primary={pos+1 +". "+std.firstName + " "+ std.lastName}
							/>
						</ListItemButton>
					))}
				</List> }
			</Box>
		</div>
	);

	if (mdUp) {
		return (
			<ChatSidebarDesktop
				anchor="left"
				open={open}
				SlideProps={{container: containerRef?.current}}
				variant="persistent"
				{...other}
			>
				{content}
			</ChatSidebarDesktop>
		);
	}

	return (
		<ChatSidebarMobile
			anchor="left"
			ModalProps={{container: containerRef?.current}}
			onClose={onClose}
			open={open}
			SlideProps={{container: containerRef?.current}}
			variant="temporary"
			{...other}
		>
			{content}
		</ChatSidebarMobile>
	);
};

ChatSidebar.propTypes = {
	containerRef: PropTypes.any,
	onClose: PropTypes.func,
	open: PropTypes.bool,
};
