import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreatePollDto,
  UpdatePollDto
} from "./dtos";

import {
  Poll
} from "./entities/poll.entity";

import {
  VoteGateway
} from "../vote/vote.gateway"

@Controller('polls')
export class PollsController {
  constructor(
    @InjectRepository(Poll) private readonly repository: Repository<Poll>,
    private readonly pollsGateway: VoteGateway,
  ) {}

  @Get()
  async findAll() {
    const polls = await this.repository.find();
    return { success: true, count: polls.length, data: polls };
  }

  // Amazing pagination
  @Get(':start/:end')
  async findAllPagination(@Param() start) {
    const offset = parseInt(start.end) - parseInt(start.start);
    const polls = await this.repository.find({
      skip: parseInt(start.start),
      take: offset,
    });

    return { success: true, data: polls };
  }
  @Get(':id')
  async findOne(@Param() id) {
    const poll = await this.repository.findOneBy({ id });

    if (!poll) {
      throw new NotFoundException();
    }
    return { success: true, data: poll };
  }

  @Post()
  async create(@Body() input: CreatePollDto) {
    const poll = await this.repository.save({
      ...input,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });

    return { success: true, data: poll };
  }

  @Patch(':id/vote')
  async vote(
      @Param('id') id,
      @Body('questionIndex') questionIndex: number,
  ) {
    const poll = await this.repository.findOneBy({ id });
    if (!poll) {
      throw new NotFoundException();
    }

    // Increment the vote count for the selected question
    poll.votes[questionIndex] += 1;
    const updatedPoll = await this.repository.save(poll);

    // Notify all clients about the updated poll
    this.pollsGateway.server.emit('pollUpdated', updatedPoll);

    return { success: true, data: updatedPoll };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const poll = await this.repository.findOneBy({ id });

    if (!poll) {
      throw new NotFoundException();
    }

    await this.repository.remove(poll);
  }
}
