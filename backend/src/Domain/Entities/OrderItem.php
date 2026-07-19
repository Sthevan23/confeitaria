<?php
declare(strict_types=1);

namespace Gimarry\Domain\Entities;

final class OrderItem
{
    public function __construct(
        public readonly ?string $productId,
        public readonly string $name,
        public readonly int $qty,
        public readonly float $price,
        public readonly string $detail = '',
    ) {}

    public function subtotal(): float
    {
        return $this->qty * $this->price;
    }

    public function toArray(): array
    {
        return [
            'productId' => $this->productId,
            'name' => $this->name,
            'qty' => $this->qty,
            'price' => $this->price,
            'detail' => $this->detail,
        ];
    }
}
