import { Answer } from "./answer";
import { QuestionInterface } from "./question.interface";

export class Question implements QuestionInterface{
    public id: number;
    public question: string;
    public description: string;
    public answers: object;
    public correct_answers: object;
    public answersArray?: Array<Answer>;
    public multiple_correct_answers: boolean;
    

    constructor(question: QuestionInterface){
        this.id = question.id;
        this.question = question.question;
        this.answers = question.answers;
        this.description = question.description;
        this.correct_answers = question.correct_answers;
        this.multiple_correct_answers = question.multiple_correct_answers;
        
        this.answersArray = new Array<Answer>();

        Object.values(question.answers).filter(x => x != null).forEach((el,i) => {
            this.answersArray?.push(new Answer({description: el, isCorrect: Object.values(this.correct_answers)[i] == 'true'}))
        })

        console.log(this)
    }

    
}