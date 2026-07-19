<?php
declare(strict_types=1);

namespace Gimarry\Application\UseCases;

use Gimarry\Domain\Repositories\AuthRepositoryInterface;

final class AdminLogin
{
    public function __construct(private readonly AuthRepositoryInterface $auth) {}

    public function execute(string $email, string $password): bool
    {
        return $this->auth->verify(trim($email), $password);
    }
}
