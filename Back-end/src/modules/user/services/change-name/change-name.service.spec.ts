import { Test, TestingModule } from '@nestjs/testing';
import { ChangeNameService } from './change-name.service';

describe('ChangeNameService', () => {
  let service: ChangeNameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangeNameService],
    }).compile();

    service = module.get<ChangeNameService>(ChangeNameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
