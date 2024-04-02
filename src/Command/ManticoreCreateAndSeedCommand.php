<?php

namespace App\Command;

use App\Architecture\Category;
use Manticoresearch\Client;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[AsCommand(
    name: 'manticore:create-and-seed',
    description: 'Add a short description for your command',
)]
class ManticoreCreateAndSeedCommand extends Command
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

        $index->drop();

        $index->create(
            [
                'location' => [
                    'type' => 'text'
                ],
                'title' => [
                    'type' => 'text',
                ],
                'description' => [
                    'type' => 'text',
                ],
                'link' => [
                    'type' => 'text'
                ],
            ],
            [ // Allows keyword suggestions
                'dict' => 'keywords',
                'min_infix_len' => 2
            ]
        );

        $io->success('Index created.');

        $index->addDocuments([
            ['location' => Category::CHANGELOGS, 'title' => 'Version 1.0.0', 'description' => 'Finally released the first version!', 'link' => 'https://en.wikipedia.org/wiki/New_York'],
            ['location' => Category::DOCUMENTATIONS, 'title' => 'Getting Started Guide', 'description' => 'Learn how to set up and use our software.', 'link' => 'https://example.com/documentation/getting-started'],
            ['location' => Category::DOCUMENTATIONS, 'title' => 'Advanced Usage Manual', 'description' => 'Discover advanced features and usage scenarios.', 'link' => 'https://example.com/documentation/advanced-usage'],
            ['location' => Category::TUTORIALS, 'title' => 'Basic Concepts Tutorial', 'description' => 'Explore the fundamental concepts with this tutorial.', 'link' => 'https://example.com/tutorials/basic-concepts'],
            ['location' => Category::TUTORIALS, 'title' => 'Integration Tutorial', 'description' => 'Learn how to integrate our software with other tools.', 'link' => 'https://example.com/tutorials/integration'],
            ['location' => Category::KNOWLEDGE_BASE, 'title' => 'FAQs and Troubleshooting', 'description' => 'Find answers to common questions and troubleshoot issues.', 'link' => 'https://example.com/knowledge-base/faqs'],
            ['location' => Category::KNOWLEDGE_BASE, 'title' => 'Best Practices Guide', 'description' => 'Follow best practices for optimal usage of our software.', 'link' => 'https://example.com/knowledge-base/best-practices'],
            ['location' => Category::FORUMS, 'title' => 'Community Discussions', 'description' => 'Engage with the community and share your experiences.', 'link' => 'https://example.com/forums/community-discussions'],
            ['location' => Category::FORUMS, 'title' => 'Feature Requests', 'description' => 'Suggest and discuss new features for our products.', 'link' => 'https://example.com/forums/feature-requests'],
            ['location' => Category::DESCRIPTIONS, 'title' => 'Product Descriptions', 'description' => 'Detailed descriptions of our products and their features.', 'link' => 'https://example.com/descriptions/product-details'],
            ['location' => Category::DESCRIPTIONS, 'title' => 'Technical Specifications', 'description' => 'Explore the technical specifications of our products.', 'link' => 'https://example.com/descriptions/technical-specs'],
            ['location' => Category::PRODUCTS, 'title' => 'New Product Launch', 'description' => 'Introducing our latest product to the market.', 'link' => 'https://example.com/products/new-launch'],
            ['location' => Category::PRODUCTS, 'title' => 'Product Showcase', 'description' => 'Highlighting the key features of our products.', 'link' => 'https://example.com/products/showcase'],
            ['location' => Category::ROADMAPS, 'title' => 'Development Roadmap', 'description' => 'Explore the future plans and developments.', 'link' => 'https://example.com/roadmaps/development-roadmap'],
            ['location' => Category::ROADMAPS, 'title' => 'Upcoming Features Preview', 'description' => 'Get a sneak peek into the upcoming features.', 'link' => 'https://example.com/roadmaps/upcoming-features'],
            ['location' => Category::CHANGELOGS, 'title' => 'Version 2.0.0', 'description' => 'Check out the release notes for the latest version.', 'link' => 'https://example.com/changelogs/version-2.0.0'],
            ['location' => Category::CHANGELOGS, 'title' => 'Version 2.1.0', 'description' => 'Explore the new features and improvements in this release.', 'link' => 'https://example.com/changelogs/version-2.1.0'],
        ]);

        $io->success('Added documents successfully.');

        return Command::SUCCESS;
    }
}
