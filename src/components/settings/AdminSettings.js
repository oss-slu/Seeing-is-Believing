import React from 'react';
import {Stack, Box, Card, Typography, Button, Switch } from '@mui/material';
import SendIcon from '@mui/icons-material/Send'
import Head from 'next/head';
import { Cog as CogIcon } from '../../icons/cog';
import firebase from "../../lib/firebase"
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/use-auth';
import LightThemeIcon from '../light-theme.svg';
import DarkThemeIcon from '../dark-theme.svg';
import { useSettings } from '../../hooks/use-settings';
import toast from 'react-hot-toast';

const getValues = (settings) => ({
	direction: settings.direction,
	responsiveFontSizes: settings.responsiveFontSizes,
	theme: settings.theme
  });

const AdminSettings = () => {
	const { user } = useAuth();
    const [isDisabled, setDisabled] = useState(localStorage.getItem('resetButtonDisabled') === 'true');
	const { settings, saveSettings } = useSettings();
  	const [values, setValues] = useState(getValues(settings));

	const themes = [
		{
		  label: 'Light',
		  value: 'light',
		  icon: LightThemeIcon
		},
		{
		  label: 'Dark',
		  value: 'dark',
		  icon: DarkThemeIcon
		}
	  ];
	
	useEffect(() => {
	setValues(getValues(settings));
	}, [settings]);

	const handleChange = (field, value) => {
		const newValues = {
			...values,
			[field]: value
		};
		setValues(newValues);
		saveSettings(newValues); // Save the immediately updated values
	};
	

	useEffect(() => {
        // Whenever isDisabled changes, update localStorage
        localStorage.setItem('resetButtonDisabled', isDisabled);
    }, [isDisabled]);
	

    const handlePasswordReset = () => {
        firebase.auth().sendPasswordResetEmail(user.email)
            .then(() => {
                setDisabled(true);
				toast.success("Password Reset Email Sent");
                // Set a timeout for how long you want the button to remain disabled
                const disableDuration = 10000; // 5 minutes in milliseconds
                setTimeout(() => setDisabled(false), disableDuration);
                // Update localStorage with the timeout end time
                localStorage.setItem('disableUntil', Date.now() + disableDuration);
            })
            .catch((error) => {
                // Handle any errors here
				toast.error("Failed to send Password Reset Email");
                console.error(error);
            });
    };

	useEffect(() => {
		const disableUntil = localStorage.getItem('disableUntil');
		if (disableUntil && Date.now() < parseInt(disableUntil)) {
			setDisabled(true);
			const timeoutDuration = parseInt(disableUntil) - Date.now();
			setTimeout(() => setDisabled(false), timeoutDuration);
		} else {
			// This part is missing in your original code
			setDisabled(false);
		}
	}, []);
	

    return (
        <>
			<Head>
				<title>Seeing Is Believing</title>
			</Head>
			<Box
				component="main"
				sx={{
					backgroundColor: "background.default",
					display: "flex",
					flexDirection: "column",
					height: "100%",
					width: '100%',
					padding: 2

				}}
			>

				<Stack direction = "row">
					<CogIcon
									sx={{
										height: 40,
										width: 40,
									}}
					/>
					<Typography variant="h4"
								sx ={{marginBottom: 2, marginLeft: 2}}>
									Administrator Settings
					</Typography>
				</Stack>



				<Stack direction="column">

					<Card elevation={16} variant = "outlined" sx={{p: 2}}>
						<Stack direction="row" spacing={30}>
							<Typography variant = "h5">Password Reset</Typography>
							<Button variant="contained" onClick={handlePasswordReset} disabled={isDisabled} endIcon={<SendIcon/>}>Reset Password</Button>
						</Stack>
					</Card>


					<Card elevation={16} variant = "outlined" sx={{p: 2}}>
						<Stack direction="row" spacing={42}>
							<Typography variant="h5">Theme</Typography>
						
							<Box sx={{alignItems: 'center', display: 'flex', m: -1}}>
								{themes.map((theme) => {
									const { label, icon: Icon, value } = theme;

									return (
									<div key={value}>
										<Box
										onClick={() => handleChange('theme', value)}
										sx={{
											borderColor: values.theme === value ? 'primary.main' : 'divider',
											borderRadius: 1,
											borderStyle: 'solid',
											borderWidth: 2,
											cursor: 'pointer',
											flexGrow: 1,
											fontSize: 0,
											m: 1,
											overflow: 'hidden',
											p: 1,
											'& svg': {
											height: 'auto',
											width: '100%'
											}
										}}
										>
										<Icon />
                				</Box>
										<Typography
										align="center"
										sx={{ mt: 1 }}
										variant="subtitle2"
										>
										{label}
										</Typography>
									</div>
									);
								})}
								</Box>
						</Stack>
					</Card>
					
					<Card elevation={16} variant = "outlined" sx={{p: 2}}>
						<Stack direction="row" spacing={23}>
							<Typography variant="h5">Responsive font sizes</Typography>
							<Switch checked={values.responsiveFontSizes} name="direction" onChange={(event) => handleChange('responsiveFontSizes', event.target.checked)}/>
						</Stack>
					</Card> 

					{/* <Card elevation={16} variant = "outlined" sx={{p: 2}}>
						<Stack direction="row" spacing={24}>
							<Typography variant="h5">Activate RTL content</Typography>
							<Switch checked={values.direction === 'rtl'} name="direction" onChange={(event) => handleChange('direction', event.target.checked ? 'rtl' : 'ltr')}/>
						</Stack>
					</Card> */}

				</Stack>
			</Box>
		</>
    );
};

export default AdminSettings;