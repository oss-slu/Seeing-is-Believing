import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
	Box,
	IconButton,
	Typography,
	Grid,
	useMediaQuery,
	Button,
	Chip,
	TextField,
	Slider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { ChatSidebar } from "../../../components/dashboard/chat/chatsidebar_homework _teacher";
import { MenuAlt4 as MenuAlt4Icon } from "../../../icons/menu-alt-4";
//import { gtm } from "../../../lib/gtm";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../hooks/use-auth";
import { Scrollbar } from "../../../components/scrollbar";
import * as COLORMAPS from "../../../constants/colormaps";
import { useReactMediaRecorder } from "react-media-recorder"; //Library used for recording
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { LoadingButton } from "@mui/lab";
import SpectrogramPlugin from "../../../utils/spectogramPlugin";
import DOMPurify from "dompurify";

/*------------------------------------Markup description------------------------------------*/
const createMarkup = (html) => {
	return {
		__html: DOMPurify.sanitize(html),
	};
};
const ChatInner = styled("div", {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	display: "flex",
	flexDirection: "column",
	flexGrow: 1,
	overflow: "hidden",
	[theme.breakpoints.up("md")]: {
		marginLeft: -380,
	},
	transition: theme.transitions.create("margin", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		[theme.breakpoints.up("md")]: {
			marginLeft: 0,
		},
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

// In our case there two possible routes
// one that contains /chat and one with a chat?threadKey={{threadKey}}
// if threadKey does not exist, it means that the chat is in compose mode

//Show spectogram of original audio

const Practice = () => {
	const { user } = useAuth();
	const router = useRouter();
	const homeworkId = router.query.hid;
	const rootRef = useRef(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	//Custom hooks
	const [view, setView] = useState("blank"); //Variable to render a blank view first time rendered
	const [hasBeenMarked, setHasBeenMarked] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [homework, setHomework] = useState(null);
	const [feedback, setFeedback] = useState("");
	const [grade, setGrade] = useState(0);
	const [words, setWords] = useState(null);
	const [studentId, setStudentId] = useState(null);

	const fetchHomeworkDetails = async (id) => {
		try {
			await db
				.collection("assignments")
				.doc(homeworkId)
				.get()
				.then(async (docRef) => {
					const results = docRef.data();
					setHomework(results);
				});
		} catch (err) {
			console.log(err.message);
		}
	};

	const handleSubmit = async () => {
		try {
			setIsSubmitting(true);
			const updatedStudentsAssignments = homework.studentsAssignements.map(
				(std) => {
					if (std.idStudent === studentId) {
						return {
							idStudent: studentId,
							answers: std.answers,
							feedback,
							grade,
						};
					} else {
						return std;
					}
				}
			);
			await db.collection("assignments").doc(homeworkId).update({
				studentsAssignements: updatedStudentsAssignments,
			});
			setIsSubmitting(false);
			setView("blank");
		} catch (err) {
			console.error(err.message);
		}
	};

	const handleChooseStudent = async (std_id) => {
		setStudentId(std_id);
		setGrade(0);
		setFeedback("");
		setHasBeenMarked(false);
		await fetchHomeworkDetails();
	};

	useEffect(() => {
		if (homework) {
			const std_assignment = homework.studentsAssignements.filter(
				(el) => el.idStudent === studentId
			);
			setWords(std_assignment);
			std_assignment = std_assignment[0];
			if (std_assignment.grade && std_assignment.feedback) {
				setGrade(std_assignment.grade);
				setFeedback(std_assignment.feedback);
				setHasBeenMarked(true);
			}
		}
	}, [homework]);

	useEffect(() => {
		if (words) {
			setView("practice");
		}
	}, [words]);

	const handleCloseSidebar = () => {
		setIsSidebarOpen(false);
	};

	const handleToggleSidebar = () => {
		setIsSidebarOpen((prevState) => !prevState);
	};

	if (!router.isReady) {
		return null;
	}


	return (
		<>
			<Head>
				<title>Seeing is believing</title>
				<script src="https://unpkg.com/wavesurfer.js"></script>
			</Head>
			<Box
				component="main"
				sx={{
					position: "relative",
					height: "100%",
					width: "100%",
					overflow: "hidden",
				}}
			>
				<Box
					ref={rootRef}
					sx={{
						display: "flex",
						position: "absolute",
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
					}}
				>
					<ChatSidebar
						containerRef={rootRef}
						onClose={handleCloseSidebar}
						open={isSidebarOpen}
						homework={homeworkId}
						chooseStudent={handleChooseStudent}
					/>
					{view != "blank" && (
						<ChatInner open={isSidebarOpen}>
							<Box
								sx={{
									alignItems: "center",
									backgroundColor: "background.paper",
									borderBottomColor: "divider",
									borderBottomStyle: "solid",
									borderBottomWidth: 1,
									display: "flex",
									p: 2,
								}}
							>
								<IconButton onClick={handleToggleSidebar}>
									<MenuAlt4Icon fontSize="small" />
								</IconButton>
							</Box>
							<Scrollbar sx={{ maxHeight: "100%", pb: 10 }}>
								{words.map((word, pos) => (
									<SubSection
										key={pos}
										answer={word.answers[0]}
										position={pos}
									/>
								))}

								<Grid xs={12} mx={3}>
									<Typography
										variant="subtitle1"
										sx={{ display: "block", mt: 2 }}
									>
										Feedback
									</Typography>
									<TextField
										multiline
										minRows={3}
										disabled={hasBeenMarked}
										placeholder="Feedback ..."
										sx={{
											my: 1,
											width: "100%",
											fontSize: "0.5em",
										}}
										value={feedback}
										onChange={(evt) => {
											setFeedback(evt.target.value);
										}}
									/>
									<Typography
										variant="subtitle1"
										sx={{ display: "block", mt: 3 }}
									>
										Grade :{" "}
										<Chip
											sx={{
												fontStyle: "oblique",
											}}
											label={`${grade}/ ${homework.score} pts`}
										/>
									</Typography>
									<Slider
										disabled={hasBeenMarked}
										valueLabelDisplay="auto"
										value={grade}
										onChange={(evt, val) => {
											setGrade(val);
										}}
										min={0}
										step={1}
										max={homework.score}
									/>
									{!hasBeenMarked && (
										<LoadingButton
											sx={{ mt: 3 }}
											fullWidth
											loading={isSubmitting}
											variant="contained"
											onClick={handleSubmit}
										>
											Submit Grade
										</LoadingButton>
									)}
								</Grid>
							</Scrollbar>
						</ChatInner>
					)}
				</Box>
			</Box>
		</>
	);
};

const SubSection = (props) => {
	const { answer } = props;
	const specMainContainerRef = useRef(null);
	const specMainRef = useRef(null);
	const specMainNonNativeContainerRef = useRef(null);
	const specMainNonNativeRef = useRef(null);
	const specRecordContainerRef = useRef(null);
	const specRecordRef = useRef(null);
	const [audioMain, setAudioMain] = useState("");
	const [audioMainNonNative, setAudioMainNonNative] = useState("");
	const [audioRecord, setAudioRecord] = useState(null);
	const [isMainPlaying, setIsMainPlaying] = useState(false);
	const [isMainNonNativePlaying, setIsMainNonNativePlaying] = useState(false);
	const [isRecordedPlaying, setIsRecordedPlaying] = useState(false);
	const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
		useReactMediaRecorder({ audio: true });

	const showSpectroMain = async () => {
		try {
			const container = specMainContainerRef.current;
			const wavesurfer = WaveSurfer.create({
				container,
				fillParent: true,
				plugins: [
					SpectrogramPlugin.create({
						wavesurfer: wavesurfer,
						container: specMainRef.current,
						fftSamples: 2048,
						noverlap: 0,
						labels: false,
						colorMap: COLORMAPS.hsv,
						forceDecode: true,
						windowFunc: "bartlettHann",
					}),
				],
			});
			wavesurfer.empty();
			wavesurfer.load(answer.word.urlAudio);
		} catch (err) {
			console.error(err.message);
		}
	};
	const showSpectroMainNonNative = async () => {
		try {
			const container = specMainNonNativeContainerRef.current;
			const wavesurfer = WaveSurfer.create({
				container,
				fillParent: true,
				plugins: [
					SpectrogramPlugin.create({
						wavesurfer: wavesurfer,
						container: specMainNonNativeRef.current,
						fftSamples: 2048,
						noverlap: 0,
						labels: false,
						colorMap: COLORMAPS.hsv,
						forceDecode: true,
						windowFunc: "bartlettHann",
					}),
				],
			});
			wavesurfer.empty();
			wavesurfer.load(answer.word.urlAudioNonNative);
		} catch (err) {
			console.error(err.message);
		}
	};
	const toggleAudioMain = () => {
		//Play or pauses the main audio every time the function is called
		if (!isMainPlaying) {
			audioMain.play();
			setIsMainPlaying(true);
		} else {
			audioMain.pause();
			setIsMainPlaying(false);
		}
		audioMain.addEventListener("ended", function () {
			setIsMainPlaying(false);
		});
	};
	const toggleAudioMainNonNative = () => {
		//Play or pauses the main audio every time the function is called
		if (!isMainNonNativePlaying) {
			audioMainNonNative.play();
			setIsMainNonNativePlaying(true);
		} else {
			audioMainNonNative.pause();
			setIsMainNonNativePlaying(false);
		}
		audioMainNonNative.addEventListener("ended", function () {
			setIsMainNonNativePlaying(false);
		});
	};

	const playRecording = () => {
		if (!isRecordedPlaying) {
			audioRecord.play();
			setIsRecordedPlaying(true);
		} else {
			audioRecord.pause();
			setIsRecordedPlaying(false);
		}
		audioRecord.addEventListener("ended", function () {
			setIsRecordedPlaying(false);
		});
	};

	const showSpectroRecord = async () => {
		const wavesurfer = WaveSurfer.create({
			container: specRecordContainerRef.current,
			fillParent: true,
			plugins: [
				SpectrogramPlugin.create({
					container: specRecordRef.current,
					fftSamples: 2048,
					noverlap: 0,
					labels: false,
					colorMap: COLORMAPS.hsv,
					forceDecode: true,
					windowFunc: "bartlettHann",
				}),
			],
		});
		await wavesurfer.empty();
		await wavesurfer.load(answer.answerAudioUrl);
	};

	useEffect(() => {
		//update the component if a word is chosen
		if (answer) {
			showSpectroMain();
			showSpectroMainNonNative();
			showSpectroRecord();
			const audio1 = new Audio(answer.word.urlAudio);
			setAudioMain(audio1);
			const audio1NonNative = new Audio(answer.word.urlAudioNonNative);
			setAudioMainNonNative(audio1NonNative);
			const audio2 = new Audio(answer.answerAudioUrl);
			setAudioRecord(audio2);
		}
	}, [answer]);

	return (
		<Grid container xs={12} direction="column">
			<Grid container item xs={6} pt={3}>
				<Grid xs={12} px={3} item sx={{ display: "flex" }}>
					<Typography
						variant="subtitle1"
						sx={{
							display: "inline",
							display: "flex",
							mr: 4,
						}}
					>
						Word :&#160;
						<Typography color="textSecondary" variant="subtitle1">
							{answer.word.name}
						</Typography>
					</Typography>
					<Typography
						variant="subtitle1"
						sx={{
							display: "inline",
							display: "flex",
						}}
					>
						Dialect :&#160;
						<Typography color="textSecondary" variant="subtitle1">
							<em>{answer.word.dialect} </em>
						</Typography>
					</Typography>
				</Grid>
				<Grid xs={12} px={3} mt={2} item>
					<Typography variant="subtitle1" sx={{ display: "block" }}>
						Description
					</Typography>
					<Grid md={10}>
						<div
							style={{ color: "#65748B" }}
							dangerouslySetInnerHTML={createMarkup(answer.word.description)}
						></div>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={6} pt={3} px={3}>
				<Grid
					mt={2}
					mb={2}
					item
					sx={{
						maxWidth: "680px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="subtitle1" sx={{ display: "block" }}>
						Spectogram view : &#160;
						<Chip
							sx={{
								fontStyle: "oblique",
							}}
							label="Native Speaker"
						/>
					</Typography>
					<Box
						sx={{
							maxWidth: "680px",
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						<Button
							onClick={toggleAudioMain}
							disabled={isMainPlaying && audioMain ? true : false}
							variant="contained"
							endIcon={<PlayArrowIcon fontSize="large" />}
						>
							Listen
						</Button>
					</Box>
				</Grid>
				<Grid
					sx={{
						maxWidth: "665px",
						maxHeight: "350px",
						overflowX: "scroll",
						overflowY: "scroll",
					}}
				>
					<div
						style={{
							height: "1000px",
							width: "1200px",
							position: "relative",
						}}
						ref={specMainRef}
					></div>
					<Grid
						item
						style={{
							overflow: "hidden",
							height: "0px",
						}}
						xs={12}
					>
						<div
							style={{
								visibility: "hidden",
							}}
							ref={specMainContainerRef}
						></div>
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={6} pt={3} px={3}>
				<Grid
					mt={2}
					mb={2}
					item
					sx={{
						maxWidth: "680px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="subtitle1" sx={{ display: "block" }}>
						Spectogram view : &#160;
						<Chip
							sx={{
								fontStyle: "oblique",
							}}
							label="Recorded Speech"
						/>
					</Typography>
					<Box
						sx={{
							maxWidth: "680px",
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						{
							<Button
								onClick={playRecording}
								disabled={isRecordedPlaying}
								variant="contained"
								endIcon={<PlayArrowIcon sx={{ transform: "scale(1.2)" }} />}
							>
								Listen
							</Button>
						}
					</Box>
				</Grid>
				{
					<Grid
						sx={{
							maxWidth: "665px",
							maxHeight: "350px",
							overflowX: "scroll",
							overflowY: "scroll",
						}}
					>
						<div
							style={{
								height: "1000px",
								width: "1200px",
								position: "relative",
							}}
							id="spectrogram"
							ref={specRecordRef}
						></div>
						<Grid
							item
							style={{
								overflow: "hidden",
								height: "0px",
							}}
							xs={12}
						>
							<div
								style={{
									visibility: "hidden",
								}}
								ref={specRecordContainerRef}
							></div>
						</Grid>
					</Grid>
				}
			</Grid>

			<Grid item xs={6} pt={3} px={3} mb={5}>
				<Grid
					mt={2}
					mb={2}
					item
					sx={{
						maxWidth: "680px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="subtitle1" sx={{ display: "block" }}>
						Spectogram view : &#160;
						<Chip
							sx={{
								fontStyle: "oblique",
							}}
							label="Non-Native Speaker"
						/>
					</Typography>
					<Box
						sx={{
							maxWidth: "680px",
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						<Button
							onClick={toggleAudioMainNonNative}
							disabled={
								isMainNonNativePlaying && audioMainNonNative ? true : false
							}
							variant="contained"
							endIcon={<PlayArrowIcon fontSize="large" />}
						>
							Listen
						</Button>
					</Box>
				</Grid>
				<Grid
					sx={{
						maxWidth: "665px",
						maxHeight: "350px",
						overflowX: "scroll",
						overflowY: "scroll",
					}}
				>
					<div
						style={{
							height: "1000px",
							width: "1200px",
							position: "relative",
						}}
						ref={specMainNonNativeRef}
					></div>
					<Grid
						item
						style={{
							overflow: "hidden",
							height: "0px",
						}}
						xs={12}
					>
						<div
							style={{
								visibility: "hidden",
							}}
							ref={specMainNonNativeContainerRef}
						></div>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};
Practice.getLayout = (page) => (
	<AuthGuard>
		<DashboardLayout>{page}</DashboardLayout>
	</AuthGuard>
);

export default Practice;
