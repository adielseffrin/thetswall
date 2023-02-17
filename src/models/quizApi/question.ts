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

	private _questionBox = document.querySelector('.question-box');
    

    constructor(question: QuestionInterface){
        this.id = question.id;
        this.question = question.question;
        this.answers = question.answers;
        this.description = question.description;
        this.correct_answers = question.correct_answers;
        this.multiple_correct_answers = question.multiple_correct_answers;
        
        this.answersArray = new Array<Answer>();

        Object.values(question.answers).filter(x => x != null).forEach((el,i) => {
            this.answersArray?.push(new Answer({description: el, isCorrect: Object.values(this.correct_answers)[i] == 'true', id:i}))
        })

        console.log(this)
    }

	showQuestion(){
		let questionArea = document.querySelector('.question-box > .question-area');
		if(questionArea != null){
			questionArea.innerHTML = this.question;
		}
	}
	showPossibleAnswers(){
		
		let answersArea = document.querySelector('.question-box > .answers-area');
		let questionArea = document.querySelector('.question-box > .question-area');
		
		if(answersArea != null){
			answersArea.innerHTML = '';
		}

		if(questionArea != null){
			questionArea.innerHTML = '';
		}

		if(answersArea != null){
			let input = document.createElement('div');
			this.answersArray?.forEach((el,i) => {
				let answerContainer = document.createElement('div');
				answerContainer.setAttribute('data-id',`answer-${i}`);
				answerContainer.classList.add('asnwer-container');

				let radio = document.createElement('input');
				let label = document.createElement(`label`);
				label.textContent = el.description;
				label.htmlFor = `answer-${i}`;
				
				radio.type = "radio";
				radio.name="possible-answers";
				radio.setAttribute('data-id',`answer-${i}`);
				radio.id = `answer-${i}`
				
				answerContainer.appendChild(radio);
				answerContainer.appendChild(label);
				input.appendChild(answerContainer);

			})
			answersArea.appendChild(input);
		}
		this._questionBox?.classList.remove('hidden');
	}
	getCorrectAsnwerId(){
		return this.answersArray?.filter(x => x.isCorrect)[0].id;
	}
	highLigthCorrectAnswer(){
		let correctAnswerId = `answer-${this.getCorrectAsnwerId()}`
		document.querySelector(`div[data-id=${correctAnswerId}]`)?.classList.add('highlighted');
	}
	hideQuestionBox(){
		this._questionBox?.classList.add('hidden');
	}

    
}