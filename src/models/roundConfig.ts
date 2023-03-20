import { BallColor } from "../enums/ball-color";
import { RoundDificulty } from "../enums/round-dificulty";
import { Ball } from "./ball";

export class RoundConfig{
    internalRoundNumber: number;
    externalRoundNumber?: number;
    playable: boolean = true;
    hasQuestion: boolean = true;
    ballPositions: Array<number> = [];
    ballMultiplier: number;
    ballColor: BallColor = BallColor.white;
    roundDificulty: RoundDificulty;
    callback: any;
    copyBallPositionFrom?: number;

    constructor(
        {
            internalRoundNumber, 
            externalRoundNumber, 
            ballMultiplier, 
            ballPositions, 
            playable, 
            roundDificulty, 
            hasQuestion = true, 
            ballColor,
            callback,
            copyBallPositionFrom
        }: any){
        this.internalRoundNumber = internalRoundNumber;
        this.ballMultiplier = ballMultiplier | 1;
        this.roundDificulty = roundDificulty;
        this.hasQuestion = hasQuestion;
        
        if(ballColor)
            this.ballColor = ballColor;
        
        if(copyBallPositionFrom)
            this.copyBallPositionFrom = copyBallPositionFrom;
        
        if(callback)
            this.callback = callback;
        
        if(externalRoundNumber)
            this.externalRoundNumber = externalRoundNumber;
        
        if(playable){
            this.playable = playable;
        }

        if(ballPositions){
            this.ballPositions = ballPositions;
        }
    }

}