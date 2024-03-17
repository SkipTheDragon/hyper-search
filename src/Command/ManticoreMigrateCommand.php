<?php

namespace App\Command;

use Manticoresearch\Client;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[AsCommand(
    name: 'manticore:migrate',
    description: 'Add a short description for your command',
)]
class ManticoreMigrateCommand extends Command
{
    public function __construct(
        protected readonly ParameterBagInterface $parameterBag,
    )
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $manticoreConfig = $this->parameterBag->get('manticore');
        $config = ['host' => $manticoreConfig['host'], 'port' => $manticoreConfig['port']];
        $client = new Client($config);

        $index = $client->index('links');

        $index->create([
            'location' => ['type' => 'text'],
            'title' => ['type' => 'text'],
            'description' => ['type' => 'text'],
            'link' => ['type' => 'text']
        ]);

        $io->success('Index created.');

        return Command::SUCCESS;
    }
}
