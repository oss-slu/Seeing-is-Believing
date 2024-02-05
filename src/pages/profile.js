import {
	Avatar,
	Box,
	Typography,
	Button,
	IconButton,
	DialogTitle,
	Dialog,
	List,
	ListItem,
	ListItemButton,
	Tooltip,
	Chip,
	DialogContent,
	Grid,
	Item,
	Card,
	CardContent,
	Divider,
	Container
} from "@mui/material";
import { DashboardLayout } from "../components/dashboard/dashboard-layout";
import { useAuth } from "../hooks/use-auth";
import React, { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import Stack from "@mui/material/Stack";
import { AuthGuard } from "../components/authentication/auth-guard";


const Profile = () => {

	const {user,logout } = useAuth();
	const pronouns = ['She/Her/Hers', 'He/Him/His', 'They/Them/Theirs'];
	const [pronounOpen, setPronounOpen] = useState(false);
	const [selectedPronoun, setSelectedPronoun] = useState(pronouns[1]);
	// TODO: pull pronoun from database

	const [editOpen, setEditOpen] = useState(false);


	const [pictureEntryOpen, setPictureEntryOpen] = useState(false);

	const handleEditOpen = () => {
		setEditOpen(true);
	}

	const handleEditClose = () => {
		setEditOpen(false);
	};
	
	// TODO: pull picture from database
	const userPicture = "/static/images/placeholder.png"

	const firstToUpperCase=(i)=>{
		if(i){
		  return i.charAt(0).toUpperCase()
		}
		return ""
	  }

	const handlePronounOpen = () => {
		setPronounOpen(true);
	};

	const handlePronounSelected = (value) => {
		setPronounOpen(false);
		setSelectedPronoun(value);
		// TODO: save to firebase database
	};

	const handlePronounClose = () => {
		setPronounOpen(false);
	};

	const handlePictureEntryOpen = () => {
		setPictureEntryOpen(true);
	}

	const handlePictureEntryClose = () => {
		setPictureEntryOpen(false);
	}

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
					
					{/* <Grid item>
						<Typography variant="h4">Homework</Typography>
					</Grid>

					<Grid item mt={2} xs={10}>
						<Typography variant="subtitle1" sx={{my: 1}}>
							Select the homework you want to see the grades
						</Typography>
					</Grid> */}
					
					<Grid container>
						<Stack
							direction="row"
							justifyContent="flex-start"
							alignItems="flex-end"
							spacing={12}
							>
							<Typography variant="h2" mt={2}>
								Profile
							</Typography>
						
							<Button variant="outlined" onClick={() => handleEditOpen()}>
								Edit Profile
							</Button>
						</Stack>

						<Dialog onClose={handleEditClose} open={editOpen}>
							<DialogTitle>
								Edit Your Profile
							</DialogTitle>

							<DialogContent>
								<Card 
									variant="outlined" 
									sx={{ 
										width: '100%',
									}}>

									<CardContent>
										<Stack
											direction="row"
											spacing={12}
										>
											<Typography variant="h5">
												Email
											</Typography>

											<Typography variant="h5">
												{user.email}
											</Typography>
										</Stack>
									</CardContent>
								</Card>
							</DialogContent>

							<List>
								{pronouns.map((pronoun) => (
									<ListItem key={pronoun}>
										<ListItemButton onClick={() => handlePronounSelected(pronoun)}>
											{pronoun}
										</ListItemButton>
									</ListItem>
								))}
							</List>
						</Dialog>

					</Grid>

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
									Upload a Picture
									{/* TODO: logic for allowing user to upload their own profile picture */}
									
								</DialogContent>
							</Dialog>
					</Box>

				</Grid>

				<Grid container mt={4}>
					<Card 
						variant="outlined" 
						sx={{ 
							width: '100%',
						}}>

						<CardContent>
							<Stack
								direction="row"
								spacing={45}
							>
								<Typography variant="h5">
									Email
								</Typography>

								<Typography variant="h5">
									{user.email}
								</Typography>
							</Stack>
						</CardContent>
					</Card>

					<Card 
						variant="outlined" 
						sx={{ 
							width: '100%',
						}}>

						<CardContent>
							<Stack
								direction="row"
								spacing={35}
							>
								<Typography variant="h5">
									Organization
								</Typography>

								<Typography variant="h5">
									{user.organization}
								</Typography>
							</Stack>
						</CardContent>
					</Card>

					<Card 
						variant="outlined" 
						sx={{ 
							width: '100%',
						}}>

						<CardContent>
							<Stack
								direction="row"
								spacing={34}
							>
								<Typography variant="h5">
									Account Type
								</Typography>

								<Typography variant="h5">
									{user.status}
								</Typography>
							</Stack>
						</CardContent>
					</Card>

					<Card 
						variant="outlined" 
						sx={{ 
							width: '100%',
						}}>

						<CardContent>
							<Stack
								direction="row"
								spacing={39}
							>
								<Typography variant="h5">
									Biography
								</Typography>

								<Typography variant="h5">
									TBD
								</Typography>
							</Stack>
						</CardContent>
					</Card>

					<Card 
						variant="outlined" 
						sx={{ 
							width: '100%',
						}}>

						<CardContent>
							<Stack
								direction="row"
								spacing={39}
							>
								<Typography variant="h5">
									Language
								</Typography>

								<Typography variant="h5">
									TBD
								</Typography>
							</Stack>
						</CardContent>
					</Card>

				</Grid>
				
				</Container>
			</Box>




{/* bad stuff below */}
			<Box
				sx={{
					// display: 'flex',
					// flex: '1 1 auto',
					// alignItems:'left',
					// flexDirection: 'column',
					// width: '100%',
					flexGrow: 1,
					pt: 5,
					pb: 8,
				}}
			>

				<Stack
					direction="row"
					justifyContent="space-evenly"
					alignItems="flex-end"
					spacing={12}
					>
					<Typography variant="h2" mt={2}>
						Profile
					</Typography>
					<Button variant="outlined">
						Edit Profile
					</Button>
				</Stack>
				
				<Box
					sx={{
					alignItems: 'center',
					p: 2,
					display: 'flex',
					marginLeft: '24%',
					flexGrow: 1,
					pt: 5,
					pb: 8,
					}}
				>
					{/* TODO: insert image src */}
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
					<Box
						sx={{
							ml: 2
						}}
					>

						{/* Name */}
						<Typography 
							variant="h4">
							{user &&(user.firstName +" "+ user.lastName)  }
						</Typography>
						
						<Stack direction="row" spacing={2}>
						
						{/* Pronouns */}
						<Typography
							color="textSecondary"
							variant="body2"
						>
							{selectedPronoun}
						</Typography>
						<IconButton
						onClick={() => handlePronounOpen()}
							sx={{
								height: 20,
								width: 20
							}}>
							<EditIcon sx={{
								height: 20,
								width: 20
							}}>

							</EditIcon>
						</IconButton>
						
						<Dialog onClose={handlePronounClose} open={pronounOpen}>
							<DialogTitle>
								Set Your Pronouns
							</DialogTitle>
							<List>
								{pronouns.map((pronoun) => (
									<ListItem key={pronoun}>
										<ListItemButton onClick={() => handlePronounSelected(pronoun)}>
											{pronoun}
										</ListItemButton>
									</ListItem>
								))}
							</List>
						</Dialog>
						
						</Stack>

						{/* Upload Picture Dialog */}
						<Dialog onClose={handlePictureEntryClose} open={pictureEntryOpen}>
							<DialogTitle>
								Select Profile Picture
							</DialogTitle>
							<DialogContent>
								Upload a Picture
								{/* TODO: logic for allowing user to upload their own profile picture */}
								
							</DialogContent>
						</Dialog>
					
						{/* <Typography
							color="textSecondary"
							variant="body2"
						>
							{user && (user.organization)}
						</Typography> */}
					</Box>
				</Box>

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