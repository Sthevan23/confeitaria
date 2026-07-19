<?php
declare(strict_types=1);

namespace Gimarry\Application\UseCases;

use Gimarry\Domain\Entities\Client;
use Gimarry\Domain\Entities\Order;
use Gimarry\Domain\Entities\OrderItem;
use Gimarry\Domain\Repositories\ClientRepositoryInterface;
use Gimarry\Domain\Repositories\OrderRepositoryInterface;
use InvalidArgumentException;

final class CreatePublicOrder
{
    public function __construct(
        private readonly OrderRepositoryInterface $orders,
        private readonly ClientRepositoryInterface $clients,
    ) {}

    public function execute(array $input): Order
    {
        $firstName = trim((string) ($input['firstName'] ?? $input['nome'] ?? ''));
        $lastName = trim((string) ($input['lastName'] ?? $input['sobrenome'] ?? ''));
        $fullName = trim((string) ($input['fullName'] ?? ($firstName . ' ' . $lastName)));
        $phone = preg_replace('/\D+/', '', (string) ($input['whatsapp'] ?? $input['phone'] ?? '')) ?: '';
        $itemsInput = $input['items'] ?? [];

        if ($fullName === '' || str_word_count($fullName) < 1) {
            throw new InvalidArgumentException('Nome é obrigatório.');
        }
        if (strlen($phone) < 10) {
            throw new InvalidArgumentException('Telefone/WhatsApp válido com DDD é obrigatório.');
        }
        if (!is_array($itemsInput) || count($itemsInput) === 0) {
            throw new InvalidArgumentException('Informe ao menos um item.');
        }

        $parts = preg_split('/\s+/', $fullName) ?: [];
        if (count($parts) < 2 && $lastName === '') {
            throw new InvalidArgumentException('Informe nome e sobrenome.');
        }

        $client = $this->clients->findByPhone($phone);
        if (!$client) {
            $client = new Client(
                'c' . bin2hex(random_bytes(6)),
                $fullName,
                $phone,
                '',
                ''
            );
        } else {
            $client = new Client($client->id, $fullName, $phone, $client->email, $client->address);
        }
        $this->clients->save($client);

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

        $order = new Order(
            'o' . bin2hex(random_bytes(6)),
            $this->orders->nextNumber(),
            $client->id,
            $fullName,
            $phone,
            $items,
            isset($input['total']) ? (float) $input['total'] : $total,
            'novo',
            date('c'),
            (string) ($input['notes'] ?? ''),
            (string) ($input['source'] ?? 'site'),
        );

        $this->orders->save($order);
        return $order;
    }
}
