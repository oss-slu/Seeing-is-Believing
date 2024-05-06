import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { EditorState } from "draft-js";
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
	Slider,
	Stack
} from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import LoadingButton from "@mui/lab/LoadingButton";
import { db } from "../../../lib/firebase";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "../../../styles/rte.module.css";

const Editor = dynamic(
	() => import("react-draft-wysiwyg").then((mod) => mod.Editor),
	{ ssr: false }
);

const EditHomeworkForm = (props) => {
	const { languages, classes, teacher, stepBack, ...other } = props;
	const [title, setTitle] = useState(props.title);
	const [score, setScore] = useState(props.score);
	const [dueDate, setDueDate] = useState(props.date);
	const [wordsArray, setWordsArray] = useState([]);
	const [words, setWords] = useState(props.words);
	//const [classes, setClass] = useState(props.class);
	const [students, setStudents] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedClass, setSelectedClass] = useState(props.selectedClass);
	const [date, setDate] = useState(props.date);
	const [description, setDescription] = useState(props.description);
	//Rich text editor
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);

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

	const handleSave = async () => {
		try {
			setIsLoading(true);
			const wordsIds = wordsArray.map((word) => word.id); //Retrieve words-Ids
			await fetchStudents();
			//const collection = await db.collection("assignments");
			const document = await db.collection("assignments").doc(props.id);
			await document
				.update({
					title,
					description,
					class: selectedClass.id,
					words: wordsIds,
					dueDate: date,
					score,
				});
			/*await collection.add({
				title,
				description,
				class: selectedClass.id,
				words: wordsIds,
				dueDate: date,
				score,
				students: students,
				studentsAssignements: [],
			});*/
			setIsLoading(false);
			toast.success("Homework saved successfully!");
			initialize();
			window.location.reload(false);
		} catch (err) {
			console.error('err.message:', err.message);
			console.log('error')
			toast.error("Something went wrong!");
		}
	};
	const fetchStudents = async () => {
		const collection = db.collection("classes");
		await collection
			.doc(selectedClass.id)
			.get()
			.then((snapshot) => {
				const students = snapshot.data().students;
				students = students.map((el) => {
					return { id: el, submitted: "no" };
				});
				setStudents(students);

			});
	};

	useEffect(() => {
		if (selectedClass) {
			fetchStudents();
		}
		setTitle(props.title);
		setDescription(props.description);
		setWords(props.words);
		setDate(props.date);
		setSelectedClass(props.setSelectedClass);
		setScore(props.score);
	}, [props.setSelectedClass, props.title, props.description, props.words, props.date, props.score]);



	const handleChange = (newValue) => {
		setDate(newValue);
	};

	const initialize = () => {
		setTitle(title);
		setDescription(description);
		setScore(score);
		setDueDate(dueDate);
		//setClass(classes);
		//setWordsArray([wordsArray]);
		setStudents([]);
		setSelectedClass(selectedClass);
		setIsLoading(false);
		setWords(words);
		setDate(date);
	};

	const onCancel = () => {
		initialize();
	};
	
	///Formating assignment point value
	function valuetext(value) {
		return `${value}°C`;
	}

	return (
		<div {...other}>
			<Box>
				<Typography variant="subtitle1">Title</Typography>
				<Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
					Enter the title of the homework
				</Typography>
				<TextField
					fullWidth
					sx={{ mb: 2, mt: 1 }}
					value={title}
					InputProps={{ style: { fontWeight: 300 } }}
					onChange={(evt) => setTitle(evt.target.value)}
				/>
				<Typography variant="subtitle1">Class</Typography>
				<Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
					Choose the class
				</Typography>
				<Autocomplete
					disablePortal
					clearIcon
					options={classes}
					value={selectedClass}
					getOptionLabel={(option) => option.name}
					onChange={(evt, newValue) => {
						setSelectedClass(newValue);
					}}
					renderInput={(params) => (
						<TextField {...params} sx={{ mb: 2, mt: 1 }} fullWidth />
					)}
				/>
				<Typography variant="subtitle1">Description</Typography>
				<Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
					Enter a description concerning the homework
				</Typography>
				<Box sx={{ mb: 3 }}>
					<Editor
						editorState={editorState}
						onEditorStateChange={handleEditorChange}
						wrapperClassName={styles.wrapperClass}
						editorClassName={styles.editorClass}
						toolbarClassName={styles.toolbarClass}
						value={description}
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
				<Typography variant="subtitle1">Words</Typography>
				<Typography color="textSecondary" variant="body2" sx={{ mb: 3 }}>
					Set the collection of words to figure in the assignment
				</Typography>
				{/**************************************Autocomplete that will contain the students that will be passed to the box-Display***********************************************************/}
				<Autocomplete
					disablePortal
					multiple

					options={words}
					getOptionLabel={(option) => option.name}
					onChange={(evt, newValue) => {
						setWordsArray(newValue);
					}}
					renderInput={(params) => (
						<TextField {...params} sx={{ mb: 3 }} fullWidth />
					)}
				/>
				<Typography sx={{ mt: 0 }} variant="subtitle1">
					Due Date & Time
				</Typography>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Stack spacing={3} direction="row" mt={2} mb={2}>
						<DesktopDatePicker
							label="Due Date"
							inputFormat="MM/dd/yyyy"
							value={date}
							onChange={handleChange}
							renderInput={(params) => <TextField {...params} />}
						/>

						<TimePicker
							label="Due Time"
							value={date}
							onChange={handleChange}
							renderInput={(params) => <TextField {...params} />}
						/>
					</Stack>
				</LocalizationProvider>
				<Typography sx={{ mt: 3 }} variant="subtitle1">
					Assignment Point Value
				</Typography>
				<Box sx={{ pl: 2.5, mt: 1 }}>
					<Slider
						sx={{ width: "95%" }}
						aria-label="Temperature"
						defaultValue={0}
						value={score}
						getAriaValueText={valuetext}
						valueLabelDisplay="auto"
						step={5}
						marks
						min={0}
						max={100}
						onChange={(evt, value) => {
							setScore(value);
						}}
					/>
				</Box>
			</Box>
			<Box sx={{ mt: 4 }}>
				<LoadingButton
					loading={isLoading}
					onClick={handleSave}
					variant="contained"
				>
					Save
				</LoadingButton>
				<Button onClick={onCancel} sx={{ ml: 2 }}>
					Cancel
				</Button>
			</Box>
		</div>
	);
};

EditHomeworkForm.propTypes = {
	onBack: PropTypes.func,
	onNext: PropTypes.func,
};

export default EditHomeworkForm;
