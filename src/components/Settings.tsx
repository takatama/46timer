import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { TranslationType } from '../types';

interface SettingsProps {
  t: TranslationType;
  beansAmount: number;
  setBeansAmount: (amount: number) => void;
  roastLevel: string;
  setRoastLevel: (level: string) => void;
  flavor: string;
  setFlavor: (flavor: string) => void;
  strength: string;
  setStrength: (strength: string) => void;
}

const Settings: React.FC<SettingsProps> = ({
  t,
  beansAmount,
  setBeansAmount,
  roastLevel,
  setRoastLevel,
  flavor,
  setFlavor,
  strength,
  setStrength,
}) => {
  const getWaterTemperature = (roast: string) => {
    switch (roast) {
      case "light": return 93;
      case "dark": return 83;
      default: return 88;
    }
  };

  return (
    <Table sx={{
      '& td, & th': { fontSize: '1.1rem' },
      '& .MuiTableCell-root': {
        borderBottom: 'none',
        padding: '10px 16px',
      }
    }}>
      <TableBody>
        <TableRow>
          <TableCell align="right">
            {t.roastLevel}:
          </TableCell>
          <TableCell align="left">
            <ToggleButtonGroup
              value={roastLevel}
              exclusive
              onChange={(_e, newRoast) => { if (newRoast) setRoastLevel(newRoast); }}
              size="small"
              sx={{ '& .MuiToggleButton-root': { fontSize: '1.0rem' } }}
            >
              <ToggleButton value="light">{t.lightRoast}</ToggleButton>
              <ToggleButton value="medium">{t.mediumRoast}</ToggleButton>
              <ToggleButton value="dark">{t.darkRoast}</ToggleButton>
            </ToggleButtonGroup>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right">
            {t.waterTemp}:
          </TableCell>
          <TableCell align="left">
            {getWaterTemperature(roastLevel)}℃
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right">
            {t.beansAmount}:
          </TableCell>
          <TableCell align="left">
            <Button variant="outlined" onClick={() => setBeansAmount(beansAmount - 1)} disabled={beansAmount <= 1} size='small' sx={{ minWidth: '30px', padding: '5px' }}>
              <RemoveIcon fontSize="small" />
            </Button>
            <Box component="span" sx={{ mx: 1 }}>{beansAmount}g</Box>
            <Button variant="outlined" onClick={() => setBeansAmount(beansAmount + 1)} size='small' sx={{ minWidth: '30px', padding: '5px' }}>
              <AddIcon fontSize='small' />
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right">
            {t.waterVolume}:
          </TableCell>
          <TableCell align="left">
            {beansAmount * 15}ml
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right">
            {t.taste}:
          </TableCell>
          <TableCell align="left">
            <ToggleButtonGroup
              value={flavor}
              exclusive
              onChange={(_e, newFlavor) => { if (newFlavor) setFlavor(newFlavor); }}
              size="small"
              sx={{ '& .MuiToggleButton-root': { fontSize: '1.0rem' } }}
            >
              <ToggleButton value="sweet">{t.sweet}</ToggleButton>
              <ToggleButton value="balance">{t.balance}</ToggleButton>
              <ToggleButton value="sour">{t.sour}</ToggleButton>
            </ToggleButtonGroup>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right">
            {t.strength}:
          </TableCell>
          <TableCell align="left">
            <ToggleButtonGroup
              value={strength}
              exclusive
              onChange={(_e, newStrength) => { if (newStrength) setStrength(newStrength); }}
              size="small"
              sx={{ '& .MuiToggleButton-root': { fontSize: '1.0rem' } }}
            >
              <ToggleButton value="light">{t.light}</ToggleButton>
              <ToggleButton value="balance">{t.balance}</ToggleButton>
              <ToggleButton value="strong">{t.strong}</ToggleButton>
            </ToggleButtonGroup>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default Settings;
