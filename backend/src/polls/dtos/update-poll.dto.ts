import { PartialType } from '@nestjs/mapped-types';
import { CreatePollDto } from './create-poll.dto';

// Pulls types from CreateGoalDto into UpdateGoalDto
export class UpdatePollDto extends PartialType(CreatePollDto) {}