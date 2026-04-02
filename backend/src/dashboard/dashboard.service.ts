/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecordType } from '@prisma/client';


@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) {}

    async getSummary() {
        const income = await this.prisma.financialRecord.aggregate({
            _sum: {amount: true},
            where: {type: RecordType.INCOME},
        });

        const expense = await this.prisma.financialRecord.aggregate({
            _sum: {amount: true},
            where: {type: RecordType.EXPENSE},
        });


        const totalIncome = income._sum.amount ? Number(income._sum.amount) : 0;
        const totalExpense = expense._sum.amount ? Number(expense._sum.amount) : 0;

        return {
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense,
        };
    }


    async getCategorySummary() {
        const data = await this.prisma.financialRecord.groupBy({
            by: ['category'], _sum: {amount: true},
        });

        return data.map((item) => ({
            category: item.category, 
            total: item._sum.amount ? Number(item._sum.amount) : 0,
        }));
    }


    async getRecentActivity() {
        return this.prisma.financialRecord.findMany({
            orderBy: {date: 'desc'},
            take: 5
        });
    }
}
