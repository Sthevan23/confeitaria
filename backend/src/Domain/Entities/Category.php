<?php
declare(strict_types=1);

namespace Gimarry\Domain\Entities;

final class Category
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $slug,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
        ];
    }
}
