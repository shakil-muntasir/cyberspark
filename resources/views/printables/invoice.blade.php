<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Favicon -->
  <link rel="shortcut icon" href="{{ public_path('favicon.png') }}">

  <title>INV#{{ $order->code }} - {{ config('app.name', 'Laravel') }}</title>

  <style>
    html, body {
      font-family: 'Inter', sans-serif;
    }
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }
    .table {
      padding: 8px 32px;
      width: 100%;
      table-layout: auto;
      font-size: 12px;
    }
    .data-table-header {
      text-wrap: nowrap; 
      border-bottom: solid #e5e7eb 1px;
      padding: 12px 8px;
      text-align: right;
    }
    .data-table-cell {
      border-color: #e5e7eb;
      border-style: solid;
      border-width: 0px 1px 1px 0px;
      padding: 6px 8px;
      vertical-align: top;
      text-align: right;
    }
    .payment-label {
      color: #4b5563;
      width: 50%;
      float:left;
      margin-left: 96px;
    }
    .payment-value {
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      text-align: right;
      width: 50%;
      float: right;
      padding-right: 8px;
    }
    .clearfix::after {
    content: "";
    display: table;
    clear: both;
    }
    .signature-section {
    position: absolute;
    bottom: 50px; /* Adjust to align above footer */
    width: 100%;
    }
    .signature-item {
      width: 20%;
      border-top: 1px solid #6b7280;
      padding-top: 2px;
      text-align: center;
      font-size: 12px
    }
    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      border-top: gray solid 1px;
    }
    .page-break {
      page-break-after: always;
    }
  </style>
</head>

