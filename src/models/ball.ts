import { RowType } from "../enums/row-type";

export class Ball{
    public previousCol:number| null;
    public currentCol:number;
    public previousRow:number | null;
    public currentRow:number;
    public maxEvenCol:number;
    public maxOddCol:number;
    public rowTypes: Array<RowType>;
    public canStart = false;
    public myImage = new Image(30, 26.7);
    public trace: Array<Array<number>>;
    
    private _board: any;

    constructor(rowTypes: Array<RowType>, maxOddCol: number, initialCol: number, ballColor: string, board: any){
        this.previousCol = null;
        this.currentCol = 0;
        this.previousRow = null;
        this.currentRow = 0;
        this.trace = [];
        this._board = board;

        this.rowTypes = rowTypes;
        this.maxOddCol = maxOddCol;
        this.maxEvenCol = maxOddCol+1;
        this.setStart(initialCol);
        this.changeBallColor(ballColor);
        this.trace.push([0,initialCol]);
    }

    changeBallColor(ballColor: string){
        switch(ballColor){
            case "green":
                this.myImage.src = '/images/bola-verde.png';
                break;
            case "red":
                this.myImage.src = '/images/bola-vermelha.png';
                break;
            default:
                this.myImage.src = '/images/bola-branca.png';
                break;
        }
    }

    getFinalPosition():Array<number>{
        return [this.currentRow, this.currentCol];
    }

    makeTrace(){
        this.advance();
        for(let i = 1; i < this.rowTypes.length-2; i++){
            try{
                this.roll(i);
            }catch{
                --i;
            }
        }
        this.advance();
    }

    advance(){
        this.previousCol = this.currentCol;
        this.previousRow = this.currentRow;
        this.currentRow++;
        this.updateBoard();
        this.trace.push([this.currentRow, this.currentCol]);
    }

    roll(iteration: number){
        this.previousRow = this.currentRow;
        this.previousCol = this.currentCol;
        if(this.rowTypes[iteration] != this.rowTypes[iteration+1]){
            if(this.rowTypes[iteration] == RowType.odd){
                if(!this.isToGoToLeftSide()){
                    this.currentCol++;
                }
            }else{
                if(this.isToGoToLeftSide()){
                    this.currentCol = Math.max(0, this.currentCol-1);
                }else{
                    this.currentCol = Math.min(this.currentCol,this.maxOddCol);
                }
            }
        }
        this.currentRow = iteration+1;
        this.updateBoard();
        this.trace.push([this.currentRow, this.currentCol]);
    }

    isToGoToLeftSide(){
        const array = new Uint32Array(1);
        self.crypto.getRandomValues(array);
        let randNumber = array[0] % 10;
        return randNumber < 5;
    }

    setStart(initialCol: number){
        this.currentRow = 0;
        this.currentCol = initialCol;
        this.canStart = true;
        this.paint();
    }

    paint(){
        if(this.previousRow != null && this.previousCol != null){
            document.getElementById(`${this.previousRow}_${this.previousCol}`)?.removeChild(this.myImage);
        }
        
        document.getElementById(`${this.currentRow}_${this.currentCol}`)?.appendChild(this.myImage);
    }

    paintTrace(){
        for(let i = 0; i < this.trace.length-1; ++i){
            setTimeout(() => {
                document.getElementById(`${this.trace[i][0]}_${this.trace[i][1]}`)?.removeChild(this.myImage); 
                document.getElementById(`${this.trace[i+1][0]}_${this.trace[i+1][1]}`)?.appendChild(this.myImage); 
            },250*(i+1))
        }
    }

    updateBoard(){
        try{
            if(this.previousRow != null && this.previousCol != null){
                this._board[this.previousRow].squares[this.previousCol].isFree = true;
            }
            this._board[this.currentRow].squares[this.currentCol].isFree = false;
        }catch{
            console.log('erro upadte board')
            console.log(this.previousRow)
            console.log(this.previousCol)
            console.log(this.currentRow)
            console.log(this.currentCol)
        }
    }

    eraseBall(){
        if(this.currentRow != null && this.currentCol != null){
            this._board[this.currentRow].squares[this.currentCol].isFree = true;
            document.getElementById(`${this.currentRow}_${this.currentCol}`)?.removeChild(this.myImage); 
        }  
    }
    
    isSquareFree(row: number, col:number):boolean{
        return this._board[row].squares[col].isFree;
    }

    log(caller:string){
        let logElement = document.querySelector('.log-full');
        if(this.previousRow != undefined && this.previousCol != undefined && logElement){
            logElement.innerHTML += `[${this.previousRow},${this.previousCol}] -> [${this.currentRow},${this.currentCol}](${caller})<br/>`;
        }
    }
}