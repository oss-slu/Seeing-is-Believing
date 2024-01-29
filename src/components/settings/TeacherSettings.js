import React from 'react';
import {Switch, Box, Card, Button, Container, Typography } from '@mui/material';
import NextLink from 'next/link';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Cog as CogIcon } from '../../icons/cog';


const TeacherSettings = () => {
    const router = useRouter();
    
    const handleThemeChange = (event) => {
        // Handle theme change logic here
    };

    const handlePasswordReset = () => {
        router.push('../../password-reset');
    };

    const navigateToAbout = () => {
        pass;
    };

    const navigateToHelpCenter = () => {
        pass;
    };

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
					minHeight: "100vh",
				}}
			>
				<Container
					maxWidth="sm"
					sx={{
						py: {
							xs: "40px",
							md: "45px",
						},
					}}
				>
					<Box>
						<Button
							fullWidth
							size="large"
							type="submit"
							variant="contained"
							sx={{
								backgroundColor: "#D1D5DB",
								"&:hover": {
									background: "#6B7280",
								},
                borderBottomLeftRadius:1,
                borderBottomRightRadius:1,
							}}
							onClick={() => router.back()}
						>
							Back to Previous Page
						</Button>
					</Box>
					<Card elevation={16} sx={{p: 10, paddingTop:2}}>
						<Box
							sx={{
								alignItems: "center",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
							}}
						>
							
                            <CogIcon
                                sx={{
                                    height: 40,
                                    width: 40,
                                }}
                            />
							<Typography variant="h4"
                            sx ={{marginBottom: 5}}>
								Teacher Settings
							</Typography>
						
						</Box>
						<Button 
                            fullWidth
							size="large"
							type="submit"
							variant="contained"
                            sx={{
								backgroundColor: "#D1D5DB",
								"&:hover": 
                                    {
									    background: "#6B7280",
								    },
                                borderRadius: 1,
                                marginBottom: 1
							}}
                            >
                            Theme Settings
                        </Button>
                        <Button
                            onClick = {handlePasswordReset} 
                            fullWidth
							size="large"
							type="submit"
							variant="contained"
                            sx={{
								backgroundColor: "#D1D5DB",
								"&:hover": 
                                    {
									    background: "#6B7280",
								    },
                                borderRadius: 1,
                                marginBottom: 1
							}}
                            >
                            Password Reset
                        </Button>
                        <Box fullWidth
                        sx = {{display: "flex", width: '100%'}}>
                        <Button 
                            fullWidth
							size="small"
							type="submit"
							variant="contained"
                            sx={{
								backgroundColor: "#D1D5DB",
								"&:hover": 
                                    {
									    background: "#6B7280",
								    },
                                borderRadius: 1,
                                marginRight: 1
							}}
                            >
                            Help Center
                        </Button>
                        <Button 
                            fullWidth
							size="small"
							type="submit"
							variant="contained"
                            sx={{
								backgroundColor: "#D1D5DB",
								"&:hover": 
                                    {
									    background: "#6B7280",
								    },
                                borderRadius: 1,
                                margin: 0
							}}
                            >
                            About Us
                        </Button>
                        </Box>
					</Card>
				</Container>
			</Box>
		</>
    );
};

export default TeacherSettings;