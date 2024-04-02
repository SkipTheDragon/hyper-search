<?php

namespace App\Message;

use App\Architecture\Category;
use App\Architecture\WebsocketMessageInterface;
use App\Service\SearchService;

class CategoriesMessage implements WebsocketMessageInterface
{
    public function __construct(
        protected readonly SearchService $searchService,
    )
    {
    }

    public static function getMessageType(): string
    {
        return 'FETCH_CATEGORIES_QUERY';
    }

    public function execute(object $connection, array $payload): void
    {
        $start = microtime(true);
        try {
            $connection->send(json_encode(
                [
                    'status' => 'success',
                    'type' => self::getMessageType(),
                    'items' => [
                        [
                            'name' => Category::DOCUMENTATIONS,
                            'icon' => 'IoDocumentTextSharp',
                            'bgColor' => '#FF6384'
                        ],
                        [
                            'name' => Category::TUTORIALS,
                            'icon' => 'IoDocumentTextSharp',
                            'bgColor' => '#c8eb36'
                        ],
                        [
                            'name' => Category::KNOWLEDGE_BASE,
                            'icon' => 'IoBulbSharp',
                            'bgColor' => '#FFCE56'
                        ],
                        [
                            'name' => Category::FORUMS,
                            'icon' => 'IoChatbubblesSharp',
                            'bgColor' => '#4BC0C0'
                        ],
                        [
                            'name' => Category::DESCRIPTIONS,
                            'icon' => 'IoTextSharp',
                            'bgColor' => '#FF9F40'
                        ],
                        [
                            'name' => Category::PRODUCTS,
                            'icon' => 'IoCardSharp',
                            'bgColor' => '#9966FF'
                        ],
                        [
                            'name' => Category::ROADMAPS,
                            'icon' => 'IoMapSharp',
                            'bgColor' => '#FF6384'
                        ],
                        [
                            'name' => Category::CHANGELOGS,
                            'icon' => 'IoNewspaperSharp',
                            'bgColor' => '#36A2EB'
                        ],
                    ]
                ]
            ));

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
