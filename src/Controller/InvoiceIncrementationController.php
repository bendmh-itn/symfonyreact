<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;

class InvoiceIncrementationController {

    /**
     * Permet d'enregistrer les données dans la BDD
     *
     * @var EntityManagerInterface
     */
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }
    /**
     * fonction qui va incrémenter les invoices
     *
     * @param Invoice $data
     * @return void
     */
    public function __invoke(Invoice $data)
    {
        $data->setChrono($data->getChrono()+1);
        $this->manager->flush();
        return $data;
    }
}