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

    async getMonthlyTrends() {
        const result = await this.prisma.$queryRaw<
            { month: string; type: string; total: number }[]
        >`
            SELECT 
            TO_CHAR(date, 'YYYY-MM') as month,
            type,
            SUM(amount) as total
            FROM "FinancialRecord"
            GROUP BY month, type
            ORDER BY month ASC;
        `;

        const trendsMap = {};

        result.forEach((row) => {
            if (!trendsMap[row.month]) {
            trendsMap[row.month] = {
                month: row.month,
                income: 0,
                expense: 0,
            };
            }

            if (row.type === 'INCOME') {
            trendsMap[row.month].income = Number(row.total);
            } else {
            trendsMap[row.month].expense = Number(row.total);
            }
        });

        return Object.values(trendsMap);
    }
}
