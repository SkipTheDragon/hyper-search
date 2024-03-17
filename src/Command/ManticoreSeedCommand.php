<?php

namespace App\Command;

use App\Architecture\Locations;
use Manticoresearch\Client;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[AsCommand(
    name: 'manticore:seed',
    description: 'Add a short description for your command',
)]
class ManticoreSeedCommand extends Command
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

        $index->addDocuments([
            ['location' => Locations::CHANGELOGS, 'title' => 'Version 1.0.0', 'description' => 'Finally released the first version!', 'link' => 'https://en.wikipedia.org/wiki/New_York'],
            ['location' => Locations::DOCUMENTATIONS, 'title' => 'Getting Started Guide', 'description' => 'Learn how to set up and use our software.', 'link' => 'https://example.com/documentation/getting-started'],
            ['location' => Locations::DOCUMENTATIONS, 'title' => 'Advanced Usage Manual', 'description' => 'Discover advanced features and usage scenarios.', 'link' => 'https://example.com/documentation/advanced-usage'],
            ['location' => Locations::TUTORIALS, 'title' => 'Basic Concepts Tutorial', 'description' => 'Explore the fundamental concepts with this tutorial.', 'link' => 'https://example.com/tutorials/basic-concepts'],
            ['location' => Locations::TUTORIALS, 'title' => 'Integration Tutorial', 'description' => 'Learn how to integrate our software with other tools.', 'link' => 'https://example.com/tutorials/integration'],
            ['location' => Locations::KNOWLEDGE_BASE, 'title' => 'FAQs and Troubleshooting', 'description' => 'Find answers to common questions and troubleshoot issues.', 'link' => 'https://example.com/knowledge-base/faqs'],
            ['location' => Locations::KNOWLEDGE_BASE, 'title' => 'Best Practices Guide', 'description' => 'Follow best practices for optimal usage of our software.', 'link' => 'https://example.com/knowledge-base/best-practices'],
            ['location' => Locations::FORUMS, 'title' => 'Community Discussions', 'description' => 'Engage with the community and share your experiences.', 'link' => 'https://example.com/forums/community-discussions'],
            ['location' => Locations::FORUMS, 'title' => 'Feature Requests', 'description' => 'Suggest and discuss new features for our products.', 'link' => 'https://example.com/forums/feature-requests'],
            ['location' => Locations::DESCRIPTIONS, 'title' => 'Product Descriptions', 'description' => 'Detailed descriptions of our products and their features.', 'link' => 'https://example.com/descriptions/product-details'],
            ['location' => Locations::DESCRIPTIONS, 'title' => 'Technical Specifications', 'description' => 'Explore the technical specifications of our products.', 'link' => 'https://example.com/descriptions/technical-specs'],
            ['location' => Locations::PRODUCTS, 'title' => 'New Product Launch', 'description' => 'Introducing our latest product to the market.', 'link' => 'https://example.com/products/new-launch'],
            ['location' => Locations::PRODUCTS, 'title' => 'Product Showcase', 'description' => 'Highlighting the key features of our products.', 'link' => 'https://example.com/products/showcase'],
            ['location' => Locations::ROADMAPS, 'title' => 'Development Roadmap', 'description' => 'Explore the future plans and developments.', 'link' => 'https://example.com/roadmaps/development-roadmap'],
            ['location' => Locations::ROADMAPS, 'title' => 'Upcoming Features Preview', 'description' => 'Get a sneak peek into the upcoming features.', 'link' => 'https://example.com/roadmaps/upcoming-features'],
            ['location' => Locations::CHANGELOGS, 'title' => 'Version 2.0.0', 'description' => 'Check out the release notes for the latest version.', 'link' => 'https://example.com/changelogs/version-2.0.0'],
            ['location' => Locations::CHANGELOGS, 'title' => 'Version 2.1.0', 'description' => 'Explore the new features and improvements in this release.', 'link' => 'https://example.com/changelogs/version-2.1.0'],
        ]);

        $io->success('Added documents successfully.');

        return Command::SUCCESS;
    }
}
