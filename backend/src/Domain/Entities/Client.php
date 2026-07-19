<?php
declare(strict_types=1);

namespace Gimarry\Domain\Entities;

final class Client
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $phone,
        public readonly string $email = '',
        public readonly string $address = '',
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
        ];
    }
}
