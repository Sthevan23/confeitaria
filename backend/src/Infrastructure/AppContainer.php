<?php
declare(strict_types=1);

namespace Gimarry\Infrastructure;

use Gimarry\Application\UseCases\AdminLogin;
use Gimarry\Application\UseCases\CreatePublicOrder;
use Gimarry\Application\UseCases\GetCatalog;
use Gimarry\Application\UseCases\GetFinanceSummary;
use Gimarry\Application\UseCases\SaveCategory;
use Gimarry\Application\UseCases\SaveClient;
use Gimarry\Application\UseCases\SaveOrder;
use Gimarry\Application\UseCases\SaveProduct;
use Gimarry\Application\UseCases\UpdateOrderStatus;
use Gimarry\Domain\Repositories\AuthRepositoryInterface;
use Gimarry\Domain\Repositories\CatalogRepositoryInterface;
use Gimarry\Domain\Repositories\ClientRepositoryInterface;
use Gimarry\Domain\Repositories\OrderRepositoryInterface;
use Gimarry\Domain\Repositories\SettingsRepositoryInterface;
use Gimarry\Infrastructure\Auth\JsonAuthRepository;
use Gimarry\Infrastructure\Config\EnvConfig;
use Gimarry\Infrastructure\Persistence\JsonCatalogRepository;
use Gimarry\Infrastructure\Persistence\JsonClientRepository;
use Gimarry\Infrastructure\Persistence\JsonDataStore;
use Gimarry\Infrastructure\Persistence\JsonOrderRepository;
use Gimarry\Infrastructure\Persistence\JsonSettingsRepository;

final class AppContainer
{
    private JsonDataStore $store;
    public CatalogRepositoryInterface $catalog;
    public OrderRepositoryInterface $orders;
    public ClientRepositoryInterface $clients;
    public SettingsRepositoryInterface $settings;
    public AuthRepositoryInterface $auth;

    public function __construct(string $basePath)
    {
        EnvConfig::load($basePath);
        $dataFile = EnvConfig::get('DATA_FILE')
            ?: ($basePath . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'data.json');
        $this->store = new JsonDataStore($dataFile);
        $this->catalog = new JsonCatalogRepository($this->store);
        $this->orders = new JsonOrderRepository($this->store);
        $this->clients = new JsonClientRepository($this->store);
        $this->settings = new JsonSettingsRepository($this->store);
        $this->auth = new JsonAuthRepository($this->store);
    }

    public function getCatalog(): GetCatalog
    {
        return new GetCatalog($this->catalog, $this->settings);
    }

    public function createPublicOrder(): CreatePublicOrder
    {
        return new CreatePublicOrder($this->orders, $this->clients);
    }

    public function updateOrderStatus(): UpdateOrderStatus
    {
        return new UpdateOrderStatus($this->orders, $this->clients);
    }

    public function adminLogin(): AdminLogin
    {
        return new AdminLogin($this->auth);
    }

    public function financeSummary(): GetFinanceSummary
    {
        return new GetFinanceSummary($this->orders);
    }

    public function saveOrder(): SaveOrder
    {
        return new SaveOrder($this->orders, $this->clients);
    }

    public function saveProduct(): SaveProduct
    {
        return new SaveProduct($this->catalog);
    }

    public function saveCategory(): SaveCategory
    {
        return new SaveCategory($this->catalog);
    }

    public function saveClient(): SaveClient
    {
        return new SaveClient($this->clients);
    }

    public function store(): JsonDataStore
    {
        return $this->store;
    }
}
