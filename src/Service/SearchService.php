<?php

namespace App\Service;

use Exception;
use Manticoresearch\Client;
use Manticoresearch\Query\BoolQuery;
use Manticoresearch\Query\MatchQuery;
use Manticoresearch\Search;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class SearchService
{
    protected Client $client;

    public function __construct(
        protected ParameterBagInterface $parameterBag,
        protected string $index = 'links'
    )
    {
        $manticoreConfig = $this->parameterBag->get('manticore');
        $config = ['host' => $manticoreConfig['host'], 'port' => $manticoreConfig['port']];
        $this->client = new Client($config);
    }

    /**
     * @throws Exception
     */
    public function search($keyword) : mixed
    {
        $search = new Search($this->client);
        $search->setIndex($this->index);

        $q = new BoolQuery();
        $q->must(new MatchQuery(['query' => $keyword . '~ 10', 'operator' => 'or'], '*'));
        $response = $search->search($q)->get();

        return $response->getResponse()->getResponse();
    }

    public function suggest(string $keyword, int $limit = 5) : array
    {
        $params = [
            'index' => $this->index,
            'body' => [
                'query' => $keyword . '~ 10',
                'options' => [
                    'limit' => $limit
                ],
            ]
        ];

        return $this->client->suggest($params);
    }

    public function autocomplete(string $keyword, int $limit = 5) : array
    {
        $params = [
            'index' => $this->index,
            'body' => [
                'query' => $keyword . '~ 10',
                'options' => [
                    'limit' => $limit
                ],
            ]
        ];

        return $this->client->keywords($params);
    }
}
