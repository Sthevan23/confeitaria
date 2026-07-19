<?php
declare(strict_types=1);

namespace Gimarry\Application\UseCases;

use Gimarry\Domain\Entities\Category;
use Gimarry\Domain\Repositories\CatalogRepositoryInterface;
use InvalidArgumentException;

final class SaveCategory
{
    public function __construct(private readonly CatalogRepositoryInterface $catalog) {}

    public function execute(array $input, ?string $id = null): Category
    {
        $name = trim((string) ($input['name'] ?? ''));
        if ($name === '') {
            throw new InvalidArgumentException('Nome da categoria é obrigatório.');
        }
        $slug = trim((string) ($input['slug'] ?? ''));
        if ($slug === '') {
            $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $name) ?: 'categoria');
        }
        $category = new Category(
            $id ?: ((string) ($input['id'] ?? '') ?: ('cat' . bin2hex(random_bytes(3)))),
            $name,
            $slug,
        );
        $this->catalog->saveCategory($category);
        return $category;
    }
}
