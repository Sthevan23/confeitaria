<?php
declare(strict_types=1);

namespace Gimarry\Infrastructure\Config;

final class EnvConfig
{
    private static ?array $cache = null;

    public static function load(string $basePath): void
    {
        $envFile = $basePath . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . '.env';
        if (!is_file($envFile)) {
            return;
        }
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value, " \t\"'");
            $_ENV[$key] = $value;
            putenv($key . '=' . $value);
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        return $_ENV[$key] ?? getenv($key) ?: $default;
    }

    public static function useJsonStore(): bool
    {
        $driver = strtolower((string) self::get('DB_DRIVER', 'json'));
        return $driver === 'json' || self::get('DB_HOST') === null || self::get('DB_HOST') === '';
    }
}
