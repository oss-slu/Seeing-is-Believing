import { useState } from 'react';
import { Box, Divider, IconButton, Input, Paper, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { X as XIcon } from '../../icons/x';
import { useAuth } from '../../hooks/use-auth';

export const Modal1 = (props) => {
  const {close}=props
  const {user}=useAuth()
  const [subject,setSubject]=useState("");
  const [message,setMessage]=useState("");
  const [isSending,setIsSending]=useState(false);

  const handleSubmit= async () =>{
    setIsSending(true)
	const content={
		to: 'seeingisbelievingtest@gmail.com',
		from: 'seeingisbelievingtestsender@gmail.com',
		subject,
		text: message,
		html: `<strong>From : ${user.email}</strong></br><p>${message}</p>`,
	}
 
  return (
		<Box
			sx={{
				backgroundColor: "background.default",
				minHeight: "100%",
				p: 3,
			}}
		>
			<Paper
				elevation={12}
				sx={{
					display: "flex",
					flexDirection: "column",
					margin: 3,
					minHeight: 500,
					mx: "auto",
					outline: "none",
					width: 600,
				}}
			>
				<Box
					sx={{
						alignItems: "center",
						display: "flex",
						px: 2,
						py: 1,
					}}
				>
					<Typography variant="h6">New Message</Typography>
					<Box sx={{flexGrow: 1}} />
					<IconButton onClick={close}>
						<XIcon fontSize="small" />
					</IconButton>
				</Box>
				<Input
					disableUnderline
					fullWidth
					disabled
					placeholder={"From : " + user.email}
					sx={{
						p: 1,
						borderBottom: 1,
						borderColor: "divider",
					}}
				/>
				<Input
					disableUnderline
					fullWidth
					onChange={(evt) => {
						setSubject(evt.target.value);
					}}
					placeholder="Subject"
					sx={{
						p: 1,
						borderBottom: 1,
						borderColor: "divider",
					}}
				/>
				<TextField
					minRows={6}
					multiline
					onChange={(evt) => {
						setMessage(evt.target.value);
					}}
					placeholder="Leave a message"
					sx={{
						mt: 2,
						borderRadius: 0,
						flexGrow: 1,
					}}
				/>
				<Divider />
				<Box
					sx={{
						alignItems: "center",
						display: "flex",
						justifyContent: "flex-end",
						p: 2,
					}}
				>
					<LoadingButton loading={isSending} variant="contained" onClick={handleSubmit}>
						Send
					</LoadingButton>
				</Box>
			</Paper>
		</Box>
  );}};
