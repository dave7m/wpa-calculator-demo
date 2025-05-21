import { useMemo, useState} from "react";
import {calculateWebPAScores} from "./utils.ts";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    TextField,
    Typography
} from "@mui/material";

const initialNames = ["Alice", "Bob", "Claire", "David", "Elaine"];


const WebPACalculator = () => {
    const [numStudents, setNumStudents] = useState(5);
    const [groupMark, setGroupMark] = useState(80);
    const [ratings, setRatings] = useState<number[][]>(
        Array(5).fill(0).map(() => Array(5).fill(0))
    );

    const updateRating = (i: number, j: number, val: number) => {
        const next = [...ratings];
        next[i][j] = val;
        setRatings(next);
    };

    const { webpaScores, finalGrades } = useMemo(() => calculateWebPAScores(
        ratings.slice(0, numStudents).map(r => r.slice(0, numStudents)).map(r => r.map(t => t || undefined)),
        groupMark
    ), [ratings, numStudents, groupMark]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor={`rgba(234, 225, 225, 0.66)`}
        >
        <Box p={4} width="60%" display={"flex"} flexDirection={"column"} >
            <Typography variant="h4" gutterBottom>WebPA Calculator</Typography>

            <Box mb={2} display="flex" gap={4} alignItems="center">
                <TextField
                    label="Group Mark"
                    type="number"
                    value={groupMark}
                    onChange={e => setGroupMark(+e.target.value)}
                />
                <FormControl>
                    <InputLabel>Participants</InputLabel>
                    <Select value={numStudents} label="Participants" onChange={e => setNumStudents(+e.target.value)}>
                        {[3, 4, 5].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 4 }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>From \ To</TableCell>
                            {initialNames.slice(0, numStudents).map(name => (
                                <TableCell key={name}>{name}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {initialNames.slice(0, numStudents).map((from, i) => (
                            <TableRow key={from}>
                                <TableCell>{from}</TableCell>
                                {initialNames.slice(0, numStudents).map((_, j) => (
                                    <TableCell key={j}>
                                        <TextField
                                            type="number"
                                            value={ratings[i][j]}
                                            onChange={e => updateRating(i, j, parseFloat(e.target.value) || 0)}
                                            size="small"
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h6">WebPA Scores</Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>WebPA Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {webpaScores.map((score, i) => (
                            <TableRow key={i}>
                                <TableCell>{initialNames[i]}</TableCell>
                                <TableCell>{score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h6">Final Grades</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Final Grade</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {finalGrades.map((grade, i) => (
                            <TableRow key={i}>
                                <TableCell>{initialNames[i]}</TableCell>
                                <TableCell>{grade}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        </Box>
    );
};

export default WebPACalculator;