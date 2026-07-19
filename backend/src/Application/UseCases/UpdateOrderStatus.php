<?php
declare(strict_types=1);

namespace Gimarry\Application\UseCases;

use Gimarry\Domain\Entities\Order;
use Gimarry\Domain\Repositories\ClientRepositoryInterface;
use Gimarry\Domain\Repositories\OrderRepositoryInterface;
use InvalidArgumentException;

final class UpdateOrderStatus
{
    public function __construct(
        private readonly OrderRepositoryInterface $orders,
        private readonly ClientRepositoryInterface $clients,
    ) {}

    public function execute(string $orderId, string $status, ?string $clientName = null, ?string $clientWhatsapp = null): Order
    {
        $order = $this->orders->findById($orderId);
        if (!$order) {
            throw new InvalidArgumentException('Pedido não encontrado.');
        }
        if (!in_array($status, Order::STATUSES, true)) {
            throw new InvalidArgumentException('Status inválido.');
        }

        $name = $clientName !== null ? trim($clientName) : $order->clientName;
        $phone = $clientWhatsapp !== null
            ? (preg_replace('/\D+/', '', $clientWhatsapp) ?: '')
            : $order->clientWhatsapp;

        if ($status === 'finalizado') {
            $parts = preg_split('/\s+/', $name) ?: [];
            if (count($parts) < 2) {
                throw new InvalidArgumentException('Nome completo é obrigatório para finalizar.');
            }
            if (strlen($phone) < 10) {
                throw new InvalidArgumentException('WhatsApp válido é obrigatório para finalizar.');
            }
        }

        $updated = new Order(
            $order->id,
            $order->number,
            $order->clientId,
            $name,
            $phone,
            $order->items,
            $order->total,
            $status,
            $order->createdAt,
            $order->notes,
            $order->source,
        );
        $this->orders->save($updated);

        if ($phone !== '') {
            $client = $this->clients->findById($order->clientId) ?? $this->clients->findByPhone($phone);
            if ($client) {
                $this->clients->save(new \Gimarry\Domain\Entities\Client(
                    $client->id,
                    $name,
                    $phone,
                    $client->email,
                    $client->address
                ));
            }
        }

        return $updated;
    }
}
