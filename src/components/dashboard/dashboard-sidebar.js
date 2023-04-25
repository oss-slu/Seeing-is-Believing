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
const getSectionsTeacher = (t) => [
	{
		title: t("General"),
		items: [
			{
				title: t("Home"),
				path: "/teacher",
				icon: <HomeIcon fontSize="small" />,
			},
			/*{
				title: t("Add a Langage"),
				path: "/teacher/language",
				icon: <LanguageIcon fontSize="small" />,
			},
			{
				title: t("Manage Words"),
				path: "/teacher/word",
				icon: <SaveIcon fontSize="small" />,
			},*/
			{
				title: t("Homework"),
				path: "/teacher/homework_portal",
				icon: <DocumentIcon fontSize="small" />,
			},
			{
				title: t("More"),
				path: "/teacher/word-list",
				icon: <DotsHorizontalIcon fontSize="small" />,
				children: [
					{
						title: t("Words Library"),
						path: '/teacher/wordlist'
					},
					{
						title: t('Manage Classes'),
						path: '/teacher/manage_class'
					},
					{
						title: t('Add Homework'),
						path: '/teacher/addHomework'
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
			{
				title: t("More"),
				path: "/administrator/word-list",
				icon: <DotsHorizontalIcon fontSize="small" />,
				children: [
					{
						title: t("Words Library"),
						path: '/administrator/wordlist'
					},
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
	const sections = useMemo(() => {
		if (user.status === "Student") {
			return getSectionsStudent(t)
		} else if (user.status === "Administrator") {
			return getSectionsAdministrator(t);
		} else {
			return getSectionsTeacher(t);
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
