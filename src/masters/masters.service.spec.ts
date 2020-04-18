import { Test, TestingModule } from '@nestjs/testing';
import { MastersService } from './masters.service';

describe('MastersService', () => {
  let provider: MastersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MastersService],
    }).compile();

    provider = module.get<MastersService>(MastersService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
