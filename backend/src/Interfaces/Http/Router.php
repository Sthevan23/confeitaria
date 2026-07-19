<?php
declare(strict_types=1);

namespace Gimarry\Interfaces\Http;

use Gimarry\Infrastructure\AppContainer;
use Gimarry\Infrastructure\Http\JsonResponse;

final class Router
{
    public function __construct(private readonly AppContainer $app) {}

    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $path = '/' . trim($path, '/');
        // remove base like /api or /backend/public
        $path = preg_replace('#^/(api|backend/public|public)(/|$)#', '/', $path) ?: '/';
        if ($path !== '/') {
            $path = rtrim($path, '/') ?: '/';
        }

        $catalog = new CatalogController($this->app);
        $orders = new OrderController($this->app);
        $auth = new AuthController($this->app);
        $products = new ProductController($this->app);
        $categories = new CategoryController($this->app);
        $clients = new ClientController($this->app);
        $settings = new SettingsController($this->app);
        $finance = new FinanceController($this->app);
        $adminData = new AdminDataController($this->app);

        $routes = [
            'GET /catalog' => [$catalog, 'show'],
            'POST /orders' => [$orders, 'createPublic'],
            'GET /orders' => [$orders, 'index'],
            'POST /orders/admin' => [$orders, 'store'],
            'GET /auth/me' => [$auth, 'me'],
            'POST /auth/login' => [$auth, 'login'],
            'POST /auth/logout' => [$auth, 'logout'],
            'POST /auth/password' => [$auth, 'changePassword'],
            'GET /products' => [$products, 'index'],
            'POST /products' => [$products, 'store'],
            'GET /categories' => [$categories, 'index'],
            'POST /categories' => [$categories, 'store'],
            'GET /clients' => [$clients, 'index'],
            'POST /clients' => [$clients, 'store'],
            'GET /settings' => [$settings, 'show'],
            'PUT /settings' => [$settings, 'update'],
            'POST /settings' => [$settings, 'update'],
            'GET /finance/summary' => [$finance, 'summary'],
            'GET /admin/data' => [$adminData, 'pull'],
            'POST /admin/data' => [$adminData, 'push'],
            'GET /' => static function (): void {
                JsonResponse::ok(['ok' => true, 'name' => 'Gimarry API', 'version' => '1.0']);
            },
        ];

        $key = $method . ' ' . $path;
        if (isset($routes[$key])) {
            $handler = $routes[$key];
            if (is_callable($handler) && !is_array($handler)) {
                $handler();
                return;
            }
            [$ctrl, $action] = $handler;
            $ctrl->$action();
            return;
        }

        if (preg_match('#^/orders/([^/]+)$#', $path, $m)) {
            $id = urldecode($m[1]);
            if ($method === 'GET') {
                $orders->show($id);
                return;
            }
            if ($method === 'PUT' || $method === 'PATCH') {
                $orders->update($id);
                return;
            }
            if ($method === 'DELETE') {
                $orders->destroy($id);
                return;
            }
        }

        if (preg_match('#^/products/([^/]+)$#', $path, $m)) {
            $id = urldecode($m[1]);
            if ($method === 'PUT' || $method === 'PATCH') {
                $products->update($id);
                return;
            }
            if ($method === 'DELETE') {
                $products->destroy($id);
                return;
            }
        }

        if (preg_match('#^/categories/([^/]+)$#', $path, $m)) {
            $id = urldecode($m[1]);
            if ($method === 'PUT' || $method === 'PATCH') {
                $categories->update($id);
                return;
            }
            if ($method === 'DELETE') {
                $categories->destroy($id);
                return;
            }
        }

        if (preg_match('#^/clients/([^/]+)$#', $path, $m)) {
            $id = urldecode($m[1]);
            if ($method === 'PUT' || $method === 'PATCH') {
                $clients->update($id);
                return;
            }
            if ($method === 'DELETE') {
                $clients->destroy($id);
                return;
            }
        }

        JsonResponse::error('Rota não encontrada', 404, ['path' => $path, 'method' => $method]);
    }
}
