<?php
declare(strict_types=1);

namespace Gimarry\Interfaces\Http;

use Gimarry\Infrastructure\AppContainer;
use Gimarry\Infrastructure\Auth\SessionAuth;
use Gimarry\Infrastructure\Http\JsonResponse;
use InvalidArgumentException;
use Throwable;

final class CatalogController
{
    public function __construct(private readonly AppContainer $app) {}

    public function show(): void
    {
        JsonResponse::ok($this->app->getCatalog()->execute());
    }
}

final class OrderController
{
    public function __construct(private readonly AppContainer $app) {}

    public function createPublic(): void
    {
        try {
            $body = Request::json();
            $order = $this->app->createPublicOrder()->execute($body);
            JsonResponse::ok(['ok' => true, 'order' => $order->toArray()], 201);
        } catch (InvalidArgumentException $e) {
            JsonResponse::error($e->getMessage(), 422);
        }
    }

    public function index(): void
    {
        SessionAuth::requireAuth();
        $list = array_map(static fn($o) => $o->toArray(), $this->app->orders->all());
        JsonResponse::ok(['orders' => $list]);
    }

    public function show(string $id): void
    {
        SessionAuth::requireAuth();
        $order = $this->app->orders->findById($id);
        if (!$order) {
            JsonResponse::error('Pedido não encontrado', 404);
        }
        JsonResponse::ok(['order' => $order->toArray()]);
    }

    public function store(): void
    {
        SessionAuth::requireAuth();
        try {
            $order = $this->app->saveOrder()->execute(Request::json());
            JsonResponse::ok(['ok' => true, 'order' => $order->toArray()], 201);
        } catch (InvalidArgumentException $e) {
            JsonResponse::error($e->getMessage(), 422);
        }
    }

    public function update(string $id): void
    {
        SessionAuth::requireAuth();
        try {
            $body = Request::json();
            if (isset($body['status']) && count($body) <= 4) {
                $order = $this->app->updateOrderStatus()->execute(
                    $id,
                    (string) $body['status'],
                    isset($body['clientName']) ? (string) $body['clientName'] : null,
                    isset($body['clientWhatsapp']) ? (string) $body['clientWhatsapp'] : null,
                );
            } else {
                $order = $this->app->saveOrder()->execute($body, $id);
            }
            JsonResponse::ok(['ok' => true, 'order' => $order->toArray()]);
        } catch (InvalidArgumentException $e) {
            JsonResponse::error($e->getMessage(), 422);
        }
    }

    public function destroy(string $id): void
    {
        SessionAuth::requireAuth();
        $this->app->orders->delete($id);
        JsonResponse::ok(['ok' => true]);
    }
}

final class AuthController
{
    public function __construct(private readonly AppContainer $app) {}

    public function login(): void
    {
        $body = Request::json();
        $email = trim((string) ($body['email'] ?? ''));
        $password = (string) ($body['password'] ?? '');
        if (!$this->app->adminLogin()->execute($email, $password)) {
            JsonResponse::error('Credenciais inválidas', 401);
        }
        SessionAuth::login($email);
        JsonResponse::ok([
            'ok' => true,
            'email' => $email,
            'token' => SessionAuth::token(),
        ]);
    }

    public function logout(): void
    {
        SessionAuth::logout();
        JsonResponse::ok(['ok' => true]);
    }

    public function me(): void
    {
        SessionAuth::requireAuth();
        JsonResponse::ok([
            'ok' => true,
            'email' => SessionAuth::email(),
            'token' => SessionAuth::token(),
        ]);
    }

    public function changePassword(): void
    {
        SessionAuth::requireAuth();
        $body = Request::json();
        $ok = $this->app->auth->updatePassword(
            SessionAuth::email() ?: '',
            (string) ($body['currentPassword'] ?? ''),
            (string) ($body['newPassword'] ?? '')
        );
        if (!$ok) {
            JsonResponse::error('Senha atual incorreta', 422);
        }
        JsonResponse::ok(['ok' => true]);
    }
}

final class ProductController
{
    public function __construct(private readonly AppContainer $app) {}

    public function index(): void
    {
        SessionAuth::requireAuth();
        JsonResponse::ok([
            'products' => array_map(static fn($p) => $p->toArray(), $this->app->catalog->allProducts()),
        ]);
    }

    public function store(): void
    {
        SessionAuth::requireAuth();
        try {
            $p = $this->app->saveProduct()->execute(Request::json());
            JsonResponse::ok(['ok' => true, 'product' => $p->toArray()], 201);
        } catch (InvalidArgumentException $e) {
            JsonResponse::error($e->getMessage(), 422);
        }
    }

