import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMortgageRequestDto } from './dto/create-mortgage-request.dto';
import * as nodemailer from 'nodemailer';
import { UserRole } from '@prisma/client';

@Injectable()
export class MortgageService {
  
  constructor(private prisma: PrismaService) {}

  // Create a new mortgage request
  async createRequest(createMortgageRequestDto: CreateMortgageRequestDto) {
    const { userId, propertyId, loanAmount, repaymentPeriod } = createMortgageRequestDto;

    console.log('Creating request for user:', userId);

    // Create mortgage request and save it in the database
    const mortgageRequest = await this.prisma.mortgageRequest.create({
      data: {
        propertyId,
        loanAmount,
        repaymentPeriod,
        status: 'PENDING',
        user: {
          connect: { id: userId },
        },
      },
    });

    console.log(mortgageRequest);

    // Notify the lender about the new mortgage request (optional)
    await this.notifyLender(mortgageRequest);

    return {
      requestId: mortgageRequest.id,
      status: mortgageRequest.status,
    };
  }

  // Email notification to the lender about a new mortgage request
  async notifyLender(mortgageRequest: any) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',  // You can change this to any other email service
      auth: {
        user: 'your-email@gmail.com',  // Replace with your email
        pass: 'your-email-password',   // Replace with your email password or app-specific password
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'lender-email@example.com',  // Replace with lender's email
      subject: 'New Mortgage Request',
      text: `A new mortgage request has been created for Property ID: ${mortgageRequest.propertyId}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  // Approve a mortgage request
  async approveRequest(lenderId: number, requestId: number) {
    // Verify lender's role
    const lender = await this.prisma.user.findUnique({ where: { id: lenderId } });
    if (lender.role !== UserRole.LENDER) {
      throw new UnauthorizedException('Only lenders can approve mortgage requests');
    }

    // Check if the mortgage request exists
    const mortgageRequest = await this.prisma.mortgageRequest.findUnique({ where: { id: requestId } });
    if (!mortgageRequest) {
      throw new NotFoundException('Mortgage request not found');
    }
    if (mortgageRequest.status !== 'PENDING') {
      throw new BadRequestException('Only pending requests can be approved');
    }
  
    // Update the mortgage request status to 'APPROVED'
    const updatedRequest = await this.prisma.mortgageRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' },
    });

    return {
      requestId: updatedRequest.id,
      status: updatedRequest.status,
    };
  }
  
  // Reject a mortgage request
  async rejectRequest(lenderId: number, requestId: number) {
    // Verify lender's role
    const lender = await this.prisma.user.findUnique({ where: { id: lenderId } });
    if (lender.role !== UserRole.LENDER) {
      throw new UnauthorizedException('Only lenders can reject mortgage requests');
    }

    // Check if the mortgage request exists
    const mortgageRequest = await this.prisma.mortgageRequest.findUnique({ where: { id: requestId } });
    if (!mortgageRequest) {
      throw new NotFoundException('Mortgage request not found');
    }
    if (mortgageRequest.status !== 'PENDING') {
      throw new BadRequestException('Only pending requests can be rejected');
    }

    // Update the mortgage request status to 'REJECTED'
    const updatedRequest = await this.prisma.mortgageRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });

    return {
      requestId: updatedRequest.id,
      status: updatedRequest.status,
    };
  }

  // Retrieve pending mortgage requests for a lender
  async getPendingRequests(lenderId: number) {
    console.log('Fetching pending requests for lender:', lenderId);

    // Query for pending mortgage requests
    const pendingRequests = await this.prisma.mortgageRequest.findMany({
      where: {
        status: 'PENDING',
      },
      select: {
        id: true,
        propertyId: true,
        loanAmount: true,
        repaymentPeriod: true,
        status: true,
      },
    });

    return {
      requests: pendingRequests.map((request) => ({
        requestId: request.id,
        propertyId: request.propertyId,
        loanAmount: request.loanAmount,
        repaymentPeriod: request.repaymentPeriod,
        status: request.status,
      })),
    };
  }
}
