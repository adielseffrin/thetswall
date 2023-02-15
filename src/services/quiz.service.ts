import { Question } from "../models/quizApi/question";
import { QuestionInterface } from "../models/quizApi/question.interface";

export class QuizApiService{
    
    constructor(){}
    
    public async getQuestion():Promise<QuestionInterface|null> {
        try {
          // 👇️ const response: Response
          const response = await fetch('https://quizapi.io/api/v1/questions?limit=1', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              "X-Api-Key": 'Dh00pFBEFC3Htdst6KxndfsKi3eSQ5lyBgbK0c7T',
            },
            
          });
      
          if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
          }
      
          // 👇️ const result: GetUsersResponse
          const result = (await response.json()) as QuestionInterface;
          //console.log('result is: ', JSON.stringify(result, null, 4));
      
          return result;
        } catch (error) {
          if (error instanceof Error) {
            console.log('error message: ', error.message);
            // return error.message;
          } else {
            console.log('unexpected error: ', error);
            // return 'An unexpected error occurred';
          }
          return null;
        }
      }

}