<?php
declare(strict_types=1);

namespace Gimarry\Infrastructure\Http;

final class JsonResponse
{
    public static function ok(mixed $data, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function error(string $message, int $status = 400, array $extra = []): never
    {
        self::ok(array_merge(['error' => $message], $extra), $status);
    }
}
