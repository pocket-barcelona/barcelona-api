import dynamoose from "dynamoose";

export type PollQuestionsInput = QuestionInput[];

export type PollQuestions = Question[];

export interface Answer {
  responseId: string;
  answers: string[];
}

export interface PossibleAnswerInput {
  content: string;
}
export interface PossibleAnswer {
  id: string;
  content: string;
  addedByResponseId?: string;
}

export interface QuestionInput {
  content: string;
  description?: string;
  customAnswers?: boolean;
  possibleAnswers: PossibleAnswerInput[];
}

export interface Question {
  id: string;
  content: string;
  description?: string;
  customAnswers: boolean;
  possibleAnswers: PossibleAnswer[];
  answers: Answer[];
}

export type PollResults = QuestionResult[];

export interface QuestionResult {
  questionContent: string;
  answers: QuestionResultAnswer[];
}

export interface QuestionResultAnswer {
  answerContent: string;
  answerCreatedBy?: string;
  votes?: AnswerVote[];
}

export interface AnswerVote {
  name: string;
  avatar?: string;
}

const answerSchema = new dynamoose.Schema({
  responseId: {
    type: String,
  },
  answers: {
    type: Array,
    schema: [
      {
        type: String,
      },
    ],
  },
});

const possibleAnswerSchema = new dynamoose.Schema({
  id: {
    type: String,
  },
  content: {
    type: String,
  },
  addedByResponseId: {
    type: String,
    required: false,
  },
});

export const questionSchema = new dynamoose.Schema({
  id: {
    type: String,
  },
  content: {
    type: String,
  },
  description: {
    type: String,
    required: false,
  },
  customAnswers: {
    type: Boolean,
  },
  possibleAnswers: {
    type: Array,
    schema: [possibleAnswerSchema],
  },
  answers: {
    type: Array,
    schema: [answerSchema],
  },
});