    public function update(string $id): void
    {
        SessionAuth::requireAuth();
        try {
            $p = $this->app->saveProduct()->execute(Request::json(), $id);
            JsonResponse::ok(['ok' => true, 'product' => $p->toArray()]);
        } catch (InvalidArgumentException $e) {
            JsonResponse::error($e->getMessage(), 422);
        }
    }

    public function destroy(string $id): void
    {
        SessionAuth::requireAuth();
        $this->app->catalog->deleteProduct($id);
        JsonResponse::ok(['ok' => true]);
    }
}

final class CategoryController
{
    public function __construct(private readonly AppContainer $app) {}

    public function index(): void
    {
        SessionAuth::requireAuth();
        JsonResponse::ok([
            'categories' => array_map(static fn($c) => $c->toArray(), $this->app->catalog->allCategories()),
        ]);
    }

    public function store(): void
    {
        SessionAuth::requireAuth();
        try {
            $c = $this->app->saveCategory()->execute(Request::json());
            JsonResponse::ok(['ok' => true, 'category' => $c->toArray()], 201);
        } catch (InvalidArgumentException $e) {
            JsonResponse::error($e->getMessage(), 422);
        }
    }

    public function update(string $id): void
    {
        SessionAuth::requireAuth();
        try {
            $c = $this->app->saveCategory()->execute(Request::json(), $id);
            JsonResponse::ok(['ok' => true, 'category' => $c->toArray()]);
        } catch (InvalidArgumentException $e) {
            JsonResponse::error($e->getMessage(), 422);
        }
    }

    public function destroy(string $id): void
    {
        SessionAuth::requireAuth();
        $this->app->catalog->deleteCategory($id);
        JsonResponse::ok(['ok' => true]);
    }
}

final class ClientController
{
    public function __construct(private readonly AppContainer $app) {}

    public function index(): void
    {
        SessionAuth::requireAuth();
        JsonResponse::ok([
            'clients' => array_map(static fn($c) => $c->toArray(), $this->app->clients->all()),
        ]);
    }

    public function store(): void
    {
        SessionAuth::requireAuth();
        try {
            $c = $this->app->saveClient()->execute(Request::json());
            JsonResponse::ok(['ok' => true, 'client' => $c->toArray()], 201);
        } catch (InvalidArgumentException $e) {
            JsonResponse::error($e->getMessage(), 422);
        }
    }

    public function update(string $id): void
    {
        SessionAuth::requireAuth();
        try {
            $c = $this->app->saveClient()->execute(Request::json(), $id);
            JsonResponse::ok(['ok' => true, 'client' => $c->toArray()]);
        } catch (InvalidArgumentException $e) {
            JsonResponse::error($e->getMessage(), 422);
        }
    }

    public function destroy(string $id): void
    {
        SessionAuth::requireAuth();
        $this->app->clients->delete($id);
        JsonResponse::ok(['ok' => true]);
    }
}

final class SettingsController
{
    public function __construct(private readonly AppContainer $app) {}

    public function show(): void
    {
        SessionAuth::requireAuth();
        JsonResponse::ok(['settings' => $this->app->settings->get()]);
    }

    public function update(): void
    {
        SessionAuth::requireAuth();
        $this->app->settings->save(Request::json());
        JsonResponse::ok(['ok' => true, 'settings' => $this->app->settings->get()]);
    }
}

final class FinanceController
{
    public function __construct(private readonly AppContainer $app) {}

    public function summary(): void
    {
        SessionAuth::requireAuth();
        $period = (string) ($_GET['period'] ?? 'all');
        JsonResponse::ok($this->app->financeSummary()->execute($period));
    }
}

final class AdminDataController
{
    /** Compat: painel legado que salva o blob completo */
    public function __construct(private readonly AppContainer $app) {}

    public function pull(): void
    {
        SessionAuth::requireAuth();
        $data = $this->app->store()->read();
        unset($data['auth']['password'], $data['auth']['password_hash']);
        JsonResponse::ok($data);
    }

    public function push(): void
    {
        SessionAuth::requireAuth();
        $body = Request::json();
        $current = $this->app->store()->read();
        $auth = $current['auth'] ?? [];
        foreach (['settings', 'categories', 'products', 'clients', 'orders', 'reviews', 'faq', 'gallery'] as $key) {
            if (array_key_exists($key, $body)) {
                $current[$key] = $body[$key];
            }
        }
        $current['auth'] = $auth;
        $this->app->store()->write($current);
        JsonResponse::ok(['ok' => true]);
    }
}

final class Request
{
    public static function json(): array
    {
        $raw = file_get_contents('php://input') ?: '';
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
}
