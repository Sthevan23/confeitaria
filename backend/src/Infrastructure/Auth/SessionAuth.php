<?php
declare(strict_types=1);

namespace Gimarry\Infrastructure\Auth;

final class SessionAuth
{
    public static function start(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
            session_set_cookie_params([
                'lifetime' => 0,
                'path' => '/',
                'secure' => $secure,
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
            session_start();
        }
    }

    public static function login(string $email): void
    {
        self::start();
        session_regenerate_id(true);
        $_SESSION['admin_email'] = $email;
        $_SESSION['admin_logged'] = true;
        $_SESSION['admin_token'] = bin2hex(random_bytes(24));
    }

    public static function logout(): void
    {
        self::start();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'] ?? '', (bool) $p['secure'], (bool) $p['httponly']);
        }
        session_destroy();
    }

    public static function check(): bool
    {
        self::start();
        if (!empty($_SESSION['admin_logged'])) {
            return true;
        }
        $token = '';
        $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(\S+)/i', $auth, $m)) {
            $token = $m[1];
        } elseif (!empty($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
            $token = (string) $_SERVER['HTTP_X_ADMIN_TOKEN'];
        }
        if ($token === '' || empty($_SESSION['admin_token'])) {
            return false;
        }
        return hash_equals((string) $_SESSION['admin_token'], $token);
    }

    public static function requireAuth(): void
    {
        if (!self::check()) {
            JsonResponse::error('Não autenticado', 401);
        }
    }

    public static function token(): ?string
    {
        self::start();
        return $_SESSION['admin_token'] ?? null;
    }

    public static function email(): ?string
    {
        self::start();
        return $_SESSION['admin_email'] ?? null;
    }
}
