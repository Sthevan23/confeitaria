<?php
declare(strict_types=1);

$gimarryRoot = is_dir(__DIR__ . DIRECTORY_SEPARATOR . 'src')
    ? __DIR__
    : dirname(__DIR__);

spl_autoload_register(static function (string $class) use ($gimarryRoot): void {
    $prefix = 'Gimarry\\';
    if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
        return;
    }
    $relative = str_replace('\\', DIRECTORY_SEPARATOR, substr($class, strlen($prefix)));
    $file = $gimarryRoot . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . $relative . '.php';
    if (is_file($file)) {
        require_once $file;
    }
});
