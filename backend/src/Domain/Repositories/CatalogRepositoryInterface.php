<?php
declare(strict_types=1);

namespace Gimarry\Domain\Repositories;

use Gimarry\Domain\Entities\Category;
use Gimarry\Domain\Entities\Product;

interface CatalogRepositoryInterface
{
    /** @return Category[] */
    public function allCategories(): array;

    /** @return Product[] */
    public function allProducts(): array;

    public function saveProduct(Product $product): void;

    public function deleteProduct(string $id): void;

    public function saveCategory(Category $category): void;

    public function deleteCategory(string $id): void;

    /** @return array<int, array{id:string,name:string,text:string,rating:int,avatar:string}> */
    public function allReviews(): array;

    /** @return array<int, array{id:string,question:string,answer:string}> */
    public function allFaq(): array;

    /** @return string[] */
    public function allGallery(): array;
}
