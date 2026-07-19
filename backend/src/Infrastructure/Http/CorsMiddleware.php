<?php
declare(strict_types=1);

namespace Gimarry\Infrastructure\Http;

use Gimarry\Infrastructure\Config\EnvConfig;

final class CorsMiddleware
{
    public static function handle(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowed = EnvConfig::get('CORS_ORIGIN', 'https://gimarrybolos.com.br');
        $allowedList = array_values(array_filter(array_map('trim', explode(',', (string) $allowed))));

        if ($origin !== '') {
            if (in_array('*', $allowedList, true)) {
                header('Access-Control-Allow-Origin: *');
            } elseif (in_array($origin, $allowedList, true)) {
                header('Access-Control-Allow-Origin: ' . $origin);
                header('Access-Control-Allow-Credentials: true');
            }
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token');
        header('Vary: Origin');

        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
