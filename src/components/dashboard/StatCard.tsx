import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Card, CardContent } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}) => {
  return (
    <Card className={twMerge("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
            {trend && (
              <div className="mt-2 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-danger-600 dark:text-danger-400'
                  }`}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  from last month
                </span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-500 dark:text-primary-400">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};