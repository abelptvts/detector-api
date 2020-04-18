import { Test, TestingModule } from '@nestjs/testing';
import { CamerasService } from './cameras.service';

describe('CamerasService', () => {
  let provider: CamerasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CamerasService],
    }).compile();

    provider = module.get<CamerasService>(CamerasService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
