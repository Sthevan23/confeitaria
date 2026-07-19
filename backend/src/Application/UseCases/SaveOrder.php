<?php
declare(strict_types=1);

namespace Gimarry\Application\UseCases;

use Gimarry\Domain\Entities\Order;
use Gimarry\Domain\Entities\OrderItem;
use Gimarry\Domain\Repositories\ClientRepositoryInterface;
use Gimarry\Domain\Repositories\OrderRepositoryInterface;
use Gimarry\Domain\Entities\Client;
use InvalidArgumentException;

final class SaveOrder
{
    public function __construct(
        private readonly OrderRepositoryInterface $orders,
        private readonly ClientRepositoryInterface $clients,
    ) {}

    public function execute(array $input, ?string $existingId = null): Order
    {
        $name = trim((string) ($input['clientName'] ?? ''));
        $phone = preg_replace('/\D+/', '', (string) ($input['clientWhatsapp'] ?? $input['whatsapp'] ?? '')) ?: '';
        $itemsInput = $input['items'] ?? [];
        if ($name === '' || !is_array($itemsInput) || count($itemsInput) === 0) {
            throw new InvalidArgumentException('Pedido inválido: nome e itens são obrigatórios.');
        }

        $clientId = (string) ($input['clientId'] ?? '');
        if ($clientId === '' && $phone !== '') {
            $existing = $this->clients->findByPhone($phone);
            if ($existing) {
                $clientId = $existing->id;
            } else {
                $clientId = 'c' . bin2hex(random_bytes(6));
                $this->clients->save(new Client($clientId, $name, $phone, '', ''));
            }
        }

        $items = [];
        $total = 0.0;
        foreach ($itemsInput as $row) {
            $item = new OrderItem(
                isset($row['productId']) ? (string) $row['productId'] : null,
                (string) ($row['name'] ?? 'Produto'),
                max(1, (int) ($row['qty'] ?? 1)),
                (float) ($row['price'] ?? 0),
                (string) ($row['detail'] ?? ''),
            );
            $items[] = $item;
            $total += $item->subtotal();
        }

        $id = $existingId ?: ((string) ($input['id'] ?? '') ?: ('o' . bin2hex(random_bytes(6))));
        $current = $existingId ? $this->orders->findById($existingId) : null;

        $order = new Order(
            $id,
            (string) ($input['number'] ?? ($current?->number ?? $this->orders->nextNumber())),
            $clientId,
            $name,
            $phone,
            $items,
            isset($input['total']) ? (float) $input['total'] : $total,
            (string) ($input['status'] ?? ($current?->status ?? 'novo')),
            (string) ($input['date'] ?? ($current?->createdAt ?? date('c'))),
            (string) ($input['notes'] ?? ''),
            (string) ($input['source'] ?? ($current?->source ?? 'admin')),
        );
        $this->orders->save($order);
        return $order;
    }
}
