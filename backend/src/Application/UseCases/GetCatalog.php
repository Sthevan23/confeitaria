<?php
declare(strict_types=1);

namespace Gimarry\Application\UseCases;

use Gimarry\Domain\Repositories\CatalogRepositoryInterface;
use Gimarry\Domain\Repositories\SettingsRepositoryInterface;

final class GetCatalog
{
    public function __construct(
        private readonly CatalogRepositoryInterface $catalog,
        private readonly SettingsRepositoryInterface $settings,
    ) {}

    public function execute(): array
    {
        return [
            'settings' => $this->settings->get(),
            'categories' => array_map(static fn($c) => $c->toArray(), $this->catalog->allCategories()),
            'products' => array_map(static fn($p) => $p->toArray(), $this->catalog->allProducts()),
            'reviews' => $this->catalog->allReviews(),
            'faq' => $this->catalog->allFaq(),
            'gallery' => $this->catalog->allGallery(),
        ];
    }
}
