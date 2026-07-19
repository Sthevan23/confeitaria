<?php
declare(strict_types=1);

namespace Gimarry\Application\UseCases;

use Gimarry\Domain\Repositories\OrderRepositoryInterface;

final class GetFinanceSummary
{
    public function __construct(private readonly OrderRepositoryInterface $orders) {}

    public function execute(string $period = 'all'): array
    {
        $finished = array_filter(
            $this->orders->all(),
            static fn($o) => $o->status === 'finalizado'
        );

        $today = date('Y-m-d');
        $month = date('Y-m');

        $filter = static function (array $list) use ($period, $today, $month): array {
            if ($period === 'today') {
                return array_values(array_filter($list, static fn($o) => str_starts_with($o->createdAt, $today)));
            }
            if ($period === 'month') {
                return array_values(array_filter($list, static fn($o) => str_starts_with($o->createdAt, $month)));
            }
            return array_values($list);
        };

        $scoped = $filter($finished);
        $map = [];
        foreach ($scoped as $order) {
            foreach ($order->items as $item) {
                $key = $item->productId ?: $item->name;
                if (!isset($map[$key])) {
                    $map[$key] = ['productId' => $item->productId, 'name' => $item->name, 'qty' => 0, 'revenue' => 0.0];
                }
                $map[$key]['qty'] += $item->qty;
                $map[$key]['revenue'] += $item->subtotal();
                $map[$key]['name'] = $item->name;
            }
        }

        $products = array_values($map);
        usort($products, static fn($a, $b) => $b['revenue'] <=> $a['revenue']);
        foreach ($products as &$row) {
            $row['avgPrice'] = $row['qty'] > 0 ? $row['revenue'] / $row['qty'] : 0;
        }

        $allFinished = array_values($finished);
        $totalSales = array_sum(array_map(static fn($o) => $o->total, $allFinished));
        $todaySales = array_sum(array_map(
            static fn($o) => str_starts_with($o->createdAt, $today) ? $o->total : 0,
            $allFinished
        ));
        $monthSales = array_sum(array_map(
            static fn($o) => str_starts_with($o->createdAt, $month) ? $o->total : 0,
            $allFinished
        ));

        return [
            'totalSales' => $totalSales,
            'todaySales' => $todaySales,
            'monthSales' => $monthSales,
            'orderCount' => count($scoped),
            'cakesSold' => array_sum(array_column($products, 'qty')),
            'products' => $products,
            'totalOrders' => count($this->orders->all()),
        ];
    }
}
