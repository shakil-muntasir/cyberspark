import { Card, CardContent } from '@/Components/ui/card'
import { ArrowUpDownCircle } from '@/Icons/ArrowUpDownCircle'
import { DollarCircleFill } from '@/Icons/DollarCircleFill'
import { FlagPlus } from '@/Icons/FlagPlus'
import { MenuFill } from '@/Icons/MenuFill'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Chart } from '@/Pages/Dashboard/Partials/Chart'

export default function Dashboard() {
  return (
    <AuthenticatedLayout title='Dashboard'>
      <div className='py-6'>
        <div className='mx-auto grid gap-6 sm:px-6 lg:px-8'>
          <div className='grid gap-2'>
            <span>Monthly Log</span>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <Card className='bg-background'>
                <CardContent className='flex items-center gap-4 p-6'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600'>
                    <ArrowUpDownCircle className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <div className='text-xs'>Revenue</div>
                    <div className='text-xxs font-semibold tracking-wide text-muted-foreground'>BDT 20,000</div>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-background'>
                <CardContent className='flex items-center gap-4 p-6'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-600'>
                    <DollarCircleFill className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <div className='text-xs'>Cost Of Sales</div>
                    <div className='text-xxs font-semibold tracking-wide text-muted-foreground'>BDT 20,000</div>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-background'>
                <CardContent className='flex items-center gap-4 p-6'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-600'>
                    <FlagPlus className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <div className='text-xs'>Gross Profit</div>
                    <div className='text-xxs font-semibold tracking-wide text-muted-foreground'>BDT 20,000</div>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-background'>
                <CardContent className='flex items-center gap-4 p-6'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500'>
                    <MenuFill className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <div className='text-xs'>Expense</div>
                    <div className='text-xxs font-semibold tracking-wide text-muted-foreground'>BDT 20,000</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <span>Stability</span>
              <Card className='bg-background'>
                <CardContent className='grid p-0'>
                  <div>
                    <div className='grid grid-cols-2 overflow-hidden rounded-lg'>
                      <table className='border-r text-left'>
                        <thead className='text-sm font-semibold'>
                          <tr>
                            <th className='w-4/12' />
                            <th className='w-8/12 py-2 text-xs'>Balance</th>
                          </tr>
                        </thead>
                        <tbody className='text-sm'>
                          <tr className='border-t'>
                            <td className='flex items-center py-2 pl-6'>
                              <span className='text-xs text-muted-foreground'>Cash</span>
                            </td>
                            <td className='text-nowrap py-2 text-xs font-medium'>BDT 10,000</td>
                          </tr>
                          <tr className='border-t'>
                            <td className='flex items-center py-2 pl-6'>
                              <span className='text-xs text-muted-foreground'>Bank</span>
                            </td>
                            <td className='text-nowrap py-2 text-xs font-medium'>BDT 15,000</td>
                          </tr>
                          <tr className='border-t'>
                            <td className='flex items-center py-2 pl-6'>
                              <span className='text-xs text-muted-foreground'>Inventory</span>
                            </td>
                            <td className='text-nowrap py-2 text-xs font-medium'>BDT 25,000</td>
                          </tr>
                        </tbody>
                      </table>

                      <table className='text-left'>
                        <thead className='text-sm font-semibold'>
                          <tr>
                            <th className='w-1/3' />
                            <th className='w-2/3 py-2 text-xs'>Account</th>
                          </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody className='text-sm'>
                          <tr className='border-t'>
                            <td className='flex items-center py-2 pl-2'>
                              <span className='text-xs text-muted-foreground'>Receivable</span>
                            </td>
                            <td className='text-nowrap py-2 text-xs font-medium'>BDT 10,000</td>
                          </tr>
                          <tr className='border-t'>
                            <td className='flex items-center py-2 pl-2'>
                              <span className='text-xs text-muted-foreground'>Payable</span>
                            </td>
                            <td className='text-nowrap py-2 text-xs font-medium'>BDT 15,000</td>
                          </tr>
                          <tr className='border-t'>
                            <td className='h-full' />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='flex flex-col gap-2'>
              <span>Most Expense</span>
              <Card className='bg-background'>
                <CardContent className='grid p-0'>
                  <table className='border-r text-left'>
                    <thead className='text-sm font-semibold'>
                      <tr>
                        <th className='w-3/12 py-2 pl-6 text-xs'>Serial</th>
                        <th className='w-3/12 py-2 text-xs'>Code</th>
                        <th className='w-3/12 py-2 text-xs'>Date</th>
                        <th className='w-3/12 py-2 text-xs'>Amount</th>
                      </tr>
                    </thead>
                    <tbody className='text-sm'>
                      <tr className='border-t'>
                        <td className='flex items-center py-2 pl-6'>
                          <span className='text-xs text-muted-foreground'>1</span>
                        </td>
                        <td className='text-xs'>PR-NFFP</td>
                        <td className='text-nowrap py-2 text-xs font-medium'>17th Nov, 2024</td>
                        <td className='text-xs'>BDT 32,000</td>
                      </tr>
                      <tr className='border-t'>
                        <td className='flex items-center py-2 pl-6'>
                          <span className='text-xs text-muted-foreground'>2</span>
                        </td>
                        <td className='text-xs'>PR-NFFQ</td>
                        <td className='text-nowrap py-2 text-xs font-medium'>15th July, 2024</td>
                        <td className='text-xs'>BDT 25,000</td>
                      </tr>
                      <tr className='border-t'>
                        <td className='flex items-center py-2 pl-6'>
                          <span className='text-xs text-muted-foreground'>3</span>
                        </td>
                        <td className='text-xs'>PR-NFFR</td>
                        <td className='text-nowrap py-2 text-xs font-medium'>20th Feb, 2024</td>
                        <td className='text-xs'>BDT 15,000</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className='grid gap-2'>
            <span>Purchase, Sales & Expense</span>
            <Card className='flex overflow-hidden bg-background pb-6 pt-10 shadow-sm sm:rounded-lg'>
              <Chart />
              <div className='mx-8 flex flex-col justify-between'>
                <div className='grid w-56 gap-4'>
                  <div>
                    <div className='text-nowrap text-xs font-semibold text-blue-500'>Total Purchase</div>
                    <div className='text-xs font-semibold'>BDT 20,000</div>
                  </div>

                  <div>
                    <div className='text-nowrap text-xs font-semibold text-orange-600'>Total Sales</div>
                    <div className='text-xs font-semibold'>BDT 20,000</div>
                  </div>

                  <div>
                    <div className='text-nowrap text-xs font-semibold text-green-600'>Total Expense</div>
                    <div className='text-xs font-semibold'>BDT 20,000</div>
                  </div>
                </div>

                <div className='flex gap-4 pb-8'>
                  <div className='flex items-center gap-1.5'>
                    <div className='h-3 w-3 rounded-sm bg-blue-500' />
                    <div className='text-xs'>Purchase</div>
                  </div>

                  <div className='flex items-center gap-1.5'>
                    <div className='h-3 w-3 rounded-sm bg-orange-600' />
                    <div className='text-xs'>Sales</div>
                  </div>

                  <div className='flex items-center gap-1.5'>
                    <div className='h-3 w-3 rounded-sm bg-green-600' />
                    <div className='text-xs'>Expense</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
