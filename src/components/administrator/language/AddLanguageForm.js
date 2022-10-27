import {useState} from "react";
import PropTypes from "prop-types";
import {
	Box,
	Button,
	Chip,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import {db} from '../../../lib/firebase'
import toast from 'react-hot-toast';

export const AddLanguageForm = (props) => {

	
	const {...other} = props;
    const [languageName,setLanguageName]=useState("");
	const [dialect, setDialect] = useState("");
	const [dialectArray, setDialectArray] = useState([]);
    const [isLoading,setIsLoading]=useState(false);
	
	const initialize=()=>{
		setLanguageName("");
		setDialect("");
		setDialectArray([])
	}
	const onCancel=()=>{
		initialize()
	}
	const onSave=async ()=>{
		try {
			setIsLoading(true);
			await db.collection("languages").add({
				name: languageName,
				dialects: dialectArray,
			});
			initialize();
			toast.success("Language added successfully!");
			setIsLoading(false);
		} catch (err) {
			setIsLoading(false);
			toast.error("Something went wrong!");
		}
	}

	const handleDialectAdd = (newDialect) => {
		setDialectArray([...dialectArray, newDialect]);
	};

	return (
		<div {...other}>
			<Box>
				<Typography variant="subtitle1">Name</Typography>
				<Typography color="textSecondary" variant="body2" sx={{mb: 1}}>
					Enter the name of the language you wont to add
				</Typography>
				<TextField
					fullWidth
					placeholder="e.g French"
					sx={{mb: 2, mt: 1}}
					value={languageName}
					onChange={(evt) => setLanguageName(evt.target.value)}
				/>
				<Typography variant="subtitle1">Dialects</Typography>
				<Typography color="textSecondary" variant="body2" sx={{mb: 1}}>
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
			</Box>
			<Box sx={{mt: 3}}>
				<LoadingButton
					loading={isLoading}
					onClick={onSave}
					disabled={
						languageName != "" && dialectArray.length != 0
							? false
							: true
					}
					variant="contained"
				>
					Save
				</LoadingButton>
				<Button
					onClick={onCancel}
					disabled={
						languageName != "" || dialectArray.length != 0
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

AddLanguageForm.propTypes = {
	onBack: PropTypes.func,
	onNext: PropTypes.func,
};
