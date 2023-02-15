export interface QuestionInterface{
    id: number;
    question: string;
    description: string;
    answers: object;
    correct_answers: object;
    multiple_correct_answers: boolean;
}