import { BallColor } from "../enums/ball-color";
import { RowType } from "../enums/row-type";
import { Ball } from "./ball";
import { Row } from "./row";

export class TsWall{
    public rowTypes : Array<RowType> = new Array<RowType>();
    
    public currentRowValues: Array<number> = new Array<number>();
    public rowValues1: Array<number> = [1,1000,100,300,10,1500,1,4000,1,1500,10,30000,100,1000,1];
    public rowValues2: Array<number> = [1,10000,100,15000,10,30000,1,45000,1,50000,10,75000,100,15000,1];

    public maxOddCol = 14;
    public ballsInGame : Array<Ball> = new Array<Ball>();
    public board: Array<Row>;
    public ballColor : BallColor;
    public isAnswerCorrect: boolean;
    public aggregateTotal : number;

    /* Buttons */
    private _playButton = document.querySelector('#playButton') as HTMLButtonElement;
    private _prepareButton = document.querySelector('#prepareButton') as HTMLButtonElement;
    private _evaluateButton = document.querySelector('#evaluateButton') as HTMLButtonElement;
    private _clearButton = document.querySelector('#clearButton') as HTMLButtonElement;
    private _allButton = document.querySelector('#allButton') as HTMLButtonElement;
    private _changeValuesButton = document.querySelector('#changeValuesButton') as HTMLButtonElement;

    constructor(){
        this.rowTypes.push(...[RowType.odd,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.even,RowType.odd,RowType.odd]);

        this.ballColor = BallColor.white;
        this.aggregateTotal = 0;
        this.isAnswerCorrect = false;
        this.board = new Array<Row>();
        this._setButtonsActions();
        this.setGame();
    }

    public setGame():void{
        this.rowTypes.forEach((t,i) => {
            this.board.push(new Row(t,i,t==RowType.odd?this.maxOddCol:this.maxOddCol+1));
        })
        this.currentRowValues = this.rowValues1;

        document.querySelectorAll(".last-row .col span.label").forEach((e,i) => {
            e.innerHTML = this.currentRowValues[i].toString();
        });
    }

    private _setButtonsActions(){
        
        this._playButton.addEventListener('click', () => {
            this.play();
        })
        
        this._allButton.addEventListener('click', () => {
            document.querySelectorAll("input[name='multiple_squares']").forEach(e => {
                let el = e as HTMLInputElement;
                el.checked = true;
            });
        })
        
        this._changeValuesButton.addEventListener('click', () => {
            document.querySelectorAll(".last-row .col span.label").forEach((e,i) => {
                e.innerHTML = this.rowValues2[i].toString();
            });
            this.currentRowValues = this.rowValues2;
        })
        
        this._prepareButton?.addEventListener('click', () => {
            let canStart = this.setStart();
            if(canStart){
                this._evaluateButton.disabled = false;
                this._prepareButton.disabled = true;
            }
        })
        
        this._evaluateButton.addEventListener('click', () => {
            this.evaluateAnswers();
            this._evaluateButton.disabled = true;
            this._playButton.disabled = false;
        })
        
        this._clearButton.addEventListener('click', () => {
            this._playButton.disabled = true;
            this._prepareButton.disabled = false;
            
            let multipleSelection = document.querySelectorAll('input[name="multiple_squares"]:checked');
            if(multipleSelection != null){
                multipleSelection.forEach(e => {
                    let el = e as HTMLInputElement;
                    el.checked = false;
                })
            }
        
            this.ballsInGame.forEach(b => {
                this.board[b.currentRow].squares[b.currentCol].isFree = true;
                let currentSquare = document.querySelector(`div[id="${b.currentRow}_${b.currentCol}"]`) as HTMLElement;
                currentSquare.removeChild(b.myImage);
            })
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
        const answerInputElement = document.querySelector('input[name="correct-answer"]:checked') as HTMLInputElement | null;
        if(answerInputElement != null){
            this.isAnswerCorrect = answerInputElement.value == 'correct';
        }
        if(this.isAnswerCorrect){
            this.ballColor = BallColor.green;
        }else{
            this.ballColor = BallColor.red; 
        }
        this.ballsInGame.forEach(b => {
            b.changeBallColor(this.ballColor);
        })
    }

    public play():void{
        const totalTime = (this.rowTypes.length + this.ballsInGame.length-1) * 250;
        this.ballsInGame.forEach(b => b.makeTrace());
        this.ballsInGame.sort(() => Math.floor(Math.random()*100)-Math.floor(Math.random()*100) );

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
            positions.forEach((el:Array<number>) => total += this.currentRowValues[el[1]]*multiplier);
            
            this.aggregateTotal = Math.max(this.aggregateTotal + total,0);
            let roundPointsElement = document.querySelector('.round-points span');
            let totalPointsElement = document.querySelector('.total-points span');

            if(roundPointsElement != null){
                roundPointsElement.innerHTML = total.toString();
            }

            if(totalPointsElement != null){
                totalPointsElement.innerHTML = this.aggregateTotal.toString();
            }

        },totalTime);
    }

    getFinalPositions():Array<Array<number>>{
        let positions:Array<Array<number>> = new Array<Array<number>>();
        this.ballsInGame.forEach(b => {
            positions.push(b.getFinalPosition())
        })
        return positions;
    }
}