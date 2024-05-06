import {
	Avatar,
	Box,
	Typography,
	Button,
	DialogTitle,
	Dialog,
	Tooltip,
	DialogContent,
	Grid,
	Card,
	CardContent,
	Divider,
	Container,
	TextField,
	Select,
	MenuItem,
} from "@mui/material";
import { DashboardLayout } from "../components/dashboard/dashboard-layout";
import { useAuth } from "../hooks/use-auth";
import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { AuthGuard } from "../components/authentication/auth-guard";
import {db,storage} from "../lib/firebase"
import toast from 'react-hot-toast';


const Profile = () => {

	const {user,logout } = useAuth();
	
	const pronouns = ['She/Her/Hers', 'He/Him/His', 'They/Them/Theirs'];
	const [selectedPronoun, setSelectedPronoun] = useState('');

	const [biography, setBiography] = useState('');

	const [languages, setLanguages] = useState([]);
	const [selectedLanguage, setSelectedLanguage] = useState('');

	const [editOpen, setEditOpen] = useState(false);

	const [pictureEntryOpen, setPictureEntryOpen] = useState(false);
	
	const [userPicture, setUserPicture] = useState(null);
	const [userFile, setUserFile] = useState(null);

	const fetchDataLanguages = async () => {
		const collection = await db.collection("languages");
		let results = [];
		await collection.get().then((snapshot) => {
			snapshot.docs.forEach((doc) => {
				const newLanguage = doc.data();
				newLanguage={id:doc.id,...newLanguage}
				results.push(newLanguage);
			});
		});
		setLanguages(results);
	};

	useEffect(() => {
		fetchDataLanguages();
	}, []);

	useEffect(() => {
		setSelectedPronoun(user.pronoun || '');
		setBiography(user.biography || ''); 
		setSelectedLanguage(user.language || ''); 
		setUserPicture(user.profilePicture || ''); 
	  }, []);

	const firstToUpperCase=(i)=>{
		if(i){
		  return i.charAt(0).toUpperCase()
		}
		return ""
	}

	const handlePictureEntryOpen = () => {
		setPictureEntryOpen(true);
	}

	const handlePictureEntryClose = () => {
		setPictureEntryOpen(false);
	}

	const handleEditOpen = () => {
		setEditOpen(true);
	}

	const handleEditClose = () => {
		setEditOpen(false);
	};

	const handleProfileUpdate = async () => {
		try {
		  const userRef = db.collection('users').doc(user.id);
		  await userRef.update({
			pronoun: selectedPronoun,
			language: selectedLanguage,
			biography: biography
		  });
		  toast.success("Profile Information Updated!");
		} catch (err) {
			console.error(err.message);
		} finally {
			handleEditClose();
		}
	};

	  const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
		  setUserPicture(URL.createObjectURL(file));
		  setUserFile(file);
		}
	};

	const handleImageSubmit = async () => {
		try {
			const userRef = db.collection('users').doc(user.id);
			const storageRef = storage.ref(`profilePictures/${user.id}`);
			await storageRef.put(userFile);
			const downloadURL = await storageRef.getDownloadURL();
			await userRef.update({
				profilePicture: downloadURL,
			});
      toast.success("Profile Information Updated!");
		} catch (err) {
			console.error(err.message);
		} finally {
			handlePictureEntryClose();
      
		}
	};

	return(
		<>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pt: 5,
					pb: 8,
				}}
			>
				<Container maxWidth="xl">
					
					<Grid container>

						{/* Edit Profile Dialog */}
						<Dialog onClose={handleEditClose} open={editOpen}>
							<DialogTitle>
								Edit Your Profile
							</DialogTitle>

							<DialogContent>

								{/* Biography */}
								<Stack
									direction="row"
									spacing={12}
									mb={2}
									mt={2}
								>
									<Typography variant="h6" mt={1}>
										Biography
									</Typography>

									<TextField
										fullWidth
										sx={{mb: 2, mt: 1}}
										id="outlined-multiline-flexible"
										label="Enter Biography"
										multiline
										maxRows={4}
										value={biography}
										onChange={(event) => setBiography(event.target.value)}
									/>
								</Stack>

								<Divider/>

								{/* Pronouns */}
								<Stack
									direction="row"
									spacing={12}
									mb={2}
									mt={2}
								>
									<Typography variant="h6" mt={1}>
										Pronouns
									</Typography>

									<Select
										displayEmpty
										fullWidth
										sx={{mb: 2, mt: 1}}
										labelId="pronounSelect"
										id="pronounSelect"
										value={selectedPronoun}
										label="Pronoun"
										onChange={(event) => setSelectedPronoun(event.target.value)}
									>
										{pronouns.map((pronoun) => (
											<MenuItem key = {pronoun} value={pronoun}>
												{pronoun}
											</MenuItem>
										))}

									</Select>

								</Stack>

								<Divider/>

								{/* Language */}
								<Stack
									direction="row"
									spacing={12}
									mb={2}
									mt={2}
								>
									<Typography variant="h6" mt={1}>
										Language
									</Typography>

									<Select
										displayEmpty
										fullWidth
										sx={{mb: 2, mt: 1}}
										labelId="langaugeSelect"
										id="languageSelect"
										value={selectedLanguage}
										label="language"
										onChange={(event) => setSelectedLanguage(event.target.value)}
									>

									{languages.map((language, pos) => {
										return (
											<MenuItem key={pos} value={language.name}>
												{language.name}
											</MenuItem>
										);
									})}

									</Select>

								</Stack>

							</DialogContent>

							<Button onClick={() => handleProfileUpdate()}>
								Save
							</Button>
						</Dialog>

					</Grid>

					{/* Profile Picture + Name + Pronouns + Edit Profile Button */}
					<Stack
							direction="row"
							justifyContent="flex-start"
							alignItems="flex-end"
							spacing={-20}
							>
							
							<Grid container mt={2}>
									<Grid item>
										<Tooltip
											title="Edit Profile Picture">
												<div onClick={() => handlePictureEntryOpen()}>
													<Avatar
														alt={user.firstName}
														src={userPicture}
														sx={{
															bgcolor:'#7582EB',
															height: 80,
															width: 80
														}}
													>
														{user && (firstToUpperCase(user.firstName)+ firstToUpperCase(user.lastName))}
													</Avatar>
												</div>
										</Tooltip>
									</Grid>
									
									<Box
										sx={{
											ml: 2,
											mt: 1
										}}
									>
										{/* Name */}
										<Typography 
											variant="h4">
											{user &&(user.firstName +" "+ user.lastName)  }
										</Typography>

										{/* Pronouns */}
										<Typography
											color="textSecondary"
											variant="body2"
										>
											{selectedPronoun}
										</Typography>
											
										{/* Upload Picture Dialog */}
										<Dialog onClose={handlePictureEntryClose} open={pictureEntryOpen}>
											<DialogTitle>
												Select Profile Picture
											</DialogTitle>
											<DialogContent>
												<input
													type="file"
													accept="image/*"
													onChange={handleImageChange}
												/>
												<Button onClick={() => handleImageSubmit()}>
													Save
												</Button>
											</DialogContent>
										</Dialog>
								</Box>

							</Grid>
						
							<Button variant="outlined" onClick={() => handleEditOpen()}>
								Edit Profile
							</Button>
						</Stack>

				<Grid container mt={4}>
					<Card 
						variant="outlined" 
						sx={{ 
							width: '80%',
							height: '50%'
						}}>

						<CardContent>
							<Stack
								direction="row"
								spacing={44}
							>
								<Typography variant="h6">
									Email
								</Typography>

								<Typography variant="h6">
									{user.email}
								</Typography>
							</Stack>
						</CardContent>
					</Card>

					<Card 
						variant="outlined" 
						sx={{ 
							width: '80%',
						}}>

						<CardContent>
							<Stack
								direction="row"
								spacing={35}
							>
								<Typography variant="h6">
									Organization
								</Typography>

								<Typography variant="h6">
									{user.organization}
								</Typography>
							</Stack>
						</CardContent>
					</Card>

					<Card 
						variant="outlined" 
						sx={{ 
							width: '80%',
						}}>

						<CardContent>
							<Stack
								direction="row"
								spacing={34}
							>
								<Typography variant="h6">
									Account Type
								</Typography>

								<Typography variant="h6">
									{user.status}
								</Typography>
							</Stack>
						</CardContent>
					</Card>

					<Card 
						variant="outlined" 
						sx={{ 
							width: '80%',
						}}>

						<CardContent>
							<Stack
								direction="row"
								spacing={39}
							>
								<Typography variant="h6">
									Biography
								</Typography>

								<Typography variant="body1">
									{biography}
								</Typography>
							</Stack>
						</CardContent>
					</Card>

					<Card 
						variant="outlined" 
						sx={{ 
							width: '80%',
						}}>

						<CardContent>
							<Stack
								direction="row"
								spacing={39}
							>
								<Typography variant="h6">
									Language
								</Typography>

								<Typography variant="h6">
									{selectedLanguage}
								</Typography>
							</Stack>
						</CardContent>
					</Card>

				</Grid>
				
				</Container>
			</Box>
		</>
	);
};

Profile.getLayout = (page) => (
	<AuthGuard>
		<DashboardLayout>{page}</DashboardLayout>
	</AuthGuard>
);

export default Profile;