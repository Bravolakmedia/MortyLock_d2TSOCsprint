import { Controller, Post, Body, UseGuards, Get, Query, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MortgageService } from './mortgage.service';
import { CreateMortgageRequestDto } from './dto/create-mortgage-request.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Mortgage Requests')
@Controller('api/mortgage')
export class MortgageRequestController {
  constructor(private readonly mortgageService: MortgageService) {}
  
  @Post('requests')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Make a mortgage request' })
  @ApiResponse({ status: 201, description: 'The mortgage request has been successfully created.' })
  async createMortgageRequest(
    @Body() createMortgageRequestDto: CreateMortgageRequestDto,
  ) {
    // Attach the buyer's ID (from the JWT token) to the DTO
    const result = await this.mortgageService.createRequest(createMortgageRequestDto);
    
    return {
      requestId: result.requestId,
      status: result.status,
    };
  }
  // GET /api/mortgage/pending
  @Get('pending')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check pending mortgage requests' })
  @ApiResponse({ status: 201, description: 'Review the pending mortgage requests.' })
  async getPendingRequests(@Query('lenderId') lenderId: number) {
    const pendingRequests = await this.mortgageService.getPendingRequests(lenderId);
    return pendingRequests;
  }

  // Approve mortgage request
  @Post('approve/:requestId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check pending mortgage requests' })
  @ApiResponse({ status: 201, description: 'Review the pending mortgage requests.' })
  async approveMortgageRequest(
    @Param('requestId') requestId: number,
    @Body('lenderId') lenderId: number,
  ) {
    return this.mortgageService.approveRequest(lenderId, requestId);
  }

  // Reject mortgage request
  @Post('reject/:requestId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check pending mortgage requests' })
  @ApiResponse({ status: 201, description: 'Review the pending mortgage requests.' })
  async rejectMortgageRequest(
    @Param('requestId') requestId: number,
    @Body('lenderId') lenderId: number,
  ) {
    return this.mortgageService.rejectRequest(lenderId, requestId);
  }
}
