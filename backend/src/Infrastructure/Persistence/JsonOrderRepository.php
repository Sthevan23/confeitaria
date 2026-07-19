<?php
declare(strict_types=1);

namespace Gimarry\Infrastructure\Persistence;

use Gimarry\Domain\Entities\Order;
use Gimarry\Domain\Entities\OrderItem;
use Gimarry\Domain\Repositories\OrderRepositoryInterface;

final class JsonOrderRepository implements OrderRepositoryInterface
{
    public function __construct(private readonly JsonDataStore $store) {}

    public function all(): array
    {
        return array_map([$this, 'map'], $this->store->read()['orders'] ?? []);
    }

    public function findById(string $id): ?Order
    {
        foreach ($this->all() as $order) {
            if ($order->id === $id) {
                return $order;
            }
        }
        return null;
    }

    public function save(Order $order): void
    {
        $this->store->update(static function (array $data) use ($order) {
            $list = $data['orders'] ?? [];
            $found = false;
            foreach ($list as $i => $row) {
                if (($row['id'] ?? '') === $order->id) {
                    $list[$i] = $order->toArray();
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $list[] = $order->toArray();
            }
            $data['orders'] = $list;
            return $data;
        });
    }

    public function delete(string $id): void
    {
        $this->store->update(static function (array $data) use ($id) {
            $data['orders'] = array_values(array_filter(
                $data['orders'] ?? [],
                static fn(array $o) => ($o['id'] ?? '') !== $id
            ));
            return $data;
        });
    }

    public function nextNumber(): string
    {
        $year = date('Y');
        $count = count($this->store->read()['orders'] ?? []) + 1;
        return sprintf('PED-%s-%03d', $year, $count);
    }

    private function map(array $row): Order
    {
        $items = array_map(
            static fn(array $i) => new OrderItem(
                $i['productId'] ?? null,
                $i['name'] ?? 'Item',
                (int) ($i['qty'] ?? 1),
                (float) ($i['price'] ?? 0),
                $i['detail'] ?? '',
            ),
            $row['items'] ?? []
        );

        return new Order(
            $row['id'],
            $row['number'],
            $row['clientId'] ?? '',
            $row['clientName'] ?? '',
            $row['clientWhatsapp'] ?? '',
            $items,
            (float) ($row['total'] ?? 0),
            $row['status'] ?? 'novo',
            $row['date'] ?? ($row['created_at'] ?? date('c')),
            $row['notes'] ?? '',
            $row['source'] ?? 'site',
        );
    }
}
