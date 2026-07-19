<?php
declare(strict_types=1);

namespace Gimarry\Infrastructure\Persistence;

use Gimarry\Domain\Entities\Category;
use Gimarry\Domain\Entities\Product;
use Gimarry\Domain\Repositories\CatalogRepositoryInterface;

final class JsonCatalogRepository implements CatalogRepositoryInterface
{
    public function __construct(private readonly JsonDataStore $store) {}

    public function allCategories(): array
    {
        return array_map(
            static fn(array $c) => new Category($c['id'], $c['name'], $c['slug']),
            $this->store->read()['categories'] ?? []
        );
    }

    public function allProducts(): array
    {
        return array_map(
            static fn(array $p) => new Product(
                $p['id'],
                $p['name'],
                $p['description'] ?? '',
                (float) ($p['price'] ?? 0),
                $p['categoryId'] ?? $p['category_id'] ?? '',
                $p['image'] ?? '',
                (bool) ($p['featured'] ?? false),
                (bool) ($p['fromPrice'] ?? $p['from_price'] ?? false),
            ),
            $this->store->read()['products'] ?? []
        );
    }

    public function saveProduct(Product $product): void
    {
        $this->store->update(static function (array $data) use ($product) {
            $list = $data['products'] ?? [];
            $found = false;
            foreach ($list as $i => $row) {
                if (($row['id'] ?? '') === $product->id) {
                    $list[$i] = $product->toArray();
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $list[] = $product->toArray();
            }
            $data['products'] = $list;
            return $data;
        });
    }

    public function deleteProduct(string $id): void
    {
        $this->store->update(static function (array $data) use ($id) {
            $data['products'] = array_values(array_filter(
                $data['products'] ?? [],
                static fn(array $p) => ($p['id'] ?? '') !== $id
            ));
            return $data;
        });
    }

    public function saveCategory(Category $category): void
    {
        $this->store->update(static function (array $data) use ($category) {
            $list = $data['categories'] ?? [];
            $found = false;
            foreach ($list as $i => $row) {
                if (($row['id'] ?? '') === $category->id) {
                    $list[$i] = $category->toArray();
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $list[] = $category->toArray();
            }
            $data['categories'] = $list;
            return $data;
        });
    }

    public function deleteCategory(string $id): void
    {
        $this->store->update(static function (array $data) use ($id) {
            $data['categories'] = array_values(array_filter(
                $data['categories'] ?? [],
                static fn(array $c) => ($c['id'] ?? '') !== $id
            ));
            return $data;
        });
    }

    public function allReviews(): array
    {
        return $this->store->read()['reviews'] ?? [];
    }

    public function allFaq(): array
    {
        return $this->store->read()['faq'] ?? [];
    }

    public function allGallery(): array
    {
        return $this->store->read()['gallery'] ?? [];
    }
}
