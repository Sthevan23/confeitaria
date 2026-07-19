<?php
declare(strict_types=1);

namespace Gimarry\Domain\Repositories;

use Gimarry\Domain\Entities\Order;

interface OrderRepositoryInterface
{
    /** @return Order[] */
    public function all(): array;

    public function findById(string $id): ?Order;

    public function save(Order $order): void;

    public function delete(string $id): void;

    public function nextNumber(): string;
}
