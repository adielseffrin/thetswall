export class Answer{
    public description: string;
    public isCorrect: boolean;

    constructor({description, isCorrect}:any){
        this.description = description;
        this.isCorrect = isCorrect;
    }
}