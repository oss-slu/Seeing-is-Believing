import Image from 'next/image';
import { Avatar, Box, Button, Card, CardActions, Divider, Typography,Grow} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import { ChevronUp as ChevronUpIcon } from '../../../icons/chevron-up';
import { DocumentText as DocumentIcon } from '../../../icons/document-text';

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