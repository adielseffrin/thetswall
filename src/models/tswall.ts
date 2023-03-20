import { BallColor } from "../enums/ball-color";
import { RoundDificulty } from "../enums/round-dificulty";
import { RowType } from "../enums/row-type";
import { QuizApiService } from "../services/quiz.service";
import { Ball } from "./ball";
import { Question } from "./quizApi/question";
import { QuestionInterface } from "./quizApi/question.interface";
import { RoundConfig } from "./roundConfig";
import { Rounds } from "./rounds";
import { Row } from "./row";
import { Values } from "./values";

export class TsWall{
    public rowTypes : Array<RowType> = new Array<RowType>();
    
    private rowValues = new Values();
    public maxOddCol = 14;
    public ballsInGame : Array<Ball> = new Array<Ball>();
    public board: Array<Row>;
    public ballColor : BallColor;
    public isAnswerCorrect: boolean;
    public aggregateTotal : number;

    public question : Question | null = null;

    /* Buttons */
    private _newRoundButton = document.querySelector('#newRoundButton') as HTMLButtonElement;
    private _showAlternativesButton = document.querySelector('#showAlternativesButton') as HTMLButtonElement;
    private _showQuestionButton = document.querySelector('#showQuestionButton') as HTMLButtonElement;
    private _setBallPositionButton = document.querySelector('#setBallPositionButton') as HTMLButtonElement;
    private _evaluateButton = document.querySelector('#evaluateButton') as HTMLButtonElement;
    private _playButton = document.querySelector('#playButton') as HTMLButtonElement;
    

    private _quizService : QuizApiService;

    private rounds: Rounds = new Rounds();
    private roundNumber = 0;
    private currentRoundConfig : RoundConfig|undefined = undefined;


    constructor(){
        this.rowTypes.push(...[RowType.odd,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.odd]);

        this.ballColor = BallColor.white;
        this.aggregateTotal = 0;
        this.isAnswerCorrect = false;
        this.board = new Array<Row>();
        this._quizService = new QuizApiService();

        this._setButtonsActions();
        this.setGame();
        this.setRounds();
    }

    private _setButtonsActions(){
        
        this._playButton.addEventListener('click', () => {
            this.question?.hideQuestionBox();
            this.play();
        })
        
        this._evaluateButton.addEventListener('click', () => {
            this.evaluateAnswers();
            this._evaluateButton.disabled = true;
            this._playButton.disabled = false;
        })
        
        /* === NOVOS BOTOES ==*/
        //TODO check round to get difficulty
        this._newRoundButton.addEventListener('click', () => {
            this.setNewRound();
        })

        this._showAlternativesButton.addEventListener('click', async () => {
            this.getQuestion();
            if(this.currentRoundConfig?.externalRoundNumber != undefined){
                this.paintToolbar()
            }
            this._showAlternativesButton.disabled = true;
            if((this.currentRoundConfig?.ballPositions.length??0) > 0){
                this._showQuestionButton.disabled = false;
            }
        })

        this._showQuestionButton?.addEventListener('click', () => {
            this._showQuestionButton.disabled = true;
            if(this.question != null){
                this.question.showQuestion();
            }
            if(!this.doesUserSetPosition() && this.currentRoundConfig?.hasQuestion){
                this._evaluateButton.disabled = false;
            }
            
        })

        document.querySelectorAll('input[name="multiple_squares"]').forEach(x => {
            x?.addEventListener('click', () => {
                if(this.canShowQuestion()){
                    this._showQuestionButton.disabled = false; 
                }
            })
        });

        document.querySelectorAll('.clickable-element').forEach(x => {
            x.addEventListener('click', y => {
                this.clickableElementAction(y);
            })
        })

        this._setBallPositionButton.addEventListener('click', async () => {
            this.setBallsPosition();
        })
    }

    public clickableElementAction(x: any){
        let elementId = x.srcElement.id;
        let parentId = x.srcElement.parentElement.id;

        let currentId = Number((elementId == '' ? parentId : elementId).split('_')[1])-3;
        let element = document.getElementById(`square_${currentId}`) as HTMLInputElement;

        if(!element.disabled){
            element.checked = true;
        }
        this.setBallsPosition();
        if(this.canShowQuestion()){
            this._showQuestionButton.disabled = false; 
        }
    }

