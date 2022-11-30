import {useState,useEffect} from "react";
import {useRouter} from "next/router";
import PropTypes from "prop-types";
import {
	Box,
	Button,
	Drawer,
	IconButton,
	List,
	Typography,
  Select,
  MenuItem,
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
	const {languages, chooseWord, containerRef, onClose, open, ...other} =props;
	const router = useRouter();
	const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  //Custom hooks
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [languageNames, setLanguageNames] = useState([]);
  const [words, setWords] = useState([]);
  const [isFetchingWords, setIsFetchingWords] = useState(false); //for circular progress indicator

	

	useEffect(() => {
		if (languages) {
			//Map to retrieve languages names
			let names = [];
			languages.forEach((language) => {
				names.push(language.name);
			});
			setLanguageNames(names);
		}
	}, [languages]);

	const fetchWords = async () => {
		setIsFetchingWords(true);
		try {
			let wordsFetched = [];
			await db
				.collection("words")
				.where("language", "==", selectedLanguage)
				.get()
				.then((snapshot) => {
					snapshot.docs.forEach((doc) => {
						wordsFetched.push({id: doc.id, ...doc.data()});
					});
				});
			setWords(wordsFetched);
		} catch (err) {
			console.log(err.message);
		}
		setIsFetchingWords(false);
	};

	useEffect(() => {
		fetchWords();
	}, [selectedLanguage, languages]);

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

			<Box px={2}>
				<Typography sx={{}} color="textSecondary" variant="body2">
					Select the language
				</Typography>
				<Select
					displayEmpty
					fullWidth
					sx={{mb: 2, mt: 0.5}}
					onChange={(evt) => setSelectedLanguage(evt.target.value)}
					value={selectedLanguage}
				>
					<MenuItem value="">
						<em style={{color: "grey"}}>None</em>
					</MenuItem>
					{languageNames.map((item, pos) => {
						return (
							<MenuItem key={pos} value={item}>
								{item}
							</MenuItem>
						);
					})}
				</Select>
			</Box>
			<Box
				sx={{
					borderTopColor: "divider",
					borderTopStyle: "solid",
					borderTopWidth: 1,
					display: "block",
				}}
			>
				<List disablePadding>
					{words.map((word, pos) => (
						<ListItemButton
							key={pos}
							onClick={() => chooseWord(word)}
						>
							<ListItemText
								primary={word.name}
								secondary={"Dialect :" + word.dialect}
							/>
						</ListItemButton>
					))}
				</List>
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
