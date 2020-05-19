<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber {

    public function updateJwtData(JWTCreatedEvent $event){

        /** @var User $user */
        $user = $event->getUser();
        //renvoie un tableau avec les données contenu dans le JWT
        $data = $event->getData();
        $data['firstname'] = $user->getFirstName();
        $data['lastname'] = $user->getLastName();
        $event->setData($data);

    }
}