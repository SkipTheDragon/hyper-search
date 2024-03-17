<?php

namespace App\Websocket;

use Exception;
use Manticoresearch\Client;
use Manticoresearch\Query\BoolQuery;
use Manticoresearch\Query\MatchQuery;
use Manticoresearch\Search;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use SplObjectStorage;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

/*
 * Inspired by https://rojas.io/symfony-5-websockets-tutorial/
 */

class MessageHandler implements MessageComponentInterface
{
    protected SplObjectStorage $connections;

    public function __construct(
        protected ParameterBagInterface $parameterBag
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
        foreach ($this->connections as $connection) {
            if ($from != $connection) {
                continue;
            }

            $manticoreConfig = $this->parameterBag->get('manticore');
            $config = ['host' => $manticoreConfig['host'], 'port' => $manticoreConfig['port']];

            $client = new Client($config);
            $search = new Search($client);
            $search->setIndex('links');

            $q = new BoolQuery();
            $q->must(new MatchQuery(['query' => $msg . '~ 10', 'operator' => 'or'], '*'));
            $response = $search->search($q)->get();
            $manticoreResponse = $response->getResponse()->getResponse();

            if (!isset($manticoreResponse['hits']) || $manticoreResponse['hits']['total'] === 0) {
                $connection->send(json_encode([
                    'status' => 'error',
                    'message' => 'Nothing found for this search term.'
                ]));

                continue;
            }

            $result = $manticoreResponse['hits']['hits'];
            $connection->send(json_encode([
                'status' => 'success',
                'data' => $result
            ]));
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
