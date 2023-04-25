import Image from 'next/image';
import { Box, Card, Typography,Grow} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CardHeader = (props) => {
  const theme = useTheme();

  return (
		<Grow in>
			<Card {...props}>
				<Box
					sx={{
						alignItems: {
							sm: "center",
						},
						cursor: "pointer",
						display: "flex",
						flexWrap: "wrap",
						flexDirection: {
							xs: "column",
							sm: "row",
						},
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Image
							alt="Homework"
							src={props.image}
							placeholder="blur"
							fullWidth
							height={props.heightImg}
							style={{filter: 'contrast(100%)',transform:'scale(1)'}}
						/>
						<Typography
							sx={{
								position: "absolute",
								mt: 1,
								ml: 1.5,
								color: "neutral.100",
								fontSize: "1.6rem",
								letterSpacing:0.4,
								fontWeight: "800",
							}}
						>
							{props.title}
						</Typography>
					</Box>
				</Box>
			</Card>
		</Grow>
  );
};


export default CardHeader;