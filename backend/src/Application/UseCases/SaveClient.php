<?php
declare(strict_types=1);

namespace Gimarry\Application\UseCases;

use Gimarry\Domain\Entities\Client;
use Gimarry\Domain\Repositories\ClientRepositoryInterface;
use InvalidArgumentException;

final class SaveClient
{
    public function __construct(private readonly ClientRepositoryInterface $clients) {}

    public function execute(array $input, ?string $id = null): Client
    {
        $name = trim((string) ($input['name'] ?? ''));
        $phone = preg_replace('/\D+/', '', (string) ($input['phone'] ?? '')) ?: '';
        if ($name === '') {
            throw new InvalidArgumentException('Nome do cliente é obrigatório.');
        }
        $client = new Client(
            $id ?: ((string) ($input['id'] ?? '') ?: ('c' . bin2hex(random_bytes(4)))),
            $name,
            $phone,
            (string) ($input['email'] ?? ''),
            (string) ($input['address'] ?? ''),
        );
        $this->clients->save($client);
        return $client;
    }
}
