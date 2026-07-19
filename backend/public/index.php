<?php
declare(strict_types=1);

require_once __DIR__ . '/autoload.php';

$basePath = is_dir(__DIR__ . DIRECTORY_SEPARATOR . 'src')
    ? __DIR__
    : dirname(__DIR__);

require_once $basePath . '/src/Interfaces/Http/Controllers.php';

use Gimarry\Infrastructure\AppContainer;
use Gimarry\Infrastructure\Auth\SessionAuth;
use Gimarry\Infrastructure\Http\CorsMiddleware;
use Gimarry\Infrastructure\Http\JsonResponse;
use Gimarry\Interfaces\Http\Router;

try {
    CorsMiddleware::handle();
    SessionAuth::start();

    $app = new AppContainer($basePath);
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $uri = $_GET['route'] ?? ($_SERVER['PATH_INFO'] ?? ($_SERVER['REQUEST_URI'] ?? '/'));

    (new Router($app))->dispatch($method, $uri);
} catch (Throwable $e) {
    JsonResponse::error('Erro interno', 500, [
        'detail' => $e->getMessage(),
    ]);
}
