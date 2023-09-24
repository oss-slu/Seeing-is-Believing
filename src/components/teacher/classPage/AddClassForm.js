import {useState} from "react";
import {useRouter} from 'next/router';
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
import {db,storage} from '../../../lib/firebase'
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import {useAuth} from '../../../hooks/use-auth'

const AddClassForm = (props) => {
	
	const {user} =useAuth()
	const router=useRouter()
	const {languages,terms,students,stepBack,...other} = props;
	const [className,setClassName]=useState("")
	const [arrayStudents,setArrayStudents]=useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [selectedLanguage,setSelectedLanguage]=useState({})	
    const [selectedTerm,setSelectedTerm]=useState({})	

	const handleSave=async () =>{
		try{
		setIsLoading(true)
		const studentsIds=arrayStudents.map(student=>student.id)
		const collection=await db.collection('classes');
		await collection.add({
			name:className,
			language:selectedLanguage,
			term:selectedTerm,
			students:studentsIds,
			teacher:user.id
		})
			toast.success("Class added successfully")
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
	const initialize=() =>{
		setClassName("");
		setSelectedLanguage("");
		setSelectedTerm("");
		setArrayStudents([]);
	}

	return (
		<div {...other}>
			<Box>
				<Typography variant="subtitle1">Name</Typography>
				<Typography color="textSecondary" variant="body2" sx={{mb: 1}}>
					Enter the name of the class
				</Typography>
				<TextField
					fullWidth
					sx={{mb: 2, mt: 1}}
					value={className}
					InputProps={{style: {fontWeight: 300}}}
					onChange={(evt) => setClassName(evt.target.value)}
				/>

				<Typography variant="subtitle1">Language</Typography>
				<Typography color="textSecondary" variant="body2" sx={{mb: 1}}>
					Select the language in which the course will be taught
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
					{languages.map((language, pos) => {
						return (
							<MenuItem key={pos} value={language.id}>
								{language.name}
							</MenuItem>
						);
					})}
				</Select>

				<Typography variant="subtitle1">Term</Typography>
				<Typography color="textSecondary" variant="body2" sx={{mb: 1}}>
					Select the term of the year
				</Typography>
				<Select
					displayEmpty
					fullWidth
					sx={{mb: 2, mt: 1}}
					onChange={(evt) => setSelectedTerm(evt.target.value)}
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
				<Typography color="textSecondary" variant="body2" sx={{mb: 2}}>
					The students registered for the class
				</Typography>
		{/**************************************Autocomplete that will contain the students that will be passed to the box-Display***********************************************************/}
				<Autocomplete
					disablePortal
					multiple
					value={arrayStudents}
					options={students}
					getOptionLabel={option => option.firstName+" "+option.lastName}
					onChange={(evt,newValue)=>{setArrayStudents(newValue)}}
						renderInput={(params) => (
						<TextField {...params} fullWidth  />
					)}
				/>
			
			</Box>
			<Box sx={{mt: 3}}>
				<LoadingButton
					loading={isLoading}
					onClick={handleSave}
					disabled={
						className && selectedLanguage && selectedTerm && arrayStudents.length>0
							? false
							: true
					}
					variant="contained"
				>
					Save
				</LoadingButton>
				<Button
					onClick={handleCancel}
					disabled={className || selectedLanguage || selectedTerm || arrayStudents.length>0 ? false : true}
					sx={{ml: 2}}
				>
					Cancel
				</Button>
			</Box>
		</div>
	);
};

AddClassForm.propTypes = {
	onBack: PropTypes.func,
	onNext: PropTypes.func,
};


export default AddClassForm