    public setGame():void{
        this.rowTypes.forEach((t,i) => {
            this.board.push(new Row(t,i,t==RowType.odd?this.maxOddCol:this.maxOddCol+1));
        })
        // this.currentRowValues = this.rowValues1;

        // document.querySelectorAll(".last-row .col span.label").forEach((e,i) => {
        //     e.innerHTML = this.currentRowValues[i].toString();
        // });
    }

    private setRounds(){
        this.rounds.addRound({externalRoundNumber: 1, ballPositions: [1,4,7], ballMultiplier:2, roundDificulty: RoundDificulty.easy});
        this.rounds.addRound({externalRoundNumber: 2, ballPositions: [1,4,7], ballMultiplier:2, roundDificulty: RoundDificulty.easy});
        this.rounds.addRound({externalRoundNumber: 3, ballPositions: [1,4,7], ballMultiplier:2, roundDificulty: RoundDificulty.easy});
        this.rounds.addRound({externalRoundNumber: 4, ballPositions: [1,4,7], ballMultiplier:2, roundDificulty: RoundDificulty.easy});
        
        this.rounds.addRound({ballMultiplier:1, roundDificulty: RoundDificulty.medium, hasQuestion: false, ballColor: BallColor.green, ballPositions: [1,2,3,4,5,6,7]});
                
        this.rounds.addRound({externalRoundNumber: 5, roundDificulty: RoundDificulty.medium, hasQuestion: true, ballMultiplier: 1});
        this.rounds.addRound({externalRoundNumber: 6, roundDificulty: RoundDificulty.medium, hasQuestion: true, ballMultiplier: 2});
        this.rounds.addRound({externalRoundNumber: 7, roundDificulty: RoundDificulty.medium, hasQuestion: true, ballMultiplier: 3});
        
        this.rounds.addRound({ballMultiplier:1, roundDificulty: RoundDificulty.medium, hasQuestion: false, ballColor: BallColor.red, ballPositions: [1,2,3,4,5,6,7]});

        let rn1 = this.rounds.addRound({ballMultiplier:1, roundDificulty: RoundDificulty.hard, hasQuestion: false, ballColor: BallColor.green});
        let rn2 = this.rounds.addRound({ballMultiplier:1, roundDificulty: RoundDificulty.hard, hasQuestion: false, ballColor: BallColor.green});
        let rn3 = this.rounds.addRound({ballMultiplier:1, roundDificulty: RoundDificulty.hard, hasQuestion: false, ballColor: BallColor.green});
        
        this.rounds.addRound({externalRoundNumber: 8, roundDificulty: RoundDificulty.hard, hasQuestion: true, ballMultiplier: 1});
        this.rounds.addRound({externalRoundNumber: 9, roundDificulty: RoundDificulty.hard, hasQuestion: true, ballMultiplier: 2});
        this.rounds.addRound({externalRoundNumber: 10, roundDificulty: RoundDificulty.hard, hasQuestion: true, ballMultiplier: 3});

        this.rounds.addRound({ballMultiplier:1, roundDificulty: RoundDificulty.hard, hasQuestion: false, ballColor: BallColor.red, copyBallPositionFrom: rn1, playable: false});
        this.rounds.addRound({ballMultiplier:1, roundDificulty: RoundDificulty.hard, hasQuestion: false, ballColor: BallColor.red, copyBallPositionFrom: rn2, playable: false});
        this.rounds.addRound({ballMultiplier:1, roundDificulty: RoundDificulty.hard, hasQuestion: false, ballColor: BallColor.red, copyBallPositionFrom: rn3, playable: false});
        
    }

    private setBallsPosition(){
        this.ballsInGame = new Array<Ball>();
        this.ballColor = BallColor.white;
        this.useUserBallPosition();
        if(this.currentRoundConfig?.hasQuestion){
            this._evaluateButton.disabled = false;
        }else{
            this._playButton.disabled = false;
        }
        this._setBallPositionButton.disabled = true;
    }

