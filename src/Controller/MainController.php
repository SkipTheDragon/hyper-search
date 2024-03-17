<?php

namespace App\Controller;

use Manticoresearch\Client;
use Manticoresearch\Query\BoolQuery;
use Manticoresearch\Query\MatchQuery;
use Manticoresearch\Search;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    #[Route('/')]
    public function index(): Response
    {
        return $this->render('index.html.twig', [
            'app_host' => $this->getParameter('app')['host']
        ]);
    }

    #[Route('/search/{term}', name: 'app_search', methods: ['POST'])]
    public function search(string $term): JsonResponse
    {
        $manticoreConfig = $this->getParameter('manticore');
        $config = ['host' => $manticoreConfig['host'], 'port' => $manticoreConfig['port']];

        $client = new Client($config);
        $search = new Search($client);
        $search->setIndex('links');

        $q = new BoolQuery();
        $q->must(new MatchQuery(['query' => $term . '~ 10', 'operator' => 'or'], '*'));
        $response = $search->search($q)->get();
        $manticoreResponse  = $response->getResponse()->getResponse();

        if (!isset($manticoreResponse['hits'])) {
            return $this->json(['message' => 'Nothing found for this search term.'], 404);
        }

        $result = $manticoreResponse['hits']['hits'];

        return $this->json($result);
    }
}
