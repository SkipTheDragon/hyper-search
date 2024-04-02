<?php

namespace App\Architecture;

enum Category: string
{
    case DOCUMENTATIONS = 'Documentations';
    case TUTORIALS = 'Tutorials';
    case KNOWLEDGE_BASE = 'Knowledgebases';
    case FORUMS = 'Forums';
    case DESCRIPTIONS = 'Descriptions';
    case PRODUCTS = 'Products';
    case ROADMAPS = 'Roadmaps';
    case CHANGELOGS = 'Changelogs';
}
