import { Test, TestingModule } from '@nestjs/testing';
import { DetectionsController } from './detections.controller';

describe('Detections Controller', () => {
  let controller: DetectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetectionsController],
    }).compile();

    controller = module.get<DetectionsController>(DetectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
