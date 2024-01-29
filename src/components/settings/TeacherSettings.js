import React from 'react';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useRouter } from 'next/router';

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
        <Box sx={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
            <h2>Teacher Settings</h2>

            {/* Dark Theme Toggle */}
            <Box sx={{ marginY: '1rem' }}>
                <FormControlLabel
                    control={<Switch onChange={handleThemeChange} />}
                    label="Dark Theme"
                />
            </Box>

            {/* Password Reset Button */}
            <Box sx={{ marginY: '1rem' }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handlePasswordReset}
                >
                    Reset Password
                </Button>
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ marginY: '1rem' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={navigateToAbout}
                    sx={{ marginBottom: '0.5rem' }}
                >
                    About
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={navigateToHelpCenter}
                >
                    Help Center
                </Button>
            </Box>
        </Box>
    );
};

export default TeacherSettings;