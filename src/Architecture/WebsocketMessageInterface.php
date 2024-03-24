<?php

namespace App\Architecture;

interface WebsocketMessageInterface
{
    public static function getMessageType() : string;

    public function execute(object $connection, array $payload) : void;
}
