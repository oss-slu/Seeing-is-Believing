import {useEffect, useState} from "react";
import Head from "next/head";
import NextLink from "next/link";

import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Container,
	Divider,
	Grid,
	Typography,
	Modal
} from "@mui/material";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import HomeworkCard from "../../components/dashboard/overview/homework-card";
import OverviewClasses from "../../components/student/home/OverviewClasses";
import YoutubeEmbed from "../../components/student/instructions/video";
import {ExternalLink as ExternalLinkIcon} from "../../icons/external-link";
import {InformationCircleOutlined as InformationCircleOutlinedIcon} from "../../icons/information-circle-outlined";
import homeworkImg from "../../assets/images/background1.jpg";
import practiceImg from "../../assets/images/background2.jpg";
import gradesImg from "../../assets/images/background3.jpg";
//import {gtm} from "../../lib/gtm";
import {db} from "../../lib/firebase";
import {useAuth} from "../../hooks/use-auth.js"
import {Modal1 as HelpForm} from '../../components/modals/modal-1'

const Overview = () => {
	const [displayBanner, setDisplayBanner] = useState(true);
	const {user} = useAuth()
	const [fetchedClasses,setFetchedClasses]=useState(null)
	const [languages,setLanguages]=useState(null)
	const [isFetching,setIsFetching]=useState(true)
	const [showHelpForm,setShowHelpForm]=useState(false);
	const youtubeStyle={
		alignItems:"center",
		margin:50,
	};
	const formatLTRText = (text) => `\u202A${text}\u202C`;
    const YoutubeEmbed = ({ embedId }) => (
        <div className="video-responsive">
          <iframe
            width="853"
            height="480"
            src={`https://www.youtube.com/embed/${embedId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
			style={youtubeStyle}
          />
        </div>
      );

  const fetchDataClasses= async()=>{
    const collection = await db.collection("classes");
    const results=[]
    await collection.where("students","array-contains",user.id)
      .get()
      .then(snapshot=>{
        if(snapshot)
        {snapshot.forEach(doc=>{
          results.push({id:doc.id,...doc.data()})
        })}
      })
        setFetchedClasses(results);
  }	

  useEffect(()=>{
		if(fetchedClasses){
			setIsFetching(false)
		}
  },[fetchedClasses])

	useEffect(() => {
		//gtm.push({event: "page_view"});
		fetchDataClasses();
	}, []);

	return (
		<Box>
			<Head>
				<title>Seeing-is-believing</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pt: 1,
					pb: 8,
				}}
			>

      <YoutubeEmbed embedId="_FatxGN3vAM" />

				<Container maxWidth="xl">
					<Grid container>




						<Grid item sx={{mt: 6}} xs={12}>
							<Card>
								<CardContent>
									<Box
										sx={{
											alignItems: "center",
											display: "flex",
										}}
									>
										<InformationCircleOutlinedIcon color="primary" />
										<Typography
											color="primary.main"
											sx={{pl: 1}}
											variant="subtitle2"
										>
											Help Center
										</Typography>
									</Box>
									<Typography sx={{mt: 2}} variant="h6">
										{formatLTRText("Need help figuring things out?")}
									</Typography>
									<Typography
										color="textSecondary"
										variant="body2"
									>
										{formatLTRText("In case there is something going wrong, please click below and let us know what went wrong.")}
									</Typography>
								</CardContent>
								<Divider />
								<CardActions>
									<Button
										onClick={() => {
											setShowHelpForm(true);
										}}
										endIcon={
											<ExternalLinkIcon fontSize="small" />
										}
										size="small"
									>
										Help Center
									</Button>
								</CardActions>
							</Card>
						</Grid>
						<Modal
							open={showHelpForm}
							onClose={() => {
								setShowHelpForm(false);
							}}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
							sx={{backgroundColor: "transparent"}}
						>
							<Box sx={style}>
								<HelpForm
									close={() => {
										setShowHelpForm(false);
									}}
								/>
							</Box>
						</Modal>
					</Grid>
				</Container>
			</Box>
		</Box>
	);
};

Overview.getLayout = (page) => (
	<AuthGuard>
		<DashboardLayout>{page}</DashboardLayout>
	</AuthGuard>
);

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	boxShadow: 24,
	p: 4,
};
export default Overview;