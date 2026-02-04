import { Paper, Typography } from "@mui/material";

type ScoreBoxProps = {
  label: string;
  value: number;
  highlight?: boolean;
};

const ScoreBox = ({ label, value, highlight }: ScoreBoxProps) => (
  <Paper
    sx={{
      p: 2,
      minWidth: 120,
      textAlign: 'center',
      backgroundColor: highlight && value > 65 ? '#e6f7ec' : undefined,
    }}
  >
    <Typography variant="body2">{label}</Typography>
    <Typography variant="h6">{value}</Typography>
  </Paper>
);

export default ScoreBox
