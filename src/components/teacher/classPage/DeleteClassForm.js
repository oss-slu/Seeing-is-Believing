import {useState} from "react";
import PropTypes from "prop-types";
import {
	Box,
	Button,
	TextField,
    Select,
    MenuItem,
	Typography,
	Autocomplete
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import {db} from '../../../lib/firebase'
import toast from 'react-hot-toast';

const DeleteClassForm = (props) => {
	const {languages,terms,refetch,students,classes,stepBack,...other} = props;
	const [arrayStudents,setArrayStudents]=useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [selectedLanguage,setSelectedLanguage]=useState({})	
    const [selectedTerm,setSelectedTerm]=useState({})	
	const [selectedClass,setSelectedClass]=useState(null)

    const handleDelete=async ()=>{
        try{
            setIsLoading(true)
            const collection=await db.collection('classes');
            await collection.doc(selectedClass.id).delete()
                refetch();
                toast.success("Class deleted successfully")
            }catch(err){
                console.error(err.message)
                toast.error("Something went wrong")
            }
    
            setIsLoading(false);
            initialize()
    }

	const handleCancel=()=>{
		initialize()
	}

	const handleChooseClass=(chosenClass) =>{
		setSelectedLanguage(chosenClass.language);
		setSelectedTerm(chosenClass.term)
		
		//Map through students to get additional informations
		const studentsInCLass=[];
		students.forEach(student=>{
			if(chosenClass.students.includes(student.id)){
				  studentsInCLass.push(student)
		}})
		
		setArrayStudents(studentsInCLass)
		setSelectedClass(chosenClass);
		
	}

	
	const initialize=() =>{
		setSelectedClass(null);
		setSelectedLanguage("");
		setSelectedTerm("");
		setArrayStudents([]);
	}

	return (
		<div {...other}>
			<Box>
				<Typography variant="subtitle1">Name of the class</Typography>
				<Typography color="textSecondary" variant="body2" sx={{mb: 1}}>
					Enter the name of the class
				</Typography>
				<Autocomplete
					disablePortal
					clearIcon
					options={classes}
					value={selectedClass}
					getOptionLabel={(option) => option.name}
					onChange={(evt, newValue) => {
						handleChooseClass(newValue);
					}}
					renderInput={(params) => (
						<TextField {...params} sx={{mb: 2, mt: 1}} fullWidth />
					)}
				/>
				{selectedClass && (
					<>
						<Typography variant="subtitle1">Language</Typography>
						<Select
							displayEmpty
							fullWidth
							sx={{mb: 2, mt: 1}}
							value={selectedLanguage}
                            disabled={true}
						>
							<MenuItem value="">
								<em style={{color: "grey"}}>None</em>
							</MenuItem>
							{languages.map((language, pos) => {
								return (
									<MenuItem key={pos} value={language.id}>
										{language.name}
									</MenuItem>
								);
							})}
						</Select>

						<Typography variant="subtitle1">Term</Typography>
						<Select
							displayEmpty
							fullWidth
							sx={{mb: 2, mt: 1}}
                            disabled={true}
							value={selectedTerm}
						>
							<MenuItem value="">
								<em style={{color: "grey"}}>None</em>
							</MenuItem>
							{terms.map((term, pos) => {
								return (
									<MenuItem key={pos} value={term.id}>
										{term.name}
									</MenuItem>
								);
							})}
						</Select>
						<Typography variant="subtitle1">Students</Typography>
						
						{/**************************************Autocomplete that will contain the students that will be passed to the box-Display***********************************************************/}
						<Autocomplete
							disablePortal
							multiple
							value={arrayStudents}
							options={students}
							getOptionLabel={(option) =>
								option.firstName + " " + option.lastName
							}
                            disabled={true}
							renderInput={(params) => (
								<TextField {...params} fullWidth />
							)}
						/>
					</>
				)}
			</Box>
			<Box sx={{mt: 3}}>
				<LoadingButton
					loading={isLoading}
					onClick={handleDelete}
					disabled={
						selectedClass &&
						selectedLanguage &&
						selectedTerm &&
						arrayStudents.length > 0
							? false
							: true
					}
					variant="contained"
				>
					Delete Class
				</LoadingButton>
				<Button
					onClick={handleCancel}
					disabled={
						selectedClass ||
						selectedLanguage ||
						selectedTerm ||
						arrayStudents.length > 0
							? false
							: true
					}
					sx={{ml: 2}}
				>
					Cancel
				</Button>
			</Box>
		</div>
	);
};

DeleteClassForm.propTypes = {
	onBack: PropTypes.func,
	onNext: PropTypes.func,
};

export default DeleteClassForm