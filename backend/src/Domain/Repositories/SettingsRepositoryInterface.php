<?php
declare(strict_types=1);

namespace Gimarry\Domain\Repositories;

interface SettingsRepositoryInterface
{
    public function get(): array;

    public function save(array $settings): void;
}
