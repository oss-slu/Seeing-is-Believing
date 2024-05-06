import {useEffect, useState} from "react";
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
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import {db} from '../../../lib/firebase'
import toast from 'react-hot-toast';
import { language } from "gray-matter";

export const EditLanguageForm = (props) => {

	
	const {languages,stepBack,...other} = props;
    const [languageNames,setLanguageNames]=useState([]);
	const [dialect, setDialect] = useState("");
	const [dialectArray, setDialectArray] = useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [selectedLanguage,setSelectedLanguage]=useState(null)

    
   useEffect(()=>{
        if(languages){
            //Map to retrieve languages names
            let names=[]
            languages.forEach(language=>{
                names.push(language.name)
            })
            setLanguageNames(names)
        }
   },[languages])


useEffect(() => {
    //To retrieve dialects names
	if (selectedLanguage) {
		var language = languages.find((language) => {
			return language.name === selectedLanguage;
		});

		setDialectArray(language.dialects);
	}
}, [selectedLanguage,languages]);


	const initialize=()=>{
		setSelectedLanguage("");
	}

	const onCancel=()=>{
		initialize()
	}
	const onEdit=async ()=>{
		try {
			setIsLoading(true);
			await db.collection("languages").where("name", "==", selectedLanguage)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    doc.ref.update({dialects:dialectArray})
                });
            })
			toast.success("Modifications saved!");
			setIsLoading(false);
            stepBack();
		} catch (err) {
			setIsLoading(false);
            console.error(err.message)
			toast.error("Something went wrong!");
		}
	}

	const handleDialectAdd = (newDialect) => {
		setDialectArray([...dialectArray, newDialect]);
	};

	return (
		<div {...other}>
			<Box>
				<Typography variant="subtitle1">Language</Typography>
				<Typography color="textSecondary" variant="body2" sx={{mb: 1}}>
					Select the language you want to modify
				</Typography>
				<Select
					displayEmpty
					fullWidth
					sx={{mb: 2, mt: 1}}
					onChange={(evt) => setSelectedLanguage(evt.target.value)}
					value={selectedLanguage}
				>
					<MenuItem value="">
						<em style={{color:'grey'}}>None</em>
					</MenuItem>
					{languageNames.map((item, pos) => {
						return (
							<MenuItem key={pos} value={item}>
								{item}
							</MenuItem>
						);
					})}
				</Select>

				{selectedLanguage && (
					<>
						<Typography variant="subtitle1">Dialects</Typography>
						<Typography
							color="textSecondary"
							variant="body2"
							sx={{mb: 1}}
						>
							The different dialects of the language to be added
						</Typography>
						<TextField
							fullWidth
							sx={{mb: 2, mt: 1}}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<Button
											sx={{ml: 2}}
											onClick={() => {
												if (!dialect) {
													return;
												}

												handleDialectAdd(dialect);
												setDialect("");
											}}
										>
											Add
										</Button>
									</InputAdornment>
								),
							}}
							onChange={(event) => setDialect(event.target.value)}
							value={dialect}
						/>
						<Box sx={{ml: -1}}>
							{dialectArray.map((_dialect, i) => (
								<Chip
									onDelete={() => {
										const newDialects = dialectArray.filter(
											(t) => t !== _dialect
										);
										setDialectArray(newDialects);
									}}
									// eslint-disable-next-line react/no-array-index-key
									key={i}
									label={_dialect}
									sx={{
										mt: 1,
										ml: 1,
									}}
									variant="outlined"
								/>
							))}
						</Box>
					</>
				)}
			</Box>
			<Box sx={{mt: 3}}>
				<LoadingButton
					loading={isLoading}
					onClick={onEdit}
					disabled={selectedLanguage ? false : true}
					variant="contained"
				>
					Edit
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

EditLanguageForm.propTypes = {
	onBack: PropTypes.func,
	onNext: PropTypes.func,
};
