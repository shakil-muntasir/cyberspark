import { useEffect, useState } from 'react'
import { ChevronLeftIcon, PlusCircle } from 'lucide-react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { Label } from '@/Components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'

import { columns } from '@/Pages/Order/_data/variant-columns'
import { PaymentBadge } from '@/Components/PaymentBadge'
import ProgressBar from '@/Pages/Order/_partials/ProgressBar'
import { ExportIcon } from '@/Icons/ExportIcon'
import SimpleDataTable from '@/Components/SimpleDataTable'
import { cn, formatCurrency, toTitleCase } from '@/Lib/utils'

import { OrderResource } from '@/Types/modules/order'
import { OrderVariant } from '@/Types/modules/order-variant'
import { TableData } from '@/Types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion'
import { MobileBankingIcon } from '@/Icons/MobileBankingIcon'
import { ChequeIcon } from '@/Icons/ChequeIcon'
import { CashIcon } from '@/Icons/CashIcon'
import { StatusOption } from '@/Pages/Order/types'

interface ShowOrderProps {
  order: OrderResource
  order_variants: TableData<OrderVariant>
  statuses: StatusOption[]
}

const ShowOrder: React.FC<ShowOrderProps> = ({ order, statuses }) => {
  const [totalPaid, setTotalPaid] = useState<number>()

  useEffect(() => {
    if (order?.data?.relationships?.transactions) {
      const total = order.data.relationships.transactions.map(transaction => transaction.attributes.amount).reduce((acc, amount) => acc + amount, 0)

      setTotalPaid(totalPaid ?? 0 + total)
    }
  }, [order.data.relationships?.transactions])

  return (
    <AuthenticatedLayout title='Order Details'>
      <main className='mx-auto flex max-w-[80rem] flex-1 flex-col gap-4'>
        <div className='flex auto-rows-max flex-col gap-4'>
          <div className='flex items-center gap-4'>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant='outline' size='icon' className='h-7 w-7' onClick={() => window.history.back()}>
                    <ChevronLeftIcon className='h-4 w-4' />
                    <span className='sr-only'>Back</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>Order #{order.data.attributes.code}</h1>
            <PaymentBadge variant={order.data.attributes.payment_status as 'draft' | 'due' | 'partial' | 'paid'} className='ml-auto min-w-min py-0 sm:ml-0'>
              {toTitleCase(order.data.attributes.payment_status)}
            </PaymentBadge>
            <div className='hidden items-center gap-2 md:ml-auto md:flex'>
              <Button variant='secondary' size='sm' onClick={() => null}>
                Discard
              </Button>
              <Button size='sm'>Save Order</Button>
            </div>
          </div>

          <div className='flex flex-col gap-4 lg:gap-6'>
            <Card>
              <CardHeader>
                <div className='flex justify-between'>
                  <div>
                    <CardTitle>Order #{order.data.attributes.code}</CardTitle>
                    <CardDescription>Here is an overview of your order.</CardDescription>
                  </div>
                  <Button variant='outline' className='flex gap-2 px-3'>
                    <ExportIcon className='text-muted-foreground' />
                    <span>Export</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='flex flex-col items-center justify-between lg:flex-row-reverse lg:items-end'>
                <div className='w-full pb-6 lg:w-2/3 lg:pb-0'>
                  <ProgressBar steps={statuses} currentStep={order.data.attributes.status} />
                </div>
                <div className='flex h-fit w-full flex-col gap-2 lg:flex-row'>
                  <Badge variant='secondary' className='flex w-fit gap-2 rounded-md py-1 dark:bg-secondary/50'>
                    <span>Placed on:</span>
                    <span className='text-muted-'>{order.data.attributes.created_at}</span>
                  </Badge>
                  <Badge variant='secondary' className='flex w-fit gap-2 rounded-md py-1 dark:bg-secondary/50'>
                    <span>Updated at:</span>
                    <span className='text-muted-'>{order.data.attributes.updated_at}</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <div className='flex w-full flex-col gap-4 lg:flex-row lg:gap-6'>
              <Card className='lg:w-1/3'>
                <CardHeader className='pb-3.5 pt-4'>
                  <div className='flex items-center justify-between'>
                    <Label>Customer</Label>
                    <Button variant='outline' className='h-6 rounded-sm px-3'>
                      <span className='text-xs font-semibold'>Edit</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className='border-t py-4'>
                  <div className='grid gap-2'>
                    <div className='flex gap-2 text-xs'>
                      <div className='flex w-4/12 justify-between'>
                        <span>Name</span>
                        <span className='text-muted-foreground'>&#58;</span>
                      </div>
                      <span className='text-muted-foreground'>{order.data.relationships?.customer.attributes.name}</span>
                    </div>

                    <div className='flex gap-2 text-xs'>
                      <div className='flex w-4/12 justify-between'>
                        <span>Email</span>
                        <span className='text-muted-foreground'>&#58;</span>
                      </div>
                      <span className='text-muted-foreground'>{order.data.relationships?.shipping_address.attributes.email}</span>
                    </div>

                    <div className='flex gap-2 text-xs'>
                      <div className='flex w-4/12 justify-between'>
                        <span>Phone</span>
                        <span className='text-muted-foreground'>&#58;</span>
                      </div>
                      <span className='text-muted-foreground'>{order.data.relationships?.shipping_address.attributes.contact_number}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className='lg:w-1/3'>
                <CardHeader className='pb-3.5 pt-4'>
                  <div className='flex items-center justify-between'>
                    <Label>Address & Delivery</Label>
                    <Button variant='outline' className='h-6 rounded-sm px-3'>
                      <span className='text-xs font-semibold'>Edit</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className='grid gap-2 border-t py-4'>
                  <div className='flex gap-2 text-xs'>
                    <div className='flex w-4/12 justify-between'>
                      <span>Address</span>
                      <span className='text-muted-foreground'>&#58;</span>
                    </div>
                    <span className='text-wrap text-muted-foreground'>
                      {`${order.data.relationships?.shipping_address.attributes.street}, ${order.data.relationships?.shipping_address.attributes.city},`}
                      <br /> {`${order.data.relationships?.shipping_address.attributes.state}, ${order.data.relationships?.shipping_address.attributes.zip}`}
                    </span>
                  </div>

                  <div className='flex gap-2 text-xs'>
                    <div className='flex w-4/12 justify-between'>
                      <span>Delivery Method</span>
                      <span className='text-muted-foreground'>&#58;</span>
                    </div>
                    <span className='text-muted-foreground'>{order.data.attributes.delivery_method}</span>
                  </div>

                  <div className='flex gap-2 text-xs'>
                    <div className='flex w-4/12 justify-between'>
                      <span>Delivered By</span>
                      <span className='text-muted-foreground'>&#58;</span>
                    </div>
                    <span className='text-muted-foreground'>{order.data.attributes.delivered_by}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className='lg:w-1/3'>
                <CardHeader className='pb-3.5 pt-4'>
                  <div className='flex items-center justify-between'>
                    <Label>Payment</Label>
                    <Button variant='outline' className='h-6 rounded-sm px-3'>
                      <span className='text-xs font-semibold'>Edit</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className='grid gap-2 border-t py-4'>
                  <div className='flex gap-2 text-xs'>
                    <div className='flex w-4/12 justify-between'>
                      <span>Subtotal</span>
                      <span className='text-muted-foreground'>&#58;</span>
                    </div>
                    <span className='text-muted-foreground'>
                      {formatCurrency(
                        order.data.relationships?.order_variants
                          ?.map(variant => variant.attributes?.subtotal ?? 0) // Get subtotal or default to 0 if undefined
                          .reduce((acc, subtotal) => acc + subtotal, 0) || 0
                      )}
                    </span>
                  </div>

                  <div className='flex gap-2 text-xs'>
                    <div className='flex w-4/12 justify-between'>
                      <span>Shipping Cost</span>
                      <span className='text-muted-foreground'>&#58;</span>
                    </div>
                    <span className='text-muted-foreground'>{formatCurrency(order.data.attributes.delivery_cost)}</span>
                  </div>

                  <div className='flex gap-2 text-xs'>
                    <div className='flex w-4/12 justify-between'>
                      <span>Total Payable</span>
                      <span className='text-muted-foreground'>&#58;</span>
                    </div>
                    <span className='text-muted-foreground'>{formatCurrency(order.data.attributes.total_payable)}</span>
                  </div>

                  {totalPaid ? (
                    <div className='flex gap-2 text-xs'>
                      <div className='flex w-4/12 justify-between'>
                        <span>Total Paid</span>
                        <span className='text-muted-foreground'>&#58;</span>
                      </div>
                      <span className='text-muted-foreground'>{formatCurrency(totalPaid)}</span>
                    </div>
                  ) : null}

                  {totalPaid && totalPaid < order.data.attributes.total_payable ? (
                    <div className='flex gap-2 text-xs'>
                      <div className='flex w-4/12 justify-between'>
                        <span>Total Remaining</span>
                        <span className='text-muted-foreground'>&#58;</span>
                      </div>
                      <span className='text-muted-foreground'>{formatCurrency(order.data.attributes.total_payable - totalPaid)}</span>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
            <div className='flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6'>
              <Card className='h-fit lg:col-span-2'>
                <CardHeader className='border-b pb-3.5 pt-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1.5'>
                      <Label>Items Ordered</Label>
                      <Badge variant='secondary' className='h-5 px-2 text-xxs'>
                        {order.data.relationships!.order_variants.length}
                      </Badge>
                    </div>
                    <Button variant='outline' className='h-6 rounded-sm px-3'>
                      <span className='text-xs font-semibold'>Edit</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className='p-0'>
                  <SimpleDataTable data={order.data.relationships!.order_variants} columns={columns} />
                </CardContent>
              </Card>
              <Card className='h-max'>
                <CardHeader className='border-b pb-3.5 pt-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1.5'>
                      <Label>Billing History</Label>
                      <Badge variant='secondary' className='h-5 px-2 text-xxs'>
                        {order.data.relationships!.transactions.length}
                      </Badge>
                    </div>
                    <Button variant='outline' className='h-6 rounded-sm px-3'>
                      <span className='text-xs font-semibold'>Edit</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className='px-4 py-4'>
                  <Accordion type='single' collapsible className='w-full space-y-2'>
                    {order.data.relationships?.transactions.map(transaction => (
                      <AccordionItem key={transaction.id} value={transaction.id} className={cn('group my-1 rounded-md outline outline-1 outline-muted transition-all hover:outline-muted-foreground/50')}>
                        <AccordionTrigger className='px-2 py-3'>
                          <div className='flex w-full items-center gap-2'>
                            <div className='h-fit w-fit rounded-md bg-muted/50 p-2'>
                              {transaction.attributes.payment_method === 'mobile_banking' ? <MobileBankingIcon className='h-5 w-5' /> : transaction.attributes.payment_method === 'cheque' ? <ChequeIcon className='h-5 w-5' /> : <CashIcon className='h-5 w-5' />}
                            </div>
                            <div className='text-xs'>
                              <p className='text-nowrap text-start'>{toTitleCase(transaction.attributes.payment_method)}</p>
                              <p className='text-start text-muted-foreground'>{formatCurrency(transaction.attributes.amount)}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className='pb-0'>
                          <div className='mx-2 grid gap-2 border-t py-2.5 text-xs'>
                            {transaction.attributes.payment_method === 'mobile_banking' ? (
                              <>
                                <p>
                                  Transaction ID: <span className='text-muted-foreground'>{transaction.attributes.txn_id}</span>
                                </p>

                                <p>
                                  Account Number: <span className='text-muted-foreground'>{transaction.attributes.account_number}</span>
                                </p>

                                <p>
                                  Provider: <span className='text-muted-foreground'>{toTitleCase(transaction.attributes.service_provider)}</span>
                                </p>
                              </>
                            ) : (
                              transaction.attributes.payment_method === 'cheque' && (
                                <>
                                  <p>
                                    Cheque Number: <span className='text-muted-foreground'>{transaction.attributes.cheque_number}</span>
                                  </p>

                                  <p>
                                    Bank: <span className='text-muted-foreground'>{transaction.attributes.bank_name}</span>
                                  </p>
                                </>
                              )
                            )}
                            <p>
                              Approved By: <span className='text-muted-foreground'>{transaction.attributes.created_by?.name}</span>
                            </p>
                            <p>
                              Processed At: <span className='text-muted-foreground'>{transaction.attributes.created_at}</span>
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
                <CardFooter className='px-4 pb-4'>
                  <Button variant='outline' className='flex w-full gap-1.5'>
                    <PlusCircle className='h-4 w-4' /> <span>New Transaction</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </AuthenticatedLayout>
  )
}

export default ShowOrder
