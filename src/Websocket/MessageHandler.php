<?php

namespace App\Websocket;

use App\Message\AutocompleteMessage;
use App\Message\CategoriesMessage;
use App\Message\SearchMessage;
use App\Message\SuggestionMessage;
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

    protected const REQUIRED_ARRAY_KEYS = [
        'type'
    ];

    protected const MESSAGE_TYPES = [
        SearchMessage::class,
        SuggestionMessage::class,
        AutocompleteMessage::class,
        CategoriesMessage::class
    ];

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
                $decodedMessage = json_decode($msg, true);

                foreach (self::REQUIRED_ARRAY_KEYS as $requiredKey) {
                    if (!array_key_exists($requiredKey, $decodedMessage)) {
                        throw new Exception('Malformed request!');
                    }
                }

                foreach (self::MESSAGE_TYPES as $message) {
                    /** @noinspection PhpUndefinedMethodInspection */
                    if ($message::getMessageType() === $decodedMessage['type']) {
                        $messageInstance = new $message($this->searchService);
                        $messageInstance->execute($connection, $decodedMessage['payload'] ?? []);
                        break;
                    }
                }

            } catch (Exception $e) {
                $responseTime = microtime(true) - $start;

                $connection->send(json_encode([
                    'status' => 'error',
                    'message' => 'Something went extremely wrong. This incident has been reported!',
                    'data' => [],
                    'extra' => [
                        'executionTime' => [
                            'took' => number_format($responseTime, 4). 'ms',
                            'tookRaw' => $responseTime
                        ],
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
