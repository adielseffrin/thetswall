import { RoundDificulty } from "../enums/round-dificulty";
export class Values{
    easy: Array<number> = [];
    medium: Array<number> = [];
    hard: Array<number> = [];

    constructor(){
        this.easy = [1,1000,100,300,10,1500,1,4000,1,1500,10,30000,100,1000,1];
        this.medium = [1,10000,100,15000,10,30000,1,45000,1,50000,10,75000,100,15000,1];
        //TODO update values
        this.hard = [1,10000,100,15000,10,30000,1,45000,1,50000,10,75000,100,15000,1];
    }

    getValues(dificulty: RoundDificulty){
        switch(dificulty){
            case RoundDificulty.easy:
                return this.easy;
            case RoundDificulty.medium:
                return this.medium;
            case RoundDificulty.hard:
                return this.hard;
            default:
                return this.easy;
        }
    }
}