<body>
  @foreach ($pages as $page)
  <header style="width: 100%; margin-top: 12px">
    <table class="table">
      <tr>
        <!-- First TD (Logo) -->
        <td style="width: 50%;">
            <img src="{{ public_path('assets/cyberspark_full_light.svg') }}" style="max-width: 100%; vertical-align: middle; height: 64px;" alt="">
        </td>
    
        <!-- Second TD (Payment Status & Invoice) - aligned to the right -->
        <td style="width: 50%; text-align: right;">
            <div style="display: inline-block; vertical-align: middle;">
                <div style="width: 48px; height: 48px; display: inline-block;">
                    @if($order->payment_status == 'due')
                        <img src="{{ public_path('assets/payment_due.svg') }}" style="width: 100%; height: 100%; vertical-align: middle;" alt="">
                    @elseif($order->payment_status == 'partial')
                        <img src="{{ public_path('assets/payment_partial.svg') }}" style="width: 100%; height: 100%; vertical-align: middle;" alt="">
                    @elseif($order->payment_status == 'paid')
                        <img src="{{ public_path('assets/payment_paid.svg') }}" style="width: 100%; height: 100%; vertical-align: middle;" alt="">
                    @endif
                </div>
            </div>
            <div style="display: inline-block; vertical-align: middle; padding-left: 8px;">
                <h1 style="color: #4b5563;">INV#{{ $order->code }}</h1>
            </div>
        </td>
      </tr>

    </table>
  </header>

  @if($loop->first)
    <section style="margin-top: 12px;">
      <table class="table">
        <tr>
          <td style="width: 60%; font-size: 14px">
            <div>
              <div style="font-weight: 700;">
                <span style="color: #4b5563;">INVOICE DATE</span>
                <span style="text-wrap: no-wrap;">{{ $order->created_at->format('jS F, Y') }}</span>
              </div>
              <div style="margin-top: 16px">
                <span style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em">Cyberspark</span>
                <div style="margin-top: 4px;">
                  01615 420444, 0967712313
                </div>
                <div>House - 38, Road - 7, Block - E, Banasree</div>
                <div>Rampura, Dhaka - 1219</div>
              </div>
              <div style="margin-top: 16px">
                <span style="font-weight: 700;">Sales Rep:</span>
                <span>{{ $order->salesRep->name }}</span>
              </div>
            </div>
          </td>
          <td style="width: 40%; font-size: 14px; vertical-align: top;">
            <div>
              <div style="font-weight: 700; color: #4b5563; text-underline-offset: 1px; text-decoration: underline">BILLED TO</div>
              <div style="font-size: 14px; margin-top: 16px;">
                <div style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em;">{{ $order->customer->name }}</div>
                <div style="margin-top: 4px;">{{ $order->shippingAddress->contact_number }}</div>
                <div>{{ $order->shippingAddress->street }}, {{ $order->shippingAddress->city }}</div>
                <div>{{ \Str::title($order->shippingAddress->state) }} - {{ $order->shippingAddress->zip }}</div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </section>
  @endif

  <table class="table" style="margin-top: 12px; border-top: 1px solid #e5e7eb" cellpadding="0" cellspacing="0" role="none">
    <tr style="height: 32px;">
      <th class="data-table-header" style="text-align: left;">ITEM DETAILS</th>
      <th class="data-table-header">RETAIL PRICE</th>
      <th class="data-table-header">SELLING PRICE</th>
      <th class="data-table-header">QUANTITY</th>
      <th class="data-table-header">TOTAL</th>
    </tr>
    @foreach ($page as $variant)
    <tr style="font-size: 14px;">
      <td class="data-table-cell" style="text-align: left">
        <div style="white-space: nowrap;">{{ \Str::title($variant->productVariant->product->name) }}</div>
        <div style="font-size: 10px; color: #374151; margin-top: 4px">SKU: {{ $variant->productVariant->product->sku_prefix . sprintf('%05d', $variant->productVariant->id)}}</div>
      </td>
      <td class="data-table-cell">BDT {{ number_format((float) $variant->productVariant->retail_price, 2) }}</td>
      <td class="data-table-cell">BDT {{ number_format((float) $variant->unit_price, 2) }}</td>
      <td class="data-table-cell">{{ $variant->quantity }}&times;</td>
      <td class="data-table-cell" style="border-right: 0px">BDT {{ number_format((float) $variant->subtotal, 2) }}</td>
    </tr>
    @endforeach
    @if ($loop->last)
    <tr style="font-size: 14px;">
      <td colspan="2"></td>
      <td colspan="3">
        <div class="clearfix" style="padding-top: 12px;">
          <div class="payment-label">
            Subtotal
          </div>
          
          <div class="payment-value">
            BDT {{ number_format((float) $order->total_subtotal, 2) }}
          </div>
        </div>
      
        <div class="clearfix" style="padding-top: 10px;">
          <div class="payment-label">
            Delivery Cost
          </div>
          
          <div class="payment-value">
            BDT {{ number_format((float) $order->delivery_cost, 2) }}
          </div>
        </div>

        <div class="clearfix" style="padding-top: 10px;">
          <div class="payment-label">
            Total Payable
          </div>
          
          <div class="payment-value">
            BDT {{ number_format((float) $order->total_payable, 2) }}
          </div>
        </div>

        @if($order->transactions_sum_amount)
        <div class="clearfix" style="padding-top: 10px;">
          <div class="payment-label">
            Total Paid
          </div>
          
          <div class="payment-value">
            BDT {{ number_format((float) $order->transactions_sum_amount, 2) }}
          </div>
        </div>
        @endif

        @if($order->transactions_sum_amount != $order->total_payable)
        <div class="clearfix" style="padding-top: 5px; margin-top: 5px; border-top: 1px solid #e5e7eb; margin-left:88px">
          <div class="payment-label" style="margin-left: 8px">
            Total Remaining
          </div>
          
          <div class="payment-value">
            BDT {{ number_format((float) ($order->total_payable - $order->transactions_sum_amount), 2) }}
          </div>
        </div>
        @endif
      </td>
    </tr>
    @endif
  </table>

  @if(!$loop->last)
  <section class="signature-section">
    <table class="table">
      <tr>
        <td style="text-align: right; font-style: italic; color: #374151;">Please refer to all pages for full invoice information.</td>
      </tr>
    </table>
  </section>
  @endif

  @if($loop->last)
  <section class="signature-section">
    <table class="table">
      <tr>
        <td class="signature-item">Prepared by</td>
        <td class="spacer"></td>
        <td class="signature-item">Manager's Signature</td>
      </tr>
    </table>
  </section>
  @endif

  <footer class="footer">
    <table class="table">
      <tr>
        <td style="width: 20%">
          <img src="{{ public_path('assets/sprint_devs_full_light_solid.svg') }}" alt="" style="max-width: 100%; vertical-align: middle; height: 24px"/>
        </td>
        <td style="width: 60%; text-align: center;">
          <div class="text-center text-xs">
            <a href="https://sprintdevs.com/" target="_blank" style="color: #df1a22; text-decoration: none;">www.sprintdevs.com</a>
            <div style="text-wrap: no-wrap">&copy; 2022-{{ now()->format('Y') }} Sprint Devs. All Rights Reserved.</div>
          </div>
        </td>
        <td style="width: 20%; text-align: right;">
          <div class="flex items-center justify-end text-end text-xs">
            @if($pages->count() > 1)
            <span>Page {{ $loop->iteration }} of {{ $pages->count() }}</span>
            @endif
        </div>
        </td>
      </tr>
    </table>
  </footer>

  @if(!$loop->last)
  <div style="page-break-after: always;"/></div>
  @endif

  @endforeach
</body>

</html>