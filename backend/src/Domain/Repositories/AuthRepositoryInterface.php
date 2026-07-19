<?php
declare(strict_types=1);

namespace Gimarry\Domain\Repositories;

interface AuthRepositoryInterface
{
    public function verify(string $email, string $password): bool;

    public function updatePassword(string $email, string $currentPassword, string $newPassword): bool;

    public function getEmail(): string;
}
