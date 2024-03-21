<?php

namespace App\Websocket;

use App\Service\SearchService;
use Exception;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use SplObjectStorage;

/*
 * Inspired by https://rojas.io/symfony-5-websockets-tutorial/
 */

class MessageHandler implements MessageComponentInterface
{
    protected SplObjectStorage $connections;

    public function __construct(
        protected readonly SearchService $searchService,
    )
    {
        $this->connections = new SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn): void
    {
        $this->connections->attach($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg): void
    {
        $start = microtime(true);

        foreach ($this->connections as $connection) {
            if ($from != $connection) {
                continue;
            }
            try {
                $manticoreResponse = $this->searchService->search($msg);

                $result = $manticoreResponse['hits']['hits'];

                $responseTime = microtime(true) - $start;

                $connection->send(json_encode([
                    'status' => 'success',
                    'data' => $result,
                    'extraData' => [
                        'executionTime' => [
                            'took' => number_format($responseTime, 4). 'ms',
                            'tookRaw' => $responseTime
                        ],
                        'suggestions' => $this->searchService->suggest($msg),
                        'total' => $manticoreResponse['hits']['total']
                    ]
                ]));
            } catch (Exception $e) {
                $responseTime = microtime(true) - $start;

                $connection->send(json_encode([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                    'data' => [],
                    'extraData' => [
                        'suggestions' => $this->searchService->suggest($msg),
                        'executionTime' => [
                            'took' => number_format($responseTime, 4). 'ms',
                            'tookRaw' => $responseTime
                        ],
                        'total' => 0
                    ]
                ]));
                continue;
            }
        }

    }

    public function onClose(ConnectionInterface $conn): void
    {
        $this->connections->detach($conn);
    }

    public function onError(ConnectionInterface $conn, Exception $e): void
    {
        $this->connections->detach($conn);
        $conn->close();
    }
}
