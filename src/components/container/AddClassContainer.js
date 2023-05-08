import { useState } from "react";
import { useRouter } from 'next/router';
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
	Autocomplete
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { db } from "../../lib/firebase";
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "../../hooks/use-auth";
import AddClassForm from "../teacher/classPage/AddClassForm";

const AddClassContainer = (props) => {

	const { user } = useAuth()
	const router = useRouter()
	const { languages, terms, students, stepBack, ...other } = props;
	const [className, setClassName] = useState("")
	const [arrayStudents, setArrayStudents] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState({})
	const [selectedTerm, setSelectedTerm] = useState({})

	const handleSave = async () => {
		try {
			setIsLoading(true)
			const studentsIds = arrayStudents.map(student => student.id)
			const collection = await db.collection('classes');
			await collection.add({
				name: className,
				language: selectedLanguage,
				term: selectedTerm,
				students: studentsIds,
				teacher: user.id
			})
			toast.success("Class added successfully")
		} catch (err) {
			console.error(err.message)
			toast.error("Something went wrong")
		}
		setIsLoading(false);
		initialize()
	}

	const handleCancel = () => {
		initialize()
	}
	const initialize = () => {
		setClassName("");
		setSelectedLanguage("");
		setSelectedTerm("");
		setArrayStudents([]);
	}

	return (
		<AddClassForm
			{...other}
			languages={languages}
			terms={terms}
			students={students}
			className={className}
			setClassName={setClassName}
			arrayStudents={arrayStudents}
			setArrayStudents={setArrayStudents}
			selectedLanguage={selectedLanguage}
			setSelectedLanguage={setSelectedLanguage}
			selectedTerm={selectedTerm}
			setSelectedTerm={setSelectedTerm}
			handleSave={handleSave}
			handleCancel={handleCancel}
			isLoading={isLoading}
			
			{...props}

		/>
	);
};
 
AddClassContainer.propTypes = {
	onBack: PropTypes.func,
	onNext: PropTypes.func,
};


export default AddClassContainer