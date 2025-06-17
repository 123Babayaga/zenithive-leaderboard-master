"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, Users, Clock, TrendingUp } from "lucide-react";

import { CostSummary } from "@/types/user";

interface CostSummaryCardsProps {
  costSummary: CostSummary;
}

const CostSummaryCards: React.FC<CostSummaryCardsProps> = ({ costSummary }) => {
  const cards = [
    {
      icon: Users,
      color: "text-blue-600",
      label: "Total Resources",
      value: costSummary.totalUsers.toString(),
    },
    {
      icon: IndianRupee,
      color: "text-green-600",
      label: "Monthly Cost",
      value: `₹${costSummary.totalMonthlyCost.toLocaleString()}`,
    },
    {
      icon: Clock,
      color: "text-purple-600",
      label: "Avg Hourly Cost",
      value: `₹${costSummary.avgHourlyCost}`,
    },
    {
      icon: TrendingUp,
      color: "text-orange-600",
      label: "Annual Cost",
      value: `₹${costSummary.totalAnnualCost.toLocaleString()}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <card.icon className={`h-8 w-8 ${card.color}`} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CostSummaryCards;
