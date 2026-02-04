import { useState } from "react";
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

import type { GradeResponse } from "./types/types";
import { url } from "./constants/constants";
import ScoreBox from "./components/scoreBox";

const App = () => {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [result, setResult] = useState<GradeResponse | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

const handleButtonSubmit = async () => {
  setIsLoading(true);
  setIsSubmitted(false);

  const payload = { textA, textB };

  console.log('SUBMIT:', payload);

  const res = await axios.post<GradeResponse>(
    `${url}/api/grade/total/text`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('RESPONSE:', res.data);

  setResult(res.data);
  setIsSubmitted(true);
  setIsLoading(false);
};


  const handleTextAChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTextA(e.target.value);
  };

  const handleTextBChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTextB(e.target.value);
  };

  return (
    <Box maxWidth={800} mx="auto" mt={5}>
      <Typography variant="h5" mb={2}>
        Αξιολόγηση Απάντησης
      </Typography>

      <TextField
        label="Απάντηση μαθητή"
        multiline
        rows={6}
        fullWidth
        value={textA}
        onChange={handleTextAChange}
        sx={{
          mb: 3,
          backgroundColor:
            result && result.scores.total > 65 ? "#e6f7ec" : undefined,
        }}
      />

      <TextField
        label="Προτεινόμενη απάντηση"
        multiline
        rows={6}
        fullWidth
        value={textB}
        onChange={handleTextBChange}
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        onClick={handleButtonSubmit}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={22} /> : "Υποβολή"}
      </Button>

      {isSubmitted && result && (
        <Paper sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" mb={2}>
            Αποτελέσματα
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            <ScoreBox label="Σύνολο" value={result.scores.total} highlight />
            <ScoreBox label="Cosine" value={result.scores.cosine} />
            <ScoreBox label="BM25" value={result.scores.bm25} />
            <ScoreBox label="Bullets" value={result.scores.bullets} />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default App;
