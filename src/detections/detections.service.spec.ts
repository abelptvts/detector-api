import { Test, TestingModule } from '@nestjs/testing';
import { DetectionsService } from './detections.service';

describe('DetectionsService', () => {
  let provider: DetectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetectionsService],
    }).compile();

    provider = module.get<DetectionsService>(DetectionsService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
