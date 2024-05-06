import {useState} from 'react'
import {useRouter} from "next/router";
import * as Yup from "yup";
import {useFormik} from "formik";
import {Box, Button, FormHelperText, TextField} from "@mui/material";
import {useAuth} from "../../hooks/use-auth";
import {useMounted} from "../../hooks/use-mounted";
import firebase from "../../lib/firebase";

export const AmplifyPasswordRecovery = (props) => {
	const [message,setMessage]=useState("Recover Password")
	const [color,setColor]=useState("primary")
	const [submited,setSubmited]=useState(false)
	const isMounted = useMounted();
	const {passwordRecovery} = useAuth();
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			email: "",
			submit: null,
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("Must be a valid email")
				.max(255)
				.required("Email is required"),
		}),
		onSubmit: async (values, helpers) => {
			try {
				await firebase
					.auth()
					.sendPasswordResetEmail(values.email, {
            url: `${window.location.origin}`+'/authentication/login',
            handleCodeInApp: false
          })

		 setMessage("Verification Email Sent")
		 setColor("secondary")
		 setSubmited(true)

				/* await passwordRecovery(values.email);

        if (isMounted()) {
          sessionStorage.setItem('username', values.email);
          router.push('/authentication/password-reset');
        } */
			} catch (err) {
				console.error(err);

				if (isMounted()) {
					helpers.setStatus({success: false});
					helpers.setErrors({submit: err.message});
					helpers.setSubmitting(false);
				}
			}
		},
	});

	return (
		<form noValidate onSubmit={formik.handleSubmit} {...props}>
			<TextField
				autoFocus
				error={Boolean(formik.touched.email && formik.errors.email)}
				fullWidth
				helperText={formik.touched.email && formik.errors.email}
				label="Email Address"
				margin="normal"
				name="email"
				onBlur={formik.handleBlur}
				onChange={formik.handleChange}
				type="email"
				value={formik.values.email}
			/>
			{formik.errors.submit && (
				<Box sx={{mt: 3}}>
					<FormHelperText error>
						{formik.errors.submit}
					</FormHelperText>
				</Box>
			)}
			<Box sx={{mt: 3}}>
				<Button
					disabled={formik.isSubmitting || submited}
					fullWidth
					size="large"
					type="submit"
					variant="contained"
					color={color}
				>
					{message}
				</Button>
			</Box>
		</form>
	);
};
