export function calculateWebPAScores(
    data: (number | undefined)[][],
    groupMark: number,
    paWeight = 1.0,
    nonCompletionPenalty = 0
): {
    webpaScores: number[];
    finalGrades: number[];
} {
    const numStudents = data.length;

    // Determine which participants submitted marks
    const submitted = data.map(row => row.some(v => typeof v === "number" && !Number.isNaN(v)));
    const numSubmitted = submitted.filter(Boolean).length;
    const fudgeFactor = numSubmitted > 0 ? numStudents / numSubmitted : 1;

    // Normalize each student's ratings
    const normalized: number[][] = data.map((row) => {
        const validValues = row.map(v => (typeof v === "number" && !Number.isNaN(v)) ? v : 0);
        const total = validValues.reduce((sum, v) => sum + v, 0);
        return total === 0 ? Array(numStudents).fill(0) : validValues.map(v => v / total);
    });

    // Sum up the received fractional scores
    const received = Array(numStudents).fill(0);
    for (let giver = 0; giver < numStudents; giver++) {
        for (let receiver = 0; receiver < numStudents; receiver++) {
            received[receiver] += normalized[giver][receiver];
        }
    }

    const webpaScores = received.map(v => +(v * fudgeFactor).toFixed(2));

    const finalGrades = webpaScores.map((score, i) => {
        const weighted = paWeight * groupMark * score;
        const fixed = (1 - paWeight) * groupMark;
        let grade = weighted + fixed;
        if (!submitted[i]) grade -= nonCompletionPenalty;
        return Math.min(100, +grade.toFixed(2));
    });

    return { webpaScores, finalGrades };
}
