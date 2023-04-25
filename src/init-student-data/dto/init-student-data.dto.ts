import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class InitStudentDataDto{

    email: string;
    courseCompletion: number;
    courseEngagment: number;
    projectDegree: number;
    teamProjectDegree: number;
    bonusProjectUrls: string;
}