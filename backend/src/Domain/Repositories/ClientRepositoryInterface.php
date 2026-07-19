<?php
declare(strict_types=1);

namespace Gimarry\Domain\Repositories;

use Gimarry\Domain\Entities\Client;

interface ClientRepositoryInterface
{
    /** @return Client[] */
    public function all(): array;

    public function findByPhone(string $phone): ?Client;

    public function findById(string $id): ?Client;

    public function save(Client $client): void;

    public function delete(string $id): void;
}
