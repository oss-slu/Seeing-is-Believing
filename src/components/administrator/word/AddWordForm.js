import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";
import {EditorState} from "draft-js";
import {convertToHTML} from "draft-convert";
import PropTypes from "prop-types";
import {
	Box,
	Button,
	Chip,
	TextField,
	Select,
	MenuItem,
	IconButton,
	Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import {db, storage} from "../../../lib/firebase";
import toast from "react-hot-toast";
import {v4 as uuidv4} from "uuid";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "../../../styles/rte.module.css";

const Editor = dynamic(
	() => import("react-draft-wysiwyg").then((mod) => mod.Editor),
	{ssr: false}
);

const AddWordForm = (props) => {
	const router = useRouter();

	const {languages, stepBack, ...other} = props;
	const [wordName, setWordName] = useState("");
	const [languageNames, setLanguageNames] = useState([]);
	const [dialect, setDialect] = useState("");
	const [dialectArray, setDialectArray] = useState([]);
	const [audio, setAudio] = useState(null);
	const [audioNonNative, setAudioNonNative] = useState(null);
	const [isNativePlaying, setIsNativePlaying] = useState(false);
	const [isNonNativePlaying, setIsNonNativePlaying] = useState(false);
	const [urlAudio, setUrlAudio] = useState(null);
	const [urlAudioNonNative, setUrlAudioNonNative] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
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
		let currentContentAsHTML = convertToHTML(
			editorState.getCurrentContent()
		);
		setDescription(currentContentAsHTML);
	};

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
		setAudio(null);
		setUrlAudio(null);
		setAudioNonNative(null);
		setUrlAudioNonNative(null);
		setIsLoading(false);
	};

	const onCancel = () => {
		initialize();
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
		if (e.target.files[0]) {
			setAudio(e.target.files[0]);
		}
	};

	const handleChange_ = (e) => {
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

			const uploadTask = storage.ref(`audio/${uuid}`).put(audio);
			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					console.log(error);
				},
				() => {
					storage
						.ref("audio")
						.child(uuid)
						.getDownloadURL()
						.then(async (url) => {
							urlNative = url;
							const uploadTask_ = storage
								.ref(`audio/${uuid2}`)
								.put(audioNonNative);
							uploadTask_.on(
								"state_changed",
								(snapshot) => {},
								(error) => {
									console.log(error);
								},
								() => {
									storage
										.ref("audio")
										.child(uuid2)
										.getDownloadURL()
										.then(async (url) => {
											urlNonNative = url;
											await db.collection("words").add({
												name: wordName,
												language: selectedLanguage,
												dialect,
												description,
												urlAudio: urlNative,
												urlAudioNonNative: urlNonNative,
											});
											setIsLoading(false);
											toast.success(
												"Word added successfully!"
											);
											initialize();
										});
								}
							);
						});
				}
			);
		} catch (err) {
			console.error(err.message);
			setIsLoading(false);
			toast.error("Something went wrong!");
		}
	};

	return (
		<div {...other}>
			<Box>
				<Typography variant="subtitle1">Name</Typography>
				<Typography color="textSecondary" variant="body2" sx={{mb: 1}}>
					Enter the name of the word
				</Typography>
				<TextField
					fullWidth
					sx={{mb: 2, mt: 1}}
					value={wordName}
					InputProps={{style: {fontWeight: 300}}}
					onChange={(evt) => setWordName(evt.target.value)}
				/>

				<Typography variant="subtitle1">Language</Typography>
				<Typography color="textSecondary" variant="body2" sx={{mb: 1}}>
					Select the language to which belongs the word
				</Typography>
				<Select
					displayEmpty
					fullWidth
					sx={{mb: 2, mt: 1}}
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

				<Typography variant="subtitle1">Dialect</Typography>
				<Typography color="textSecondary" variant="body2" sx={{mb: 1}}>
					Select the dialect corresponding
				</Typography>
				<Select
					displayEmpty
					fullWidth
					sx={{mb: 2, mt: 1}}
					onChange={(evt) => setDialect(evt.target.value)}
					value={dialect}
				>
					<MenuItem value="">
						<em style={{color: "grey"}}>None</em>
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
				<Box sx={{mb: 3}}>
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
						style={{display: "none"}}
						id="raised-button-file"
						type="file"
						onChange={handleChange}
					/>
					<label htmlFor="raised-button-file">
						<Button
							sx={{width: "14rem"}}
							variant="outlined"
							component="span"
						>
							Upload audio native
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
									<PlayCircleFilledWhiteIcon
										sx={{fontSize: "1.9rem"}}
									/>
								) : (
									<PauseCircleIcon
										sx={{fontSize: "1.9rem"}}
									/>
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
						style={{display: "none"}}
						id="raised-button-file_"
						type="file"
						onChange={handleChange_}
					/>
					<label htmlFor="raised-button-file_">
						<Button
							sx={{width: "14rem"}}
							variant="outlined"
							component="span"
						>
							Upload audio non-native
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
									<PlayCircleFilledWhiteIcon
										sx={{fontSize: "1.9rem"}}
									/>
								) : (
									<PauseCircleIcon
										sx={{fontSize: "1.9rem"}}
									/>
								)}
							</IconButton>
						</Box>
					)}
				</Box>
			</Box>
			<Box sx={{mt: 3}}>
				<LoadingButton
					loading={isLoading}
					onClick={handleUpload}
					disabled={
						wordName!="" &&
						selectedLanguage != "" &&
						dialect != "" &&
						description != "" &&
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
					sx={{ml: 2}}
				>
					Cancel
				</Button>
			</Box>
		</div>
	);
};

AddWordForm.propTypes = {
	onBack: PropTypes.func,
	onNext: PropTypes.func,
};

export default AddWordForm;