    /*new methods*/
    private setNewRound(){
        this.roundNumber++;
        this.resetButtonForPlay();
        this.uncheckBallSelection();
        if(this.roundNumber != 1){
            this.clearBoard()
        }
        this.currentRoundConfig = this.rounds.getRound(this.roundNumber);
        let element = document.querySelector('.round_counter span');
        if(element){
            element.innerHTML = this.roundNumber.toString();
        }
        this.checkBallSelection();
        this.setRoundValues();
        
        if(this.haveRoundQuestion()){
            this._showAlternativesButton.disabled = false;
        }else{
            this.isAnswerCorrect = this.currentRoundConfig?.ballColor == BallColor.green;
        }

        if(this.roundNumber == this.rounds.getTotalRounds()){
            this._newRoundButton.disabled = true;
        }
    }

    private resetButtonForPlay(){
        this._showAlternativesButton.disabled = true;
        this._showQuestionButton.disabled = true;
        this._setBallPositionButton.disabled = true;
        this._evaluateButton.disabled = true;
        this._playButton.disabled = true;
    }

    private checkBallSelection(){
        if(!this.doesUserSetPosition()){
            this.disableBallSelection();
            this.disableSetBallPostionButton();
            this.usePredefinedBallPosition();
        }else{
            this.enableBallSelection();
            this.enableSetBallPostionButton();
        }
    }

    private doesUserSetPosition(){
        return (this.currentRoundConfig?.ballPositions.length??0) == 0 && this.currentRoundConfig?.copyBallPositionFrom == undefined;
    }

    private disableBallSelection(){
        document.querySelectorAll('input[name="multiple_squares"]').forEach(x => {
            x.setAttribute('disabled','disabled');
            
        });
    }
    
    private enableBallSelection(){
        document.querySelectorAll('input[name="multiple_squares"]').forEach(x => {
            x.removeAttribute('disabled');
        });
    }

    private uncheckBallSelection(){
        document.querySelectorAll('input[name="multiple_squares"]').forEach(x => {
            (x as HTMLInputElement).checked = false;
        });
    }

    private disableSetBallPostionButton(){
        this._setBallPositionButton.disabled = true;
    }
    
    private enableSetBallPostionButton(){
        this._setBallPositionButton.disabled = false;
    }

    private haveRoundQuestion(){
        return this.currentRoundConfig?.hasQuestion;
    }
    
    private setRoundValues(){
        if(this.currentRoundConfig){
            let difficulty = this.currentRoundConfig.roundDificulty;
            let rowValues = this.rowValues.getValues(difficulty);
            document.querySelectorAll(".last-row .col span.label").forEach((e,i) => {
                e.innerHTML = rowValues[i].toString();
            });
        }
    }

    private usePredefinedBallPosition(){
        this.hasCallback()
        this.currentRoundConfig?.ballPositions.forEach(el => {
            this.ballsInGame.push(new Ball(this.rowTypes, this.maxOddCol, el + 3, (this.currentRoundConfig?.ballColor as BallColor).toString(), this.board ));
            this.board[0].squares[el + 3 ].isFree = false;
        })
    }

    private hasCallback(){
        let copyFrom = this.currentRoundConfig?.copyBallPositionFrom;
        if(copyFrom != undefined){
            let position = this.rounds.getRound(copyFrom)?.ballPositions[0] as number;
            this.currentRoundConfig?.ballPositions.push(position);
        }
        this._playButton.disabled = false;
    }

    private useUserBallPosition(){
        let multipleBalls = document.querySelectorAll('input[name="multiple_squares"]:checked');
        if(this.currentRoundConfig?.ballColor != BallColor.white){
            this.ballColor = this.currentRoundConfig?.ballColor??BallColor.white;
        }
        multipleBalls.forEach(b => {
            let el = b as HTMLInputElement;
            this.ballsInGame.push(new Ball(this.rowTypes, this.maxOddCol, Number(el.value) + 3, this.ballColor, this.board ));
            this.currentRoundConfig?.ballPositions.push(Number(el.value));
            this.board[0].squares[Number(el.value) + 3 ].isFree = false;
        })

    }

    private canShowQuestion(){
        return document.querySelectorAll('input[name="multiple_squares"]:checked').length > 0 && this.currentRoundConfig?.hasQuestion;
    }
    /*new methods*/
    private async getQuestion():Promise<void>{
        try{
            await this.getQuestion2()
            .then(() => this.question?.showPossibleAnswers())
        }catch(err){
            this.getQuestion();
        }
        
    }

