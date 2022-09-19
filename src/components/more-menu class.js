import { useEffect, useRef, useState } from 'react';
import {useRouter} from 'next/router';
import { ListItemIcon, ListItemText, Tooltip, IconButton, Menu, MenuItem } from '@mui/material';
import { Archive as ArchiveIcon } from '../icons/archive';
import { DocumentText as DocumentTextIcon } from '../icons/document-text';
import { DotsHorizontal as DotsHorizontalIcon } from '../icons/dots-horizontal';
import { Download as DownloadIcon } from '../icons/download';
import { Duplicate as DuplicateIcon } from '../icons/duplicate';

export const MoreMenu = (props) => {
  const router=useRouter();
  const anchorRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const {options,classId}=props;

  const handleMenuOpen = () => {
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  return (
		<>
			<Tooltip title="More options">
				<IconButton onClick={handleMenuOpen} ref={anchorRef} {...props}>
					<DotsHorizontalIcon fontSize="small" />
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={anchorRef.current}
				anchorOrigin={{
					horizontal: "left",
					vertical: "bottom",
				}}
				onClose={handleMenuClose}
				open={openMenu}
				PaperProps={{
					sx: {
						maxWidth: "100%",
						width: 256,
					},
				}}
				transformOrigin={{
					horizontal: "left",
					vertical: "top",
				}}
			>
				{
					options.map((el,pos)=>(
						<MenuItem key={pos}>
					<ListItemText
						onClick={() => {
							router.push(el.link);
						}}
						secondary={el.display}
					/>
				</MenuItem>	
					))
				}
			</Menu>
		</>
  );
};
