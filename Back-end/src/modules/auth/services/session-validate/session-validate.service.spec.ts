import { Test, TestingModule } from '@nestjs/testing';
import { SessionValidateService } from './session-validate.service';

describe('SessionValidateService', () => {
  let service: SessionValidateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionValidateService],
    }).compile();

    service = module.get<SessionValidateService>(SessionValidateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