    private async getQuestion2():Promise<void>{
            await this._quizService.getQuestion()
            .then(r => {
                if(Boolean(r)){
                    let questionResponses = (r as unknown) as Array<QuestionInterface>;
                    this.question = new Question(questionResponses[0] as QuestionInterface);
                    if(!this.question.isQuestionValid()){
                        throw new Error('invalidQuestion');
                    }
                }
            })
            .catch(err => {
                console.log(err)    
            })
    }

    public setStart():boolean{
        this.ballsInGame = new Array<Ball>();
        let multipleBalls = document.querySelectorAll('input[name="multiple_squares"]:checked');
        this.ballColor = BallColor.white;

        multipleBalls.forEach(b => {
            let el = b as HTMLInputElement;
            this.ballsInGame.push(new Ball(this.rowTypes, this.maxOddCol, Number(el.value) + 3, this.ballColor, this.board ));
            this.board[0].squares[Number(el.value) + 3 ].isFree = false;
        })
        return this.ballsInGame.length > 0;
    }

    public evaluateAnswers():void{
        const selectedAnswer = Number(document.querySelector("input[name='possible-answers']:checked")?.id.split('-')[1]);
        let correctAsnwerId = this.question?.getCorrectAsnwerId();
        this.isAnswerCorrect = selectedAnswer == correctAsnwerId;
        this.question?.highLigthCorrectAnswer();

        if(this.isAnswerCorrect){
            this.ballColor = BallColor.green;
        }else{
            this.ballColor = BallColor.red; 
        }
        this.ballsInGame.forEach(b => {
            b.changeBallColor(this.ballColor);
        })
        this._playButton.disabled = false;
        if(this.currentRoundConfig?.externalRoundNumber != undefined){
            this.paintToolbar(this.isAnswerCorrect)
        }
    }

    private paintToolbar(status: boolean | undefined = undefined){
        let elementId = `round-${this.currentRoundConfig?.externalRoundNumber}`;
        let style : string = "";
        switch(status){
            case undefined:
                style = "ongoing";
                break;
            case true:
                style = "correct";
                break;
            case false:
                style = "incorrect";
                break;
        }
        document.querySelector(`.info > .rounds > #${elementId}`)?.classList.remove("ongoing");
        document.querySelector(`.info > .rounds > #${elementId}`)?.classList.add(style);
    }

    public play():void{
        const totalTime = (this.rowTypes.length + this.ballsInGame.length-1) * 250;
        this.ballsInGame.forEach(b => b.makeTrace());
        this.ballsInGame.sort(() => Math.floor(Math.random()*100)-Math.floor(Math.random()*100) );
        this._playButton.disabled = true;

        for(let i = 0; i < this.ballsInGame.length; ++i){
            setTimeout(() => this.ballsInGame[i].paintTrace(),300*i);
        };
        
        setTimeout(() => {
            const positions = this.getFinalPositions();
            let total = 0;
            let multiplier = 0;
            if(this.isAnswerCorrect){
                multiplier = 1;
            }else{
                multiplier = -1;
            }
            if(this.currentRoundConfig != undefined){
                let config = this.currentRoundConfig as RoundConfig;
                positions.forEach((el:Array<number>) => total += this.rowValues.getValues(config.roundDificulty)[el[1]]*multiplier);

            }
            
            this.aggregateTotal = Math.max(this.aggregateTotal + total,0);
            let roundPointsElement = document.querySelector('.round-points span');
            let totalPointsElement = document.querySelector('.total-points span');

            if(roundPointsElement != null){
                roundPointsElement.innerHTML = total.toString();
            }

            if(totalPointsElement != null){
                totalPointsElement.innerHTML = this.aggregateTotal.toString();
            }
            // this._showAlternativesButton.disabled = false;

        },totalTime);
    }

    clearBoard(){
        this.ballsInGame.forEach(x => x.eraseBall());
        this.ballsInGame.length = 0;
    }

    getFinalPositions():Array<Array<number>>{
        let positions:Array<Array<number>> = new Array<Array<number>>();
        this.ballsInGame.forEach(b => {
            positions.push(b.getFinalPosition())
        })
        return positions;
    }
}