<?php
declare(strict_types=1);

namespace Gimarry\Infrastructure\Persistence;

use Gimarry\Domain\Repositories\SettingsRepositoryInterface;

final class JsonSettingsRepository implements SettingsRepositoryInterface
{
    public function __construct(private readonly JsonDataStore $store) {}

    public function get(): array
    {
        return $this->store->read()['settings'] ?? [];
    }

    public function save(array $settings): void
    {
        $this->store->update(static function (array $data) use ($settings) {
            $data['settings'] = array_merge($data['settings'] ?? [], $settings);
            return $data;
        });
    }
}
