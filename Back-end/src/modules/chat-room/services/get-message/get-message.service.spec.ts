import { Test, TestingModule } from '@nestjs/testing';
import { GetMessageService } from './get-message.service';

describe('GetMessageService', () => {
  let service: GetMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetMessageService],
    }).compile();

    service = module.get<GetMessageService>(GetMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
