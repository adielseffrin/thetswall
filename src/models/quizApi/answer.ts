export class Answer{
    public id: number;
    public description: string;
    public isCorrect: boolean;

    constructor({description, isCorrect, id}:any){
        this.id = id;
        this.description = description;
        this.isCorrect = isCorrect;
    }
}