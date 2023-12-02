import {useEffect, useRef, useState} from "react";
import Head from "next/head";
import {useRouter} from "next/router";
import {
	Avatar,
	Box,
	IconButton,
	Typography,
	Grid,
	useMediaQuery,
	Button,
	Chip,
} from "@mui/material";
import {styled} from "@mui/material/styles";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {ChatSidebar} from "../../components/dashboard/chat/chatsidebar";
import {MenuAlt4 as MenuAlt4Icon} from "../../icons/menu-alt-4";
//import {gtm} from "../../lib/gtm";
import {db} from "../../lib/firebase";
import {Scrollbar} from "../../components/scrollbar";
import * as COLORMAPS from "../../constants/colormaps";
import toast from "react-hot-toast";
import {useReactMediaRecorder} from "react-media-recorder"; //Library used for recording
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SpectrogramPlugin from "../../utils/spectogramPlugin";
import DOMPurify from "dompurify";

const ChatInner = styled("div", {shouldForwardProp: (prop) => prop !== "open"})(
	({theme, open}) => ({
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
	})
);

// In our case there two possible routes
// one that contains /chat and one with a chat?threadKey={{threadKey}}
// if threadKey does not exist, it means that the chat is in compose mode

//Show spectogram of original audio

const WordList = () => {
	const router = useRouter();
	const rootRef = useRef(null);
	const specMainContainerRef = useRef(null);
	const specMainRef = useRef(null);
	const specMainNonNativeContainerRef = useRef(null);
	const specMainNonNativeRef = useRef(null);
	const specRecordContainerRef = useRef(null);
	const specRecordRef = useRef(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"), {
		noSsr: false,
	});
	//Custom hooks
	const [languages, setLanguages] = useState([]);
	const [word, setWord] = useState(null);
	const [view, setView] = useState("blank"); //Variable to render a blank view first time rendered
	const [audioMain, setAudioMain] = useState("");
	const [audioMainNonNative, setAudioMainNonNative] = useState("");
	const [audioRecord, setAudioRecord] = useState(null);
	const [isMainPlaying, setIsMainPlaying] = useState(false);
	const [isMainNonNativePlaying, setIsMainNonNativePlaying] = useState(false);
	const [isRecordedPlaying, setIsRecordedPlaying] = useState(false);
	const {status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl} =
		useReactMediaRecorder({audio: true});

	useEffect(() => {
		if (mediaBlobUrl && mediaBlobUrl != "") {
			showSpectroRecord();
			const audio = new Audio(mediaBlobUrl);
			setAudioRecord(audio);
		} else {
			reinitialize();
		}
	}, [mediaBlobUrl]);

	const reinitialize = () => {
		setAudioRecord(null);
		setIsRecordedPlaying(false);
		clearBlobUrl();
	};

	const showSpectroRecord = async () => {
		const wavesurfer = WaveSurfer.create({
			container: specRecordContainerRef.current,
			plugins: [
				SpectrogramPlugin.create({
					container: specRecordRef.current,
					fftSamples: 1024,
					noverlap: 0,
					labels: false,
					colorMap: COLORMAPS.hsv,
					forceDecode: true,
					windowFunc: "bartlettHann",
					//windowFunc: 'cosine',
					//windowFunc: 'lanczoz',
				}),
			],
		});
		await wavesurfer.empty();
		await wavesurfer.load(mediaBlobUrl);
	};
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
						fftSamples: 1024,
						noverlap: 0,
						labels: false,
						colorMap: COLORMAPS.hsv,
						forceDecode: true,
						windowFunc: "bartlettHann",
						//windowFunc: 'cosine',
						//windowFunc: 'lanczoz',
					}),
				],
			});
			wavesurfer.empty();
			wavesurfer.load(word.urlAudio);
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
						fftSamples: 1024,
						noverlap: 0,
						labels: false,
						colorMap: COLORMAPS.hsv,
						forceDecode: true,
						windowFunc: "bartlettHann",
						//windowFunc: 'cosine',
						//windowFunc: 'lanczoz',
					}),
				],
			});
			wavesurfer.empty();
			wavesurfer.load(word.urlAudioNonNative);
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

	const record = () => {
		toast.loading(
			<Typography color="textSecondary" fontSize="subtitle2">
				Recording
			</Typography>,
			{icon: "🛑"}
		);
		startRecording();
	};

	const stopRecord = () => {
		toast.dismiss();
		stopRecording();
	};

	const fetchData = async () => {
		//Fetch the languages to fill in languages comboBox
		const collection = await db.collection("languages");
		let results = [];
		await collection.get().then((snapshot) => {
			snapshot.docs.forEach((doc) => {
				const newLanguage = doc.data();
				results.push(newLanguage);
			});
		});
		setLanguages(results);
	};

	useEffect(() => {
		//gtm.push({event: "page_view"});
		//first time rendered component -->fetch the data
		fetchData();
	}, []);

	const handleChooseWord = async (choice) => {
		setWord(choice);
		setView("practice");
		const audio = new Audio(choice.urlAudio);
		setAudioMain(audio);
		const audioNonNative = new Audio(choice.urlAudioNonNative);
		setAudioMainNonNative(audioNonNative);
	};
	/*------------------------------------Markup description------------------------------------*/
	const createMarkup = (html) => {
		return {
			__html: DOMPurify.sanitize(html),
		};
	};

	useEffect(() => {
		//update the component if a word is chosen
		reinitialize();
		if (specMainContainerRef.current) {
			showSpectroMain();
		}
		if (specMainNonNativeContainerRef.current) {
			showSpectroMainNonNative();
		}
	}, [view, word]);

	//Hook when component will be unmounted
	useEffect(() => {
		return () => {
			if (status === "recording") {
				toast.dismiss();
				stopRecording();
			}
		};
	});

	useEffect(() => {
		if (!mdUp) {
			setIsSidebarOpen(false);
		} else {
			setIsSidebarOpen(true);
		}
	}, [mdUp]);

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
				<script src="https://unpkg.com/wavesurfer.js@6"></script>
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
						languages={languages}
						chooseWord={handleChooseWord}
					/>
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
						{view == "practice" && (
							<Scrollbar sx={{ maxHeight: "100%" }}>
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
													{word.name}
												</Typography>
											</Typography>
											<Typography
												variant="subtitle1"
												sx={{
													display: "inline",
													display: "flex",
												}}
											>
												Dialect: &#160;
												<Typography color="textSecondary" variant="subtitle1">
													<em>{word.dialect} </em>
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
													dangerouslySetInnerHTML={createMarkup(
														word.description
													)}
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
												maxHeight: "450px",
												overflowX: "clip",
												overflowY: "clip",
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
									<Grid item xs={6} pt={3} px={3} mb={18}>
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
														isMainNonNativePlaying && audioMainNonNative
															? true
															: false
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
												maxHeight: "450px",
												overflowX: "clip",
												overflowY: "clip",
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
							</Scrollbar>
						)}
						{view === "blank" && (
							<Box
								sx={{
									alignItems: "center",
									display: "flex",
									flexGrow: 1,
									flexDirection: "column",
									justifyContent: "center",
									overflow: "hidden",
								}}
							>
								<Avatar
									sx={{
										backgroundColor: "primary.main",
										color: "primary.contrastText",
										height: 56,
										width: 56,
										fontSize: 15,
										fontWeight: 900,
									}}
								>
									{"</>"}
								</Avatar>
								<Typography
									color="textSecondary"
									sx={{ mt: 2 }}
									variant="subtitle1"
								>
									Choose a word to start
								</Typography>
							</Box>
						)}
					</ChatInner>
				</Box>
			</Box>
		</>
	);
};

WordList.getLayout = (page) => (
	<AuthGuard>
		<DashboardLayout>{page}</DashboardLayout>
	</AuthGuard>
);

export default WordList;
