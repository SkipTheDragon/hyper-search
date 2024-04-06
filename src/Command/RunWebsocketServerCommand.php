<?php

namespace App\Command;

use App\Service\SearchService;
use App\Websocket\MessageHandler;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'run:websocket-server',
    description: 'Run the websocket server.'
)]
class RunWebsocketServerCommand extends Command
{
    public function __construct(
        protected SearchService $searchService
    )
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $port = 1241;
        $output->writeln("Starting server on port " . $port);

        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    new MessageHandler(
                        $this->searchService
                    )
                )
            ),
            $port
        );
        $server->run();
        return Command::SUCCESS;
    }
}
