import DEFINE_SCORE from "../constants/score";

const getScoreFromExam = (level) => {
  if(level === "EASY") return DEFINE_SCORE.EASY;
  if(level === "MEDIUM") return DEFINE_SCORE.MEDIUM;
  if(level === "HARD") return DEFINE_SCORE.HARD;
}

export default getScoreFromExam;