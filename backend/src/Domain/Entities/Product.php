<?php
declare(strict_types=1);

namespace Gimarry\Domain\Entities;

final class Product
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $description,
        public readonly float $price,
        public readonly string $categoryId,
        public readonly string $image,
        public readonly bool $featured = false,
        public readonly bool $fromPrice = false,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'categoryId' => $this->categoryId,
            'image' => $this->image,
            'featured' => $this->featured,
            'fromPrice' => $this->fromPrice,
        ];
    }
}
