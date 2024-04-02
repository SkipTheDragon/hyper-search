<?php

namespace App\Message;

use App\Architecture\WebsocketMessageInterface;
use App\Service\SearchService;

class SuggestionMessage implements WebsocketMessageInterface
{
    public function __construct(
        protected readonly SearchService $searchService,
    )
    {
    }

    public static function getMessageType(): string
    {
        return 'SUGGESTION_QUERY';
    }

    public function execute(object $connection, array $payload): void
    {
        $start = microtime(true);
        try {

            if (!isset($payload['term'])) {
                throw new \Exception(self::getMessageType() . ' is missing the term key inside the payload!');
            }

            $result = $this->searchService->suggest($payload['term']);

            $responseTime = microtime(true) - $start;

            $connection->send(json_encode([
                'status' => 'success',
                'type' => self::getMessageType(),
                'suggestions' => $result,
                'extra' => [
                    'executionTime' => [
                        'took' => number_format($responseTime, 4) . 'ms',
                        'tookRaw' => $responseTime
                    ],
                    'total' => count($result)
                ]
            ]));

        } catch (\Exception $exception) {
            $responseTime = microtime(true) - $start;

            $connection->send(
                json_encode(
                    [
                        'status' => 'error',
                        'type' => self::getMessageType(),
                        'message' => 'Something went extremely wrong. This incident has been reported!',
                        'extra' => [
                            'executionTime' => [
                                'took' => number_format($responseTime, 4) . 'ms',
                                'tookRaw' => $responseTime
                            ],
                        ]
                    ]
                )
            );
        }
    }
}
