import { Test, TestingModule } from '@nestjs/testing';
import { MortgageRequestController } from './mortgage.controller';

describe('MortgageController', () => {
  let controller: MortgageRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MortgageRequestController],
    }).compile();

    controller = module.get<MortgageRequestController>(MortgageRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
