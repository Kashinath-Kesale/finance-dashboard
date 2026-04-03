/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
    constructor(private dashboardService: DashboardService) {}

    @Get('summary')
    @Roles('VIEWER', 'ANALYST', 'ADMIN')
    getSummary() {
        return this.dashboardService.getSummary();
    }

    @Get('category-summary')
    @Roles('ANALYST', 'ADMIN')
    getCategorySummary() {
        return this.dashboardService.getCategorySummary();
    }

    @Get('recent')
    @Roles('VIEWER', 'ANALYST', 'ADMIN')
    getRecent() {
        return this.dashboardService.getRecentActivity();
    }

    @Get('trends')
    @Roles('ANALYST', 'ADMIN')
    getTrends() {
        return this.dashboardService.getMonthlyTrends();
    }
}

