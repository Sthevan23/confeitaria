<?php
declare(strict_types=1);

namespace Gimarry\Infrastructure\Persistence;

use Gimarry\Domain\Entities\Client;
use Gimarry\Domain\Repositories\ClientRepositoryInterface;

final class JsonClientRepository implements ClientRepositoryInterface
{
    public function __construct(private readonly JsonDataStore $store) {}

    public function all(): array
    {
        return array_map(
            static fn(array $c) => new Client(
                $c['id'],
                $c['name'],
                preg_replace('/\D+/', '', (string) ($c['phone'] ?? '')) ?: '',
                $c['email'] ?? '',
                $c['address'] ?? '',
            ),
            $this->store->read()['clients'] ?? []
        );
    }

    public function findByPhone(string $phone): ?Client
    {
        $digits = preg_replace('/\D+/', '', $phone) ?: '';
        foreach ($this->all() as $client) {
            if ($client->phone === $digits) {
                return $client;
            }
        }
        return null;
    }

    public function findById(string $id): ?Client
    {
        foreach ($this->all() as $client) {
            if ($client->id === $id) {
                return $client;
            }
        }
        return null;
    }

    public function save(Client $client): void
    {
        $this->store->update(static function (array $data) use ($client) {
            $list = $data['clients'] ?? [];
            $found = false;
            foreach ($list as $i => $row) {
                if (($row['id'] ?? '') === $client->id || ($row['phone'] ?? '') === $client->phone) {
                    $list[$i] = $client->toArray();
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $list[] = $client->toArray();
            }
            $data['clients'] = $list;
            return $data;
        });
    }

    public function delete(string $id): void
    {
        $this->store->update(static function (array $data) use ($id) {
            $data['clients'] = array_values(array_filter(
                $data['clients'] ?? [],
                static fn(array $c) => ($c['id'] ?? '') !== $id
            ));
            return $data;
        });
    }
}
