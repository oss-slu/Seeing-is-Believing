import {useState, useEffect} from 'react';
import {useRouter} from "next/router";
import * as Yup from "yup";
import {useFormik} from "formik";
import {
	Box,
	Button,
	Checkbox,
	FormHelperText,
	Link,
	Grid,
	TextField,
	Typography,
	MenuItem,
	InputLabel,
	Select,
	FormControl,
	Alert,
} from "@mui/material";
import {useAuth} from "../../hooks/use-auth";
import {useMounted} from "../../hooks/use-mounted";
import {db} from '../../lib/firebase';

export const FirebaseRegister = (props) => {
	const isMounted = useMounted();
	const router = useRouter();
	const {createUserWithEmailAndPassword, getAuth} = useAuth();
	const [isUserCreated, setIsUserCreated] = useState(false)
	const [emailInUse, setEmailInUse] = useState(false)
	const [showStatus, setShowStatus] = useState(true); // Use showStatus to control visibility

	useEffect(() => {
		const queryString = window.location.search;
		const show = !queryString.includes('=') || queryString.split('=')[1] === '';
		setShowStatus(show);
	  
		// Automatically set status to "Administrator" if we're hiding the status field
		if (!show) {
		  formik.setFieldValue("status", "Administrator");
		  formik.setFieldTouched("status");
		}
	  }, [router.asPath]); // Depend on router.asPath to react to URL changes


	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			status: "",
			organizations: "",
			policy: true,
			submit: null,
		},
		validationSchema: Yup.object({
			firstName: Yup.string()
				.min(2, "Too Short!")
				.max(50, "Too Long!")
				.required("Required *"),
			lastName: Yup.string()
				.min(2, "Too Short!")
				.max(50, "Too Long!")
				.required("Required *"),
			email: Yup.string()
				.email("Required *")
				.max(255)
				.required("Required *"),
			password: Yup.string().min(4).max(255).required("Required *"),
			confirmPassword: Yup.string()
				.required("Required *")
				.oneOf([Yup.ref("password"), null], "Password doesn't match"),
			status: Yup.string().required("Required *"),     
			organizations: Yup.string().required("Required *"),
			policy: Yup.boolean().oneOf([true], "This field must be checked"),
		}),
		onSubmit: async (values, helpers) => {
			try {
				const userCreated = await createUserWithEmailAndPassword(
					values.email,
					values.password
				)
					.then((res) => {
						return res.user;
					})
					.catch((err) => {
						if (err.code == "auth/email-already-in-use") {
							setEmailInUse(true);
						}
					});
				if (userCreated) {
					setIsUserCreated(true);
					await userCreated.sendEmailVerification();
					await db.collection("users").add({
						email: values.email,
						firstName: values.firstName,
						lastName: values.lastName,
						status: values.status,
						organization: values.organizations,
					});
					
				}
				if (isMounted()) {
					if (userCreated){
						setTimeout(() => {const returnUrl = router.query.returnUrl || "/authentication/login";
						router.push(returnUrl);}, 9000);
					}
					
				}
			} catch (err) {
				if (isMounted()) {
					helpers.setStatus({success: false});
					helpers.setErrors({submit: err.message});
					helpers.setSubmitting(false);
				}
			}
		},
	});


	return (
		<div {...props}>
			<form noValidate onSubmit={formik.handleSubmit}>
				<Grid container spacing={3} mt={2}>
					<Grid item md={6} xs={12}>
						<TextField
							error={Boolean(
								formik.touched.lastName &&
									formik.errors.lastName
							)}
							fullWidth
							helperText={
								formik.touched.firstName &&
								formik.errors.firstName
							}
							label="First name"
							margin="normal"
							name="firstName"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							type="text"
							value={formik.values.firstName}
						/>
					</Grid>
					<Grid item md={6} xs={12}>
						<TextField
							error={Boolean(
								formik.touched.lastName &&
									formik.errors.lastName
							)}
							fullWidth
							helperText={
								formik.touched.lastName &&
								formik.errors.lastName
							}
							label="Last Name"
							margin="normal"
							name="lastName"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							type="text"
							value={formik.values.lastName}
						/>
					</Grid>
				</Grid>
				<TextField
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
				<TextField
					error={Boolean(
						formik.touched.password && formik.errors.password
					)}
					fullWidth
					helperText={
						formik.touched.password && formik.errors.password
					}
					label="Password"
					margin="normal"
					name="password"
					onBlur={formik.handleBlur}
					onChange={formik.handleChange}
					type="password"
					value={formik.values.password}
				/>
				<TextField
					error={Boolean(
						formik.touched.confirmPassword &&
							formik.errors.confirmPassword
					)}
					fullWidth
					helperText={
						formik.touched.confirmPassword &&
						formik.errors.confirmPassword
					}
					label="Confirm password"
					margin="normal"
					name="confirmPassword"
					onBlur={formik.handleBlur}
					onChange={formik.handleChange}
					type="password"
					value={formik.values.confirmPassword}
				/>
				
				{showStatus && (
          		<FormControl variant="standard" sx={{ mt: 2, minWidth: "100%" }}
                       error={Boolean(formik.touched.status && formik.errors.status)}>
            			<InputLabel id="status">Status</InputLabel>
						<Select labelId="status" name="status"
							value={formik.values.status} onChange={formik.handleChange}>
								{status.map((item, pos) => {
									return (
										<MenuItem key={pos} value={item.title}>
											{item.title}
										</MenuItem>
									);
								})}
						</Select>
						{formik.touched.status && formik.errors.status && (
              			<FormHelperText error>{formik.errors.status}</FormHelperText>
            			)}
          		</FormControl>
        )}
				<Box mb={3}>
					<FormControl
						variant="standard"
						sx={{mt: 2, minWidth: "100%"}}
						error={Boolean(
							formik.touched.organizations &&
								formik.errors.organizations
						)}
					>
						<InputLabel id="organizations">
							Organizations
						</InputLabel>
						<Select
							displayEmpty
							labelId="organizations"
							fullWidth
							name="organizations"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							value={formik.values.organizations}
						>
							{organizations.map((item, pos) => {
								return (
									<MenuItem key={pos} value={item.title}>
										{item.title}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</Box>
				<Box
					sx={{
						alignItems: "center",
						display: "flex",
						ml: -1,
						mt: 2,
					}}
				>
					<Checkbox
						checked={formik.values.policy}
						name="policy"
						onChange={formik.handleChange}
					/>
					<Typography color="textSecondary" variant="body2">
						I have read the{" "}
						<Link component="a" href="#">
							Terms and Conditions
						</Link>
					</Typography>
				</Box>
				{Boolean(formik.touched.policy && formik.errors.policy) && (
					<FormHelperText error>
						{formik.errors.policy}
					</FormHelperText>
				)}
				{formik.errors.submit && (
					<Box sx={{mt: 3}}>
						<FormHelperText sx={{fontSize:'0.9rem'}} error>
							{formik.errors.submit}
						</FormHelperText>
					</Box>
				)}
				<Box sx={{mt: 2}}>
					<Button
						disabled={formik.isSubmitting}
						fullWidth
						size="large"
						type="submit"
						variant="contained"
					>
						Register
					</Button>
					<div>
					{isUserCreated && <Alert severity="info">Email verification link has been sent!</Alert>}
					{emailInUse && <Alert severity="warning">Email already in use.</Alert>}
					</div>
				</Box>
			</form>
		</div>
	);
};

const status = [{title: "Student"}, {title: "Teacher"}];

const organizations = [
	{title: "Bradley University"},
	{title: "University of Delaware"},
	{title: "Ohio state university"},
	{title: "University of South Carolina"},
	{title: "Saint Louis University"},
	{title: "University of Massachousetts Amherst"},
];