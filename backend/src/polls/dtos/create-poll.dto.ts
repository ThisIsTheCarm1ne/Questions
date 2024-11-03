// Questions in a poll stored in an array
// Votes is an array of numbers,
// where each number correspondes  to position of the picked question in from questions array
export class CreatePollDto {
  name: string;
  questions: string[];
  votes: number[];
  createdAt: string;
  updatedAt: string;
}
