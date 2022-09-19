import {useState,useEffect} from "react";
import PropTypes from "prop-types";
import {
	Box,
	Drawer,
	IconButton,
	List,
	Typography,
	useMediaQuery,
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
	const {homework, chooseWord, containerRef, onClose, open, ...other} =props;
	const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
	const [wordsIds,setWordsIds]=useState(null);
	const [fetchedIds,setFetchedIds]=useState(false)
	const [wordsFetched,setWordsFetched]=useState([]);

	const fetchHomeworkDetails=async()=>{
		try {
			await db
				.collection("assignments")
				.doc(homework)
				.get()
				.then(async (docRef) => {
					 const words=docRef.data().words;

					 setWordsIds(words)
				});
			setFetchedIds(true)
		} catch (err) {
			console.log(err.message);
		}
	}


	const fetchWordsDetails=async()=>{
		 try{
			const results=[];
			await db
			.collection("words")
			.where('__name__', 'in', wordsIds)
			.get()
			.then(async (docRef) => {
				docRef.forEach(doc=>{
					results.push(doc.data())
				})
			});
			setWordsFetched(results)

	} catch (err) {
		console.log(err.message);
	}
}

	
	useEffect(()=>{
		fetchHomeworkDetails();
	},[])

	useEffect(()=>{
		if(fetchedIds){
		fetchWordsDetails()
		}
	},[fetchedIds])

	const content = (
		<div>
			<Box
				sx={{
					alignItems: "center",
					display: "flex",
					p: 2,
				}}
			>
				<Typography variant="h5">Words list</Typography>
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
				wordsFetched.length >0 &&
				 <List disablePadding>
					{wordsFetched.map((word, pos) => (
						<Box
							px={3}
							key={pos}
						>
							<ListItemText
								primary={word.name}
								secondary={"Dialect :" + word.dialect}
							/>
						</Box>
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
