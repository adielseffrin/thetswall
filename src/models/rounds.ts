import { RoundConfig } from "./roundConfig";

export class Rounds{
    private internalRoundNumber: number = 1;
    public roundsConfig: Array<RoundConfig> = [];
    
    addRound(config: Partial<RoundConfig>):number{
        if(config.copyBallPositionFrom){
            config.callback = this.applyBallPosition.bind(this, config.copyBallPositionFrom, this.internalRoundNumber)
        }
        let round = new RoundConfig({internalRoundNumber: this.internalRoundNumber, ...config})
        this.roundsConfig.push(round);
        return this.internalRoundNumber++;
    }

    getBallPosition(roundNumber: number): Array<number> | undefined{
        return this.getRound(roundNumber)?.ballPositions;
    }

    getRound(roundNumber: number):RoundConfig|undefined{
        return this.roundsConfig.find(x => x.internalRoundNumber == roundNumber)
    }

    getTotalRounds(){
        return this.roundsConfig.length;
    }

    applyBallPosition(roundSource:number, roundTarget:number){
        let round = this.getRound(roundTarget);
        let previousPositions = this.getBallPosition(roundSource);
        if(round && previousPositions){
            round.ballPositions.length = 0;
            round.ballPositions.push(...previousPositions);
        }
    }
}