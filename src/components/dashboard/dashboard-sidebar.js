import { useEffect, useMemo, useRef, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/use-auth';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, Button, Divider, Drawer, useMediaQuery } from '@mui/material';
import { Home as HomeIcon } from '../../icons/home';
import { DocumentText as DocumentIcon } from '../../icons/document-text';
import { Scrollbar } from '../scrollbar';
import { DashboardSidebarSection } from './dashboard-sidebar-section';
import {PencilAlt as PenIcon} from '../../icons/pencil-alt'
import {ViewList as GradesIcon} from '../../icons/view-list';
import { InstructionsBook as InstructionsIcon } from '../../icons/instruction-book';
import { Language as LanguageIcon } from '../../icons/language';
import { Save as SaveIcon } from '../../icons/save';
import { DotsHorizontal as DotsHorizontalIcon } from '../../icons/dots-horizontal'	
import {db} from "../../lib/firebase";

const getSectionsStudent = (t) => [
	{
		title: t("General"),
		items: [

			{
				title: t("Home"),
				path: "/student",
				icon: <HomeIcon fontSize="small" />,
			},
			{
				title: t("Homework"),
				path: "/student/homework_portal",
				icon: <DocumentIcon fontSize="small" />,
			},
			{
				title: t("Practice"),
				path: "/student/practice",
				icon: <PenIcon fontSize="small" />,
			},
			{
				title: t("Grades"),
				path: "/student/grades",
				icon: <GradesIcon fontSize="small" />,
			},
			{
				title: t("Instructions"),
				path: "/student/instructions",
				icon: <InstructionsIcon fontSize="small" />,
			},
		],
	}
];

//declare routes for firebase info
const ROUTES = {
	home: "/teacher",
	manageClasses: "/teacher/manage_class",
	wordList: "/teacher/wordlist",
	addHomework: "/teacher/addHomework",
	language: "/teacher/language",
	words: "/tacher/word"
};

const getSectionsTeacher = (t) => [
	{
		title: t("General"),
		items: [
			{
				title: t("Home"), path: ROUTES.home,
				icon: <HomeIcon fontSize="small" />,
			},
			/*{
				title: t("Add a Langage"), path: ROUTES.language, 
				icon: <LanguageIcon fontSize="small" />,
			},
			{
				title: t("Manage Words"), path: ROUTES.words, 
				icon: <SaveIcon fontSize="small" />,
			},*/
			{
				title: t("Homework"), path: "/teacher/homework_portal", 
				icon: <DocumentIcon fontSize="small" />,
			},
			{
				title: t("More"),
				path: ROUTES.wordList,
				icon: <DotsHorizontalIcon fontSize="small" />,
				children: [
					{
						title: t("Words Library"), path: ROUTES.wordList
					},
					{
						title: t('Manage Classes'), path: ROUTES.manageClasses
					},
					{
						title: t('Add Homework'), path: ROUTES.addHomework
					},
				]
			},
		],
	}
];

// modified display for teachers that do not manage any classes
const getModifiedSectionsTeacher = (t) => [
	{
		title: t("General"),
		items: [
			{
				title: t("Home"), path: ROUTES.home,
				icon: <HomeIcon fontSize="small" />,
			},
			{
				title: t("More"), path: ROUTES.wordList,
				icon: <DotsHorizontalIcon fontSize="small" />,
				children: [
					{
						title: t('Manage Classes'), path: ROUTES.manageClasses
					},
				]
			},
		],
	}
];

const getSectionsAdministrator = (t) => [
	{
		title: t("General"),
		items: [
			{
				title: t("Home"), 
				path: "/administrator",
				icon: <HomeIcon fontSize="small" />,
			},
			{
				title: t("Add a Langage"),
				path: "/administrator/language",
				icon: <LanguageIcon fontSize="small" />,
			},
			{
				title: t("Manage Words"),
				path: "/administrator/word",
				icon: <SaveIcon fontSize="small" />,
			},
			/*{
				title: t("Homework"),
				path: "/administrator/homework_portal",
				icon: <DocumentIcon fontSize="small" />,
			},*/
			{
				title: t("More"),
				path: "/administrator/word-list",
				icon: <DotsHorizontalIcon fontSize="small" />,
				children: [
					{
						title: t("Words Library"),
						path: '/administrator/wordlist'
					},
					/*{
						title: t('Manage Classes'),
						path: '/administrator/manage_class'
					},*/
					/*{
						title: t('Add Homework'),
						path: '/administrator/addHomework'
					},*/
				]
			},
		]
	}

];

export const DashboardSidebar = (props) => {
	const { onClose, open } = props;
	const { logout, user } = useAuth();
	const router = useRouter();
	const { t } = useTranslation();
	const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
		noSsr: true,
	});
	const [fetchedClasses,setFetchedClasses]=useState(null);
	const [res, setRes] = useState(0);

	useEffect(() => {
		fetchDataClasses();
	}, []);
	

	const fetchDataClasses=async () =>{
		const collection= await db.collection("classes");
		let results=[];
		await collection.where("teacher","==",user.id).get().then(snapshot=>{
			snapshot.docs.forEach(doc=>{
				const newClass={id:doc.id,...doc.data()}
				results.push(newClass)
			})
		})
		if (results.length > 0) {
			setRes(1);
		}
		setFetchedClasses(results)
	}


	// const sections = useMemo(() => user.status === "Student" ? getSectionsStudent(t): getSectionsTeacher(t), [t]);
	// check user type and status, call appropriate method
	const sections = useMemo(() => {
		if (user.status === "Student") {
			return getSectionsStudent(t)
		} else if (user.status === "Administrator") {
			return getSectionsAdministrator(t);
		} else {
			if(res == 1) return getSectionsTeacher(t);
			else return getModifiedSectionsTeacher(t);
		}
	}, [t]);

	const handleLogout = async () => {
		try {
			onClose?.();
			await logout();
			router.push("/");
		} catch (err) {
			console.error(err);
			toast.error("Unable to logout.");
		}
	};

	const handlePathChange = () => {
		if (!router.isReady) {
			return;
		}

		if (open) {
			onClose?.();
		}
	};

	useEffect(
		handlePathChange,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router.isReady, router.asPath]
	);

	const content = (
		<>
			<Scrollbar
				sx={{
					height: "100%",
					"& .simplebar-content": {
						height: "100%",
					},
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						height: "100%",
					}}
				>
					<div>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<NextLink href="/" passHref>
								<img
									alt='Seeing is Believing'
									src='/static/icons/logo.png'
									style={{ width: '70%', marginTop: -3, objectFit: 'cover' }}
								/>
							</NextLink>
						</Box>
					</div>
					<Divider
						sx={{
							borderColor: "#2D3748",
							my: 1,
						}}
					/>
					<Box sx={{ flexGrow: 1 }}>
						{sections.map((section) => (
							<DashboardSidebarSection
								key={section.title}
								path={router.asPath}
								sx={{
									mt: 2,
									"& + &": {
										mt: 2,
									},
								}}
								{...section}
							/>
						))}
					</Box>
					<Divider
						sx={{
							borderColor: "#2D3748", // dark divider
						}}
					/>
					<Box sx={{ p: 2 }}>
						<Button
							color="primary"
							component="a"
							fullWidth
							sx={{ mt: 2 }}
							variant="contained"
							onClick={handleLogout}
						>
							{t("Logout")}
						</Button>
					</Box>
				</Box>
			</Scrollbar>
		</>
	);

	if (lgUp) {
		return (
			<Drawer
				anchor="left"
				open
				PaperProps={{
					sx: {
						backgroundColor: "neutral.900",
						borderRightColor: "divider",
						borderRightStyle: "solid",
						borderRightWidth: (theme) =>
							theme.palette.mode === "dark" ? 1 : 0,
						color: "#FFFFFF",
						width: 280,
					},
				}}
				variant="permanent"
			>
				{content}
			</Drawer>
		);
	}

	return (
		<Drawer
			anchor="left"
			onClose={onClose}
			open={open}
			PaperProps={{
				sx: {
					backgroundColor: "neutral.900",
					color: "#FFFFFF",
					width: 280,
				},
			}}
			sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
			variant="temporary"
		>
			{content}
		</Drawer>
	);
};

DashboardSidebar.propTypes = {
	onClose: PropTypes.func,
	open: PropTypes.bool
};
