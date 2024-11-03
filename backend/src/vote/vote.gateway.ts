import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import {
  Logger
} from '@nestjs/common';
import {
  Socket,
  Server
} from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from '../polls/entities/poll.entity';


@WebSocketGateway()
export class VoteGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
      @InjectRepository(Poll)
      private readonly repository: Repository<Poll>,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('VoteGateway');

  @SubscribeMessage('vote')
  async handleVote(
      @MessageBody() { pollId, questionIndex }: { pollId: number; questionIndex: number }
  ) {
    const poll = await this.repository.findOneBy({ id: pollId });
    if (!poll) {
      return { success: false, message: 'Poll not found' };
    }

    poll.votes.push(questionIndex);
    const updatedPoll = await this.repository.save(poll);

    // Broadcast the updated poll to all clients
    this.server.emit('pollUpdated', updatedPoll);

    return { success: true, data: updatedPoll };
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
