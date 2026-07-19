<?php
declare(strict_types=1);

namespace Gimarry\Domain\Entities;

final class Order
{
    public const STATUSES = ['novo', 'preparo', 'entrega', 'finalizado', 'cancelado'];

    /** @param OrderItem[] $items */
    public function __construct(
        public readonly string $id,
        public readonly string $number,
        public readonly string $clientId,
        public readonly string $clientName,
        public readonly string $clientWhatsapp,
        public readonly array $items,
        public readonly float $total,
        public readonly string $status,
        public readonly string $createdAt,
        public readonly string $notes = '',
        public readonly string $source = 'site',
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'clientId' => $this->clientId,
            'clientName' => $this->clientName,
            'clientWhatsapp' => $this->clientWhatsapp,
            'items' => array_map(static fn(OrderItem $i) => $i->toArray(), $this->items),
            'total' => $this->total,
            'status' => $this->status,
            'date' => $this->createdAt,
            'notes' => $this->notes,
            'source' => $this->source,
        ];
    }
}
