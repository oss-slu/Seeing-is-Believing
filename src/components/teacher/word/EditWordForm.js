import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { convertToHTML } from "draft-convert";
import PropTypes from "prop-types";
import {
	Box,
	Button,
	Chip,
	InputAdornment,
	TextField,
	Select,
	MenuItem,
	Typography,
	Autocomplete,
	IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import LoadingButton from "@mui/lab/LoadingButton";
import { db, storage } from "../../../lib/firebase";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "../../../styles/rte.module.css";

const Editor = dynamic(
	() => import("react-draft-wysiwyg").then((mod) => mod.Editor),
	{ ssr: false }
);

const EditWordForm = (props) => {
	const router = useRouter();

	const { languages, stepBack, ...other } = props;
	const [wordName, setWordName] = useState("");
	const [languageNames, setLanguageNames] = useState([]);
	const [dialect, setDialect] = useState("");
	const [dialectArray, setDialectArray] = useState([]);
	const [audio, setAudio] = useState(null);
	const [audioNonNative, setAudioNonNative] = useState(null);
	const [updatedAudioNative, setUpdatedAudioNative] = useState(false);
	const [updatedAudioNonNative, setUpdatedAudioNonNative] = useState(false);
	const [isNativePlaying, setIsNativePlaying] = useState(false);
	const [isNonNativePlaying, setIsNonNativePlaying] = useState(false);
	const [urlAudio, setUrlAudio] = useState(null);
	const [urlAudioNonNative, setUrlAudioNonNative] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [wordsFetched, setWordsFetched] = useState([]);
	const [selectedWord, setSelectedWord] = useState("");
	const [selectedLanguage, setSelectedLanguage] = useState("");

	//Rich text editor
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);
	const [description, setDescription] = useState("");

	const handleEditorChange = (state) => {
		setEditorState(state);
		convertContentToHTML();
	};

	const convertContentToHTML = () => {
		let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
		setDescription(currentContentAsHTML);
	};F

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

	useEffect(() => {
		fetchWords();
	}, []);

	useEffect(() => {
		//To retrieve dialects names
		if (selectedLanguage) {
			var language = languages.find((language) => {
				return language.name === selectedLanguage;
			});
			setDialectArray(language.dialects);
		}
	}, [selectedLanguage, languages]);

	const initialize = () => {
		setWordName("");
		setSelectedLanguage("");
		setDialect("");
		setDescription("");
		setEditorState("");
		setAudio(null);
		setUrlAudio(null);
		setAudioNonNative(null);
		setUrlAudioNonNative(null);
		setIsLoading(false);
		setUpdatedAudioNative(false);
		setUpdatedAudioNonNative(false);
	};

	const onCancel = () => {
		initialize();
	};

	const fetchWords = async () => {
		const collection = await db.collection("words");
		let results = [];
		await collection.get().then((snapshot) => {
			//results = snapshot.docs[0].data();
			snapshot.docs.forEach((doc) => {
				const id = doc.id;
				const word = doc.data();
				word = { id, ...word, label: word.name };
				results.push(word);
			});
		});
		setWordsFetched(results);
	};

	const toggleAudioNonNative = () => {
		//Play or pauses the main audio every time the function is called
		const audio = new Audio(URL.createObjectURL(audioNonNative));
		if (!isNonNativePlaying) {
			audio.play();
			setIsNonNativePlaying(true);
		} else {
			audio.pause();
			setIsNonNativePlaying(false);
		}
		audio.addEventListener("ended", function () {
			setIsNonNativePlaying(false);
		});
	};

	const toggleAudioNative = () => {
		//Play or pauses the main audio every time the function is called
		const audio_ = new Audio(URL.createObjectURL(audio));
		if (!isNativePlaying) {
			audio_.play();
			setIsNativePlaying(true);
		} else {
			audio_.pause();
			setIsNativePlaying(false);
		}
		audio_.addEventListener("ended", function () {
			setIsNativePlaying(false);
		});
	};

	const handleChange = (e) => {
		setUpdatedAudioNative(true);
		if (e.target.files[0]) {
			setAudio(e.target.files[0]);
		}
	};

	const handleChange_ = (e) => {
		setUpdatedAudioNonNative(true);
		if (e.target.files[0]) {
			setAudioNonNative(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		setIsLoading(true);
		
		try {
			const uuid = await uuidv4();
			const uuid2 = await uuidv4();
			let urlNative;
			let urlNonNative;
			
			if(updatedAudioNative){
				//Upload audion native
				await storage.ref(`audio/${uuid}`).put(audio);
				//Get it's url
				await storage
					.ref("audio")
					.child(uuid)
					.getDownloadURL()
					.then(async (url) => {
							urlNative=url;
					});
			}
			if(updatedAudioNonNative){
			//Upload non-native audio
			await storage.ref(`audio/${uuid2}`).put(audioNonNative);
			//Get the non-native audio url
			await storage
				.ref("audio")
				.child(uuid2)
				.getDownloadURL()
				.then(async (url) => {
					urlNonNative = url;
				});
			}
			//Finally update the word
			await db.collection("words").doc(selectedWord.id).update({
				name: wordName,
				language: selectedLanguage,
				dialect,
				description,
				urlAudio:updatedAudioNative&&urlNative,  
				urlAudioNonNative:updatedAudioNonNative&&urlNonNative,
			});
			initialize();
			fetchWords();
			setIsLoading(false);
			toast.success("Word edited successfully!");
		} catch (err) {
			console.error(err.message);
			setIsLoading(false);
			toast.error("Something went wrong!");
		}
	};

	const handleSelectedWord = async (evt, value) => {
		setSelectedWord(value);
		setWordName(value.name);
		setSelectedLanguage(value.language);
		setDialect(value.dialect);
		setUrlAudio(value.urlAudio);
		setUrlAudioNonNative(value.urlAudioNonNative);
		setDescription(value.description)
		
		await fetch(value.urlAudio)
			.then((response) => response.blob())
			.then((blob) => {
				let file = new File([blob], `${value.name}-native.wav`, {
					type: "audio/x-wav",
					lastModified: new Date().getTime(),
				});
				// do stuff with `file`
				setAudio(file);
			})
			.catch((err) => console.error(err));
		await fetch(value.urlAudioNonNative)
				.then((response) => response.blob())
				.then((blob) => {
					let file = new File([blob], `${value.name}-non-native.wav`, {
						type: "audio/x-wav",
						lastModified: new Date().getTime(),
					});
					// do stuff with `file`
					
					setAudioNonNative(file);
				})
				.catch((err) => console.error(err));

		const blocksFromHTML = await convertFromHTML(value.description);
		const state = ContentState.createFromBlockArray(
			blocksFromHTML.contentBlocks,
			blocksFromHTML.entityMap
		);
		setEditorState(EditorState.createWithContent(state));
		//Load native audio
		setIsLoading(false);
		
		console.log({
			wordName,
			selectedLanguage,
			dialect,
			audio,
			audioNonNative,
		});
	};

	return (
		<div {...other}>
			<Box>
				<Typography variant="h6">Search</Typography>
				<Autocomplete
					freeSolo
					id="free-solo-2-demo"
					disableClearable
					options={wordsFetched}
					onChange={handleSelectedWord}
					renderInput={(params) => (
						<TextField
							{...params}
							sx={{ mt: 1 }}
							label="Search for the word"
							InputProps={{
								...params.InputProps,
								type: "search",
								endAdornment: (
									<InputAdornment position="end">
										<SearchIcon sx={{ fontSize: "1.8rem" }} />
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
				<Typography variant="subtitle1" sx={{ mt: 4 }}>
					Name
				</Typography>
				<Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
					Enter the name of the word
				</Typography>
				<TextField
					fullWidth
					sx={{ mb: 2, mt: 1 }}
					value={wordName}
					InputProps={{ style: { fontWeight: 300 } }}
					onChange={(evt) => setWordName(evt.target.value)}
				/>

				<Typography variant="subtitle1">Language</Typography>
				<Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
					Select the language to which belongs the word
				</Typography>
				<Select
					displayEmpty
					fullWidth
					sx={{ mb: 2, mt: 1 }}
					onChange={(evt) => setSelectedLanguage(evt.target.value)}
					value={selectedLanguage}
				>
					<MenuItem value="">
						<em style={{ color: "grey" }}>None</em>
					</MenuItem>
					{languageNames.map((item, pos) => {
						return (
							<MenuItem key={pos} value={item}>
								{item}
							</MenuItem>
						);
					})}
				</Select>

				<Typography variant="subtitle1">Dialect</Typography>
				<Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
					Select the dialect corresponding
				</Typography>
				<Select
					displayEmpty
					fullWidth
					sx={{ mb: 2, mt: 1 }}
					onChange={(evt) => setDialect(evt.target.value)}
					value={dialect}
				>
					<MenuItem value="">
						<em style={{ color: "grey" }}>None</em>
					</MenuItem>
					{dialectArray.map((item, pos) => {
						return (
							<MenuItem key={pos} value={item}>
								{item}
							</MenuItem>
						);
					})}
				</Select>

				<Typography variant="subtitle1">Description</Typography>
				<Box sx={{ mb: 3, mt: 1 }}>
					<Editor
						editorState={editorState}
						onEditorStateChange={handleEditorChange}
						wrapperClassName={styles.wrapperClass}
						editorClassName={styles.editorClass}
						toolbarClassName={styles.toolbarClass}
						toolbar={{
							options: [
								"inline",
								"blockType",
								"list",
								"textAlign",
								"colorPicker",
								"remove",
								"history",
							],
						}}
					/>
				</Box>
				<Box
					mb={2}
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<input
						accept="audio/*"
						style={{ display: "none" }}
						id="raised-button-file_edit"
						type="file"
						onChange={handleChange}
					/>
					<label htmlFor="raised-button-file_edit">
						<Button sx={{ width: "14rem" }} variant="outlined" component="span">
							Update audio native
						</Button>
					</label>
					{audio && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Chip label={audio.name} />
							<IconButton onClick={toggleAudioNative}>
								{!isNativePlaying ? (
									<PlayCircleFilledWhiteIcon sx={{ fontSize: "1.9rem" }} />
								) : (
									<PauseCircleIcon sx={{ fontSize: "1.9rem" }} />
								)}
							</IconButton>
						</Box>
					)}
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<input
						accept="audio/*"
						style={{ display: "none" }}
						id="raised-button-file_edit_"
						type="file"
						onChange={handleChange_}
					/>
					<label htmlFor="raised-button-file_edit_">
						<Button sx={{ width: "14rem" }} variant="outlined" component="span">
							Update audio non-native
						</Button>
					</label>
					{audioNonNative && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Chip label={audioNonNative.name} />
							<IconButton onClick={toggleAudioNonNative}>
								{!isNonNativePlaying ? (
									<PlayCircleFilledWhiteIcon sx={{ fontSize: "1.9rem" }} />
								) : (
									<PauseCircleIcon sx={{ fontSize: "1.9rem" }} />
								)}
							</IconButton>
						</Box>
					)}
				</Box>
			</Box>
			<Box sx={{ mt: 3 }}>
				<LoadingButton
					loading={isLoading}
					onClick={handleUpload}
					disabled={
						wordName != "" &&
						selectedLanguage != "" &&
						dialect != "" &&
						audio &&
						audioNonNative
							? false
							: true
					}
					variant="contained"
				>
					Save
				</LoadingButton>
				<Button
					onClick={onCancel}
					disabled={selectedLanguage ? false : true}
					sx={{ ml: 2 }}
				>
					Cancel
				</Button>
			</Box>
		</div>
	);
};

EditWordForm.propTypes = {
	onBack: PropTypes.func,
	onNext: PropTypes.func,
};

export default EditWordForm;
