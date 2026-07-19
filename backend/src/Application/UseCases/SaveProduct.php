<?php
declare(strict_types=1);

namespace Gimarry\Application\UseCases;

use Gimarry\Domain\Entities\Product;
use Gimarry\Domain\Repositories\CatalogRepositoryInterface;
use InvalidArgumentException;

final class SaveProduct
{
    public function __construct(private readonly CatalogRepositoryInterface $catalog) {}

    public function execute(array $input, ?string $id = null): Product
    {
        $name = trim((string) ($input['name'] ?? ''));
        if ($name === '') {
            throw new InvalidArgumentException('Nome do produto é obrigatório.');
        }
        $product = new Product(
            $id ?: ((string) ($input['id'] ?? '') ?: ('p' . bin2hex(random_bytes(4)))),
            $name,
            (string) ($input['description'] ?? ''),
            (float) ($input['price'] ?? 0),
            (string) ($input['categoryId'] ?? ''),
            (string) ($input['image'] ?? ''),
            (bool) ($input['featured'] ?? false),
            (bool) ($input['fromPrice'] ?? false),
        );
        $this->catalog->saveProduct($product);
        return $product;
    }
}
