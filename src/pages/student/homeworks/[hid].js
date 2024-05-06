import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
	Box,
	//IconButton,
	Typography,
	Grid,
	useMediaQuery,
	Button,
	Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { ChatSidebar } from "../../../components/dashboard/chat/chatsidebar_homework";
import { MenuAlt4 as MenuAlt4Icon } from "../../../icons/menu-alt-4";
//import { gtm } from "../../../lib/gtm";
import { db, storage } from "../../../lib/firebase";
import { useAuth } from "../../../hooks/use-auth";
import { Scrollbar } from "../../../components/scrollbar";
import * as COLORMAPS from "../../../constants/colormaps";
import toast from "react-hot-toast";
import { useReactMediaRecorder } from "react-media-recorder"; //Library used for recording
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { v4 as uuidv4 } from "uuid";
import { LoadingButton } from "@mui/lab";
import SpectrogramPlugin from "../../../utils/spectogramPlugin";
import DOMPurify from "dompurify";

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
	//const specMainContainerRef = useRef(null);
	//const specMainRef = useRef(null);
	//const specRecordContainerRef = useRef(null);
	//const specRecordRef = useRef(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	/*const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"), {
		noSsr: false,
	});*/
	//Custom hooks
	//const [view, setView] = useState("blank"); //Variable to render a blank view first time rendered
	const [wordsIds, setWordsIds] = useState(null);
	const [fetchedIds, setFetchedIds] = useState(false);
	const [wordsFetched, setWordsFetched] = useState([]);
	const [homework, setHomework] = useState(null);
	const [loading, setLoading] = useState(false);
	const [answers, setAnswers] = useState([]);
	const [readyToSubmit, setReadyToSubmit] = useState(false);
	const [uploadedAudio, setUploadedAudio] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const fetchHomeworkDetails = async () => {
		try {
			await db
				.collection("assignments")
				.doc(homeworkId)
				.get()
				.then(async (docRef) => {
					setHomework(docRef.data());
					const words = docRef.data().words;
					setWordsIds(words);
				});
			setFetchedIds(true);
		} catch (err) {
			console.log(err.message);
		}
	};

	const fetchWordsDetails = async () => {
		try {
			const results = [];
			await db
				.collection("words")
				.where("__name__", "in", wordsIds)
				.get()
				.then(async (docRef) => {
					docRef.forEach((doc) => {
						results.push(doc.data());
					});
				});
			setWordsFetched(results);
		} catch (err) {
			console.log(err.message);
		}
	};

	const handleSetAnswer = async (obj) => {
		const tmp = answers;
		tmp[obj.position] = {
			answerAudioUrl: obj.answerAudioBlob,
			word: obj.word,
			count: obj.count,
		};

		function checkArr(arr) {
			const length = 0;
			arr.forEach((el) => {
				length += 1;
			});
			return length;
		}
		setAnswers(tmp);
		if (tmp.length != 0 && checkArr(tmp) === wordsFetched.length) {
			setReadyToSubmit(true);
		}
	};

	const uploadAudiosRecorded = async () => {
		const tmp_ = answers;
		const tmp_answers = [];
		tmp_.forEach(async (ans, pos) => {
			const uuid = await uuidv4();
			const uploadTask = storage.ref(`audio/${uuid}`).put(ans.answerAudioUrl);
			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					console.log(error);
				},
				() => {
					storage
						.ref("audio")
						.child(uuid)
						.getDownloadURL()
						.then(async (url) => {
							tmp_answers.push({ ...ans, answerAudioUrl: url });
							if (tmp_answers.length === answers.length) {
								setAnswers(tmp_answers);
								setUploadedAudio(true);
							}
						});
				}
			);
		});
	};

	const handleSubmit = async () => {
		try {
			//Save first the files and get a urlAUdio
			setIsSubmitting(true);
			await uploadAudiosRecorded();
			//Upload the audio first and will continue the submission once the urlAudio obtained
			//--> useEffect on state uploadedAudio to check if upload is done
		} catch (err) {
			console.error(err.message);
		}
	};

	/* TODO: timer counting up feature to time homework */
	const [displayTime, setDisplayTime] = useState("");
	const [time, setTime] = useState(0); // TODO: need to read and write this value to and from database so that we don't lose time spent on hw every time page is reloaded
	
	useEffect(() => {
		const intervalId = setInterval(() => {
		  setTime(prevTime => prevTime + 1); // increment by 1 second
		}, 1000); // every 1 second
		return () => clearInterval(intervalId); // cleanup
	  }, []); 

	useEffect(() => {
		var hours   = Math.floor(time / 3600);
		var minutes = Math.floor((time - (hours * 3600)) / 60);
		var seconds = time - (hours * 3600) - (minutes * 60);

		if (hours < 10) {
			hours   = "0"+hours;
		}
		if (minutes < 10) {
			minutes = "0"+minutes;
		}
		if (seconds < 10) {
			seconds = "0"+seconds;
		}
		setDisplayTime(hours+':'+minutes+':'+seconds);
	})

	/*------------------------------------Markup description------------------------------------*/
	const createMarkup = (html) => {
		return {
			__html: DOMPurify.sanitize(html),
		};
	};

	useEffect(() => {
		const continueSubmit = async () => {
			const tmp = {
				idStudent: user.id,
				answers,
			};
			let homework;
			await db
				.collection("assignments")
				.doc(homeworkId)
				.get()
				.then((snapshot) => {
					homework = snapshot.data();
				});
			const updatedStudents = homework.students.map((std) => {
				if (std.id === user.id) {
					return { 
						submitted: "yes", 
						id: user.id,
						timeTaken: displayTime,
					};
				} else {
					return std;
				}
			});
			const updatedStudentsAssignments = [
				...homework.studentsAssignements,
				tmp,
			];
			await db
				.collection("assignments")
				.doc(homeworkId)
				.update({
					students: updatedStudents.map((obj) => {
						return Object.assign({}, obj);
					}),
					studentsAssignements: updatedStudentsAssignments.map((obj) => {
						return Object.assign({}, obj);
					}),
				});
			setIsSubmitting(false);
			router.push(`/student/homeworks?cl=${homework.class}`);
		};
		if (uploadedAudio) {
			continueSubmit();
		}
	}, [uploadedAudio]);

	useEffect(() => {
		if (fetchedIds) {
			fetchWordsDetails();
		}
	}, [fetchedIds]);

	useEffect(() => {
		if (wordsFetched) {
			setLoading(false);
		}
	}, [wordsFetched]);
	useEffect(() => {
		//gtm.push({ event: "page_view" });
		//first time rendered component -->fetch the data
		fetchHomeworkDetails();
	}, []);

	//Hook when component will be unmounted
	useEffect(() => {
		return () => {
			if (status === "recording") {
				toast.dismiss();
				stopRecording();
			}
		};
	});

	/* 	useEffect(() => {
		if (!mdUp) {
			setIsSidebarOpen(false);
		} else {
			setIsSidebarOpen(true);
		}
	}, [mdUp]); */

	const handleCloseSidebar = () => {
		setIsSidebarOpen(false);
	};

	if (!router.isReady) {
		return null;
	}

	return (
		<>
			<Head>
				<title>Seeing is Believing</title>
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
						homework={homeworkId}
					/>
					{!loading && (
						<ChatInner open={isSidebarOpen}>
							<Scrollbar sx={{ maxHeight: "100%", pb: 10 }}>
								{homework && (
									<Grid item xs={12} px={3} mt={2}>
										<Typography variant="subtitle1" sx={{ display: "block" }}>
											Homework Description
										</Typography>
										
										<Typography
												variant="subtitle1"
												sx={{
													display: "inline",
													display: "flex",
												}}
											>
												Time Spent On This Assignment: &#160;
												<Typography color="textSecondary" variant="subtitle1">
													<em> {displayTime} </em>  
												</Typography>
											</Typography>
										<Grid item md={10}>
											<div
												style={{ color: "#65748B" }}
												dangerouslySetInnerHTML={createMarkup(
													homework.description
												)}
											></div>
										</Grid>
									</Grid>
								)}
								{wordsFetched.map((word, pos) => (
									<SubSection
										key={pos}
										word={word}
										position={pos}
										setAnswer={handleSetAnswer}
									/>
								))}
								<Grid item xs={8.5} mx={3}>		
									<LoadingButton
										fullWidth
										loading={isSubmitting}
										variant="contained"
										disabled={!readyToSubmit}
										onClick={handleSubmit}
									>
										Submit Homework
									</LoadingButton>
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
	const { word, setAnswer, position } = props;
	const [count, setCount] = useState(0); // TODO: gets updated when student is on page but is not written to database so reloading page wipes how many times you attempted a recording
	const specMainContainerRef = useRef(null);
	const specMainRef = useRef(null);
	const specMainNonNativeContainerRef = useRef(null);
	const specMainNonNativeRef = useRef(null);
	const specRecordContainerRef = useRef(null);
	const specRecordRef = useRef(null);
	const [audioMain, setAudioMain] = useState("");
	const [audioMainNonNative, setAudioMainNonNative] = useState("");
	const [isMainPlaying, setIsMainPlaying] = useState(false);
	const [isMainNonNativePlaying, setIsMainNonNativePlaying] = useState(false);
	const [audioRecord, setAudioRecord] = useState(null);
	const [isRecordedPlaying, setIsRecordedPlaying] = useState(false);
	const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
		useReactMediaRecorder({ audio: true });
		

	const showSpectroMain = async () => {
		try {
			const container = specMainContainerRef.current;
			const wavesurfer = WaveSurfer.create({ // TODO: problem with wavesurfer creation 
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
			{ icon: "🛑" }
		);
		startRecording();
	};

	const stopRecord = () => {
		setCount(count + 1);
		toast.dismiss();
		stopRecording();
	};

	const showSpectroRecord = async () => {
		const wavesurfer = WaveSurfer.create({
			container: specRecordContainerRef.current,
			fillParent: true,
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

	useEffect(() => {
		const getRecorderAudio = async () => {
			if (mediaBlobUrl && mediaBlobUrl != "") {
				let blob = await fetch(mediaBlobUrl)
					.then((r) => r.blob())
					.then(
						(blobFile) => new File([blobFile], "file", { type: "audio/wav" })
					);
				showSpectroRecord();
				const audio = new Audio(mediaBlobUrl);
				setAudioRecord(audio);
				//pass the answer to upper state
				setAnswer({
					answerAudioBlob: blob,
					position,
					word,
					count: count,
				});
			}
		};
		getRecorderAudio();
	}, [mediaBlobUrl]);

	/*------------------------------------Markup description------------------------------------*/
	const createMarkup = (html) => {
		return {
			__html: DOMPurify.sanitize(html),
		};
	};
	useEffect(() => {
		//update the component if a word is chosen
		if (specMainContainerRef.current) {
			showSpectroMain();
			const audio = new Audio(word.urlAudio);
			setAudioMain(audio);
		}
		if (specMainNonNativeContainerRef.current) {
			showSpectroMainNonNative();
			const audioNonNative = new Audio(word.urlAudioNonNative);
			setAudioMainNonNative(audioNonNative);
		}
	}, []);

	return (
		<Grid container item xs={12} direction="column">
			<Grid container item xs={6} pt={3}>
				<Grid item xs={12} px={3} sx={{ display: "flex" }}>
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
						Dialect :&#160;
						<Typography color="textSecondary" variant="subtitle1">
							<em>{word.dialect} </em>
						</Typography>
					</Typography>
				</Grid>
				<Grid xs={12} px={3} mt={2} item>
					<Typography variant="subtitle1" sx={{ display: "block" }}>
						Description
					</Typography>
					<Grid item md={10}>
						<div
							style={{ color: "#65748B" }}
							dangerouslySetInnerHTML={createMarkup(word.description)}
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
						{mediaBlobUrl && (
							<Button
								sx={{ mr: 2 }}
								onClick={playRecording}
								disabled={isRecordedPlaying}
								variant="contained"
								endIcon={<PlayArrowIcon sx={{ transform: "scale(1.2)" }} />}
							>
								Listen
							</Button>
						)}
						{status === "recording" ? (
							<Button
								onClick={stopRecord}
								variant="contained"
								endIcon={<StopIcon sx={{ transform: "scale(1.2)" }} />}
							>
								Stop
							</Button>
						) : (
							<><Button
								onClick={record}
								variant="contained"
								endIcon={<KeyboardVoiceIcon sx={{ transform: "scale(1.2)" }} />}
							>
								Record
							</Button><p>&nbsp;{count} attempts </p></>
						)}
					</Box>
				</Grid>

				{mediaBlobUrl && (
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
				)}
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
	);
};
Practice.getLayout = (page) => (
	<AuthGuard>
		<DashboardLayout>{page}</DashboardLayout>
	</AuthGuard>
);

export default Practice;
