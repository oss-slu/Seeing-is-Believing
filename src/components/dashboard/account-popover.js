import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
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

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const { user,logout } = useAuth();
  const [inviteUserDialogOpen, setInviteUserDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(' ');

  const handleInviteUser = () => {
    // This function does nothing for testing
  };

  const hadleOpenInviteUserDialog = () => {
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
          href="/dashboard/social/profile"
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
          href="/dashboard/account"
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

} else { // add "Invite User" section if user status is Administrator

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
          href="/dashboard/social/profile"
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
          href="/dashboard/account"
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

        <MenuItem onClick={hadleOpenInviteUserDialog}>
            <ListItemIcon>
              <UserCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary = {(
                <Typography variant="body1">
                  Invite User
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
      <DialogTitle>Invite User</DialogTitle>
      <DialogContent>
        <TextField
        label="User Email"
        variant="outlined"
        fullWidth
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        sx={{
          marginTop: '20px'
        }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseInviteUserDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleInviteUser} color="primary">
          Invite
        </Button>
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
