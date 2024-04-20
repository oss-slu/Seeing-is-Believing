import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import emailjs from '../../utils/email';

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  TextField,
  Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/use-auth';
import { Cog as CogIcon } from '../../icons/cog';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import React, { useState } from 'react';
import firebase from "../../lib/firebase";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const { user,logout } = useAuth();
  const [inviteUserDialogOpen, setInviteUserDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(' ');
  const [validMail,setValidMail]=useState(false)
  const {createUserWithEmailAndPassword, getAuth} = useAuth();
  const {sendPasswordResetEmail} = useAuth();
  const [error, setError] = useState(false);


  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  const handleInputChange = (e) => {
    const email = e.target.value;
    setUserEmail(email);

    const isValidEmail = validateEmail(email)
    setValidMail(isValidEmail)
    setError(!isValidEmail);
  };

  const handleInviteUser = async () => {

    
    try {
      const email = userEmail.trim();
      const message = `${window.location.origin}/authentication/register?email=${email}`;
  
      // Prepare the template parameters
      const templateParams = {
        user_email: email, // User's email address
        message: message, // Invitation message
      };
  
      // Send email using EmailJS
      const response = await emailjs.send('service_lbz6mka', 'template_aisa2ns', templateParams);
      
      toast.success('Admin successfully invited!');
    } catch (error) {
      console.error('Failed to send email', error);
      toast.error('Failed to invite admin.')
    }
    handleCloseInviteUserDialog();
  };

  const handleOpenInviteUserDialog = () => {
    setInviteUserDialogOpen(true);
  }

  const handleCloseInviteUserDialog = () => {
    setInviteUserDialogOpen(false);
  }

  const firstToUpperCase=(i)=>{
    if(i){
      return i.charAt(0).toUpperCase()
    }
    return ""
  }
  const handleLogout = async () => {
    try {
      onClose?.();
      await logout();
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };

  if (user.status == "Student" || user.status == "Teacher") {

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 300 } }}
      transitionDuration={0}
      {...other}>
      <Box
        sx={{
          alignItems: 'center',
          p: 2,
          display: 'flex'
        }}
      >
        <Avatar
          src={user.profilePicture}
          sx={{
            bgcolor:'#7582EB',
            height: 40,
            width: 40
          }}
        >
            {user && (firstToUpperCase(user.firstName)+ firstToUpperCase(user.lastName))}
        </Avatar>
        <Box
          sx={{
            ml: 1
          }}
        >
          <Typography variant="body1">
            {user &&(user.firstName +" "+ user.lastName)  }
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {user && (user.organization)}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ my: 1 }}>
        <NextLink
          href="/profile"
          passHref
        >
          <MenuItem component="a">
            <ListItemIcon>
              <UserCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="body1">
                  Profile
                </Typography>
              )}
            />
          </MenuItem>
        </NextLink>
        <NextLink
          href="/settings"
          passHref
        >
          <MenuItem component="a">
            <ListItemIcon>
              <CogIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="body1">
                  Settings
                </Typography>
              )}
            />
          </MenuItem>
        </NextLink>

        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography variant="body1">
                Logout
              </Typography>
            )}
          />
        </MenuItem>
      </Box>
    </Popover>
  );

} else { // add "Invite Admin" section if user status is Administrator

  return (
    <div>
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 300 } }}
      transitionDuration={0}
      {...other}>
      <Box
        sx={{
          alignItems: 'center',
          p: 2,
          display: 'flex'
        }}
      >
        <Avatar
          sx={{
            bgcolor:'#7582EB',
            height: 40,
            width: 40
          }}
        >
            {user && (firstToUpperCase(user.firstName)+ firstToUpperCase(user.lastName))}
        </Avatar>
        <Box
          sx={{
            ml: 1
          }}
        >
          <Typography variant="body1">
            {user &&(user.firstName +" "+ user.lastName)  }
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {user && (user.organization)}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ my: 1 }}>
        <NextLink
          href="/profile"
          passHref
        >
          <MenuItem component="a">
            <ListItemIcon>
              <UserCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="body1">
                  Profile
                </Typography>
              )}
            />
          </MenuItem>
        </NextLink>
        <NextLink
          href="/settings"
          passHref
        >
          <MenuItem component="a">
            <ListItemIcon>
              <CogIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="body1">
                  Settings
                </Typography>
              )}
            />
          </MenuItem>
        </NextLink>

        <MenuItem onClick={handleOpenInviteUserDialog}>
            <ListItemIcon>
              <UserCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary = {(
                <Typography variant="body1">
                  Invite Admin
                </Typography>
              )}
            />
          </MenuItem>

        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography variant="body1">
                Logout
              </Typography>
            )}
          />
        </MenuItem>
      </Box>
    </Popover>

    <Dialog
      open={inviteUserDialogOpen}
      onClose={handleCloseInviteUserDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Invite Admin</DialogTitle>
      <DialogContent>
      <TextField
      label="User Email"
      variant="outlined"
      fullWidth
      type="email"
      value={userEmail}
      onChange={handleInputChange}
      error={error}
      helperText={error ? 'Invalid email format' : ''}
      sx={{
        marginTop: '20px'
      }}
    />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseInviteUserDialog} color="primary">
          Cancel
        </Button>
        
        {validMail ? (
    <Button onClick={handleInviteUser} color="primary">
      Invite
    </Button>
  ) : ( 
    <Button disabled color="primary">
      Invite
    </Button>
  )}
      </DialogActions>
    </Dialog>
    </div>
  );
}
}


AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
