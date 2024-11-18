import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/Components/ui/chart'
const chartData = [
  { month: 'January', purchase: 186, sales: 80, expense: 50 },
  { month: 'February', purchase: 305, sales: 160, expense: 40 },
  { month: 'March', purchase: 237, sales: 120, expense: 80 },
  { month: 'April', purchase: 73, sales: 190, expense: 100 },
  { month: 'May', purchase: 209, sales: 130, expense: 150 },
  { month: 'June', purchase: 214, sales: 140, expense: 50 }
]

const chartConfig = {
  purchase: {
    label: 'Purchase',
    color: '#0284c7'
  },
  sales: {
    label: 'Sales',
    color: '#ea580c'
  },
  expense: {
    label: 'Expense',
    color: '#16a34a'
  }
} satisfies ChartConfig

export function Chart() {
  return (
    <ChartContainer config={chartConfig} className='h-96 w-full'>
      {/* TODO: make chart responsive */}
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: '#888', fontSize: 12 }} tickMargin={8} />
        <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} tickFormatter={value => value.slice(0, 3)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
        <Area dataKey='purchase' type='natural' fill='var(--color-purchase)' fillOpacity={0.4} stroke='var(--color-purchase)' stackId='a' />
        <Area dataKey='sales' type='natural' fill='var(--color-sales)' fillOpacity={0.4} stroke='var(--color-sales)' stackId='a' />
        <Area dataKey='expense' type='natural' fill='var(--color-expense)' fillOpacity={0.4} stroke='var(--color-expense)' stackId='a' />
      </AreaChart>
    </ChartContainer>
  )
}
